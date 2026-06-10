package br.edu.ifpb.explorae.gamification.event;

import br.edu.ifpb.explorae.gamification.domain.Challenge;
import java.util.UUID;

public record ChallengeCompletedEvent(UUID userId, Challenge challenge) {}
