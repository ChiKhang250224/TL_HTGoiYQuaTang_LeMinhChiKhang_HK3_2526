package com.giftmatch.backend.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AuthDtoValidationTests {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void rejectsInvalidRegistrationData() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("")
                .email("invalid-email")
                .password("123")
                .phoneNumber("0123")
                .role("ADMIN")
                .build();

        assertThat(validator.validate(request)).hasSize(5);
    }

    @Test
    void acceptsValidStoreRegistrationData() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("GiftMatch Store")
                .email("store@gmail.com")
                .password("password123")
                .phoneNumber("0901234567")
                .role("STORE")
                .build();

        assertThat(validator.validate(request)).isEmpty();
    }
}
