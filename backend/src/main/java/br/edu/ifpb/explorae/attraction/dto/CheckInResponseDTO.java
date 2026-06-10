package br.edu.ifpb.explorae.attraction.dto;
import br.edu.ifpb.explorae.gamification.dto.BadgeResponseDTO;

import java.util.List;

public record CheckInResponseDTO(
    String status,
    List<BadgeResponseDTO> unlockedBadges
) {}
