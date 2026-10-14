package com.campushub.controller;

import com.campushub.dto.ApiResponse;
import com.campushub.dto.AuthResponse;
import com.campushub.dto.LoginRequest;
import com.campushub.dto.RegisterRequest;
import com.campushub.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Xác thực & Người dùng", description = "Đăng ký, Đăng nhập và Lấy thông tin tài khoản")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản sinh viên mới")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Đăng ký tài khoản thành công!", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập hệ thống")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công!", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin người dùng hiện tại")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(
            @RequestHeader(value = "X-User-Id", defaultValue = "2") Long userId) {
        var user = authService.getUserById(userId);
        AuthResponse response = AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .studentId(user.getStudentId())
                .phone(user.getPhone())
                .role(user.getRole())
                .token("SESSION-ACTIVE")
                .build();
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
