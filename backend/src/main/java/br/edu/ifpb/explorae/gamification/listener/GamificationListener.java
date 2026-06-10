package br.edu.ifpb.explorae.gamification.listener;

import br.edu.ifpb.explorae.gamification.event.DestinationReachedEvent;
import br.edu.ifpb.explorae.gamification.event.FavoriteCreatedEvent;
import br.edu.ifpb.explorae.gamification.event.PreferenceCompletedEvent;
import br.edu.ifpb.explorae.gamification.event.ReviewCreatedEvent;
import br.edu.ifpb.explorae.gamification.service.GamificationService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class GamificationListener {

    private final GamificationService gamificationService;

    public GamificationListener(GamificationService gamificationService) {
        this.gamificationService = gamificationService;
    }

    @EventListener
    public void handlePreferenceCompleted(PreferenceCompletedEvent event) {
        if (!gamificationService.hasBadge(event.userId(), "PIONEIRO")) {
            gamificationService.addXp(event.userId(), 100, "Conclusão do Onboarding de Preferências");
            gamificationService.awardBadge(event.userId(), "PIONEIRO");
        }
    }

    @EventListener
    public void handleFavoriteCreated(FavoriteCreatedEvent event) {
        if (!gamificationService.hasBadge(event.userId(), "COLECIONADOR")) {
            gamificationService.addXp(event.userId(), 10, "Adicionou um favorito");
            gamificationService.awardBadge(event.userId(), "COLECIONADOR");
        }
    }

    @EventListener
    public void handleDestinationReached(DestinationReachedEvent event) {
        if (!gamificationService.hasBadge(event.userId(), "DESBRAVADOR")) {
            gamificationService.addXp(event.userId(), 50, "Chegou ao primeiro destino");
            gamificationService.awardBadge(event.userId(), "DESBRAVADOR");
        }
    }

    @EventListener
    public void handleReviewCreated(ReviewCreatedEvent event) {
        if (!gamificationService.hasBadge(event.userId(), "CRITICO")) {
            gamificationService.addXp(event.userId(), 30, "Realizou a primeira avaliação");
            gamificationService.awardBadge(event.userId(), "CRITICO");
        }
    }
}
