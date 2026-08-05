package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.ProductRequest;
import com.giftmatch.backend.dto.ProductBusinessStatusRequest;
import com.giftmatch.backend.entity.Product;
import com.giftmatch.backend.entity.Role;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.CategoryRepository;
import com.giftmatch.backend.repository.GiftLabelRepository;
import com.giftmatch.backend.repository.ProductRepository;
import com.giftmatch.backend.security.UserDetailsImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class ProductControllerAccessTests {
    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private GiftLabelRepository giftLabelRepository;

    @InjectMocks
    private ProductController productController;

    @Test
    void customerCannotCreateProduct() {
        User customer = User.builder().userId(1L).role(Role.CUSTOMER).build();

        assertThatThrownBy(() -> productController.createProduct(
                new ProductRequest(),
                new UserDetailsImpl(customer)
        )).isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("403 FORBIDDEN");
    }

    @Test
    void storeCannotUpdateAnotherStoresProduct() {
        User currentStore = User.builder().userId(1L).role(Role.STORE).build();
        User owner = User.builder().userId(2L).role(Role.STORE).build();
        Product product = Product.builder().productId(10L).store(owner).build();
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> productController.updateProduct(
                10L,
                new ProductRequest(),
                new UserDetailsImpl(currentStore)
        )).isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("403 FORBIDDEN");
    }

    @Test
    void ownerCanMarkProductOutOfStockWithoutChangingApproval() {
        User owner = User.builder().userId(2L).role(Role.STORE).build();
        Product product = Product.builder().productId(10L).store(owner).status("APPROVED").businessStatus("IN_STOCK").build();
        ProductBusinessStatusRequest request = new ProductBusinessStatusRequest();
        request.setBusinessStatus("OUT_OF_STOCK");
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        productController.updateBusinessStatus(10L, request, new UserDetailsImpl(owner));

        org.assertj.core.api.Assertions.assertThat(product.getBusinessStatus()).isEqualTo("OUT_OF_STOCK");
        org.assertj.core.api.Assertions.assertThat(product.getStatus()).isEqualTo("APPROVED");
    }
}
