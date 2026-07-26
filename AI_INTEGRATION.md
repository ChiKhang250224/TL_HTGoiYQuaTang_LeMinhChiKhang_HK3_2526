# Tích hợp Random Forest vào GiftMatch

## Kiến trúc

```text
React Survey
    → POST /api/recommendations (Spring Boot, JWT)
    → POST /predict (FastAPI)
    → Random Forest Joblib
    → Spring Boot ghép gift_name/gift_type với sản phẩm MySQL
    → React hiển thị và lọc kết quả
```

## 1. Lấy model từ Colab

Sau khi chạy notebook, tải file:

```text
artifacts/gift_recommender_rf_hybrid.joblib
```

Đặt file tại:

```text
D:\TieuLuanTotNghiep\gift-recommendation-system\artifacts\gift_recommender_rf_hybrid.joblib
```

Hoặc khai báo `GIFT_MODEL_PATH` tới vị trí thực tế.

## 2. Chạy AI service

```powershell
cd D:\TieuLuanTotNghiep\src_code\ai-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:GIFT_MODEL_PATH="D:\TieuLuanTotNghiep\gift-recommendation-system\artifacts\gift_recommender_rf_hybrid.joblib"
uvicorn app.main:app --reload --port 8000
```

Mở `http://localhost:8000/health`. Kết quả `status: ready` nghĩa là model
đã được nạp.

## 3. Chạy backend

Đặt `AI_SERVICE_URL=http://localhost:8000` trong `backend/.env`, sau đó chạy
Spring Boot trên cổng 8080.

## 4. Chuẩn hóa sản phẩm

Mỗi sản phẩm cần hai trường:

- `aiGiftName`: một trong 35 nhãn tên quà của dataset.
- `giftType`: một trong 9 nhóm quà của dataset.

Trang quản lý sản phẩm tự động gán `giftType` khi cửa hàng chọn
`aiGiftName`. Sản phẩm phải có trạng thái `APPROVED` và giá không vượt ngân
sách khảo sát thì mới xuất hiện trong kết quả.

## 5. Chạy frontend

```powershell
cd D:\TieuLuanTotNghiep\src_code\frontend
npm install
npm run dev
```

Đăng nhập, mở `/survey`, hoàn thành sáu bước và chờ AI trả kết quả.

## 6. Quản lý model và gắn nhãn

Tài khoản có role `ADMIN` mở:

```text
http://localhost:5173/admin/ai
```

Màn hình này hỗ trợ:

- Tải file `.joblib` mới lên AI service.
- Kiểm tra bundle trước khi kích hoạt.
- Xem model đang hoạt động.
- Chuyển qua lại giữa các phiên bản và reload model.
- Xem sản phẩm chưa có nhãn AI.
- Gắn một trong 35 `gift_name`, tự suy ra `gift_type` và duyệt sản phẩm.

Các file model được quản lý nằm trong `ai-service/models` và không được đưa
lên Git.

## 7. Tìm kiếm, lọc và lịch sử

API tìm kiếm sản phẩm:

```text
GET /api/products/search?keyword=&categoryId=&giftType=&minPrice=&maxPrice=
```

Mỗi lần `POST /api/recommendations` thành công, hệ thống tự lưu lịch sử theo
JWT của người dùng. Giao diện `/history` đọc dữ liệu từ:

```text
GET /api/history/me
```
