package br.edu.ifpb.explorae.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ChallengeProgressDTO(
    UUID id,
    String title,
    String description,
    String type,
    String actionType,
    Integer targetValue,
    Integer xpReward,
    Integer coinsReward,
    LocalDateTime startDate,
    LocalDateTime endDate,
    Integer currentValue,
    boolean completed,
    LocalDateTime completedAt
) {}
