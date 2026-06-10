package br.edu.ifpb.explorae.gamification.repository;

import br.edu.ifpb.explorae.gamification.domain.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, UUID> {
    Optional<Badge> findByName(String name);
}
