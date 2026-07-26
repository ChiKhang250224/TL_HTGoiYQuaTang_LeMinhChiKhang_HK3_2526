package com.giftmatch.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class AiServiceConfig {

    @Bean
    public RestClient aiRestClient(@Value("${ai.service.url}") String baseUrl) {
        SimpleClientHttpRequestFactory requestFactory =
                new SimpleClientHttpRequestFactory();

        return RestClient.builder()
                .baseUrl(baseUrl)
                // Uvicorn serves HTTP/1.1. Avoid the JDK client's h2c upgrade
                // request, which can make Uvicorn receive an empty POST body.
                .requestFactory(requestFactory)
                .build();
    }
}
