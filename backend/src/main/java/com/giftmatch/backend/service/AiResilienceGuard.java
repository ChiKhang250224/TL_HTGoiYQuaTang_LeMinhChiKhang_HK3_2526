package com.giftmatch.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientResponseException;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.Supplier;

@Component
public class AiResilienceGuard {
    private static final Logger LOGGER = LoggerFactory.getLogger(AiResilienceGuard.class);

    private final int maxAttempts;
    private final long retryDelayMs;
    private final int failureThreshold;
    private final long circuitOpenMs;
    private final AtomicInteger consecutiveFailures = new AtomicInteger();
    private final AtomicLong openUntilEpochMs = new AtomicLong();

    public AiResilienceGuard(
            @Value("${ai.service.retry.max-attempts:2}") int maxAttempts,
            @Value("${ai.service.retry.delay-ms:200}") long retryDelayMs,
            @Value("${ai.service.circuit-breaker.failure-threshold:3}") int failureThreshold,
            @Value("${ai.service.circuit-breaker.open-ms:30000}") long circuitOpenMs
    ) {
        this.maxAttempts = Math.max(1, maxAttempts);
        this.retryDelayMs = Math.max(0, retryDelayMs);
        this.failureThreshold = Math.max(1, failureThreshold);
        this.circuitOpenMs = Math.max(1000, circuitOpenMs);
    }

    public <T> T execute(Supplier<T> operation) {
        long now = System.currentTimeMillis();
        long openUntil = openUntilEpochMs.get();
        if (openUntil > now) {
            throw new AiCircuitOpenException("Mạch bảo vệ AI đang mở trong thời gian phục hồi.");
        }
        if (openUntil > 0) {
            openUntilEpochMs.compareAndSet(openUntil, 0);
        }

        RuntimeException lastFailure = null;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                T result = operation.get();
                consecutiveFailures.set(0);
                openUntilEpochMs.set(0);
                return result;
            } catch (RuntimeException exception) {
                if (!isRetryable(exception)) {
                    throw exception;
                }
                lastFailure = exception;
                LOGGER.warn("AI request failed at attempt {}/{}: {}", attempt, maxAttempts, exception.getMessage());
                if (attempt < maxAttempts) {
                    waitBeforeRetry();
                }
            }
        }

        int failures = consecutiveFailures.incrementAndGet();
        if (failures >= failureThreshold) {
            openUntilEpochMs.set(System.currentTimeMillis() + circuitOpenMs);
            LOGGER.error("AI circuit opened after {} consecutive failed requests.", failures);
        }
        throw lastFailure == null
                ? new IllegalStateException("AI request failed without a recorded cause.")
                : lastFailure;
    }

    private boolean isRetryable(RuntimeException exception) {
        if (exception instanceof RestClientResponseException responseException) {
            return responseException.getStatusCode().is5xxServerError();
        }
        return true;
    }

    private void waitBeforeRetry() {
        if (retryDelayMs == 0) return;
        try {
            Thread.sleep(retryDelayMs);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Quá trình gọi AI đã bị gián đoạn.", exception);
        }
    }

    public static class AiCircuitOpenException extends RuntimeException {
        public AiCircuitOpenException(String message) {
            super(message);
        }
    }
}
