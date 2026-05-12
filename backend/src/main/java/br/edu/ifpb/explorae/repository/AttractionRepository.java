package br.edu.ifpb.explorae.repository;

import br.edu.ifpb.explorae.domain.attraction.Attraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

@Repository
public interface AttractionRepository extends JpaRepository<Attraction, UUID> {
    Page<Attraction> findByCategory(String category, Pageable pageable);
}
