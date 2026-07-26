# GiftMatch AI Service

Dịch vụ này nạp mô hình Random Forest được xuất từ
`Gift_Recommendation_Training_Colab.ipynb`.

## Yêu cầu

- Python 3.12
- Môi trường ảo `.venv`
- Các thư viện trong `requirements.txt`

## Chuẩn bị model

Tải `gift_recommender_rf_hybrid.joblib` từ Google Drive về thư mục
`gift-recommendation-system/artifacts`. Service cũng tự nhận thư mục
`gift-recommendation-system/content/gift_system/artifacts` khi giải nén trực
tiếp bộ artifacts từ Colab. Có thể dùng biến môi trường `GIFT_MODEL_PATH` để
chỉ định một vị trí khác.

## Chạy dịch vụ

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Kiểm tra model tại `http://localhost:8000/health` và tài liệu API tại
`http://localhost:8000/docs`.

Model tải lên từ màn hình quản trị được lưu trong `ai-service/models`.
AI service kiểm tra cấu trúc bundle trước khi cho phép kích hoạt.
