package com.campushub.controller;

import com.campushub.dto.*;
import com.campushub.entity.LostFoundItem;
import com.campushub.service.LostFoundService;
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
@Tag(name = "Đồ Thất Lạc (Lost & Found)", description = "Các API quản lý, tra cứu, báo mất và nhặt được đồ trong khuôn viên trường")
public class LostFoundController {

    private final LostFoundService lostFoundService;

    @GetMapping
    @Operation(summary = "Tìm kiếm và lọc tin đăng đồ thất lạc")
    public ResponseEntity<ApiResponse<List<LostFoundItemDto>>> getItems(
            @RequestParam(required = false) LostFoundItem.ItemType type,
            @RequestParam(required = false) LostFoundItem.ItemCategory category,
            @RequestParam(required = false) LostFoundItem.ItemStatus status,
            @RequestParam(required = false) String keyword) {
        List<LostFoundItemDto> items = lostFoundService.searchItems(type, category, status, keyword);
        return ResponseEntity.ok(ApiResponse.ok(items));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết tin đăng đồ thất lạc")
    public ResponseEntity<ApiResponse<LostFoundItemDto>> getItemById(@PathVariable Long id) {
        LostFoundItemDto item = lostFoundService.getItemById(id);
        return ResponseEntity.ok(ApiResponse.ok(item));
    }

    @GetMapping("/my-items")
    @Operation(summary = "Lấy danh sách các tin đăng do tài khoản hiện tại tạo")
    public ResponseEntity<ApiResponse<List<LostFoundItemDto>>> getMyItems(
            @RequestHeader(value = "X-User-Id", defaultValue = "2") Long userId) {
        List<LostFoundItemDto> items = lostFoundService.getItemsByUser(userId);
        return ResponseEntity.ok(ApiResponse.ok(items));
    }

    @PostMapping
    @Operation(summary = "Đăng tin báo mất đồ hoặc nhặt được đồ mới")
    public ResponseEntity<ApiResponse<LostFoundItemDto>> createItem(
            @Valid @RequestBody CreateLostFoundRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "2") Long userId) {
        LostFoundItemDto item = lostFoundService.createItem(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Đăng tin đồ thất lạc thành công!", item));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái tin đăng (OPEN, CLAIMED_PENDING, RESOLVED, CLOSED)")
    public ResponseEntity<ApiResponse<LostFoundItemDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam LostFoundItem.ItemStatus status,
            @RequestHeader(value = "X-User-Id", defaultValue = "2") Long userId) {
        LostFoundItemDto updated = lostFoundService.updateStatus(id, status, userId);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái thành công!", updated));
    }

    @GetMapping("/{id}/matches")
    @Operation(summary = "Thuật toán gợi ý thông minh: Tìm các tin đối lập khớp danh mục và địa điểm")
    public ResponseEntity<ApiResponse<List<MatchSuggestionDto>>> getSmartMatches(@PathVariable Long id) {
        List<MatchSuggestionDto> matches = lostFoundService.findSmartMatches(id);
        return ResponseEntity.ok(ApiResponse.ok("Tìm thấy " + matches.size() + " gợi ý tiềm năng", matches));
    }
}
