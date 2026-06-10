package br.edu.ifpb.explorae.attraction.dto;

import java.util.List;
import java.util.UUID;

public record AttractionDetailsResponseDTO(
    UUID id,
    String name,
    String category,
    String shortDescription,
    String longDescription,
    String address,
    Double latitude,
    Double longitude,
    String openingHours,
    Integer priceRange,
    Double averageRating,
    Boolean isPartner,
    List<String> imageUrls,
    List<String> highlights,
    Boolean isSaved,
    List<AttractionReviewDTO> reviews
) {}
