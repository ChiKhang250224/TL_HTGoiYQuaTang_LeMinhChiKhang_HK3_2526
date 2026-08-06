package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.TaxonomyLabelRequest;
import com.giftmatch.backend.entity.GiftLabel;
import com.giftmatch.backend.entity.GiftType;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.GiftLabelRepository;
import com.giftmatch.backend.repository.GiftTypeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaxonomyServiceTests {
    @Mock GiftTypeRepository typeRepository;
    @Mock GiftLabelRepository labelRepository;
    @Mock AuditLogService auditLogService;
    @InjectMocks TaxonomyService service;

    @Test
    void createsLabelOnlyForActiveType() {
        GiftType type = GiftType.builder().giftTypeId(1L).code("BOOK").displayName("Sách").isActive(true).build();
        TaxonomyLabelRequest request = new TaxonomyLabelRequest();
        request.setGiftTypeId(1L); request.setCode("NOVEL"); request.setDisplayName("Tiểu thuyết");
        when(typeRepository.findById(1L)).thenReturn(Optional.of(type));
        when(labelRepository.findByCode("NOVEL")).thenReturn(Optional.empty());
        when(labelRepository.findByDisplayNameIgnoreCase("Tiểu thuyết")).thenReturn(Optional.empty());
        when(labelRepository.save(any(GiftLabel.class))).thenAnswer(invocation -> {
            GiftLabel label = invocation.getArgument(0); label.setGiftLabelId(5L); return label;
        });
        var response = service.createLabel(request, User.builder().userId(9L).fullName("Admin").email("a@gift.vn").build());
        assertThat(response.getGiftLabelId()).isEqualTo(5L);
        assertThat(response.getGiftTypeName()).isEqualTo("Sách");
    }
}
