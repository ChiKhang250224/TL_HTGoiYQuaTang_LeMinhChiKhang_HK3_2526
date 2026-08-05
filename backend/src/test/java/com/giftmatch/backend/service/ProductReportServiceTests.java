package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.ProductReportDecisionRequest;
import com.giftmatch.backend.dto.ProductReportRequest;
import com.giftmatch.backend.entity.Product;
import com.giftmatch.backend.entity.ProductReport;
import com.giftmatch.backend.entity.Role;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.ProductReportRepository;
import com.giftmatch.backend.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductReportServiceTests {
    @Mock ProductReportRepository reportRepository;
    @Mock ProductRepository productRepository;
    @InjectMocks ProductReportService service;

    @Test
    void rejectsDuplicateReportWithinTwentyFourHours() {
        User reporter = customer(1L, "customer@gift.vn", "Customer");
        Product product = Product.builder().productId(10L).status("APPROVED").build();
        ProductReportRequest request = new ProductReportRequest();
        request.setReason("WRONG_PRICE");
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(reportRepository.existsByReporter_UserIdAndProduct_ProductIdAndCreatedAtAfter(
                any(), any(), any())).thenReturn(true);

        assertThatThrownBy(() -> service.create(reporter, 10L, request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("409 CONFLICT");
    }

    @Test
    void adminCanResolveReportAndHideProduct() {
        User store = customer(2L, "store@gift.vn", "Gift Store");
        User reporter = customer(1L, "customer@gift.vn", "Customer");
        User admin = customer(3L, "admin@gift.vn", "Admin");
        Product product = Product.builder()
                .productId(10L).name("Gift").store(store)
                .status("APPROVED").businessStatus("IN_STOCK").build();
        ProductReport report = ProductReport.builder()
                .reportId(20L).product(product).reporter(reporter)
                .reason("WRONG_PRICE").status("PENDING").build();
        ProductReportDecisionRequest request = new ProductReportDecisionRequest();
        request.setStatus("RESOLVED");
        request.setResolutionNote("Đã kiểm tra và tạm ẩn sản phẩm.");
        request.setHideProduct(true);
        when(reportRepository.findById(20L)).thenReturn(Optional.of(report));
        when(reportRepository.save(report)).thenReturn(report);

        var result = service.decide(20L, request, admin);

        assertThat(result.getStatus()).isEqualTo("RESOLVED");
        assertThat(product.getBusinessStatus()).isEqualTo("HIDDEN");
        assertThat(report.getHandledBy()).isEqualTo(admin);
        verify(productRepository).save(product);
    }

    private User customer(Long id, String email, String name) {
        return User.builder().userId(id).email(email).fullName(name).role(Role.CUSTOMER).build();
    }
}
