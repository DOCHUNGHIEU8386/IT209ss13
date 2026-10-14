package com.campushub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "item_claims")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemClaim {

    public enum ClaimStatus {
        SUBMITTED,  // Mới gửi yêu cầu nhận đồ
        ACCEPTED,   // Người nhặt / Admin đã duyệt và bàn giao
        REJECTED    // Từ chối (thông tin không khớp)
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    private LostFoundItem item;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "claimant_id", nullable = false)
    private User claimant;

    @Column(name = "proof_description", nullable = false, columnDefinition = "TEXT")
    private String proofDescription;

    @Column(name = "proof_image_url", length = 500)
    private String proofImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "claim_status", nullable = false, length = 30)
    @Builder.Default
    private ClaimStatus claimStatus = ClaimStatus.SUBMITTED;

    @Column(name = "review_notes", columnDefinition = "TEXT")
    private String reviewNotes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.claimStatus == null) {
            this.claimStatus = ClaimStatus.SUBMITTED;
        }
    }
}
