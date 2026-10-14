package com.campushub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchSuggestionDto {
    private LostFoundItemDto matchedItem;
    private int matchScore; // Percentage 0 - 100%
    private String matchReason; // "Cùng danh mục và địa điểm tương đồng"
}
