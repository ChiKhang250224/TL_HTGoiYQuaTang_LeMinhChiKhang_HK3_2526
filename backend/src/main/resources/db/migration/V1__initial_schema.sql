CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NULL,
    role VARCHAR(30) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    google_id VARCHAR(255) NULL,
    facebook_id VARCHAR(255) NULL,
    avatar_url VARCHAR(500) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (user_id),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT uk_users_google_id UNIQUE (google_id),
    CONSTRAINT uk_users_facebook_id UNIQUE (facebook_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
    category_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    PRIMARY KEY (category_id),
    CONSTRAINT uk_categories_name UNIQUE (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tags (
    tag_id BIGINT NOT NULL AUTO_INCREMENT,
    tag_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    PRIMARY KEY (tag_id),
    CONSTRAINT uk_tags_name UNIQUE (tag_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
    product_id BIGINT NOT NULL AUTO_INCREMENT,
    store_id BIGINT NOT NULL,
    category_id BIGINT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NULL,
    price DECIMAL(12,2) NOT NULL,
    image_url VARCHAR(500) NULL,
    gift_type VARCHAR(50) NOT NULL,
    ai_gift_name VARCHAR(100) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT NULL,
    is_top_selling BOOLEAN NOT NULL DEFAULT FALSE,
    view_count INT NOT NULL DEFAULT 0,
    recommend_count INT NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (product_id),
    INDEX idx_products_store (store_id),
    INDEX idx_products_category (category_id),
    INDEX idx_products_status_price (status, price),
    INDEX idx_products_ai_label (gift_type, ai_gift_name),
    CONSTRAINT fk_products_store FOREIGN KEY (store_id) REFERENCES users (user_id),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS recipient_profiles (
    profile_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    age INT NULL,
    gender VARCHAR(20) NULL,
    relationship VARCHAR(50) NULL,
    notes TEXT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (profile_id),
    INDEX idx_recipient_profiles_user (user_id),
    CONSTRAINT fk_recipient_profiles_user FOREIGN KEY (user_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS profile_hobbies (
    profile_id BIGINT NOT NULL,
    hobby VARCHAR(255) NULL,
    INDEX idx_profile_hobbies_profile (profile_id),
    CONSTRAINT fk_profile_hobbies_profile
        FOREIGN KEY (profile_id) REFERENCES recipient_profiles (profile_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS profile_anniversaries (
    profile_id BIGINT NOT NULL,
    event_name VARCHAR(255) NULL,
    event_date DATE NULL,
    INDEX idx_profile_anniversaries_profile (profile_id),
    CONSTRAINT fk_profile_anniversaries_profile
        FOREIGN KEY (profile_id) REFERENCES recipient_profiles (profile_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS favorites (
    favorite_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (favorite_id),
    CONSTRAINT uk_favorites_user_product UNIQUE (user_id, product_id),
    INDEX idx_favorites_product (product_id),
    CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_product FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS recommendation_history (
    history_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    profile_id BIGINT NULL,
    ai_insights TEXT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (history_id),
    INDEX idx_recommendation_history_user_created (user_id, created_at),
    INDEX idx_recommendation_history_profile (profile_id),
    CONSTRAINT fk_recommendation_history_user FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_recommendation_history_profile
        FOREIGN KEY (profile_id) REFERENCES recipient_profiles (profile_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS history_products (
    history_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    PRIMARY KEY (history_id, product_id),
    INDEX idx_history_products_product (product_id),
    CONSTRAINT fk_history_products_history
        FOREIGN KEY (history_id) REFERENCES recommendation_history (history_id) ON DELETE CASCADE,
    CONSTRAINT fk_history_products_product
        FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
