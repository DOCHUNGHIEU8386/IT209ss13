package com.campushub.dto;

import com.campushub.entity.LostFoundItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateLostFoundRequest {

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    @NotNull(message = "Loại tin đăng (LOST hoặc FOUND) không được để trống")
    private LostFoundItem.ItemType type;

    @NotNull(message = "Danh mục vật phẩm không được để trống")
    private LostFoundItem.ItemCategory category;

    @NotBlank(message = "Địa điểm không được để trống")
    private String location;

    @NotNull(message = "Ngày xảy ra sự việc không được để trống")
    private LocalDate eventDate;

    @NotBlank(message = "Mô tả chi tiết không được để trống")
    private String description;

    private String secretQuestion;

    private String imageUrl;

    private String contactName;

    private String contactPhone;

    private String contactLocation;
}
