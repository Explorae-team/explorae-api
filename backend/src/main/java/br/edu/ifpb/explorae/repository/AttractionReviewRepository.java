package br.edu.ifpb.explorae.repository;

import br.edu.ifpb.explorae.domain.attraction.AttractionReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AttractionReviewRepository extends JpaRepository<AttractionReview, UUID> {
    List<AttractionReview> findByAttractionIdOrderByCreatedAtDesc(UUID attractionId);
}
