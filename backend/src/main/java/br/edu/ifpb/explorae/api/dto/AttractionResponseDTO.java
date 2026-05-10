package br.edu.ifpb.explorae.api.dto;

import br.edu.ifpb.explorae.domain.attraction.Attraction;

import java.util.UUID;

public record AttractionResponseDTO(
        UUID id,
        String name,
        String category,
        String shortDescription,
        Double averageRating,
        String mainImageUrl,
        String distance // Calculada ou placeholder por enquanto
) {
    public static AttractionResponseDTO fromEntity(Attraction attraction) {
        String mainImage = attraction.getImages().isEmpty() ? null : attraction.getImages().get(0);
        return new AttractionResponseDTO(
                attraction.getId(),
                attraction.getName(),
                attraction.getCategory(),
                attraction.getShortDescription(),
                attraction.getAverageRating(),
                mainImage,
                "2.4 km" // Placeholder conforme design showcase
        );
    }
}
