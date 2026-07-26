INSERT IGNORE INTO ai_models (
    model_version,
    algorithm,
    filename,
    storage_path,
    file_size,
    accuracy,
    top3_accuracy,
    top5_accuracy,
    ndcg_at_5,
    metrics_json,
    status,
    activated_at
) VALUES (
    'random_forest_hybrid_v2',
    'Hierarchical Random Forest',
    'gift_recommender_rf_hybrid.joblib',
    'gift-recommendation-system/content/gift_system/artifacts/gift_recommender_rf_hybrid.joblib',
    658037897,
    0.662600,
    0.759500,
    0.846700,
    0.753700,
    JSON_OBJECT(
        'gift_type_accuracy', 0.7697,
        'conditional_gift_name_accuracy', 0.7374,
        'end_to_end_accuracy', 0.6626,
        'top_3_accuracy', 0.7595,
        'top_5_accuracy', 0.8467,
        'ndcg_at_5', 0.7537,
        'catalog_coverage_at_5', 1.0,
        'alpha', 0.4,
        'beta', 0.0
    ),
    'ACTIVE',
    CURRENT_TIMESTAMP(6)
);

INSERT IGNORE INTO recommendation_items (
    history_id,
    product_id,
    rank_position,
    clicked,
    favorited,
    selected,
    created_at
)
SELECT
    hp.history_id,
    hp.product_id,
    ROW_NUMBER() OVER (
        PARTITION BY hp.history_id
        ORDER BY hp.product_id
    ),
    FALSE,
    FALSE,
    FALSE,
    COALESCE(rh.created_at, CURRENT_TIMESTAMP(6))
FROM history_products hp
JOIN recommendation_history rh ON rh.history_id = hp.history_id;
