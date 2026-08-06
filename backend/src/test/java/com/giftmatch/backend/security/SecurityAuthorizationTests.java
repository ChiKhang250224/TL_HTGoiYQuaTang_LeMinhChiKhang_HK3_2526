package com.giftmatch.backend.security;

import com.giftmatch.backend.controller.AdminUserController;
import com.giftmatch.backend.controller.RecommendationController;
import com.giftmatch.backend.controller.StoreAnalyticsController;
import com.giftmatch.backend.dto.RecommendationResponse;
import com.giftmatch.backend.entity.Role;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.service.AdminUserService;
import com.giftmatch.backend.service.AnalyticsService;
import com.giftmatch.backend.service.RecommendationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {
        AdminUserController.class,
        StoreAnalyticsController.class,
        RecommendationController.class
})
@Import({SecurityConfig.class, JwtFilter.class})
class SecurityAuthorizationTests {
    @Autowired private MockMvc mockMvc;

    @MockitoBean private JwtUtil jwtUtil;
    @MockitoBean private UserDetailsService userDetailsService;
    @MockitoBean private AdminUserService adminUserService;
    @MockitoBean private AnalyticsService analyticsService;
    @MockitoBean private RecommendationService recommendationService;

    @Test
    void onlyAdminCanAccessAdminUserApi() throws Exception {
        when(adminUserService.search(null, null, null)).thenReturn(List.of());

        mockMvc.perform(get("/api/admin/users").with(user(principal(1L, Role.ADMIN))))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/admin/users").with(user(principal(2L, Role.CUSTOMER))))
                .andExpect(status().isForbidden());
    }

    @Test
    void onlyStoreOrAdminCanAccessStoreAnalyticsApi() throws Exception {
        mockMvc.perform(get("/api/store/analytics").with(user(principal(3L, Role.STORE))))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/store/analytics").with(user(principal(2L, Role.CUSTOMER))))
                .andExpect(status().isForbidden());
    }

    @Test
    void onlyCustomerCanRequestRecommendations() throws Exception {
        when(recommendationService.recommend(any(), eq(2L)))
                .thenReturn(RecommendationResponse.builder().products(List.of()).build());
        String request = """
                {
                  "recipientName":"Lan",
                  "relationship":"Friend",
                  "occasion":"Birthday",
                  "ageGroup":"Adult",
                  "gender":"Female",
                  "hobby":"Books",
                  "personality":"Thoughtful",
                  "budget":500,
                  "style":"Practical",
                  "relationshipCloseness":"Close",
                  "topK":5
                }
                """;

        mockMvc.perform(post("/api/recommendations")
                        .with(user(principal(2L, Role.CUSTOMER)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isOk());
        mockMvc.perform(post("/api/recommendations")
                        .with(user(principal(3L, Role.STORE)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isForbidden());
    }

    @Test
    void protectedApiRejectsAnonymousRequest() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isForbidden());
    }

    private UserDetailsImpl principal(Long userId, Role role) {
        return new UserDetailsImpl(User.builder()
                .userId(userId)
                .email(role.name().toLowerCase() + userId + "@giftmatch.test")
                .passwordHash("encoded")
                .fullName(role.name())
                .role(role)
                .isActive(true)
                .build());
    }
}
