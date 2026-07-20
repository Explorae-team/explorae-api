package br.edu.ifpb.explorae.attraction.repository;

import br.edu.ifpb.explorae.attraction.dto.AttractionFiltersDTO;
import br.edu.ifpb.explorae.attraction.domain.Attraction;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class AttractionSpecification {

    public static Specification<Attraction> withFilters(AttractionFiltersDTO filters) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filters == null) {
                return criteriaBuilder.conjunction();
            }

            if (filters.getName() != null && !filters.getName().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%" + filters.getName().toLowerCase() + "%"
                ));
            }

            if (filters.getCategory() != null && !filters.getCategory().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("category"), filters.getCategory()));
            }

            if (filters.getMinPrice() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("priceRange"), filters.getMinPrice()));
            }

            if (filters.getMaxPrice() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("priceRange"), filters.getMaxPrice()));
            }

            if (filters.getMinRating() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("averageRating"), filters.getMinRating()));
            }

            if (filters.getIsPartner() != null) {
                predicates.add(criteriaBuilder.equal(root.get("isPartner"), filters.getIsPartner()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
