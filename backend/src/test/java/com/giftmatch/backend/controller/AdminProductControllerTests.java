package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.ProductRejectionRequest;
import com.giftmatch.backend.entity.Product;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.GiftLabelRepository;
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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminProductControllerTests {
    @Mock
    private ProductRepository productRepository;

    @Mock
    private GiftLabelRepository giftLabelRepository;

    @InjectMocks
    private AdminProductController controller;

    @Test
    void cannotApproveProductWithoutAiLabel() {
        Product product = Product.builder().productId(10L).status("PENDING").build();
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> controller.approveProduct(10L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("400 BAD_REQUEST");
    }

    @Test
    void rejectionStoresReasonAndStatus() {
        Product product = Product.builder()
                .productId(10L)
                .store(User.builder().fullName("Store").build())
                .status("PENDING")
                .build();
        ProductRejectionRequest request = new ProductRejectionRequest();
        request.setReason("  Thieu thong tin  ");
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        controller.rejectProduct(10L, request);

        assertThat(product.getStatus()).isEqualTo("REJECTED");
        assertThat(product.getRejectionReason()).isEqualTo("Thieu thong tin");
    }
}
