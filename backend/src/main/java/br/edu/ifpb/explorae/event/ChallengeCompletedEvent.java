package br.edu.ifpb.explorae.event;

import br.edu.ifpb.explorae.domain.gamification.Challenge;
import java.util.UUID;

public record ChallengeCompletedEvent(UUID userId, Challenge challenge) {}
