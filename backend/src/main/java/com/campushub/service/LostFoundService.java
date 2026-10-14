package com.campushub.service;

import com.campushub.dto.CreateLostFoundRequest;
import com.campushub.dto.LostFoundItemDto;
import com.campushub.dto.MatchSuggestionDto;
import com.campushub.entity.LostFoundItem;
import com.campushub.entity.User;
import com.campushub.exception.BadRequestException;
import com.campushub.exception.ResourceNotFoundException;
import com.campushub.repository.ItemClaimRepository;
import com.campushub.repository.LostFoundItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LostFoundService {

    private final LostFoundItemRepository itemRepository;
    private final ItemClaimRepository claimRepository;
    private final AuthService authService;

    public List<LostFoundItemDto> searchItems(
            LostFoundItem.ItemType type,
            LostFoundItem.ItemCategory category,
            LostFoundItem.ItemStatus status,
            String keyword
    ) {
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        List<LostFoundItem> items = itemRepository.searchItems(type, category, status, cleanKeyword);
        return items.stream().map(this::toDto).collect(Collectors.toList());
    }

    public LostFoundItemDto getItemById(Long id) {
        LostFoundItem item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tin đăng vật phẩm ID: " + id));
        return toDto(item);
    }

    public List<LostFoundItemDto> getItemsByUser(Long userId) {
        return itemRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public LostFoundItemDto createItem(CreateLostFoundRequest request, Long userId) {
        User user = authService.getUserById(userId);

        LostFoundItem item = LostFoundItem.builder()
                .title(request.getTitle())
                .type(request.getType())
                .category(request.getCategory())
                .location(request.getLocation())
                .eventDate(request.getEventDate())
                .description(request.getDescription())
                .secretQuestion(request.getSecretQuestion())
                .imageUrl(request.getImageUrl())
                .status(LostFoundItem.ItemStatus.OPEN)
                .contactName(request.getContactName() != null ? request.getContactName() : user.getFullName())
                .contactPhone(request.getContactPhone() != null ? request.getContactPhone() : user.getPhone())
                .contactLocation(request.getContactLocation())
                .user(user)
                .build();

        return toDto(itemRepository.save(item));
    }

    @Transactional
    public LostFoundItemDto updateStatus(Long id, LostFoundItem.ItemStatus newStatus, Long userId) {
        LostFoundItem item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tin đăng ID: " + id));

        User user = authService.getUserById(userId);
        boolean isOwner = item.getUser().getId().equals(userId);
        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());

        if (!isOwner && !isAdmin) {
            throw new BadRequestException("Bạn không có quyền thay đổi trạng thái của tin đăng này");
        }

        item.setStatus(newStatus);
        return toDto(itemRepository.save(item));
    }

    /**
     * Smart Matching Algorithm:
     * Tự động phát hiện các bài viết đối lập (LOST <-> FOUND) có khả năng là cùng một vật phẩm
     */
    public List<MatchSuggestionDto> findSmartMatches(Long itemId) {
        LostFoundItem target = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tin đăng ID: " + itemId));

        List<LostFoundItem> potentialMatches = itemRepository.findPotentialMatches(
                target.getId(),
                target.getType(),
                target.getCategory()
        );

        List<MatchSuggestionDto> suggestions = new ArrayList<>();
        Set<String> targetLocationTokens = tokenize(target.getLocation() + " " + target.getTitle());

        for (LostFoundItem candidate : potentialMatches) {
            int score = 40; // Base score for same category
            List<String> reasons = new ArrayList<>();
            reasons.add("Cùng danh mục " + getCategoryDisplayName(target.getCategory()));

            // Location similarity check
            Set<String> candidateTokens = tokenize(candidate.getLocation() + " " + candidate.getTitle());
            Set<String> intersection = new HashSet<>(targetLocationTokens);
            intersection.retainAll(candidateTokens);
            if (!intersection.isEmpty()) {
                score += 35;
                reasons.add("Khớp từ khóa địa điểm: " + String.join(", ", intersection));
            }

            // Date proximity check (within 3 days)
            if (target.getEventDate() != null && candidate.getEventDate() != null) {
                long daysDiff = Math.abs(ChronoUnit.DAYS.between(target.getEventDate(), candidate.getEventDate()));
                if (daysDiff <= 3) {
                    score += 25;
                    reasons.add("Thời gian xảy ra rất gần nhau (chênh lệch " + daysDiff + " ngày)");
                } else if (daysDiff <= 7) {
                    score += 15;
                    reasons.add("Thời gian trong cùng tuần (chênh lệch " + daysDiff + " ngày)");
                }
            }

            // Cap score at 99%
            score = Math.min(score, 99);

            suggestions.add(MatchSuggestionDto.builder()
                    .matchedItem(toDto(candidate))
                    .matchScore(score)
                    .matchReason(String.join("; ", reasons))
                    .build());
        }

        // Sort by match score descending
        suggestions.sort((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()));
        return suggestions;
    }

    private Set<String> tokenize(String text) {
        if (text == null) return Collections.emptySet();
        return Arrays.stream(text.toLowerCase().split("[\\s,;.-]+"))
                .filter(w -> w.length() > 2)
                .collect(Collectors.toSet());
    }

    public LostFoundItemDto toDto(LostFoundItem item) {
        int claimCount = claimRepository.findByItemIdOrderByCreatedAtDesc(item.getId()).size();
        return LostFoundItemDto.builder()
                .id(item.getId())
                .title(item.getTitle())
                .type(item.getType())
                .category(item.getCategory())
                .categoryDisplayName(getCategoryDisplayName(item.getCategory()))
                .location(item.getLocation())
                .eventDate(item.getEventDate())
                .description(item.getDescription())
                .secretQuestion(item.getSecretQuestion())
                .imageUrl(item.getImageUrl())
                .status(item.getStatus())
                .contactName(item.getContactName())
                .contactPhone(item.getContactPhone())
                .contactLocation(item.getContactLocation())
                .userId(item.getUser().getId())
                .userName(item.getUser().getFullName())
                .claimCount(claimCount)
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }

    public String getCategoryDisplayName(LostFoundItem.ItemCategory category) {
        if (category == null) return "Khác";
        switch (category) {
            case STUDENT_CARD: return "Thẻ sinh viên / Thẻ xe";
            case ELECTRONICS: return "Điện tử & Công nghệ";
            case WALLET_PURSE: return "Ví tiền & Bóp";
            case KEYS: return "Chìa khóa & Thẻ từ";
            case DOCUMENTS: return "Giấy tờ & Hồ sơ";
            case BACKPACK_CLOTHES: return "Balo & Trang phục";
            default: return "Đồ dùng khác";
        }
    }
}
