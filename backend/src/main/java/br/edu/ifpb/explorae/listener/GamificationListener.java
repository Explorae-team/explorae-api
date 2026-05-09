package br.edu.ifpb.explorae.listener;

import br.edu.ifpb.explorae.event.DestinationReachedEvent;
import br.edu.ifpb.explorae.event.FavoriteCreatedEvent;
import br.edu.ifpb.explorae.event.PreferenceCompletedEvent;
import br.edu.ifpb.explorae.event.ReviewCreatedEvent;
import br.edu.ifpb.explorae.service.GamificationService;
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
        gamificationService.addXp(event.userId(), 100, "Conclusão do perfil de preferências");
        gamificationService.awardBadge(event.userId(), "PIONEIRO");
    }

    @EventListener
    public void handleFavoriteCreated(FavoriteCreatedEvent event) {
        gamificationService.addXp(event.userId(), 10, "Adicionou um favorito");
        gamificationService.awardBadge(event.userId(), "COLECIONADOR");
    }

    @EventListener
    public void handleDestinationReached(DestinationReachedEvent event) {
        gamificationService.addXp(event.userId(), 50, "Chegou ao primeiro destino");
        gamificationService.awardBadge(event.userId(), "DESBRAVADOR");
    }

    @EventListener
    public void handleReviewCreated(ReviewCreatedEvent event) {
        gamificationService.addXp(event.userId(), 30, "Realizou a primeira avaliação");
        gamificationService.awardBadge(event.userId(), "CRITICO");
    }
}
