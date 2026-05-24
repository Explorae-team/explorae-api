package br.edu.ifpb.explorae.api.dto;

import java.util.List;

public record ReviewResponseDTO(
    AttractionReviewDTO review,
    List<BadgeResponseDTO> unlockedBadges
) {}
