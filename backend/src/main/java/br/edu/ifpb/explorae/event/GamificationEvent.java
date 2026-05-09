package br.edu.ifpb.explorae.event;

import java.util.UUID;

/**
 * Evento base para ações de gamificação no Exploraê.
 */
public record GamificationEvent(
    UUID userId,
    String actionKey,
    String description
) {}
