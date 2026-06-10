package br.edu.ifpb.explorae.gamification.event;

import java.util.UUID;

public record UserLevelUpEvent(UUID userId, int newLevel) {}
