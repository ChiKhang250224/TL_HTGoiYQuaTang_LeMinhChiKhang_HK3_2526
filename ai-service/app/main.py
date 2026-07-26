import os
import shutil
import logging
from functools import lru_cache
from pathlib import Path
from typing import Any
from uuid import uuid4

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, model_validator


logger = logging.getLogger("giftmatch.ai")


WORKSPACE_DIR = Path(__file__).resolve().parents[3]
MODEL_FILENAME = "gift_recommender_rf_hybrid.joblib"
DEFAULT_MODEL_CANDIDATES = (
    WORKSPACE_DIR / "gift-recommendation-system" / "artifacts" / MODEL_FILENAME,
    WORKSPACE_DIR
    / "gift-recommendation-system"
    / "content"
    / "gift_system"
    / "artifacts"
    / MODEL_FILENAME,
)
DEFAULT_MODEL_PATH = next(
    (path for path in DEFAULT_MODEL_CANDIDATES if path.exists()),
    DEFAULT_MODEL_CANDIDATES[0],
)
MODEL_DIR = Path(
    os.getenv(
        "GIFT_MODEL_DIR",
        str(Path(__file__).resolve().parents[1] / "models"),
    )
).expanduser().resolve()
ACTIVE_MODEL_POINTER = MODEL_DIR / ".active_model"


class RecommendationRequest(BaseModel):
    gender: str
    relationship_to_receiver: str
    occasion: str
    budget: float = Field(gt=0)
    interests: str
    receiver_personality: str
    receiver_age_group: str
    relationship_closeness: str
    giver_preference_style: str
    top_k: int = Field(
        default=5,
        ge=1,
        le=20,
    )

    @model_validator(mode="before")
    @classmethod
    def normalize_input_names(cls, value: Any) -> Any:
        if not isinstance(value, dict):
            return value

        normalized = dict(value)
        aliases = {
            "relationship_to_receiver": (
                "relationshipToReceiver",
                "relationship",
            ),
            "interests": ("hobby",),
            "receiver_personality": (
                "receiverPersonality",
                "personality",
            ),
            "receiver_age_group": ("receiverAgeGroup", "ageGroup"),
            "relationship_closeness": ("relationshipCloseness",),
            "giver_preference_style": (
                "giverPreferenceStyle",
                "style",
            ),
            "top_k": ("topK",),
        }
        for target, alternatives in aliases.items():
            if target in normalized:
                continue
            for alternative in alternatives:
                if alternative in normalized:
                    normalized[target] = normalized[alternative]
                    break
        return normalized


class GiftPrediction(BaseModel):
    gift_name: str
    gift_type: str
    score: float
    rank: int


class RecommendationResponse(BaseModel):
    model_version: str
    predictions: list[GiftPrediction]


app = FastAPI(
    title="GiftMatch AI Service",
    version="2.0.0",
    description="Random Forest inference service for GiftMatch.",
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    errors = [
        {
            "field": ".".join(str(part) for part in error["loc"]),
            "message": error["msg"],
            "type": error["type"],
        }
        for error in exc.errors()
    ]
    logger.warning(
        "Dữ liệu không hợp lệ cho %s %s: %s",
        request.method,
        request.url.path,
        errors,
    )
    return JSONResponse(status_code=422, content={"detail": errors})


def configured_model_path() -> Path:
    if ACTIVE_MODEL_POINTER.exists():
        active_name = ACTIVE_MODEL_POINTER.read_text(encoding="utf-8").strip()
        if active_name:
            return safe_model_path(active_name)
    return Path(os.getenv("GIFT_MODEL_PATH", str(DEFAULT_MODEL_PATH))).expanduser().resolve()


def safe_model_path(filename: str) -> Path:
    clean_name = Path(filename).name
    if clean_name != filename or not clean_name.lower().endswith(".joblib"):
        raise ValueError("Tên model không hợp lệ.")
    model_path = (MODEL_DIR / clean_name).resolve()
    if model_path.parent != MODEL_DIR:
        raise ValueError("Đường dẫn model không hợp lệ.")
    return model_path


def validate_bundle(bundle: dict[str, Any]) -> None:
    required = {"type_model", "name_model", "context_features", "gift_name_to_type"}
    missing = sorted(required - set(bundle))
    if missing:
        raise ValueError(f"Model bundle thiếu thành phần: {missing}")


@lru_cache(maxsize=4)
def load_bundle_from_path(model_path_text: str) -> dict[str, Any]:
    model_path = Path(model_path_text)
    if not model_path.exists():
        raise FileNotFoundError(
            f"Không tìm thấy model tại {model_path}. "
            "Hãy chạy notebook Colab, tải file .joblib về và đặt GIFT_MODEL_PATH."
        )
    bundle = joblib.load(model_path)
    validate_bundle(bundle)
    return bundle


def load_bundle() -> dict[str, Any]:
    return load_bundle_from_path(str(configured_model_path()))


def normalize_rows(scores: np.ndarray) -> np.ndarray:
    scores = np.clip(np.asarray(scores, dtype=float), 0.0, None)
    row_sum = scores.sum(axis=1, keepdims=True)
    return np.divide(scores, row_sum, out=np.zeros_like(scores), where=row_sum > 0)


def align_probabilities(
    probabilities: np.ndarray,
    source_classes: np.ndarray,
    target_classes: np.ndarray,
) -> np.ndarray:
    aligned = np.zeros((len(probabilities), len(target_classes)), dtype=float)
    target_index = {label: index for index, label in enumerate(target_classes)}
    for source_index, label in enumerate(source_classes):
        if label in target_index:
            aligned[:, target_index[label]] = probabilities[:, source_index]
    return aligned


def prepare_context(request: RecommendationRequest, bundle: dict[str, Any]) -> pd.DataFrame:
    row = request.model_dump(exclude={"top_k"})
    frame = pd.DataFrame([row])

    budget_bins = bundle.get("budget_bins", [-np.inf, 500, 1000, 3000, np.inf])
    budget_labels = bundle.get(
        "budget_labels",
        ["below_500", "500_to_1000", "1000_to_3000", "above_3000"],
    )
    frame["budget_band"] = pd.cut(
        frame["budget"],
        bins=budget_bins,
        labels=budget_labels,
        include_lowest=True,
        right=True,
    ).astype("string")

    interactions = bundle.get("interaction_definitions", {})
    for new_column, source_columns in interactions.items():
        frame[new_column] = (
            frame[source_columns]
            .astype("string")
            .fillna("missing")
            .agg("__".join, axis=1)
        )

    missing = sorted(set(bundle["context_features"]) - set(frame.columns))
    if missing:
        raise ValueError(f"Input chưa tạo được các feature: {missing}")
    return frame


def hierarchical_components(
    frame: pd.DataFrame,
    bundle: dict[str, Any],
    name_classes: np.ndarray,
) -> tuple[np.ndarray, np.ndarray]:
    type_model = bundle["type_model"]
    name_model = bundle["name_model"]
    context_features = bundle["context_features"]
    name_features = bundle.get("name_features", [*context_features, "gift_type"])
    gift_name_to_type = bundle["gift_name_to_type"]

    type_classes = type_model.named_steps["classifier"].classes_
    conditional_classes = name_model.named_steps["classifier"].classes_
    type_probability = type_model.predict_proba(frame[context_features])

    type_prior = np.zeros((len(frame), len(name_classes)), dtype=float)
    joint = np.zeros_like(type_prior)
    for type_index, type_name in enumerate(type_classes):
        candidate = frame[context_features].copy()
        candidate["gift_type"] = type_name
        conditional_raw = name_model.predict_proba(candidate[name_features])
        conditional = align_probabilities(
            conditional_raw, conditional_classes, name_classes
        )
        valid = np.array(
            [gift_name_to_type.get(name) == type_name for name in name_classes]
        )
        valid_count = max(int(valid.sum()), 1)
        conditional[:, ~valid] = 0.0
        conditional = normalize_rows(conditional)
        type_prior[:, valid] += type_probability[:, [type_index]] / valid_count
        joint += type_probability[:, [type_index]] * conditional

    return normalize_rows(type_prior), normalize_rows(joint)


def predict_probabilities(
    frame: pd.DataFrame, bundle: dict[str, Any]
) -> tuple[np.ndarray, np.ndarray]:
    name_classes = np.asarray(
        bundle.get(
            "name_classes",
            bundle["name_model"].named_steps["classifier"].classes_,
        )
    )
    type_prior, joint = hierarchical_components(frame, bundle, name_classes)
    alpha = float(bundle.get("alpha", 0.0))
    hierarchical = normalize_rows(alpha * type_prior + (1.0 - alpha) * joint)

    direct_model = bundle.get("direct_name_model")
    if direct_model is None:
        return hierarchical, name_classes

    direct_raw = direct_model.predict_proba(frame[bundle["context_features"]])
    direct_classes = direct_model.named_steps["classifier"].classes_
    direct = normalize_rows(
        align_probabilities(direct_raw, direct_classes, name_classes)
    )
    beta = float(bundle.get("beta", 0.0))
    return normalize_rows((1.0 - beta) * hierarchical + beta * direct), name_classes


@app.get("/health")
def health() -> dict[str, Any]:
    try:
        bundle = load_bundle()
        return {
            "status": "ready",
            "model_path": str(configured_model_path()),
            "model_version": bundle.get("model_version", "two_stage_random_forest"),
        }
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.get("/models")
def list_models() -> dict[str, Any]:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    active_path = configured_model_path()
    models = []
    for model_path in sorted(MODEL_DIR.glob("*.joblib")):
        stat = model_path.stat()
        models.append(
            {
                "filename": model_path.name,
                "size_bytes": stat.st_size,
                "modified_at": stat.st_mtime,
                "active": model_path == active_path,
            }
        )
    return {
        "active_model": str(active_path),
        "loaded": active_path.exists(),
        "models": models,
    }


@app.post("/models/reload")
def reload_model() -> dict[str, Any]:
    try:
        load_bundle_from_path.cache_clear()
        bundle = load_bundle()
        return {
            "status": "reloaded",
            "active_model": str(configured_model_path()),
            "model_version": bundle.get("model_version", "two_stage_random_forest"),
        }
    except Exception as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@app.post("/models/activate/{filename}")
def activate_model(filename: str) -> dict[str, Any]:
    try:
        model_path = safe_model_path(filename)
        if not model_path.exists():
            raise FileNotFoundError(f"Không tìm thấy model {filename}.")
        candidate = joblib.load(model_path)
        validate_bundle(candidate)
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        ACTIVE_MODEL_POINTER.write_text(model_path.name, encoding="utf-8")
        load_bundle_from_path.cache_clear()
        active_bundle = load_bundle()
        return {
            "status": "activated",
            "active_model": str(model_path),
            "model_version": active_bundle.get(
                "model_version", "two_stage_random_forest"
            ),
        }
    except Exception as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@app.post("/models/upload")
async def upload_model(
    file: UploadFile = File(...),
    activate: bool = True,
) -> dict[str, Any]:
    try:
        filename = Path(file.filename or "").name
        target = safe_model_path(filename)
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        temporary = MODEL_DIR / f".{uuid4().hex}.joblib.tmp"
        with temporary.open("wb") as output:
            shutil.copyfileobj(file.file, output)
        try:
            candidate = joblib.load(temporary)
            validate_bundle(candidate)
            temporary.replace(target)
        finally:
            if temporary.exists():
                temporary.unlink()

        if activate:
            ACTIVE_MODEL_POINTER.write_text(target.name, encoding="utf-8")
        load_bundle_from_path.cache_clear()
        bundle = load_bundle() if activate else candidate
        return {
            "status": "uploaded_and_activated" if activate else "uploaded",
            "filename": target.name,
            "model_version": bundle.get(
                "model_version", "two_stage_random_forest"
            ),
        }
    except Exception as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    finally:
        await file.close()


@app.post("/predict", response_model=RecommendationResponse)
def predict(request: RecommendationRequest) -> RecommendationResponse:
    try:
        bundle = load_bundle()
        frame = prepare_context(request, bundle)
        probabilities, name_classes = predict_probabilities(frame, bundle)
        top_k = min(request.top_k, len(name_classes))
        top_indices = np.argsort(probabilities[0])[::-1][:top_k]
        mapping = bundle["gift_name_to_type"]
        predictions = [
            GiftPrediction(
                gift_name=str(name_classes[index]),
                gift_type=str(mapping[str(name_classes[index])]),
                score=float(probabilities[0, index]),
                rank=rank,
            )
            for rank, index in enumerate(top_indices, start=1)
        ]
        return RecommendationResponse(
            model_version=bundle.get("model_version", "two_stage_random_forest"),
            predictions=predictions,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Không thể dự đoán: {exc}") from exc
