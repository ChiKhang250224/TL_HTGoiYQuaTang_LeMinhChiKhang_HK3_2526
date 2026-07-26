package com.giftmatch.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AiRecommendationRequest {
    private String gender;

    @JsonProperty("relationship_to_receiver")
    private String relationshipToReceiver;

    private String occasion;
    private BigDecimal budget;
    private String interests;

    @JsonProperty("receiver_personality")
    private String receiverPersonality;

    @JsonProperty("receiver_age_group")
    private String receiverAgeGroup;

    @JsonProperty("relationship_closeness")
    private String relationshipCloseness;

    @JsonProperty("giver_preference_style")
    private String giverPreferenceStyle;

    @JsonProperty("top_k")
    private int topK;
}
