package com.giftmatch.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TaxonomyResponse {
    private List<TypeItem> types;
    private List<LabelItem> labels;

    @Data
    @Builder
    public static class TypeItem {
        private Long giftTypeId;
        private String code;
        private String displayName;
        private Boolean active;
        private long labelCount;
    }

    @Data
    @Builder
    public static class LabelItem {
        private Long giftLabelId;
        private Long giftTypeId;
        private String giftTypeName;
        private String code;
        private String displayName;
        private Boolean active;
    }
}
