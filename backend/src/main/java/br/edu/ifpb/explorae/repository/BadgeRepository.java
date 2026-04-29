package br.edu.ifpb.explorae.repository;

import br.edu.ifpb.explorae.domain.gamification.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, UUID> {
}
