package br.edu.ifpb.explorae.gamification.service;

import br.edu.ifpb.explorae.gamification.dto.BadgeResponseDTO;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.gamification.repository.BadgeRepository;
import br.edu.ifpb.explorae.gamification.repository.UserBadgeRepository;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import br.edu.ifpb.explorae.gamification.service.badge.BadgeProgressStrategy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final UserRepository userRepository;
    private final BadgeUnlockTracker badgeUnlockTracker;
    private final Map<String, BadgeProgressStrategy> strategyMap;

    public BadgeService(
            BadgeRepository badgeRepository,
            UserBadgeRepository userBadgeRepository,
            UserRepository userRepository,
            BadgeUnlockTracker badgeUnlockTracker,
            List<BadgeProgressStrategy> strategies
    ) {
        this.badgeRepository = badgeRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.userRepository = userRepository;
        this.badgeUnlockTracker = badgeUnlockTracker;
        this.strategyMap = strategies.stream()
                .collect(Collectors.toMap(
                        s -> s.getBadgeName().toUpperCase(),
                        s -> s
                ));
    }

    /**
     * Recupera todas as medalhas do sistema e calcula o progresso dinâmico para o usuário autenticado.
     */
    @Transactional(readOnly = true)
    public List<BadgeResponseDTO> getAllBadgesWithProgress(User principal) {
        final User user = principal != null ? userRepository.findById(principal.getId()).orElse(null) : null;

        if (user == null) {
            return badgeRepository.findAll().stream()
                    .map(b -> new BadgeResponseDTO(
                            b.getId(),
                            b.getName(),
                            b.getDescription(),
                            b.getIconUrl(),
                            b.getCategory(),
                            null,
                            null
                    ))
                    .collect(Collectors.toList());
        }

        final Set<UUID> unlockedBadgeIds = userBadgeRepository.findByUser(user).stream()
                .map(ub -> ub.getBadge().getId())
                .collect(Collectors.toSet());

        return badgeRepository.findAll().stream()
                .map(b -> {
                    boolean isUnlocked = unlockedBadgeIds.contains(b.getId());
                    Integer currentValue = null;
                    Integer targetValue = null;

                    BadgeProgressStrategy strategy = strategyMap.get(b.getName().toUpperCase());
                    if (strategy != null) {
                        targetValue = strategy.getTargetValue();
                        currentValue = isUnlocked ? targetValue : strategy.calculateCurrentValue(user);
                    }

                    return new BadgeResponseDTO(
                            b.getId(),
                            b.getName(),
                            b.getDescription(),
                            b.getIconUrl(),
                            b.getCategory(),
                            currentValue,
                            targetValue
                    );
                })
                .collect(Collectors.toList());
    }

    /**
     * Avalia uma Strategy e atribui a medalha caso o usuário atinja o objetivo.
     */
    @Transactional
    public void evaluateAndAward(UUID userId, String badgeName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para atribuição de medalha"));

        java.util.Optional<br.edu.ifpb.explorae.gamification.domain.Badge> badgeOpt = badgeRepository.findByName(badgeName);
        if (badgeOpt.isEmpty()) {
            System.err.println("WARN: Medalha não encontrada: " + badgeName + ". Ignorando erro para não travar a aplicação.");
            return;
        }
        br.edu.ifpb.explorae.gamification.domain.Badge badge = badgeOpt.get();

        if (userBadgeRepository.existsByUserAndBadge(user, badge)) {
            return; // Já possui a medalha
        }

        BadgeProgressStrategy strategy = strategyMap.get(badgeName.toUpperCase());
        if (strategy != null) {
            int current = strategy.calculateCurrentValue(user);
            int target = strategy.getTargetValue();
            if (current >= target) {
                br.edu.ifpb.explorae.gamification.domain.UserBadge userBadge = br.edu.ifpb.explorae.gamification.domain.UserBadge.builder()
                        .user(user)
                        .badge(badge)
                        .build();
                userBadgeRepository.save(userBadge);
                badgeUnlockTracker.add(badge);
            }
        } else {
            // Se não tem Strategy, apenas assume que o trigger já fez a validação e concede direto (ex: GamificationService antigo que concedia direto).
            br.edu.ifpb.explorae.gamification.domain.UserBadge userBadge = br.edu.ifpb.explorae.gamification.domain.UserBadge.builder()
                    .user(user)
                    .badge(badge)
                    .build();
            userBadgeRepository.save(userBadge);
            badgeUnlockTracker.add(badge);
        }
    }

    /**
     * Verifica se o usuário já possui uma determinada medalha.
     */
    @Transactional(readOnly = true)
    public boolean hasBadge(UUID userId, String badgeName) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return false;
        }
        java.util.Optional<br.edu.ifpb.explorae.gamification.domain.Badge> badgeOpt = badgeRepository.findByName(badgeName);
        if (badgeOpt.isEmpty()) {
            return false;
        }
        return userBadgeRepository.existsByUserAndBadge(user, badgeOpt.get());
    }
}
