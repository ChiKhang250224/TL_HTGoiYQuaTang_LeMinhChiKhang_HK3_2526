ALTER TABLE store_profiles
    ADD COLUMN review_note VARCHAR(1000) NULL AFTER status,
    ADD COLUMN reviewed_by BIGINT NULL AFTER review_note,
    ADD COLUMN reviewed_at DATETIME NULL AFTER reviewed_by,
    ADD CONSTRAINT fk_store_profiles_reviewed_by
        FOREIGN KEY (reviewed_by) REFERENCES users(user_id) ON DELETE SET NULL;

ALTER TABLE recommendation_items
    ADD COLUMN match_source VARCHAR(20) NULL AFTER match_score,
    ADD COLUMN match_reason VARCHAR(1000) NULL AFTER match_source;

CREATE TABLE admin_audit_logs (
    audit_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_user_id BIGINT NOT NULL,
    action VARCHAR(80) NOT NULL,
    target_type VARCHAR(80) NOT NULL,
    target_id VARCHAR(120) NULL,
    summary VARCHAR(1000) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_audit_actor
        FOREIGN KEY (actor_user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_admin_audit_created_at (created_at),
    INDEX idx_admin_audit_actor (actor_user_id),
    INDEX idx_admin_audit_target (target_type, target_id)
);

CREATE INDEX idx_recommendation_items_product_history
    ON recommendation_items(product_id, history_id);

CREATE INDEX idx_favorites_product_created
    ON favorites(product_id, created_at);

