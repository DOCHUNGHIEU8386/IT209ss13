package com.campushub.service;

import com.campushub.dto.ClaimRequestDto;
import com.campushub.dto.ReviewClaimRequest;
import com.campushub.entity.ItemClaim;
import com.campushub.entity.LostFoundItem;
import com.campushub.entity.User;
import com.campushub.exception.BadRequestException;
import com.campushub.exception.ResourceNotFoundException;
import com.campushub.repository.ItemClaimRepository;
import com.campushub.repository.LostFoundItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemClaimService {

    private final ItemClaimRepository claimRepository;
    private final LostFoundItemRepository itemRepository;
    private final AuthService authService;

    @Transactional
    public ClaimRequestDto submitClaim(Long itemId, ClaimRequestDto request, Long claimantId) {
        LostFoundItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tin đăng ID: " + itemId));

        if (item.getStatus() == LostFoundItem.ItemStatus.RESOLVED || item.getStatus() == LostFoundItem.ItemStatus.CLOSED) {
            throw new BadRequestException("Tin đăng này đã hoàn tất hoặc đã đóng, không thể gửi yêu cầu xác minh");
        }

        if (item.getUser().getId().equals(claimantId)) {
            throw new BadRequestException("Bạn không thể tự gửi yêu cầu nhận lại đồ cho chính tin đăng của mình");
        }

        if (claimRepository.existsByItemIdAndClaimantId(itemId, claimantId)) {
            throw new BadRequestException("Bạn đã gửi một yêu cầu xác minh cho vật phẩm này trước đó rồi");
        }

        User claimant = authService.getUserById(claimantId);

        ItemClaim claim = ItemClaim.builder()
                .item(item)
                .claimant(claimant)
                .proofDescription(request.getProofDescription())
                .proofImageUrl(request.getProofImageUrl())
                .claimStatus(ItemClaim.ClaimStatus.SUBMITTED)
                .build();

        claim = claimRepository.save(claim);

        // Update item status to CLAIMED_PENDING if currently OPEN
        if (item.getStatus() == LostFoundItem.ItemStatus.OPEN) {
            item.setStatus(LostFoundItem.ItemStatus.CLAIMED_PENDING);
            itemRepository.save(item);
        }

        return toDto(claim);
    }

    public List<ClaimRequestDto> getClaimsByItem(Long itemId, Long currentUserId) {
        LostFoundItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tin đăng ID: " + itemId));

        User currentUser = authService.getUserById(currentUserId);
        boolean isOwner = item.getUser().getId().equals(currentUserId);
        boolean isAdmin = "ADMIN".equalsIgnoreCase(currentUser.getRole());

        if (!isOwner && !isAdmin) {
            throw new BadRequestException("Chỉ người đăng tin hoặc Quản trị viên mới được xem danh sách yêu cầu xác minh");
        }

        return claimRepository.findByItemIdOrderByCreatedAtDesc(itemId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ClaimRequestDto> getMyClaims(Long claimantId) {
        return claimRepository.findByClaimantIdOrderByCreatedAtDesc(claimantId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public ClaimRequestDto reviewClaim(Long claimId, ReviewClaimRequest request, Long reviewerId) {
        ItemClaim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy yêu cầu xác minh ID: " + claimId));

        LostFoundItem item = claim.getItem();
        User reviewer = authService.getUserById(reviewerId);
        boolean isOwner = item.getUser().getId().equals(reviewerId);
        boolean isAdmin = "ADMIN".equalsIgnoreCase(reviewer.getRole());

        if (!isOwner && !isAdmin) {
            throw new BadRequestException("Bạn không có quyền duyệt yêu cầu này");
        }

        claim.setClaimStatus(request.getStatus());
        claim.setReviewNotes(request.getReviewNotes());
        claim.setReviewedAt(LocalDateTime.now());
        claim = claimRepository.save(claim);

        // If claim is accepted, mark item as RESOLVED
        if (request.getStatus() == ItemClaim.ClaimStatus.ACCEPTED) {
            item.setStatus(LostFoundItem.ItemStatus.RESOLVED);
            itemRepository.save(item);
        }

        return toDto(claim);
    }

    private ClaimRequestDto toDto(ItemClaim claim) {
        return ClaimRequestDto.builder()
                .id(claim.getId())
                .itemId(claim.getItem().getId())
                .itemTitle(claim.getItem().getTitle())
                .claimantId(claim.getClaimant().getId())
                .claimantName(claim.getClaimant().getFullName())
                .claimantEmail(claim.getClaimant().getEmail())
                .claimantPhone(claim.getClaimant().getPhone())
                .proofDescription(claim.getProofDescription())
                .proofImageUrl(claim.getProofImageUrl())
                .claimStatus(claim.getClaimStatus())
                .reviewNotes(claim.getReviewNotes())
                .createdAt(claim.getCreatedAt())
                .reviewedAt(claim.getReviewedAt())
                .build();
    }
}
