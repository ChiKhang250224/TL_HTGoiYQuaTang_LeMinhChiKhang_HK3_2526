package com.giftmatch.backend.dto;

import com.giftmatch.backend.entity.StoreProfile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StoreProfileDto {
    private Long storeId;
    @NotBlank @Size(max = 150) private String storeName;
    private String description;
    @Size(max = 500) private String address;
    @Size(max = 20) private String phone;
    @Size(max = 500) private String logoUrl;
    private String email;
    private String status;

    public static StoreProfileDto from(StoreProfile profile) {
        return StoreProfileDto.builder().storeId(profile.getStoreId()).storeName(profile.getStoreName())
                .description(profile.getDescription()).address(profile.getAddress()).phone(profile.getPhone())
                .logoUrl(profile.getLogoUrl()).email(profile.getOwner().getEmail()).status(profile.getStatus()).build();
    }
}
