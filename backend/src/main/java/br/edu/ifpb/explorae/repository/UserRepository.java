package br.edu.ifpb.explorae.repository;

import br.edu.ifpb.explorae.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u " +
            "LEFT JOIN FETCH u.userBadges " +
            "LEFT JOIN FETCH u.travelPreference " +
            "WHERE u.id = :id")

    Optional<User> findByIdWithDetails(@Param("id") UUID id);
}
