package com.campushub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreatePostRequest {
    @NotBlank(message = "Tiêu đề bài viết không được để trống")
    private String title;

    @NotBlank(message = "Nội dung bài viết không được để trống")
    private String content;

    @NotNull(message = "Chuyên mục không được để trống")
    private Long categoryId;
}
