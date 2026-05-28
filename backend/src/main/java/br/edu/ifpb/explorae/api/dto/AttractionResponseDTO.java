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
        String distance,
        Integer priceRange,
        Boolean isPartner,
        CoordinateDTO coordinate // NOVO CAMPO: Objeto aninhado para o mapa
) {
    // Record interno para gerar o formato JSON: "coordinate": { "latitude": X, "longitude": Y }
    public record CoordinateDTO(Double latitude, Double longitude) {}

    public static AttractionResponseDTO fromEntity(Attraction attraction) {
        return fromEntity(attraction, null);
    }

    public static AttractionResponseDTO fromEntity(Attraction attraction, String distance) {
        String mainImage = attraction.getImageUrls().isEmpty() ? null : attraction.getImageUrls().get(0);
        
        return new AttractionResponseDTO(
                attraction.getId(),
                attraction.getName(),
                attraction.getCategory(),
                attraction.getShortDescription(),
                attraction.getAverageRating(),
                mainImage,
                distance != null ? distance : "Localizando...",
                attraction.getPriceRange(),
                attraction.getIsPartner(),
                new CoordinateDTO(attraction.getLatitude(), attraction.getLongitude()) // Preenchendo as coordenadas
        );
    }
}
