package com.giftmatch.backend.service;

import org.junit.jupiter.api.Test;

import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AiResilienceGuardTests {

    @Test
    void retriesTemporaryFailureAndReturnsSuccessfulResult() {
        AiResilienceGuard guard = new AiResilienceGuard(2, 0, 3, 1_000);
        AtomicInteger calls = new AtomicInteger();

        String result = guard.execute(() -> {
            if (calls.incrementAndGet() == 1) {
                throw new IllegalStateException("temporary failure");
            }
            return "ok";
        });

        assertThat(result).isEqualTo("ok");
        assertThat(calls).hasValue(2);
    }

    @Test
    void opensCircuitAfterConfiguredNumberOfFailedRequests() {
        AiResilienceGuard guard = new AiResilienceGuard(1, 0, 2, 30_000);
        AtomicInteger calls = new AtomicInteger();

        for (int index = 0; index < 2; index++) {
            assertThatThrownBy(() -> guard.execute(() -> {
                calls.incrementAndGet();
                throw new IllegalStateException("AI unavailable");
            })).isInstanceOf(IllegalStateException.class);
        }

        assertThatThrownBy(() -> guard.execute(() -> {
            calls.incrementAndGet();
            return "unexpected";
        })).isInstanceOf(AiResilienceGuard.AiCircuitOpenException.class);
        assertThat(calls).hasValue(2);
    }
}
