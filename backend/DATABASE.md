# GiftMatch database

Database vận hành sử dụng schema `giftmatch_db`. Dataset huấn luyện không được
nhập trực tiếp vào database này; chỉ taxonomy gồm 9 loại quà và 35 nhãn quà
được seed để sản phẩm của cửa hàng khớp chính xác với đầu ra của mô hình.

## Khởi tạo

1. Khởi động MySQL hoặc MariaDB trong XAMPP.
2. Sao chép `.env.example` thành `.env` và cập nhật tài khoản database.
3. Chạy backend. Flyway sẽ tạo database và áp dụng migration tự động.

```powershell
.\mvnw.cmd spring-boot:run
```

Các migration nằm trong `src/main/resources/db/migration`:

- `V1`: các bảng tài khoản, sản phẩm, hồ sơ, yêu thích và lịch sử cũ.
- `V2`: taxonomy AI, cửa hàng, model AI, dự đoán, kết quả và phản hồi.
- `V3`: seed 9 `gift_types` và 35 `gift_labels`.
- `V4`: đăng ký model đang dùng và chuyển dữ liệu lịch sử cũ.

## Nhóm bảng

- Nghiệp vụ: `users`, `store_profiles`, `products`, `categories`, `favorites`.
- Hồ sơ: `recipient_profiles`, `profile_hobbies`, `profile_anniversaries`.
- AI: `gift_types`, `gift_labels`, `ai_models`.
- Gợi ý: `recommendation_history`, `recommendation_predictions`,
  `recommendation_items`, `recommendation_feedback`.
- Quản lý schema: `flyway_schema_history`.

File `.joblib` không được lưu vào database. Bảng `ai_models` chỉ lưu phiên bản,
đường dẫn, checksum, trạng thái và metric của model.

## Kiểm tra

```sql
SELECT version, description, success
FROM flyway_schema_history
ORDER BY installed_rank;

SELECT COUNT(*) FROM gift_types;
SELECT COUNT(*) FROM gift_labels;
```

Kết quả seed đúng là 9 loại quà và 35 nhãn sản phẩm.
