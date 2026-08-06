package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.*;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.service.TaxonomyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/taxonomy")
@RequiredArgsConstructor
public class AdminTaxonomyController {
    private final TaxonomyService service;

    @GetMapping
    public ResponseEntity<TaxonomyResponse> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping("/types")
    public ResponseEntity<TaxonomyResponse.TypeItem> createType(
            @Valid @RequestBody TaxonomyTypeRequest request,
            @AuthenticationPrincipal UserDetailsImpl details
    ) {
        return ResponseEntity.ok(service.createType(request, details.getUser()));
    }

    @PutMapping("/types/{id}")
    public ResponseEntity<TaxonomyResponse.TypeItem> updateType(
            @PathVariable Long id,
            @Valid @RequestBody TaxonomyTypeRequest request,
            @AuthenticationPrincipal UserDetailsImpl details
    ) {
        return ResponseEntity.ok(service.updateType(id, request, details.getUser()));
    }

    @PutMapping("/types/{id}/active")
    public ResponseEntity<TaxonomyResponse.TypeItem> setTypeActive(
            @PathVariable Long id,
            @Valid @RequestBody TaxonomyStatusRequest request,
            @AuthenticationPrincipal UserDetailsImpl details
    ) {
        return ResponseEntity.ok(service.setTypeActive(id, request.getActive(), details.getUser()));
    }

    @PostMapping("/labels")
    public ResponseEntity<TaxonomyResponse.LabelItem> createLabel(
            @Valid @RequestBody TaxonomyLabelRequest request,
            @AuthenticationPrincipal UserDetailsImpl details
    ) {
        return ResponseEntity.ok(service.createLabel(request, details.getUser()));
    }

    @PutMapping("/labels/{id}")
    public ResponseEntity<TaxonomyResponse.LabelItem> updateLabel(
            @PathVariable Long id,
            @Valid @RequestBody TaxonomyLabelRequest request,
            @AuthenticationPrincipal UserDetailsImpl details
    ) {
        return ResponseEntity.ok(service.updateLabel(id, request, details.getUser()));
    }

    @PutMapping("/labels/{id}/active")
    public ResponseEntity<TaxonomyResponse.LabelItem> setLabelActive(
            @PathVariable Long id,
            @Valid @RequestBody TaxonomyStatusRequest request,
            @AuthenticationPrincipal UserDetailsImpl details
    ) {
        return ResponseEntity.ok(service.setLabelActive(id, request.getActive(), details.getUser()));
    }
}
