package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import com.giftmatch.backend.entity.Role;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(Role role);
    long countByIsActiveTrue();
    List<User> findByRoleAndIsActiveTrue(Role role);
}
