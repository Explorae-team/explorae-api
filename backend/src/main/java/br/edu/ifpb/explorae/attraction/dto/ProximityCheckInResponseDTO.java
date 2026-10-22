package br.edu.ifpb.explorae.attraction.dto;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Resposta detalhada do check-in por proximidade física desenvolvido via TDD.
 */
public record ProximityCheckInResponseDTO(
        UUID checkInId,
        UUID attractionId,
        String attractionName,
        double distanceInMeters,
        int xpEarned,
        int coinsEarned,
        LocalDateTime timestamp
) {}
