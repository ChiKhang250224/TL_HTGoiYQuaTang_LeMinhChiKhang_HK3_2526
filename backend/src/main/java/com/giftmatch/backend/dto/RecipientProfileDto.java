package com.giftmatch.backend.dto;

import lombok.Data;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.time.LocalDate;

@Data
public class RecipientProfileDto {
    private Long profileId;
    private Long userId;

    @NotBlank
    private String fullName;

    @Min(1)
    @Max(120)
    private Integer age;

    private String gender;
    private String relationship;
    private List<String> hobbies;
    private String notes;

    @Valid
    private List<AnniversaryDto> anniversaries;

    @Data
    public static class AnniversaryDto {
        private String eventName;
        private LocalDate eventDate;
    }
}
