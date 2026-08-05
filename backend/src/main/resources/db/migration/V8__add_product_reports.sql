CREATE TABLE product_reports (
    report_id BIGINT NOT NULL AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    reporter_id BIGINT NOT NULL,
    reason VARCHAR(50) NOT NULL,
    description VARCHAR(1000) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    resolution_note VARCHAR(1000) NULL,
    handled_by BIGINT NULL,
    handled_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (report_id),
    INDEX idx_product_reports_status_created (status, created_at),
    INDEX idx_product_reports_reporter (reporter_id, created_at),
    INDEX idx_product_reports_product (product_id, created_at),
    CONSTRAINT fk_product_reports_product
        FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    CONSTRAINT fk_product_reports_reporter
        FOREIGN KEY (reporter_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_product_reports_handler
        FOREIGN KEY (handled_by) REFERENCES users (user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
