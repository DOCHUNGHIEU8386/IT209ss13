package com.campushub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lost_found_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LostFoundItem {

    public enum ItemType {
        LOST,  // Đang tìm đồ thất lạc
        FOUND  // Nhặt được đồ tìm chủ nhân
    }

    public enum ItemCategory {
        STUDENT_CARD,      // Thẻ sinh viên, vé xe
        ELECTRONICS,       // Điện thoại, laptop, tai nghe, sạc
        WALLET_PURSE,      // Ví tiền, bóp tiền
        KEYS,              // Chìa khóa, thẻ từ phòng
        DOCUMENTS,         // Giấy tờ, chứng minh, bằng lái, hồ sơ
        BACKPACK_CLOTHES,  // Balo, túi xách, áo khoác, mũ
        OTHER              // Khác
    }

    public enum ItemStatus {
        OPEN,             // Đang mở tìm kiếm / Chưa có người nhận
        CLAIMED_PENDING,  // Đang có người yêu cầu xác minh
        RESOLVED,         // Đã trao trả thành công cho chủ nhân
        CLOSED            // Đã đóng (hủy yêu cầu)
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ItemType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ItemCategory category;

    @Column(nullable = false, length = 150)
    private String location;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "secret_question", length = 255)
    private String secretQuestion;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ItemStatus status = ItemStatus.OPEN;

    @Column(name = "contact_name", length = 100)
    private String contactName;

    @Column(name = "contact_phone", length = 30)
    private String contactPhone;

    @Column(name = "contact_location", length = 200)
    private String contactLocation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = ItemStatus.OPEN;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
