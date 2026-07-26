package com.giftmatch.backend.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class AiRecommendationRequestSerializationTests {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void serializesPythonFieldNames() throws Exception {
        AiRecommendationRequest request = AiRecommendationRequest.builder()
                .gender("Female")
                .relationshipToReceiver("Partner")
                .occasion("Birthday")
                .budget(BigDecimal.valueOf(500))
                .interests("Books")
                .receiverPersonality("Creative")
                .receiverAgeGroup("Adult")
                .relationshipCloseness("close")
                .giverPreferenceStyle("practical")
                .topK(5)
                .build();

        String json = objectMapper.writeValueAsString(request);

        assertThat(json)
                .contains("\"relationship_to_receiver\"")
                .contains("\"receiver_personality\"")
                .contains("\"receiver_age_group\"")
                .contains("\"relationship_closeness\"")
                .contains("\"giver_preference_style\"")
                .contains("\"top_k\"");

        String jackson3Json = tools.jackson.databind.json.JsonMapper.builder()
                .build()
                .writeValueAsString(request);

        assertThat(jackson3Json)
                .contains("\"relationship_to_receiver\"")
                .contains("\"receiver_personality\"")
                .contains("\"receiver_age_group\"")
                .contains("\"relationship_closeness\"")
                .contains("\"giver_preference_style\"")
                .contains("\"top_k\"");
    }
}
