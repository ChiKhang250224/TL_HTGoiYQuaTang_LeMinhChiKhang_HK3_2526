package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.AuthResponse;
import com.giftmatch.backend.dto.RegisterRequest;
import com.giftmatch.backend.entity.StoreProfile;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.StoreProfileRepository;
import com.giftmatch.backend.repository.UserRepository;
import com.giftmatch.backend.security.JwtUtil;
import com.giftmatch.backend.security.UserDetailsImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTests {
    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private StoreProfileRepository storeProfileRepository;
    @InjectMocks private AuthService authService;

    @Test
    void registeringStoreCreatesPendingStoreProfileAndNormalizesEmail() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("  Gift Store  ")
                .email("  STORE@GMAIL.COM ")
                .password("password123")
                .phoneNumber("0901234567")
                .role("STORE")
                .build();
        when(passwordEncoder.encode("password123")).thenReturn("encoded");
        when(jwtUtil.generateToken(any(UserDetailsImpl.class))).thenReturn("jwt");

        AuthResponse response = authService.register(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getEmail()).isEqualTo("store@gmail.com");
        assertThat(userCaptor.getValue().getFullName()).isEqualTo("Gift Store");

        ArgumentCaptor<StoreProfile> profileCaptor = ArgumentCaptor.forClass(StoreProfile.class);
        verify(storeProfileRepository).save(profileCaptor.capture());
        assertThat(profileCaptor.getValue().getStatus()).isEqualTo("PENDING");
        assertThat(response.getToken()).isEqualTo("jwt");
    }

    @Test
    void rejectsDuplicateNormalizedEmail() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Customer")
                .email(" EXISTING@GMAIL.COM ")
                .password("password123")
                .phoneNumber("0901234567")
                .role("CUSTOMER")
                .build();
        when(userRepository.existsByEmail("existing@gmail.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("409 CONFLICT");
    }
}
