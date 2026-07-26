CREATE TABLE gift_types (
    gift_type_id BIGINT NOT NULL AUTO_INCREMENT,
    code VARCHAR(60) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (gift_type_id),
    CONSTRAINT uk_gift_types_code UNIQUE (code),
    CONSTRAINT uk_gift_types_display_name UNIQUE (display_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE gift_labels (
    gift_label_id BIGINT NOT NULL AUTO_INCREMENT,
    gift_type_id BIGINT NOT NULL,
    code VARCHAR(100) NOT NULL,
    display_name VARCHAR(120) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (gift_label_id),
    CONSTRAINT uk_gift_labels_code UNIQUE (code),
    CONSTRAINT uk_gift_labels_display_name UNIQUE (display_name),
    INDEX idx_gift_labels_type (gift_type_id),
    CONSTRAINT fk_gift_labels_type
        FOREIGN KEY (gift_type_id) REFERENCES gift_types (gift_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE store_profiles (
    store_id BIGINT NOT NULL AUTO_INCREMENT,
    owner_user_id BIGINT NOT NULL,
    store_name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    address VARCHAR(500) NULL,
    phone VARCHAR(20) NULL,
    logo_url VARCHAR(500) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (store_id),
    CONSTRAINT uk_store_profiles_owner UNIQUE (owner_user_id),
    INDEX idx_store_profiles_status (status),
    CONSTRAINT fk_store_profiles_owner FOREIGN KEY (owner_user_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO store_profiles (owner_user_id, store_name, phone, status)
SELECT u.user_id, u.full_name, u.phone_number, 'APPROVED'
FROM users u
WHERE u.role = 'STORE'
  AND NOT EXISTS (
      SELECT 1 FROM store_profiles sp WHERE sp.owner_user_id = u.user_id
  );

CREATE TABLE ai_models (
    model_id BIGINT NOT NULL AUTO_INCREMENT,
    model_version VARCHAR(100) NOT NULL,
    algorithm VARCHAR(100) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    storage_path VARCHAR(1000) NOT NULL,
    file_size BIGINT NULL,
    checksum_sha256 VARCHAR(64) NULL,
    accuracy DECIMAL(8,6) NULL,
    top3_accuracy DECIMAL(8,6) NULL,
    top5_accuracy DECIMAL(8,6) NULL,
    ndcg_at_5 DECIMAL(8,6) NULL,
    metrics_json JSON NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'UPLOADED',
    activated_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (model_id),
    CONSTRAINT uk_ai_models_version UNIQUE (model_version),
    CONSTRAINT uk_ai_models_checksum UNIQUE (checksum_sha256),
    INDEX idx_ai_models_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE products
    ADD COLUMN gift_label_id BIGINT NULL AFTER ai_gift_name,
    ADD INDEX idx_products_gift_label (gift_label_id),
    ADD CONSTRAINT fk_products_gift_label
        FOREIGN KEY (gift_label_id) REFERENCES gift_labels (gift_label_id);

ALTER TABLE recommendation_history
    ADD COLUMN gender VARCHAR(30) NULL AFTER profile_id,
    ADD COLUMN relationship_to_receiver VARCHAR(80) NULL AFTER gender,
    ADD COLUMN occasion VARCHAR(100) NULL AFTER relationship_to_receiver,
    ADD COLUMN budget DECIMAL(12,2) NULL AFTER occasion,
    ADD COLUMN interests VARCHAR(150) NULL AFTER budget,
    ADD COLUMN receiver_personality VARCHAR(100) NULL AFTER interests,
    ADD COLUMN receiver_age_group VARCHAR(50) NULL AFTER receiver_personality,
    ADD COLUMN relationship_closeness VARCHAR(50) NULL AFTER receiver_age_group,
    ADD COLUMN giver_preference_style VARCHAR(100) NULL AFTER relationship_closeness,
    ADD COLUMN model_id BIGINT NULL AFTER giver_preference_style,
    ADD COLUMN model_version VARCHAR(100) NULL AFTER model_id,
    ADD INDEX idx_recommendation_history_model (model_id),
    ADD CONSTRAINT fk_recommendation_history_model
        FOREIGN KEY (model_id) REFERENCES ai_models (model_id) ON DELETE SET NULL;

CREATE TABLE recommendation_predictions (
    prediction_id BIGINT NOT NULL AUTO_INCREMENT,
    history_id BIGINT NOT NULL,
    gift_name VARCHAR(120) NOT NULL,
    gift_type VARCHAR(100) NOT NULL,
    score DECIMAL(10,8) NOT NULL,
    rank_position INT NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (prediction_id),
    CONSTRAINT uk_recommendation_predictions_rank UNIQUE (history_id, rank_position),
    INDEX idx_recommendation_predictions_gift (gift_type, gift_name),
    CONSTRAINT fk_recommendation_predictions_history
        FOREIGN KEY (history_id) REFERENCES recommendation_history (history_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE recommendation_items (
    recommendation_item_id BIGINT NOT NULL AUTO_INCREMENT,
    history_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    predicted_gift_name VARCHAR(120) NULL,
    predicted_gift_type VARCHAR(100) NULL,
    ai_score DECIMAL(10,8) NULL,
    match_score DECIMAL(10,8) NULL,
    rank_position INT NOT NULL,
    clicked BOOLEAN NOT NULL DEFAULT FALSE,
    favorited BOOLEAN NOT NULL DEFAULT FALSE,
    selected BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (recommendation_item_id),
    CONSTRAINT uk_recommendation_items_product UNIQUE (history_id, product_id),
    INDEX idx_recommendation_items_history_rank (history_id, rank_position),
    INDEX idx_recommendation_items_product (product_id),
    CONSTRAINT fk_recommendation_items_history
        FOREIGN KEY (history_id) REFERENCES recommendation_history (history_id) ON DELETE CASCADE,
    CONSTRAINT fk_recommendation_items_product
        FOREIGN KEY (product_id) REFERENCES products (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE recommendation_feedback (
    feedback_id BIGINT NOT NULL AUTO_INCREMENT,
    history_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    selected_product_id BIGINT NULL,
    rating INT NOT NULL,
    is_relevant BOOLEAN NULL,
    comment VARCHAR(1000) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (feedback_id),
    CONSTRAINT uk_recommendation_feedback_history UNIQUE (history_id),
    INDEX idx_recommendation_feedback_user (user_id),
    INDEX idx_recommendation_feedback_product (selected_product_id),
    CONSTRAINT chk_recommendation_feedback_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT fk_recommendation_feedback_history
        FOREIGN KEY (history_id) REFERENCES recommendation_history (history_id) ON DELETE CASCADE,
    CONSTRAINT fk_recommendation_feedback_user
        FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_recommendation_feedback_product
        FOREIGN KEY (selected_product_id) REFERENCES products (product_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
