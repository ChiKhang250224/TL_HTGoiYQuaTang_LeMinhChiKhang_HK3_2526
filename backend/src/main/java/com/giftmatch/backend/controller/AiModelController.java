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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.service.AuditLogService;
import com.giftmatch.backend.entity.AiModel;
import com.giftmatch.backend.repository.AiModelRepository;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/ai-models")
@RequiredArgsConstructor
public class AiModelController {
    private final RestClient aiRestClient;
    private final AuditLogService auditLogService;
    private final AiModelRepository aiModelRepository;

    @GetMapping
    public ResponseEntity<Map> listModels() {
        Map response = aiRestClient.get()
                .uri("/models")
                .retrieve()
                .body(Map.class);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reload")
    @Transactional
    public ResponseEntity<Map> reloadModel(@AuthenticationPrincipal UserDetailsImpl details) {
        Map response = aiRestClient.post()
                .uri("/models/reload")
                .retrieve()
                .body(Map.class);
        syncActiveModel(response, null);
        auditLogService.record(details.getUser(), "AI_MODEL_RELOADED", "AI_MODEL", null, "Nạp lại artifact AI đang hoạt động");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/activate/{filename}")
    @Transactional
    public ResponseEntity<Map> activateModel(
            @PathVariable String filename,
            @AuthenticationPrincipal UserDetailsImpl details
    ) {
        Map response = aiRestClient.post()
                .uri("/models/activate/{filename}", filename)
                .retrieve()
                .body(Map.class);
        syncActiveModel(response, filename);
        auditLogService.record(details.getUser(), "AI_MODEL_ACTIVATED", "AI_MODEL", filename, "Kích hoạt artifact " + filename);
        return ResponseEntity.ok(response);
    }

    @PostMapping(
            path = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @Transactional
    public ResponseEntity<Map> uploadModel(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "true") boolean activate,
            @AuthenticationPrincipal UserDetailsImpl details
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
        registerUploadedModel(response, file.getOriginalFilename(), file.getSize(), activate);
        auditLogService.record(details.getUser(), "AI_MODEL_UPLOADED", "AI_MODEL", file.getOriginalFilename(), "Tải lên artifact AI; activate=" + activate);
        return ResponseEntity.ok(response);
    }

    private void registerUploadedModel(Map response, String filename, long size, boolean activate) {
        String safeFilename = filename == null ? "uploaded_model.joblib" : filename;
        String version = response == null || response.get("model_version") == null
                ? safeFilename : String.valueOf(response.get("model_version"));
        AiModel model = aiModelRepository.findByFilename(safeFilename)
                .orElseGet(() -> aiModelRepository.findByModelVersion(version).orElse(new AiModel()));
        model.setModelVersion(version);
        model.setAlgorithm("RandomForestHybrid");
        model.setFilename(safeFilename);
        model.setStoragePath(safeFilename);
        model.setFileSize(size);
        model.setStatus(activate ? "ACTIVE" : "UPLOADED");
        model.setActivatedAt(activate ? LocalDateTime.now() : null);
        if (activate) deactivateOtherModels(model);
        aiModelRepository.save(model);
    }

    private void syncActiveModel(Map response, String requestedFilename) {
        if (response == null) return;
        String filename = requestedFilename;
        if (filename == null && response.get("active_model") != null) {
            filename = java.nio.file.Path.of(String.valueOf(response.get("active_model"))).getFileName().toString();
        }
        if (filename == null) return;
        String version = response.get("model_version") == null ? filename : String.valueOf(response.get("model_version"));
        AiModel model = aiModelRepository.findByFilename(filename)
                .orElseGet(() -> aiModelRepository.findByModelVersion(version).orElse(new AiModel()));
        model.setModelVersion(version);
        model.setAlgorithm("RandomForestHybrid");
        model.setFilename(filename);
        model.setStoragePath(filename);
        model.setStatus("ACTIVE");
        model.setActivatedAt(LocalDateTime.now());
        deactivateOtherModels(model);
        aiModelRepository.save(model);
    }

    private void deactivateOtherModels(AiModel activeModel) {
        aiModelRepository.findAll().stream()
                .filter(model -> model.getModelId() != null)
                .filter(model -> activeModel.getModelId() == null || !model.getModelId().equals(activeModel.getModelId()))
                .filter(model -> "ACTIVE".equals(model.getStatus()))
                .forEach(model -> model.setStatus("INACTIVE"));
    }
}
