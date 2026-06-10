package br.edu.ifpb.explorae.gamification.repository;

import br.edu.ifpb.explorae.gamification.domain.Badge;
import br.edu.ifpb.explorae.gamification.domain.UserBadge;
import br.edu.ifpb.explorae.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, UUID> {
    List<UserBadge> findByUser(User user);
    boolean existsByUserAndBadge(User user, Badge badge);
}
