package br.edu.ifpb.explorae.user.repository;

import br.edu.ifpb.explorae.user.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    Optional<Category> findBySlug(String slug);
    List<Category> findAllBySlugIn(List<String> slugs);
}
