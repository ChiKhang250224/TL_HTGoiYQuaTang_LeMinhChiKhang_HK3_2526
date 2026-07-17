package com.giftmatch.backend.dto;

import lombok.Data;
import java.util.List;
import java.time.LocalDate;

@Data
public class RecipientProfileDto {
    private Long profileId;
    private Long userId;
    private String fullName;
    private Integer age;
    private String gender;
    private String relationship;
    private List<String> hobbies;
    private String notes;
    private List<AnniversaryDto> anniversaries;

    @Data
    public static class AnniversaryDto {
        private String eventName;
        private LocalDate eventDate;
    }
}
