package com.campushub.service;

import com.campushub.dto.AuthResponse;
import com.campushub.dto.LoginRequest;
import com.campushub.dto.RegisterRequest;
import com.campushub.entity.User;
import com.campushub.exception.BadRequestException;
import com.campushub.exception.ResourceNotFoundException;
import com.campushub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Tên đăng nhập đã tồn tại trong hệ thống");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã được sử dụng bởi tài khoản khác");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(request.getPassword()) // Plain/hashing in production
                .fullName(request.getFullName())
                .email(request.getEmail())
                .studentId(request.getStudentId())
                .phone(request.getPhone())
                .role("STUDENT")
                .build();

        user = userRepository.save(user);

        return toAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản không tồn tại"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new BadRequestException("Mật khẩu không chính xác");
        }

        return toAuthResponse(user);
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));
    }

    private AuthResponse toAuthResponse(User user) {
        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .studentId(user.getStudentId())
                .phone(user.getPhone())
                .role(user.getRole())
                .token("CH-SESSION-" + UUID.randomUUID())
                .build();
    }
}
