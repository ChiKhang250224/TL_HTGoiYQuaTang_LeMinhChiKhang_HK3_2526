package com.giftmatch.backend.dto;

import com.giftmatch.backend.entity.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponse {
    private Long userId;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String avatarUrl;
    private String role;

    public static UserProfileResponse from(User user) {
        return UserProfileResponse.builder()
                .userId(user.getUserId()).email(user.getEmail())
                .fullName(user.getFullName()).phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl()).role(user.getRole().name()).build();
    }
}
