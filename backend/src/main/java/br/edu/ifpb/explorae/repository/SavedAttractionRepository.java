package br.edu.ifpb.explorae.repository;

import br.edu.ifpb.explorae.domain.attraction.SavedAttraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface SavedAttractionRepository extends JpaRepository<SavedAttraction, UUID> {
    Optional<SavedAttraction> findByUserIdAndAttractionId(UUID userId, UUID attractionId);
    boolean existsByUserIdAndAttractionId(UUID userId, UUID attractionId);
    long countByUserId(UUID userId);
    List<SavedAttraction> findAllByUserId(UUID userId);
}
