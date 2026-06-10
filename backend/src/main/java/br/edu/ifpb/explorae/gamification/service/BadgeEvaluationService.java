package br.edu.ifpb.explorae.gamification.service;

import br.edu.ifpb.explorae.gamification.event.ChallengeCompletedEvent;
import br.edu.ifpb.explorae.gamification.event.DestinationReachedEvent;
import br.edu.ifpb.explorae.gamification.event.ReviewCreatedEvent;
import br.edu.ifpb.explorae.gamification.event.UserLevelUpEvent;
import br.edu.ifpb.explorae.attraction.repository.AttractionReviewRepository;
import br.edu.ifpb.explorae.gamification.repository.UserChallengeProgressRepository;
import br.edu.ifpb.explorae.attraction.repository.UserInteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BadgeEvaluationService {

    private final GamificationService gamificationService;
    private final UserChallengeProgressRepository progressRepository;
    private final AttractionReviewRepository reviewRepository;
    private final UserInteractionRepository userInteractionRepository;

    @EventListener
    public void handleChallengeCompleted(ChallengeCompletedEvent event) {
        UUID userId = event.userId();
        // Verificar Maratonista: Concluiu 5 desafios diários
        long completedDaily = progressRepository.countCompletedDailyChallengesByUserId(userId);
        if (completedDaily >= 5) {
            gamificationService.awardBadge(userId, "MARATONISTA");
        }
    }

    @EventListener
    public void handleDestinationReached(DestinationReachedEvent event) {
        UUID userId = event.userId();
        // Verificar Explorador: Visitou 3 destinos diferentes
        long distinctDestinations = userInteractionRepository.countDistinctAttractionsByUserIdAndInteractionType(userId, "CHECK_IN");
        if (distinctDestinations >= 3) {
            gamificationService.awardBadge(userId, "EXPLORADOR");
        }
    }

    @EventListener
    public void handleReviewCreated(ReviewCreatedEvent event) {
        UUID userId = event.userId();
        // Verificar Desbravador Verde: Avaliou 3 atrações na categoria Aventura
        long adventureReviewsCount = reviewRepository.countByUserIdAndAttractionCategoryIgnoreCase(userId, "aventura");
        if (adventureReviewsCount >= 3) {
            gamificationService.awardBadge(userId, "DESBRAVADOR_VERDE");
        }
    }

    @EventListener
    public void handleUserLevelUp(UserLevelUpEvent event) {
        UUID userId = event.userId();
        int newLevel = event.newLevel();

        // Verificar Explorador Veterano: Atingiu o nível 5
        if (newLevel >= 5) {
            gamificationService.awardBadge(userId, "EXPLORADOR_VETERANO");
        }

        // Verificar Lenda Urbana: Atingiu o nível 10
        if (newLevel >= 10) {
            gamificationService.awardBadge(userId, "LENDA_URBANA");
        }
    }
}
