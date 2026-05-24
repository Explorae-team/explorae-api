package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.api.dto.ChallengeProgressDTO;
import br.edu.ifpb.explorae.api.mapper.ChallengeMapper;
import br.edu.ifpb.explorae.domain.gamification.Challenge;
import br.edu.ifpb.explorae.domain.gamification.UserChallengeProgress;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.event.ChallengeCompletedEvent;
import br.edu.ifpb.explorae.repository.ChallengeRepository;
import br.edu.ifpb.explorae.repository.UserChallengeProgressRepository;
import br.edu.ifpb.explorae.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final UserChallengeProgressRepository progressRepository;
    private final GamificationService gamificationService;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final ChallengeMapper challengeMapper;

    /**
     * Retorna a lista de desafios ativos com o progresso do usuário.
     * Para os desafios ativos que o usuário ainda não interagiu,
     * retorna um objeto de progresso transiente com valor 0.
     */
    @Transactional(readOnly = true)
    public List<ChallengeProgressDTO> getActiveChallengesForUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        LocalDateTime now = LocalDateTime.now();
        List<Challenge> activeChallenges = challengeRepository.findActiveChallenges(now);

        List<UserChallengeProgress> existingProgress = progressRepository.findByUserIdAndChallengeIn(userId, activeChallenges);

        Map<UUID, UserChallengeProgress> progressMap = existingProgress.stream()
                .collect(Collectors.toMap(p -> p.getChallenge().getId(), p -> p));

        List<UserChallengeProgress> result = new ArrayList<>();
        for (Challenge challenge : activeChallenges) {
            UserChallengeProgress progress = progressMap.get(challenge.getId());
            if (progress == null) {
                progress = UserChallengeProgress.builder()
                        .user(user)
                        .challenge(challenge)
                        .currentValue(0)
                        .completed(false)
                        .build();
            }
            result.add(progress);
        }

        return challengeMapper.toProgressDTOList(result);
    }

    /**
     * Atualiza o progresso de todos os desafios ativos compatíveis com o actionType.
     */
    @Transactional
    public void updateProgress(UUID userId, String actionType, Integer increment) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        LocalDateTime now = LocalDateTime.now();
        List<Challenge> activeChallenges = challengeRepository.findActiveChallenges(now);

        List<Challenge> matchingChallenges = activeChallenges.stream()
                .filter(c -> c.getActionType().equalsIgnoreCase(actionType))
                .collect(Collectors.toList());

        for (Challenge challenge : matchingChallenges) {
            UserChallengeProgress progress = progressRepository.findByUserIdAndChallengeId(userId, challenge.getId())
                    .orElseGet(() -> UserChallengeProgress.builder()
                            .user(user)
                            .challenge(challenge)
                            .currentValue(0)
                            .completed(false)
                            .build());

            if (Boolean.TRUE.equals(progress.getCompleted())) {
                continue;
            }

            int newValue = progress.getCurrentValue() + increment;
            if (newValue >= challenge.getTargetValue()) {
                progress.setCurrentValue(challenge.getTargetValue());
                progress.setCompleted(true);
                progress.setCompletedAt(now);

                progressRepository.save(progress);

                // Conceder recompensas de forma unificada
                gamificationService.addXp(userId, challenge.getXpReward(), challenge.getCoinsReward(), "Desafio Concluído: " + challenge.getTitle());

                // Publicar evento
                eventPublisher.publishEvent(new ChallengeCompletedEvent(userId, challenge));
            } else {
                progress.setCurrentValue(newValue);
                progressRepository.save(progress);
            }
        }
    }
}
