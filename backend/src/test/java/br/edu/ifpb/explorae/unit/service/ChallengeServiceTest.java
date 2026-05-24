package br.edu.ifpb.explorae.unit.service;

import br.edu.ifpb.explorae.api.dto.ChallengeProgressDTO;
import br.edu.ifpb.explorae.api.mapper.ChallengeMapper;
import br.edu.ifpb.explorae.domain.gamification.Challenge;
import br.edu.ifpb.explorae.domain.gamification.UserChallengeProgress;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.event.ChallengeCompletedEvent;
import br.edu.ifpb.explorae.repository.ChallengeRepository;
import br.edu.ifpb.explorae.repository.UserChallengeProgressRepository;
import br.edu.ifpb.explorae.repository.UserRepository;
import br.edu.ifpb.explorae.service.ChallengeService;
import br.edu.ifpb.explorae.service.GamificationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChallengeServiceTest {

    @Mock
    private ChallengeRepository challengeRepository;

    @Mock
    private UserChallengeProgressRepository progressRepository;

    @Mock
    private GamificationService gamificationService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Mock
    private ChallengeMapper challengeMapper;

    @InjectMocks
    private ChallengeService challengeService;

    @Test
    @DisplayName("Deve retornar desafios ativos convertidos em DTOs")
    void shouldReturnActiveChallengesForUser() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).build();
        Challenge challenge = Challenge.builder()
                .id(UUID.randomUUID())
                .title("Explorador")
                .targetValue(2)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(challengeRepository.findActiveChallenges(any(LocalDateTime.class)))
                .thenReturn(List.of(challenge));
        when(progressRepository.findByUserIdAndChallengeIn(eq(userId), anyList()))
                .thenReturn(Collections.emptyList());

        ChallengeProgressDTO dto = new ChallengeProgressDTO(
                challenge.getId(), "Explorador", "Desc", "DAILY", "VISIT_ATTRACTION",
                2, 50, 10, LocalDateTime.now(), LocalDateTime.now(), 0, false, null
        );
        when(challengeMapper.toProgressDTOList(anyList())).thenReturn(List.of(dto));

        // WHEN
        List<ChallengeProgressDTO> result = challengeService.getActiveChallengesForUser(userId);

        // THEN
        assertThat(result).hasSize(1);
        assertThat(result.get(0).title()).isEqualTo("Explorador");
    }

    @Test
    @DisplayName("Deve atualizar o progresso e concluir o desafio ao atingir o objetivo")
    void shouldUpdateProgressAndCompleteChallenge() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).build();
        Challenge challenge = Challenge.builder()
                .id(UUID.randomUUID())
                .title("Explorador Diário")
                .actionType("VISIT_ATTRACTION")
                .targetValue(2)
                .xpReward(100)
                .coinsReward(20)
                .build();

        UserChallengeProgress progress = UserChallengeProgress.builder()
                .user(user)
                .challenge(challenge)
                .currentValue(1)
                .completed(false)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(challengeRepository.findActiveChallenges(any(LocalDateTime.class)))
                .thenReturn(List.of(challenge));
        when(progressRepository.findByUserIdAndChallengeId(userId, challenge.getId()))
                .thenReturn(Optional.of(progress));

        // WHEN
        challengeService.updateProgress(userId, "VISIT_ATTRACTION", 1);

        // THEN
        assertThat(progress.getCurrentValue()).isEqualTo(2);
        assertThat(progress.getCompleted()).isTrue();
        verify(progressRepository, times(1)).save(progress);
        verify(gamificationService, times(1)).addXp(userId, 100, 20, "Desafio Concluído: Explorador Diário");
        verify(eventPublisher, times(1)).publishEvent(any(ChallengeCompletedEvent.class));
    }
}
