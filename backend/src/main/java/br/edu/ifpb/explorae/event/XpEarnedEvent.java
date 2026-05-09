package br.edu.ifpb.explorae.event;

import java.util.UUID;

/**
 * Evento disparado quando um usuário ganha XP.
 */
public record XpEarnedEvent(
    UUID userId,
    Integer amount,
    String reason
) {}
