package com.giftmatch.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AiRecommendationResponse {
    @JsonProperty("model_version")
    private String modelVersion;

    private List<GiftPrediction> predictions;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GiftPrediction {
        @JsonProperty("gift_name")
        private String giftName;

        @JsonProperty("gift_type")
        private String giftType;

        private double score;
        private int rank;
    }
}
