package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.AuthRequest;
import com.giftmatch.backend.dto.AuthResponse;
import com.giftmatch.backend.dto.RegisterRequest;
import com.giftmatch.backend.entity.Role;
import com.giftmatch.backend.entity.StoreProfile;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.StoreProfileRepository;
import com.giftmatch.backend.repository.UserRepository;
import com.giftmatch.backend.security.JwtUtil;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.dto.SocialLoginRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.Locale;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final StoreProfileRepository storeProfileRepository;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);
        if(userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã được sử dụng.");
        }

        Role userRole = Role.CUSTOMER; // Default
        if(request.getRole() != null && request.getRole().equalsIgnoreCase("STORE")) {
            userRole = Role.STORE;
        }

        var user = User.builder()
                .fullName(request.getFullName().trim())
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber().trim())
                .role(userRole)
                .isActive(true)
                .build();
        
        userRepository.save(user);
        if (userRole == Role.STORE) {
            storeProfileRepository.save(StoreProfile.builder()
                    .owner(user)
                    .storeName(user.getFullName())
                    .phone(user.getPhoneNumber())
                    .status("PENDING")
                    .build());
        }

        var userDetails = new UserDetailsImpl(user);
        var jwtToken = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .userId(user.getUserId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        normalizedEmail,
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow();
                
        var userDetails = new UserDetailsImpl(user);
        var jwtToken = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .userId(user.getUserId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatar(user.getAvatarUrl())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse socialLogin(SocialLoginRequest request) {
        RestTemplate restTemplate = new RestTemplate();
        String email = null;
        String name = null;
        String socialId = null;
        String avatarUrl = null;

        try {
            if ("GOOGLE".equalsIgnoreCase(request.getProvider())) {
                String url = "https://www.googleapis.com/oauth2/v3/userinfo";
                org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
                headers.setBearerAuth(request.getToken());
                org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
                ResponseEntity<Map> response = restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, entity, Map.class);
                Map<String, Object> body = response.getBody();
                if (body != null) {
                    email = (String) body.get("email");
                    name = (String) body.get("name");
                    socialId = (String) body.get("sub");
                    avatarUrl = (String) body.get("picture");
                }
            } else if ("FACEBOOK".equalsIgnoreCase(request.getProvider())) {
                String url = "https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=" + request.getToken();
                ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
                Map<String, Object> body = response.getBody();
                if (body != null) {
                    email = (String) body.get("email");
                    name = (String) body.get("name");
                    socialId = (String) body.get("id");
                    Map<String, Object> pictureObj = (Map<String, Object>) body.get("picture");
                    if (pictureObj != null && pictureObj.get("data") != null) {
                        Map<String, Object> data = (Map<String, Object>) pictureObj.get("data");
                        avatarUrl = (String) data.get("url");
                    }
                }
            } else {
                throw new RuntimeException("Unsupported social provider");
            }
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Invalid social token: " + e.getMessage());
        }

        if (email == null) {
            throw new RuntimeException("Email not found from social provider");
        }
        email = email.trim().toLowerCase(Locale.ROOT);

        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;

        if (userOpt.isPresent()) {
            user = userOpt.get();
            if (!Boolean.TRUE.equals(user.getIsActive())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tài khoản đã bị khóa.");
            }
            if ("GOOGLE".equalsIgnoreCase(request.getProvider()) && user.getGoogleId() == null) {
                user.setGoogleId(socialId);
            } else if ("FACEBOOK".equalsIgnoreCase(request.getProvider()) && user.getFacebookId() == null) {
                user.setFacebookId(socialId);
            }
            // Cập nhật avatar nếu chưa có hoặc cập nhật lại
            if (avatarUrl != null) {
                user.setAvatarUrl(avatarUrl);
            }
            userRepository.save(user);
        } else {
            user = User.builder()
                    .fullName(name != null ? name : "Social User")
                    .email(email)
                    .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(Role.CUSTOMER)
                    .avatarUrl(avatarUrl)
                    .isActive(true)
                    .build();
            
            if ("GOOGLE".equalsIgnoreCase(request.getProvider())) {
                user.setGoogleId(socialId);
            } else {
                user.setFacebookId(socialId);
            }
            userRepository.save(user);
        }

        var userDetails = new UserDetailsImpl(user);
        var jwtToken = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .userId(user.getUserId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatar(user.getAvatarUrl())
                .role(user.getRole().name())
                .build();
    }
}
