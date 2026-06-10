package br.edu.ifpb.explorae.gamification.listener;

import br.edu.ifpb.explorae.gamification.event.DestinationReachedEvent;
import br.edu.ifpb.explorae.gamification.event.FavoriteCreatedEvent;
import br.edu.ifpb.explorae.gamification.event.ReviewCreatedEvent;
import br.edu.ifpb.explorae.gamification.service.ChallengeService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChallengeListener {

    private final ChallengeService challengeService;

    @EventListener
    public void handleDestinationReached(DestinationReachedEvent event) {
        challengeService.updateProgress(event.userId(), "VISIT_ATTRACTION", 1);
    }

    @EventListener
    public void handleReviewCreated(ReviewCreatedEvent event) {
        challengeService.updateProgress(event.userId(), "CREATE_REVIEW", 1);
    }

    @EventListener
    public void handleFavoriteCreated(FavoriteCreatedEvent event) {
        challengeService.updateProgress(event.userId(), "ADD_FAVORITE", 1);
    }
}
