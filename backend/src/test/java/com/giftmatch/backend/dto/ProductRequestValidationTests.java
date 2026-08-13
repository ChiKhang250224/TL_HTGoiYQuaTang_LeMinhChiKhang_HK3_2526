package com.giftmatch.backend.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class ProductRequestValidationTests {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void rejectsMissingNamePriceAndGiftLabel() {
        ProductRequest request = new ProductRequest();

        Set<ConstraintViolation<ProductRequest>> violations = validator.validate(request);

        assertThat(violations).extracting(violation -> violation.getPropertyPath().toString())
                .contains("name", "price", "aiGiftName");
    }

    @Test
    void acceptsValidProductInput() {
        ProductRequest request = new ProductRequest();
        request.setName("Bộ quà chăm sóc da");
        request.setPrice(BigDecimal.valueOf(549_000));
        request.setDescription("Bộ sản phẩm quà tặng.");
        request.setAiGiftName("Skincare Kit");

        assertThat(validator.validate(request)).isEmpty();
    }
}
