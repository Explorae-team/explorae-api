package br.edu.ifpb.explorae.attraction.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

/**
 * DTO para solicitação de check-in por proximidade física via GPS.
 */
public record CheckInRequestDTO(
        @NotNull(message = "O ID do usuário é obrigatório.")
        UUID userId,

        @NotNull(message = "O ID da atração é obrigatório.")
        UUID attractionId,

        @NotNull(message = "A latitude do usuário é obrigatória.")
        Double userLatitude,

        @NotNull(message = "A longitude do usuário é obrigatória.")
        Double userLongitude
) {}
