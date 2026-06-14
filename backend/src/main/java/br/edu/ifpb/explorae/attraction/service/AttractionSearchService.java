package br.edu.ifpb.explorae.attraction.service;

import br.edu.ifpb.explorae.attraction.domain.Attraction;
import br.edu.ifpb.explorae.attraction.dto.AttractionResponseDTO;
import br.edu.ifpb.explorae.attraction.repository.AttractionRepository;
import br.edu.ifpb.explorae.common.utils.GeoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttractionSearchService {

    private final AttractionRepository attractionRepository;

    @Transactional(readOnly = true)
    public Page<AttractionResponseDTO> findAll(
            String category, Double minRating, Double minPrice, Double maxPrice,
            Boolean openNow, Double latitude, Double longitude, Double maxDistance,
            Pageable pageable) {

        List<Attraction> allAttractions;
        if (category != null && !category.isEmpty()) {
            allAttractions = attractionRepository.findByCategory(category, Pageable.unpaged()).getContent();
        } else {
            allAttractions = attractionRepository.findAll();
        }

        List<AttractionResponseDTO> filtered = allAttractions.stream()
                .filter(attr -> minRating == null || (attr.getAverageRating() != null && attr.getAverageRating() >= minRating))
                .filter(attr -> {
                    if (minPrice == null && maxPrice == null) return true;
                    if (attr.getPriceRange() == null) return false;

                    int priceLevel = attr.getPriceRange(); // 1 to 4
                    Double estimatedMin = priceLevel == 1 ? 0.0 : (priceLevel == 2 ? 50.0 : 150.0);
                    Double estimatedMax = priceLevel == 1 ? 50.0 : (priceLevel == 2 ? 150.0 : 500.0);

                    if (minPrice != null && estimatedMax < minPrice) return false;
                    if (maxPrice != null && estimatedMin > maxPrice) return false;

                    return true;
                })
                .filter(attr -> {
                    if (openNow == null || !openNow) return true;
                    // Mock implementation for openNow as entity might not have schedules yet
                    return true;
                })
                .filter(attr -> {
                    if (latitude != null && longitude != null && maxDistance != null) {
                        double dist = GeoUtils.calculateHaversineDistance(latitude, longitude, attr.getLatitude(), attr.getLongitude());
                        return dist <= maxDistance;
                    }
                    return true;
                })
                .map(attr -> {
                    String distanceStr = "Localizando...";
                    if (latitude != null && longitude != null) {
                        double dist = GeoUtils.calculateHaversineDistance(latitude, longitude, attr.getLatitude(), attr.getLongitude());
                        distanceStr = dist > 1.0 ? String.format("%.1f km", dist).replace(".", ",") : Math.round(dist * 1000) + " m";
                    }
                    return AttractionResponseDTO.fromEntity(attr, distanceStr);
                })
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());

        List<AttractionResponseDTO> pageContent = start <= end ? filtered.subList(start, end) : List.of();
        return new PageImpl<>(pageContent, pageable, filtered.size());
    }
}
