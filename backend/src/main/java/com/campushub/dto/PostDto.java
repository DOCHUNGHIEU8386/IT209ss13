package com.campushub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDto {
    private Long id;
    private String title;
    private String content;
    private Long authorId;
    private String authorName;
    private Long categoryId;
    private String categoryName;
    private Integer likeCount;
    private Integer viewCount;
    private Integer commentCount;
    private LocalDateTime createdAt;
}
