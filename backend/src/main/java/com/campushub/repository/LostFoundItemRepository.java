package com.campushub.repository;

import com.campushub.entity.LostFoundItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostFoundItemRepository extends JpaRepository<LostFoundItem, Long> {

    List<LostFoundItem> findAllByOrderByCreatedAtDesc();

    List<LostFoundItem> findByTypeOrderByCreatedAtDesc(LostFoundItem.ItemType type);

    List<LostFoundItem> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT i FROM LostFoundItem i WHERE " +
           "(:type IS NULL OR i.type = :type) AND " +
           "(:category IS NULL OR i.category = :category) AND " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:keyword IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(i.location) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY i.createdAt DESC")
    List<LostFoundItem> searchItems(
            @Param("type") LostFoundItem.ItemType type,
            @Param("category") LostFoundItem.ItemCategory category,
            @Param("status") LostFoundItem.ItemStatus status,
            @Param("keyword") String keyword
    );

    // Smart Match: Tìm các món đồ đối lập (LOST tìm FOUND, FOUND tìm LOST) cùng danh mục, trạng thái đang OPEN
    @Query("SELECT i FROM LostFoundItem i WHERE " +
           "i.id <> :itemId AND " +
           "i.type <> :type AND " +
           "i.category = :category AND " +
           "i.status = 'OPEN' " +
           "ORDER BY i.createdAt DESC")
    List<LostFoundItem> findPotentialMatches(
            @Param("itemId") Long itemId,
            @Param("type") LostFoundItem.ItemType type,
            @Param("category") LostFoundItem.ItemCategory category
    );
}
