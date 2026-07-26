-- GiftMatch development/test data.
-- Safe to run repeatedly: accounts are updated and products are inserted only
-- when the demo store does not already have the same AI gift label.
--
-- Login accounts:
--   Admin: admin@giftmatch.vn / Admin@123
--   Store: store@giftmatch.vn / Store@123

START TRANSACTION;

INSERT INTO users (
    email,
    password_hash,
    full_name,
    phone_number,
    role,
    is_active
) VALUES (
    'admin@giftmatch.vn',
    '$2a$10$F1BE0AZmRvCzBqJ6biqWb.KXpfTTgW.4TC/i8Y8RdP19TLQpTNQEq',
    'GiftMatch Administrator',
    '0901000001',
    'ADMIN',
    TRUE
)
ON DUPLICATE KEY UPDATE
    password_hash = VALUES(password_hash),
    full_name = VALUES(full_name),
    phone_number = VALUES(phone_number),
    role = 'ADMIN',
    is_active = TRUE;

INSERT INTO users (
    email,
    password_hash,
    full_name,
    phone_number,
    role,
    is_active
) VALUES (
    'store@giftmatch.vn',
    '$2a$10$xrbq37mdzK73Ta0MG55aIelhhFTZPq7nk10O6dPth6L8QBy1d5nkq',
    'GiftMatch Demo Store',
    '0901000002',
    'STORE',
    TRUE
)
ON DUPLICATE KEY UPDATE
    password_hash = VALUES(password_hash),
    full_name = VALUES(full_name),
    phone_number = VALUES(phone_number),
    role = 'STORE',
    is_active = TRUE;

INSERT INTO store_profiles (
    owner_user_id,
    store_name,
    description,
    address,
    phone,
    logo_url,
    status
)
SELECT
    user_id,
    'GiftMatch Demo Store',
    'Cửa hàng dữ liệu mẫu phục vụ kiểm thử hệ thống gợi ý.',
    '01 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    '0901000002',
    'https://picsum.photos/seed/giftmatch-store/400/400',
    'APPROVED'
FROM users
WHERE email = 'store@giftmatch.vn'
ON DUPLICATE KEY UPDATE
    store_name = VALUES(store_name),
    description = VALUES(description),
    address = VALUES(address),
    phone = VALUES(phone),
    logo_url = VALUES(logo_url),
    status = 'APPROVED';

INSERT IGNORE INTO categories (name, description) VALUES
    ('Phụ kiện', 'Trang sức, đồng hồ và phụ kiện cá nhân'),
    ('Sách', 'Sách văn học, kỹ năng và kiến thức'),
    ('Điện tử', 'Thiết bị công nghệ và phụ kiện điện tử'),
    ('Thời trang', 'Quần áo, túi và phụ kiện thời trang'),
    ('Chăm sóc cá nhân', 'Mỹ phẩm, nước hoa và bộ chăm sóc'),
    ('Đồ thủ công', 'Quà tặng thủ công và sáng tạo'),
    ('Trang trí nhà cửa', 'Vật dụng trang trí không gian sống'),
    ('Quà cá nhân hóa', 'Sản phẩm khắc hoặc in theo yêu cầu'),
    ('Đồ chơi', 'Đồ chơi và trò chơi giải trí');

-- Keep the database taxonomy consistent with the mapping embedded in the
-- trained random_forest_hybrid_v2 model.
UPDATE gift_labels gl
JOIN gift_types gt ON gt.display_name = 'Handmade Craft'
SET gl.gift_type_id = gt.gift_type_id
WHERE gl.display_name = 'Customized Keychain';

UPDATE gift_labels gl
JOIN gift_types gt ON gt.display_name = 'Accessory'
SET gl.gift_type_id = gt.gift_type_id
WHERE gl.display_name = 'Cap';

UPDATE gift_labels gl
JOIN gift_types gt ON gt.display_name = 'Electronics'
SET gl.gift_type_id = gt.gift_type_id
WHERE gl.display_name = 'LED Table Lamp';

UPDATE gift_labels gl
JOIN gift_types gt ON gt.display_name = 'Fashion Item'
SET gl.gift_type_id = gt.gift_type_id
WHERE gl.display_name IN ('Wallet', 'Wrist Watch');

INSERT INTO products (
    store_id,
    category_id,
    name,
    description,
    price,
    image_url,
    gift_type,
    ai_gift_name,
    gift_label_id,
    status,
    is_top_selling,
    view_count,
    recommend_count,
    created_at
)
SELECT
    store_user.user_id,
    category.category_id,
    sample.product_name,
    sample.description,
    sample.price,
    CONCAT(
        'https://picsum.photos/seed/',
        sample.image_seed,
        '/800/600'
    ),
    sample.gift_type,
    sample.ai_gift_name,
    gift_label.gift_label_id,
    'APPROVED',
    sample.is_top_selling,
    sample.view_count,
    sample.recommend_count,
    NOW(6)
FROM (
    SELECT 'Vòng tay thanh lịch' product_name, 'Vòng tay tối giản, phù hợp làm quà sinh nhật.' description, 249000 price, 'Accessory' gift_type, 'Bracelet' ai_gift_name, 'gift-bracelet' image_seed, TRUE is_top_selling, 86 view_count, 31 recommend_count, 'Phụ kiện' category_name
    UNION ALL SELECT 'Móc khóa khắc tên', 'Móc khóa thủ công có thể khắc tên người nhận.', 129000, 'Handmade Craft', 'Customized Keychain', 'gift-keychain', TRUE, 112, 47, 'Đồ thủ công'
    UNION ALL SELECT 'Dây chuyền bạc', 'Dây chuyền thiết kế thanh lịch dùng hằng ngày.', 459000, 'Accessory', 'Neck Chain', 'gift-neck-chain', FALSE, 61, 19, 'Phụ kiện'
    UNION ALL SELECT 'Kính mát thời trang', 'Kính mát chống tia UV với kiểu dáng hiện đại.', 329000, 'Accessory', 'Sunglasses', 'gift-sunglasses', FALSE, 48, 13, 'Phụ kiện'
    UNION ALL SELECT 'Ví da tối giản', 'Ví da nhỏ gọn với nhiều ngăn tiện dụng.', 389000, 'Fashion Item', 'Wallet', 'gift-wallet', TRUE, 93, 28, 'Thời trang'
    UNION ALL SELECT 'Đồng hồ đeo tay cổ điển', 'Đồng hồ mặt tròn phù hợp nhiều phong cách.', 799000, 'Fashion Item', 'Wrist Watch', 'gift-watch', TRUE, 104, 35, 'Thời trang'
    UNION ALL SELECT 'Tiểu thuyết tuyển chọn', 'Tiểu thuyết nhẹ nhàng dành cho người yêu đọc sách.', 189000, 'Book', 'Fiction Novel', 'gift-fiction', TRUE, 76, 22, 'Sách'
    UNION ALL SELECT 'Sách truyền cảm hứng', 'Cuốn sách tạo động lực và thói quen tích cực.', 169000, 'Book', 'Motivational Book', 'gift-motivation', FALSE, 55, 18, 'Sách'
    UNION ALL SELECT 'Cẩm nang khoa học', 'Sách kiến thức khoa học trình bày trực quan.', 219000, 'Book', 'Science Guide', 'gift-science', FALSE, 39, 11, 'Sách'
    UNION ALL SELECT 'Sách phát triển bản thân', 'Sách hướng dẫn quản lý thời gian và mục tiêu.', 179000, 'Book', 'Self-help Book', 'gift-self-help', TRUE, 82, 26, 'Sách'
    UNION ALL SELECT 'Tai nghe Bluetooth', 'Tai nghe không dây nhỏ gọn, âm thanh rõ ràng.', 649000, 'Electronics', 'Bluetooth Earbuds', 'gift-earbuds', TRUE, 128, 43, 'Điện tử'
    UNION ALL SELECT 'Vòng đeo tay thể thao', 'Theo dõi vận động, nhịp tim và giấc ngủ.', 899000, 'Electronics', 'Fitness Band', 'gift-fitness-band', FALSE, 67, 21, 'Điện tử'
    UNION ALL SELECT 'Loa Bluetooth mini', 'Loa di động chống nước, pin sử dụng lâu.', 579000, 'Electronics', 'Portable Speaker', 'gift-speaker', TRUE, 117, 39, 'Điện tử'
    UNION ALL SELECT 'Đồng hồ thông minh', 'Đồng hồ thông minh hỗ trợ thông báo và thể thao.', 1299000, 'Electronics', 'Smart Watch', 'gift-smart-watch', TRUE, 145, 42, 'Điện tử'
    UNION ALL SELECT 'Mũ lưỡi trai', 'Mũ phong cách năng động, dễ phối trang phục.', 199000, 'Accessory', 'Cap', 'gift-cap', FALSE, 42, 12, 'Phụ kiện'
    UNION ALL SELECT 'Khăn choàng mềm', 'Khăn choàng nhẹ, phù hợp làm quà dịp lễ.', 289000, 'Fashion Item', 'Scarf', 'gift-scarf', FALSE, 45, 14, 'Thời trang'
    UNION ALL SELECT 'Túi đeo chéo', 'Túi nhỏ gọn dành cho đi học và đi chơi.', 429000, 'Fashion Item', 'Sling Bag', 'gift-sling-bag', TRUE, 91, 29, 'Thời trang'
    UNION ALL SELECT 'Áo thun thiết kế', 'Áo thun cotton với hình in trẻ trung.', 319000, 'Fashion Item', 'Stylish T-shirt', 'gift-tshirt', FALSE, 58, 17, 'Thời trang'
    UNION ALL SELECT 'Bộ chăm sóc râu', 'Bộ dụng cụ chăm sóc râu dành cho nam.', 449000, 'Grooming Set', 'Beard Grooming Kit', 'gift-beard-kit', FALSE, 37, 9, 'Chăm sóc cá nhân'
    UNION ALL SELECT 'Bộ nước hoa mini', 'Bộ nước hoa nhiều mùi hương để trải nghiệm.', 699000, 'Grooming Set', 'Perfume Set', 'gift-perfume', TRUE, 101, 33, 'Chăm sóc cá nhân'
    UNION ALL SELECT 'Bộ chăm sóc da', 'Bộ sản phẩm chăm sóc da cơ bản hằng ngày.', 549000, 'Grooming Set', 'Skincare Kit', 'gift-skincare', TRUE, 123, 41, 'Chăm sóc cá nhân'
    UNION ALL SELECT 'Chậu gốm nghệ thuật', 'Chậu gốm thủ công trang trí bàn làm việc.', 239000, 'Handmade Craft', 'Clay Art Pot', 'gift-clay-pot', TRUE, 97, 36, 'Đồ thủ công'
    UNION ALL SELECT 'Nến thơm thủ công', 'Nến sáp đậu nành với hương thơm dịu nhẹ.', 219000, 'Handmade Craft', 'Handcrafted Candle', 'gift-candle', TRUE, 134, 52, 'Đồ thủ công'
    UNION ALL SELECT 'Thiệp chúc mừng thủ công', 'Thiệp làm tay có thể viết lời nhắn riêng.', 89000, 'Handmade Craft', 'Handmade Greeting Card', 'gift-card', FALSE, 34, 10, 'Đồ thủ công'
    UNION ALL SELECT 'Máy khuếch tán tinh dầu', 'Máy khuếch tán nhỏ gọn kèm đèn ngủ.', 399000, 'Home Decor', 'Aroma Diffuser', 'gift-diffuser', TRUE, 156, 61, 'Trang trí nhà cửa'
    UNION ALL SELECT 'Đèn bàn LED', 'Đèn LED điều chỉnh độ sáng cho bàn học.', 479000, 'Electronics', 'LED Table Lamp', 'gift-led-lamp', FALSE, 72, 24, 'Điện tử'
    UNION ALL SELECT 'Cây xanh để bàn', 'Cây xanh mini dễ chăm sóc cho góc làm việc.', 159000, 'Home Decor', 'Mini Indoor Plant', 'gift-plant', TRUE, 109, 38, 'Trang trí nhà cửa'
    UNION ALL SELECT 'Tranh treo tường', 'Tranh nghệ thuật đóng khung trang trí phòng.', 369000, 'Home Decor', 'Wall Art Frame', 'gift-wall-art', FALSE, 63, 20, 'Trang trí nhà cửa'
    UNION ALL SELECT 'Khung ảnh theo yêu cầu', 'Khung ảnh in tên và ngày kỷ niệm.', 299000, 'Personalized Gift', 'Customized Photo Frame', 'gift-photo-frame', TRUE, 121, 46, 'Quà cá nhân hóa'
    UNION ALL SELECT 'Bút khắc tên', 'Bút kim loại khắc tên, phù hợp quà tốt nghiệp.', 189000, 'Personalized Gift', 'Engraved Pen', 'gift-pen', FALSE, 74, 25, 'Quà cá nhân hóa'
    UNION ALL SELECT 'Ly sứ in tên', 'Ly sứ cá nhân hóa với tên và thông điệp.', 169000, 'Personalized Gift', 'Name Printed Mug', 'gift-mug', TRUE, 143, 55, 'Quà cá nhân hóa'
    UNION ALL SELECT 'Bộ xếp hình sáng tạo', 'Bộ xếp hình phát triển tư duy và sáng tạo.', 499000, 'Toy', 'LEGO Set', 'gift-lego', TRUE, 115, 37, 'Đồ chơi'
    UNION ALL SELECT 'Trò chơi xếp hình', 'Bộ puzzle nhiều mảnh dành cho gia đình.', 239000, 'Toy', 'Puzzle Game', 'gift-puzzle', FALSE, 51, 16, 'Đồ chơi'
    UNION ALL SELECT 'Xe điều khiển từ xa', 'Xe mô hình điều khiển từ xa có pin sạc.', 599000, 'Toy', 'Remote Car', 'gift-remote-car', TRUE, 88, 30, 'Đồ chơi'
    UNION ALL SELECT 'Gấu bông mềm mại', 'Gấu bông êm mềm phù hợp nhiều độ tuổi.', 279000, 'Toy', 'Soft Toy', 'gift-soft-toy', TRUE, 138, 49, 'Đồ chơi'
) AS sample
JOIN users store_user
    ON store_user.email = 'store@giftmatch.vn'
JOIN categories category
    ON category.name = sample.category_name
LEFT JOIN gift_labels gift_label
    ON gift_label.display_name = sample.ai_gift_name
LEFT JOIN products existing_product
    ON existing_product.store_id = store_user.user_id
   AND existing_product.ai_gift_name = sample.ai_gift_name
WHERE existing_product.product_id IS NULL;

UPDATE products p
JOIN users u ON u.user_id = p.store_id
SET p.created_at = NOW(6)
WHERE u.email = 'store@giftmatch.vn'
  AND p.created_at = '0000-00-00 00:00:00';

COMMIT;

SELECT
    u.email,
    u.full_name,
    u.role,
    u.is_active
FROM users u
WHERE u.email IN ('admin@giftmatch.vn', 'store@giftmatch.vn')
ORDER BY u.role;

SELECT
    COUNT(*) AS demo_product_count
FROM products p
JOIN users u ON u.user_id = p.store_id
WHERE u.email = 'store@giftmatch.vn'
  AND p.status = 'APPROVED';
