package com.giftmatch.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/ai-models")
@RequiredArgsConstructor
public class AiModelController {
    private final RestClient aiRestClient;

    @GetMapping
    public ResponseEntity<Map> listModels() {
        Map response = aiRestClient.get()
                .uri("/models")
                .retrieve()
                .body(Map.class);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reload")
    public ResponseEntity<Map> reloadModel() {
        Map response = aiRestClient.post()
                .uri("/models/reload")
                .retrieve()
                .body(Map.class);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/activate/{filename}")
    public ResponseEntity<Map> activateModel(@PathVariable String filename) {
        Map response = aiRestClient.post()
                .uri("/models/activate/{filename}", filename)
                .retrieve()
                .body(Map.class);
        return ResponseEntity.ok(response);
    }

    @PostMapping(
            path = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Map> uploadModel(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "true") boolean activate
    ) throws IOException {
        ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };
        MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
        parts.add("file", resource);
        Map response = aiRestClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/models/upload")
                        .queryParam("activate", activate)
                        .build())
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(parts)
                .retrieve()
                .body(Map.class);
        return ResponseEntity.ok(response);
    }
}
