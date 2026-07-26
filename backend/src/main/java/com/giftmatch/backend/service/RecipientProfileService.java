package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.RecipientProfileDto;
import com.giftmatch.backend.entity.Anniversary;
import com.giftmatch.backend.entity.RecipientProfile;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.RecipientProfileRepository;
import com.giftmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipientProfileService {
    private final RecipientProfileRepository profileRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<RecipientProfileDto> getProfilesByUser(Long userId) {
        return profileRepository.findByUser_UserId(userId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public RecipientProfileDto getProfile(Long profileId, Long userId) {
        return toDto(findOwnedProfile(profileId, userId));
    }

    @Transactional
    public RecipientProfileDto createProfile(Long userId, RecipientProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy người dùng."
                ));
        RecipientProfile profile = RecipientProfile.builder()
                .user(user)
                .fullName(dto.getFullName().trim())
                .age(dto.getAge())
                .gender(dto.getGender())
                .relationship(dto.getRelationship())
                .hobbies(toHobbies(dto))
                .notes(dto.getNotes())
                .anniversaries(toAnniversaries(dto))
                .build();
        return toDto(profileRepository.save(profile));
    }

    @Transactional
    public RecipientProfileDto updateProfile(
            Long profileId,
            Long userId,
            RecipientProfileDto dto
    ) {
        RecipientProfile profile = findOwnedProfile(profileId, userId);
        profile.setFullName(dto.getFullName().trim());
        profile.setAge(dto.getAge());
        profile.setGender(dto.getGender());
        profile.setRelationship(dto.getRelationship());
        profile.setHobbies(toHobbies(dto));
        profile.setNotes(dto.getNotes());
        profile.setAnniversaries(toAnniversaries(dto));
        return toDto(profileRepository.save(profile));
    }

    @Transactional
    public void deleteProfile(Long profileId, Long userId) {
        profileRepository.delete(findOwnedProfile(profileId, userId));
    }

    private RecipientProfile findOwnedProfile(Long profileId, Long userId) {
        return profileRepository.findByProfileIdAndUser_UserId(profileId, userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy hồ sơ người nhận của người dùng."
                ));
    }

    private List<String> toHobbies(RecipientProfileDto dto) {
        if (dto.getHobbies() == null) {
            return new ArrayList<>();
        }
        return dto.getHobbies().stream()
                .filter(value -> value != null && !value.isBlank())
                .map(String::trim)
                .distinct()
                .toList();
    }

    private List<Anniversary> toAnniversaries(RecipientProfileDto dto) {
        if (dto.getAnniversaries() == null) {
            return new ArrayList<>();
        }
        return dto.getAnniversaries().stream()
                .filter(value -> value != null
                        && ((value.getEventName() != null
                        && !value.getEventName().isBlank())
                        || value.getEventDate() != null))
                .map(value -> new Anniversary(
                        value.getEventName() == null
                                ? null
                                : value.getEventName().trim(),
                        value.getEventDate()
                ))
                .toList();
    }

    private RecipientProfileDto toDto(RecipientProfile profile) {
        RecipientProfileDto dto = new RecipientProfileDto();
        dto.setProfileId(profile.getProfileId());
        dto.setUserId(profile.getUser().getUserId());
        dto.setFullName(profile.getFullName());
        dto.setAge(profile.getAge());
        dto.setGender(profile.getGender());
        dto.setRelationship(profile.getRelationship());
        dto.setHobbies(profile.getHobbies() == null
                ? List.of()
                : List.copyOf(profile.getHobbies()));
        dto.setNotes(profile.getNotes());
        dto.setAnniversaries(profile.getAnniversaries() == null
                ? List.of()
                : profile.getAnniversaries().stream()
                    .map(value -> {
                        RecipientProfileDto.AnniversaryDto anniversary =
                                new RecipientProfileDto.AnniversaryDto();
                        anniversary.setEventName(value.getEventName());
                        anniversary.setEventDate(value.getEventDate());
                        return anniversary;
                    })
                    .toList());
        return dto;
    }
}
