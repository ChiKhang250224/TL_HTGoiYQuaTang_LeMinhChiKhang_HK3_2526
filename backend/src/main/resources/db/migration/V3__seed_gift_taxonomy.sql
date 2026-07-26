INSERT IGNORE INTO gift_types (code, display_name) VALUES
    ('ACCESSORY', 'Accessory'),
    ('BOOK', 'Book'),
    ('ELECTRONICS', 'Electronics'),
    ('FASHION_ITEM', 'Fashion Item'),
    ('GROOMING_SET', 'Grooming Set'),
    ('HANDMADE_CRAFT', 'Handmade Craft'),
    ('HOME_DECOR', 'Home Decor'),
    ('PERSONALIZED_GIFT', 'Personalized Gift'),
    ('TOY', 'Toy');

INSERT IGNORE INTO gift_labels (gift_type_id, code, display_name)
SELECT gift_type_id, 'BRACELET', 'Bracelet' FROM gift_types WHERE code = 'ACCESSORY'
UNION ALL SELECT gift_type_id, 'CUSTOMIZED_KEYCHAIN', 'Customized Keychain' FROM gift_types WHERE code = 'ACCESSORY'
UNION ALL SELECT gift_type_id, 'NECK_CHAIN', 'Neck Chain' FROM gift_types WHERE code = 'ACCESSORY'
UNION ALL SELECT gift_type_id, 'SUNGLASSES', 'Sunglasses' FROM gift_types WHERE code = 'ACCESSORY'
UNION ALL SELECT gift_type_id, 'WALLET', 'Wallet' FROM gift_types WHERE code = 'ACCESSORY'
UNION ALL SELECT gift_type_id, 'WRIST_WATCH', 'Wrist Watch' FROM gift_types WHERE code = 'ACCESSORY'
UNION ALL SELECT gift_type_id, 'FICTION_NOVEL', 'Fiction Novel' FROM gift_types WHERE code = 'BOOK'
UNION ALL SELECT gift_type_id, 'MOTIVATIONAL_BOOK', 'Motivational Book' FROM gift_types WHERE code = 'BOOK'
UNION ALL SELECT gift_type_id, 'SCIENCE_GUIDE', 'Science Guide' FROM gift_types WHERE code = 'BOOK'
UNION ALL SELECT gift_type_id, 'SELF_HELP_BOOK', 'Self-help Book' FROM gift_types WHERE code = 'BOOK'
UNION ALL SELECT gift_type_id, 'BLUETOOTH_EARBUDS', 'Bluetooth Earbuds' FROM gift_types WHERE code = 'ELECTRONICS'
UNION ALL SELECT gift_type_id, 'FITNESS_BAND', 'Fitness Band' FROM gift_types WHERE code = 'ELECTRONICS'
UNION ALL SELECT gift_type_id, 'PORTABLE_SPEAKER', 'Portable Speaker' FROM gift_types WHERE code = 'ELECTRONICS'
UNION ALL SELECT gift_type_id, 'SMART_WATCH', 'Smart Watch' FROM gift_types WHERE code = 'ELECTRONICS'
UNION ALL SELECT gift_type_id, 'CAP', 'Cap' FROM gift_types WHERE code = 'FASHION_ITEM'
UNION ALL SELECT gift_type_id, 'SCARF', 'Scarf' FROM gift_types WHERE code = 'FASHION_ITEM'
UNION ALL SELECT gift_type_id, 'SLING_BAG', 'Sling Bag' FROM gift_types WHERE code = 'FASHION_ITEM'
UNION ALL SELECT gift_type_id, 'STYLISH_T_SHIRT', 'Stylish T-shirt' FROM gift_types WHERE code = 'FASHION_ITEM'
UNION ALL SELECT gift_type_id, 'BEARD_GROOMING_KIT', 'Beard Grooming Kit' FROM gift_types WHERE code = 'GROOMING_SET'
UNION ALL SELECT gift_type_id, 'PERFUME_SET', 'Perfume Set' FROM gift_types WHERE code = 'GROOMING_SET'
UNION ALL SELECT gift_type_id, 'SKINCARE_KIT', 'Skincare Kit' FROM gift_types WHERE code = 'GROOMING_SET'
UNION ALL SELECT gift_type_id, 'CLAY_ART_POT', 'Clay Art Pot' FROM gift_types WHERE code = 'HANDMADE_CRAFT'
UNION ALL SELECT gift_type_id, 'HANDCRAFTED_CANDLE', 'Handcrafted Candle' FROM gift_types WHERE code = 'HANDMADE_CRAFT'
UNION ALL SELECT gift_type_id, 'HANDMADE_GREETING_CARD', 'Handmade Greeting Card' FROM gift_types WHERE code = 'HANDMADE_CRAFT'
UNION ALL SELECT gift_type_id, 'AROMA_DIFFUSER', 'Aroma Diffuser' FROM gift_types WHERE code = 'HOME_DECOR'
UNION ALL SELECT gift_type_id, 'LED_TABLE_LAMP', 'LED Table Lamp' FROM gift_types WHERE code = 'HOME_DECOR'
UNION ALL SELECT gift_type_id, 'MINI_INDOOR_PLANT', 'Mini Indoor Plant' FROM gift_types WHERE code = 'HOME_DECOR'
UNION ALL SELECT gift_type_id, 'WALL_ART_FRAME', 'Wall Art Frame' FROM gift_types WHERE code = 'HOME_DECOR'
UNION ALL SELECT gift_type_id, 'CUSTOMIZED_PHOTO_FRAME', 'Customized Photo Frame' FROM gift_types WHERE code = 'PERSONALIZED_GIFT'
UNION ALL SELECT gift_type_id, 'ENGRAVED_PEN', 'Engraved Pen' FROM gift_types WHERE code = 'PERSONALIZED_GIFT'
UNION ALL SELECT gift_type_id, 'NAME_PRINTED_MUG', 'Name Printed Mug' FROM gift_types WHERE code = 'PERSONALIZED_GIFT'
UNION ALL SELECT gift_type_id, 'LEGO_SET', 'LEGO Set' FROM gift_types WHERE code = 'TOY'
UNION ALL SELECT gift_type_id, 'PUZZLE_GAME', 'Puzzle Game' FROM gift_types WHERE code = 'TOY'
UNION ALL SELECT gift_type_id, 'REMOTE_CAR', 'Remote Car' FROM gift_types WHERE code = 'TOY'
UNION ALL SELECT gift_type_id, 'SOFT_TOY', 'Soft Toy' FROM gift_types WHERE code = 'TOY';

UPDATE products p
JOIN gift_labels gl
    ON gl.display_name = p.ai_gift_name COLLATE utf8mb4_unicode_ci
SET p.gift_label_id = gl.gift_label_id
WHERE p.ai_gift_name IS NOT NULL;
