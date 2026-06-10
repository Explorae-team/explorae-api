package br.edu.ifpb.explorae.attraction.repository;

import br.edu.ifpb.explorae.attraction.domain.UserInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserInteractionRepository extends JpaRepository<UserInteraction, UUID> {
    List<UserInteraction> findTop20ByUserIdAndInteractionTypeOrderByCreatedAtDesc(UUID userId, String interactionType);

    @Query("SELECT COUNT(DISTINCT ui.attraction.id) FROM UserInteraction ui WHERE ui.user.id = :userId AND ui.interactionType = :interactionType")
    long countDistinctAttractionsByUserIdAndInteractionType(
            @Param("userId") UUID userId,
            @Param("interactionType") String interactionType
    );
}
