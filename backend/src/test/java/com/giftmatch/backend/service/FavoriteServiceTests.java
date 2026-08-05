package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.FavoriteDto;
import com.giftmatch.backend.entity.Favorite;
import com.giftmatch.backend.entity.Product;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.FavoriteRepository;
import com.giftmatch.backend.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTests {
    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private FavoriteService favoriteService;

    @Test
    void addsApprovedProductForAuthenticatedUser() {
        User user = User.builder().userId(10L).build();
        Product product = Product.builder()
                .productId(20L)
                .name("Qua tang")
                .status("APPROVED")
                .build();

        when(favoriteRepository.findByUser_UserIdAndProduct_ProductId(10L, 20L))
                .thenReturn(Optional.empty());
        when(productRepository.findById(20L)).thenReturn(Optional.of(product));
        when(favoriteRepository.save(any(Favorite.class))).thenAnswer(invocation -> {
            Favorite favorite = invocation.getArgument(0);
            favorite.setFavoriteId(30L);
            favorite.setCreatedAt(LocalDateTime.now());
            return favorite;
        });

        FavoriteDto result = favoriteService.addFavorite(user, 20L);

        assertThat(result.getFavoriteId()).isEqualTo(30L);
        assertThat(result.getProduct().getProductId()).isEqualTo(20L);
    }

    @Test
    void rejectsProductThatIsNotApproved() {
        User user = User.builder().userId(10L).build();
        Product product = Product.builder().productId(20L).status("PENDING").build();

        when(favoriteRepository.findByUser_UserIdAndProduct_ProductId(10L, 20L))
                .thenReturn(Optional.empty());
        when(productRepository.findById(20L)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> favoriteService.addFavorite(user, 20L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("400 BAD_REQUEST");
    }
}
