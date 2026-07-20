package br.edu.ifpb.explorae.gamification.service;

import br.edu.ifpb.explorae.gamification.event.ChallengeCompletedEvent;
import br.edu.ifpb.explorae.gamification.event.DestinationReachedEvent;
import br.edu.ifpb.explorae.gamification.event.ReviewCreatedEvent;
import br.edu.ifpb.explorae.gamification.event.UserLevelUpEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BadgeEvaluationService {

    private final GamificationService gamificationService;

    @EventListener
    public void handleChallengeCompleted(ChallengeCompletedEvent event) {
        gamificationService.awardBadge(event.userId(), "MARATONISTA");
    }

    @EventListener
    public void handleDestinationReached(DestinationReachedEvent event) {
        gamificationService.awardBadge(event.userId(), "EXPLORADOR");
    }

    @EventListener
    public void handleReviewCreated(ReviewCreatedEvent event) {
        gamificationService.awardBadge(event.userId(), "DESBRAVADOR_VERDE");
    }

    @EventListener
    public void handleUserLevelUp(UserLevelUpEvent event) {
        gamificationService.awardBadge(event.userId(), "EXPLORADOR_VETERANO");
        gamificationService.awardBadge(event.userId(), "LENDA_URBANA");
    }
}
