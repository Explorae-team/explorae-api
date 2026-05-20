package br.edu.ifpb.explorae.repository;

import br.edu.ifpb.explorae.domain.attraction.UserInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserInteractionRepository extends JpaRepository<UserInteraction, UUID> {
    List<UserInteraction> findTop20ByUserIdAndInteractionTypeOrderByCreatedAtDesc(UUID userId, String interactionType);
}
