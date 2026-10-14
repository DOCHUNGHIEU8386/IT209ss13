package com.campushub.dto;

import com.campushub.entity.ItemClaim;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewClaimRequest {

    @NotNull(message = "Trạng thái phê duyệt không được để trống (ACCEPTED hoặc REJECTED)")
    private ItemClaim.ClaimStatus status;

    private String reviewNotes;
}
