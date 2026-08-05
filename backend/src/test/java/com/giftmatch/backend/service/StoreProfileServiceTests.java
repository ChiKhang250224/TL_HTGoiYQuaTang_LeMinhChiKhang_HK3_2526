package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.StoreProfileDto;
import com.giftmatch.backend.entity.StoreProfile;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.StoreProfileRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StoreProfileServiceTests {
    @Mock StoreProfileRepository repository;
    @InjectMocks StoreProfileService service;

    @Test
    void updatesProfileOwnedByCurrentStore() {
        User owner = User.builder().userId(2L).email("store@gift.vn").build();
        StoreProfile profile = StoreProfile.builder().storeId(3L).owner(owner).storeName("Old").status("PENDING").build();
        StoreProfileDto request = StoreProfileDto.builder().storeName("New Store").phone("0902").build();
        when(repository.findByOwner_UserId(2L)).thenReturn(Optional.of(profile));
        when(repository.save(profile)).thenReturn(profile);

        var result = service.update(owner, request);
        assertThat(result.getStoreName()).isEqualTo("New Store");
        assertThat(result.getEmail()).isEqualTo("store@gift.vn");
    }
}
