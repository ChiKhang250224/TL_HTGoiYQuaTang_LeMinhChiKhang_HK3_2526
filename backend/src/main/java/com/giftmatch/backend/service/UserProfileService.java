package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.ChangePasswordRequest;
import com.giftmatch.backend.dto.UpdateUserProfileRequest;
import com.giftmatch.backend.dto.UserProfileResponse;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserProfileResponse get(User user) {
        return UserProfileResponse.from(userRepository.findById(user.getUserId()).orElseThrow());
    }

    @Transactional
    public UserProfileResponse update(User user, UpdateUserProfileRequest request) {
        User managed = userRepository.findById(user.getUserId()).orElseThrow();
        managed.setFullName(request.getFullName().trim());
        managed.setPhoneNumber(blankToNull(request.getPhoneNumber()));
        managed.setAvatarUrl(blankToNull(request.getAvatarUrl()));
        return UserProfileResponse.from(userRepository.save(managed));
    }

    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        User managed = userRepository.findById(user.getUserId()).orElseThrow();
        if (!passwordEncoder.matches(request.getCurrentPassword(), managed.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mat khau hien tai khong dung.");
        }
        if (passwordEncoder.matches(request.getNewPassword(), managed.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mat khau moi phai khac mat khau hien tai.");
        }
        managed.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(managed);
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
