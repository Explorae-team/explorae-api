package br.edu.ifpb.explorae.gamification.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record XpHistoryResponseDTO(
    UUID id,
    Integer amount,
    Integer coins,
    String reason,
    LocalDateTime createdAt
) {
    public XpHistoryResponseDTO(UUID id, Integer amount, String reason, LocalDateTime createdAt) {
        this(id, amount, 0, reason, createdAt);
    }
}
