package com.campushub.repository;

import com.campushub.entity.ItemClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemClaimRepository extends JpaRepository<ItemClaim, Long> {
    List<ItemClaim> findByItemIdOrderByCreatedAtDesc(Long itemId);
    List<ItemClaim> findByClaimantIdOrderByCreatedAtDesc(Long claimantId);
    boolean existsByItemIdAndClaimantId(Long itemId, Long claimantId);
}
