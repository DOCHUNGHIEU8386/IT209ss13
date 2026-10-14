package com.campushub.controller;

import com.campushub.dto.*;
import com.campushub.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Tag(name = "Bài viết & Diễn đàn", description = "Các API chia sẻ bài viết, tin tức và bình luận sinh viên")
public class PostController {

    private final PostService postService;

    @GetMapping
    @Operation(summary = "Lấy danh sách bài viết (hỗ trợ lọc chuyên mục và tìm kiếm từ khóa)")
    public ResponseEntity<ApiResponse<List<PostDto>>> getAllPosts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        List<PostDto> posts = postService.getAllPosts(categoryId, search);
        return ResponseEntity.ok(ApiResponse.ok(posts));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết bài viết theo ID")
    public ResponseEntity<ApiResponse<PostDto>> getPostById(@PathVariable Long id) {
        PostDto post = postService.getPostById(id);
        return ResponseEntity.ok(ApiResponse.ok(post));
    }

    @PostMapping
    @Operation(summary = "Đăng bài viết mới")
    public ResponseEntity<ApiResponse<PostDto>> createPost(
            @Valid @RequestBody CreatePostRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "2") Long authorId) {
        PostDto created = postService.createPost(request, authorId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Đăng bài viết thành công!", created));
    }

    @PostMapping("/{id}/like")
    @Operation(summary = "Bày tỏ quan tâm / Thả tim bài viết")
    public ResponseEntity<ApiResponse<PostDto>> likePost(@PathVariable Long id) {
        PostDto updated = postService.likePost(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã thích bài viết", updated));
    }

    @GetMapping("/{id}/comments")
    @Operation(summary = "Lấy danh sách bình luận của bài viết")
    public ResponseEntity<ApiResponse<List<CommentDto>>> getComments(@PathVariable Long id) {
        List<CommentDto> comments = postService.getPostComments(id);
        return ResponseEntity.ok(ApiResponse.ok(comments));
    }

    @PostMapping("/{id}/comments")
    @Operation(summary = "Gửi bình luận vào bài viết")
    public ResponseEntity<ApiResponse<CommentDto>> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CreateCommentRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "2") Long authorId) {
        CommentDto comment = postService.addComment(id, request, authorId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Bình luận thành công!", comment));
    }
}
