package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.StoreProfileDto;
import com.giftmatch.backend.entity.StoreProfile;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.StoreProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class StoreProfileService {
    private final StoreProfileRepository repository;

    @Transactional(readOnly = true)
    public StoreProfileDto get(User user) { return StoreProfileDto.from(find(user)); }

    @Transactional
    public StoreProfileDto update(User user, StoreProfileDto request) {
        StoreProfile profile = find(user);
        profile.setStoreName(request.getStoreName().trim());
        profile.setDescription(clean(request.getDescription()));
        profile.setAddress(clean(request.getAddress()));
        profile.setPhone(clean(request.getPhone()));
        profile.setLogoUrl(clean(request.getLogoUrl()));
        return StoreProfileDto.from(repository.save(profile));
    }

    private StoreProfile find(User user) {
        return repository.findByOwner_UserId(user.getUserId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Khong tim thay ho so cua hang."));
    }

    private String clean(String value) { return value == null || value.isBlank() ? null : value.trim(); }
}
