package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.RecipientProfileDto;
import com.giftmatch.backend.entity.Anniversary;
import com.giftmatch.backend.entity.RecipientProfile;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.RecipientProfileRepository;
import com.giftmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipientProfileService {
    private final RecipientProfileRepository profileRepository;
    private final UserRepository userRepository;

    public List<RecipientProfile> getProfilesByUser(Long userId) {
        return profileRepository.findByUser_UserId(userId);
    }

    public RecipientProfile createProfile(Long userId, RecipientProfileDto dto) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Anniversary> anniversaries = null;
        if (dto.getAnniversaries() != null) {
            anniversaries = dto.getAnniversaries().stream()
                .map(a -> new Anniversary(a.getEventName(), a.getEventDate()))
                .collect(Collectors.toList());
        }

        RecipientProfile profile = RecipientProfile.builder()
                .user(user)
                .fullName(dto.getFullName())
                .age(dto.getAge())
                .gender(dto.getGender())
                .relationship(dto.getRelationship())
                .hobbies(dto.getHobbies())
                .notes(dto.getNotes())
                .anniversaries(anniversaries)
                .build();
        return profileRepository.save(profile);
    }

    public void deleteProfile(Long profileId) {
        profileRepository.deleteById(profileId);
    }
}
