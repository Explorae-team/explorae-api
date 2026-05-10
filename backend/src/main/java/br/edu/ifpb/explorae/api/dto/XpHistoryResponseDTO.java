package br.edu.ifpb.explorae.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record XpHistoryResponseDTO(
    UUID id,
    Integer amount,
    String reason,
    LocalDateTime createdAt
) {}
