package br.edu.ifpb.explorae.api.dto;

import java.util.List;

public record CheckInResponseDTO(
    String status,
    List<BadgeResponseDTO> unlockedBadges
) {}
