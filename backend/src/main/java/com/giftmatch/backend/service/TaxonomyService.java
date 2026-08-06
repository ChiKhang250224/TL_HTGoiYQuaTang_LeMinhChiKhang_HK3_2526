package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.*;
import com.giftmatch.backend.entity.GiftLabel;
import com.giftmatch.backend.entity.GiftType;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.GiftLabelRepository;
import com.giftmatch.backend.repository.GiftTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class TaxonomyService {
    private final GiftTypeRepository typeRepository;
    private final GiftLabelRepository labelRepository;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public TaxonomyResponse getAll() {
        return TaxonomyResponse.builder()
                .types(typeRepository.findAllByOrderByDisplayNameAsc().stream()
                        .map(type -> TaxonomyResponse.TypeItem.builder()
                                .giftTypeId(type.getGiftTypeId())
                                .code(type.getCode())
                                .displayName(type.getDisplayName())
                                .active(type.getIsActive())
                                .labelCount(labelRepository.countByGiftType_GiftTypeId(type.getGiftTypeId()))
                                .build())
                        .toList())
                .labels(labelRepository.findAllByOrderByGiftType_DisplayNameAscDisplayNameAsc().stream()
                        .map(label -> TaxonomyResponse.LabelItem.builder()
                                .giftLabelId(label.getGiftLabelId())
                                .giftTypeId(label.getGiftType().getGiftTypeId())
                                .giftTypeName(label.getGiftType().getDisplayName())
                                .code(label.getCode())
                                .displayName(label.getDisplayName())
                                .active(label.getIsActive())
                                .build())
                        .toList())
                .build();
    }

    @Transactional
    public TaxonomyResponse.TypeItem createType(TaxonomyTypeRequest request, User actor) {
        String code = normalizeCode(request.getCode());
        if (typeRepository.findByCode(code).isPresent()
                || typeRepository.findByDisplayNameIgnoreCase(request.getDisplayName().trim()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Mã hoặc tên loại quà đã tồn tại.");
        }
        GiftType saved = typeRepository.save(GiftType.builder()
                .code(code)
                .displayName(request.getDisplayName().trim())
                .isActive(true)
                .build());
        auditLogService.record(actor, "TAXONOMY_TYPE_CREATED", "GIFT_TYPE", saved.getGiftTypeId(), "Tạo loại quà " + saved.getDisplayName());
        return TaxonomyResponse.TypeItem.builder()
                .giftTypeId(saved.getGiftTypeId()).code(saved.getCode())
                .displayName(saved.getDisplayName()).active(saved.getIsActive()).labelCount(0).build();
    }

    @Transactional
    public TaxonomyResponse.LabelItem createLabel(TaxonomyLabelRequest request, User actor) {
        GiftType type = typeRepository.findById(request.getGiftTypeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy loại quà."));
        if (!Boolean.TRUE.equals(type.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể thêm nhãn vào loại quà đã ngừng sử dụng.");
        }
        String code = normalizeCode(request.getCode());
        if (labelRepository.findByCode(code).isPresent()
                || labelRepository.findByDisplayNameIgnoreCase(request.getDisplayName().trim()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Mã hoặc tên nhãn đã tồn tại.");
        }
        GiftLabel saved = labelRepository.save(GiftLabel.builder()
                .giftType(type).code(code).displayName(request.getDisplayName().trim()).isActive(true).build());
        auditLogService.record(actor, "TAXONOMY_LABEL_CREATED", "GIFT_LABEL", saved.getGiftLabelId(), "Tạo nhãn " + saved.getDisplayName());
        return toLabelItem(saved);
    }

    @Transactional
    public TaxonomyResponse.TypeItem updateType(Long id, TaxonomyTypeRequest request, User actor) {
        GiftType type = typeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy loại quà."));
        String code = normalizeCode(request.getCode());
        typeRepository.findByCode(code).filter(other -> !other.getGiftTypeId().equals(id))
                .ifPresent(other -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "Mã loại quà đã tồn tại."); });
        typeRepository.findByDisplayNameIgnoreCase(request.getDisplayName().trim())
                .filter(other -> !other.getGiftTypeId().equals(id))
                .ifPresent(other -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "Tên loại quà đã tồn tại."); });
        type.setCode(code);
        type.setDisplayName(request.getDisplayName().trim());
        GiftType saved = typeRepository.save(type);
        auditLogService.record(actor, "TAXONOMY_TYPE_UPDATED", "GIFT_TYPE", id, "Cập nhật loại quà " + saved.getDisplayName());
        return TaxonomyResponse.TypeItem.builder().giftTypeId(id).code(saved.getCode())
                .displayName(saved.getDisplayName()).active(saved.getIsActive())
                .labelCount(labelRepository.countByGiftType_GiftTypeId(id)).build();
    }

    @Transactional
    public TaxonomyResponse.LabelItem updateLabel(Long id, TaxonomyLabelRequest request, User actor) {
        GiftLabel label = labelRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy nhãn quà."));
        GiftType type = typeRepository.findById(request.getGiftTypeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy loại quà."));
        String code = normalizeCode(request.getCode());
        labelRepository.findByCode(code).filter(other -> !other.getGiftLabelId().equals(id))
                .ifPresent(other -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "Mã nhãn đã tồn tại."); });
        labelRepository.findByDisplayNameIgnoreCase(request.getDisplayName().trim())
                .filter(other -> !other.getGiftLabelId().equals(id))
                .ifPresent(other -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "Tên nhãn đã tồn tại."); });
        label.setGiftType(type);
        label.setCode(code);
        label.setDisplayName(request.getDisplayName().trim());
        GiftLabel saved = labelRepository.save(label);
        auditLogService.record(actor, "TAXONOMY_LABEL_UPDATED", "GIFT_LABEL", id, "Cập nhật nhãn " + saved.getDisplayName());
        return toLabelItem(saved);
    }

    @Transactional
    public TaxonomyResponse.TypeItem setTypeActive(Long id, boolean active, User actor) {
        GiftType type = typeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy loại quà."));
        type.setIsActive(active);
        typeRepository.save(type);
        if (!active) {
            labelRepository.findAllByOrderByGiftType_DisplayNameAscDisplayNameAsc().stream()
                    .filter(label -> label.getGiftType().getGiftTypeId().equals(id))
                    .forEach(label -> label.setIsActive(false));
        }
        auditLogService.record(actor, active ? "TAXONOMY_TYPE_ENABLED" : "TAXONOMY_TYPE_DISABLED", "GIFT_TYPE", id, "Cập nhật trạng thái loại quà " + type.getDisplayName());
        return TaxonomyResponse.TypeItem.builder()
                .giftTypeId(type.getGiftTypeId()).code(type.getCode()).displayName(type.getDisplayName())
                .active(type.getIsActive()).labelCount(labelRepository.countByGiftType_GiftTypeId(id)).build();
    }

    @Transactional
    public TaxonomyResponse.LabelItem setLabelActive(Long id, boolean active, User actor) {
        GiftLabel label = labelRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy nhãn quà."));
        if (active && !Boolean.TRUE.equals(label.getGiftType().getIsActive())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cần kích hoạt loại quà trước khi kích hoạt nhãn.");
        }
        label.setIsActive(active);
        GiftLabel saved = labelRepository.save(label);
        auditLogService.record(actor, active ? "TAXONOMY_LABEL_ENABLED" : "TAXONOMY_LABEL_DISABLED", "GIFT_LABEL", id, "Cập nhật trạng thái nhãn " + label.getDisplayName());
        return toLabelItem(saved);
    }

    private TaxonomyResponse.LabelItem toLabelItem(GiftLabel label) {
        return TaxonomyResponse.LabelItem.builder()
                .giftLabelId(label.getGiftLabelId()).giftTypeId(label.getGiftType().getGiftTypeId())
                .giftTypeName(label.getGiftType().getDisplayName()).code(label.getCode())
                .displayName(label.getDisplayName()).active(label.getIsActive()).build();
    }

    private String normalizeCode(String value) {
        return value.trim().toUpperCase(Locale.ROOT).replaceAll("[^A-Z0-9]+", "_").replaceAll("^_+|_+$", "");
    }
}
