ALTER TABLE products
    ADD COLUMN business_status VARCHAR(20) NOT NULL DEFAULT 'IN_STOCK' AFTER status;

CREATE INDEX idx_products_availability
    ON products (status, business_status, price);
