package br.edu.ifpb.explorae.api.dto;

import java.util.List;

public record FavoriteResponseDTO(
        boolean isFavorite,
        List<BadgeResponseDTO> unlockedBadges
) {}
