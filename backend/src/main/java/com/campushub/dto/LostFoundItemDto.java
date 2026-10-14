package com.campushub.dto;

import com.campushub.entity.LostFoundItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LostFoundItemDto {
    private Long id;
    private String title;
    private LostFoundItem.ItemType type;
    private LostFoundItem.ItemCategory category;
    private String categoryDisplayName;
    private String location;
    private LocalDate eventDate;
    private String description;
    private String secretQuestion;
    private String imageUrl;
    private LostFoundItem.ItemStatus status;
    private String contactName;
    private String contactPhone;
    private String contactLocation;
    private Long userId;
    private String userName;
    private Integer claimCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
