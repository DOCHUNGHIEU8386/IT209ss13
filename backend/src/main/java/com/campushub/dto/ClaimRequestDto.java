package com.campushub.dto;

import com.campushub.entity.ItemClaim;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimRequestDto {
    private Long id;
    private Long itemId;
    private String itemTitle;
    private Long claimantId;
    private String claimantName;
    private String claimantEmail;
    private String claimantPhone;

    @NotBlank(message = "Bằng chứng sở hữu / Trả lời câu hỏi không được để trống")
    private String proofDescription;

    private String proofImageUrl;
    private ItemClaim.ClaimStatus claimStatus;
    private String reviewNotes;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
}
