package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.ProductReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ProductReportRepository extends JpaRepository<ProductReport, Long> {
    List<ProductReport> findByReporter_UserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByReporter_UserIdAndProduct_ProductIdAndCreatedAtAfter(
            Long userId,
            Long productId,
            LocalDateTime after
    );

    @Query("""
            SELECT report FROM ProductReport report
            WHERE (:status IS NULL OR report.status = :status)
              AND (:reason IS NULL OR report.reason = :reason)
            ORDER BY report.createdAt DESC
            """)
    List<ProductReport> findForAdmin(
            @Param("status") String status,
            @Param("reason") String reason
    );
}
