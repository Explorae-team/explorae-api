package br.edu.ifpb.explorae.repository;

import br.edu.ifpb.explorae.domain.gamification.Badge;
import br.edu.ifpb.explorae.domain.gamification.UserBadge;
import br.edu.ifpb.explorae.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, UUID> {
    List<UserBadge> findByUser(User user);
    boolean existsByUserAndBadge(User user, Badge badge);
}
