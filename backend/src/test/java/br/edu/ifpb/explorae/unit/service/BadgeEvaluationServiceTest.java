package br.edu.ifpb.explorae.unit.service;

import br.edu.ifpb.explorae.domain.gamification.Challenge;
import br.edu.ifpb.explorae.event.ChallengeCompletedEvent;
import br.edu.ifpb.explorae.event.DestinationReachedEvent;
import br.edu.ifpb.explorae.event.ReviewCreatedEvent;
import br.edu.ifpb.explorae.event.UserLevelUpEvent;
import br.edu.ifpb.explorae.repository.AttractionReviewRepository;
import br.edu.ifpb.explorae.repository.UserChallengeProgressRepository;
import br.edu.ifpb.explorae.repository.UserInteractionRepository;
import br.edu.ifpb.explorae.service.BadgeEvaluationService;
import br.edu.ifpb.explorae.service.GamificationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BadgeEvaluationServiceTest {

    @Mock
    private GamificationService gamificationService;

    @Mock
    private UserChallengeProgressRepository progressRepository;

    @Mock
    private AttractionReviewRepository reviewRepository;

    @Mock
    private UserInteractionRepository userInteractionRepository;

    @InjectMocks
    private BadgeEvaluationService badgeEvaluationService;

    @Test
    @DisplayName("Deve conceder medalha MARATONISTA se o usuário concluiu pelo menos 5 desafios diários")
    void shouldAwardMaratonistaBadge() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        Challenge challenge = Challenge.builder().type("DAILY").build();
        ChallengeCompletedEvent event = new ChallengeCompletedEvent(userId, challenge);

        when(progressRepository.countCompletedDailyChallengesByUserId(userId)).thenReturn(5L);

        // WHEN
        badgeEvaluationService.handleChallengeCompleted(event);

        // THEN
        verify(gamificationService, times(1)).awardBadge(userId, "MARATONISTA");
    }

    @Test
    @DisplayName("Deve conceder medalha EXPLORADOR se o usuário visitou pelo menos 3 destinos diferentes")
    void shouldAwardExploradorBadge() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        DestinationReachedEvent event = new DestinationReachedEvent(userId);

        when(userInteractionRepository.countDistinctAttractionsByUserIdAndInteractionType(userId, "CHECK_IN")).thenReturn(3L);

        // WHEN
        badgeEvaluationService.handleDestinationReached(event);

        // THEN
        verify(gamificationService, times(1)).awardBadge(userId, "EXPLORADOR");
    }

    @Test
    @DisplayName("Deve conceder medalha DESBRAVADOR_VERDE se o usuário escreveu pelo menos 3 reviews de aventura")
    void shouldAwardDesbravadorVerdeBadge() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        ReviewCreatedEvent event = new ReviewCreatedEvent(userId);

        when(reviewRepository.countByUserIdAndAttractionCategoryIgnoreCase(userId, "aventura")).thenReturn(3L);

        // WHEN
        badgeEvaluationService.handleReviewCreated(event);

        // THEN
        verify(gamificationService, times(1)).awardBadge(userId, "DESBRAVADOR_VERDE");
    }

    @Test
    @DisplayName("Deve conceder medalha EXPLORADOR_VETERANO se o usuário atingiu o nível 5")
    void shouldAwardExploradorVeteranoBadge() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        UserLevelUpEvent event = new UserLevelUpEvent(userId, 5);

        // WHEN
        badgeEvaluationService.handleUserLevelUp(event);

        // THEN
        verify(gamificationService, times(1)).awardBadge(userId, "EXPLORADOR_VETERANO");
        verify(gamificationService, never()).awardBadge(userId, "LENDA_URBANA");
    }

    @Test
    @DisplayName("Deve conceder medalha LENDA_URBANA se o usuário atingiu o nível 10")
    void shouldAwardLendaUrbanaBadge() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        UserLevelUpEvent event = new UserLevelUpEvent(userId, 10);

        // WHEN
        badgeEvaluationService.handleUserLevelUp(event);

        // THEN
        verify(gamificationService, times(1)).awardBadge(userId, "EXPLORADOR_VETERANO");
        verify(gamificationService, times(1)).awardBadge(userId, "LENDA_URBANA");
    }
}
