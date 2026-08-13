package com.giftmatch.backend.controller;

import com.giftmatch.backend.repository.GiftLabelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/store/taxonomy")
@RequiredArgsConstructor
public class StoreTaxonomyController {
    private final GiftLabelRepository giftLabelRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, String>> getActiveTaxonomy() {
        Map<String, String> taxonomy = new LinkedHashMap<>();
        giftLabelRepository.findByIsActiveTrueOrderByGiftType_DisplayNameAscDisplayNameAsc()
                .stream()
                .filter(label -> Boolean.TRUE.equals(label.getGiftType().getIsActive()))
                .forEach(label -> taxonomy.put(
                        label.getDisplayName(),
                        label.getGiftType().getDisplayName()
                ));
        return ResponseEntity.ok(taxonomy);
    }
}
