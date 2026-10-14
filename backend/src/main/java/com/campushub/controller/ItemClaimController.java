package com.campushub.controller;

import com.campushub.dto.ApiResponse;
import com.campushub.dto.ClaimRequestDto;
import com.campushub.dto.ReviewClaimRequest;
import com.campushub.service.ItemClaimService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lost-found")
@RequiredArgsConstructor
@Tag(name = "Xác Minh & Nhận Đồ (Claims)", description = "Quy trình gửi bằng chứng sở hữu, duyệt yêu cầu và bàn giao tài sản")
public class ItemClaimController {

    private final ItemClaimService claimService;

    @PostMapping("/{itemId}/claims")
    @Operation(summary = "Gửi yêu cầu xác minh nhận lại đồ (trả lời câu hỏi bảo mật, mô tả bằng chứng)")
    public ResponseEntity<ApiResponse<ClaimRequestDto>> submitClaim(
            @PathVariable Long itemId,
            @Valid @RequestBody ClaimRequestDto request,
            @RequestHeader(value = "X-User-Id", defaultValue = "2") Long claimantId) {
        ClaimRequestDto claim = claimService.submitClaim(itemId, request, claimantId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Gửi yêu cầu xác minh thành công! Đang chờ người đăng hoặc quản trị viên xét duyệt.", claim));
    }

    @GetMapping("/{itemId}/claims")
    @Operation(summary = "Lấy danh sách các yêu cầu xác minh của một món đồ (chỉ dành cho người đăng hoặc Admin)")
    public ResponseEntity<ApiResponse<List<ClaimRequestDto>>> getClaimsByItem(
            @PathVariable Long itemId,
            @RequestHeader(value = "X-User-Id", defaultValue = "2") Long currentUserId) {
        List<ClaimRequestDto> claims = claimService.getClaimsByItem(itemId, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(claims));
    }

    @GetMapping("/claims/my")
    @Operation(summary = "Lấy danh sách các yêu cầu nhận đồ do tôi đã gửi")
    public ResponseEntity<ApiResponse<List<ClaimRequestDto>>> getMyClaims(
            @RequestHeader(value = "X-User-Id", defaultValue = "2") Long claimantId) {
        List<ClaimRequestDto> claims = claimService.getMyClaims(claimantId);
        return ResponseEntity.ok(ApiResponse.ok(claims));
    }

    @PostMapping("/claims/{claimId}/review")
    @Operation(summary = "Xét duyệt yêu cầu xác minh (ACCEPTED: Đồng ý bàn giao -> Tin đăng chuyển sang RESOLVED; REJECTED: Từ chối)")
    public ResponseEntity<ApiResponse<ClaimRequestDto>> reviewClaim(
            @PathVariable Long claimId,
            @Valid @RequestBody ReviewClaimRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "2") Long reviewerId) {
        ClaimRequestDto reviewed = claimService.reviewClaim(claimId, request, reviewerId);
        return ResponseEntity.ok(ApiResponse.ok("Xử lý yêu cầu xác minh thành công!", reviewed));
    }
}
