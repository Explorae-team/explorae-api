package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.domain.gamification.Badge;
import br.edu.ifpb.explorae.domain.gamification.UserBadge;
import br.edu.ifpb.explorae.domain.gamification.XpHistory;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.event.UserLevelUpEvent;
import br.edu.ifpb.explorae.repository.BadgeRepository;
import br.edu.ifpb.explorae.repository.UserBadgeRepository;
import br.edu.ifpb.explorae.repository.UserRepository;
import br.edu.ifpb.explorae.repository.XpHistoryRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import java.util.UUID;

@Service
public class GamificationService {

    private final UserRepository userRepository;
    private final XpHistoryRepository xpHistoryRepository;
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final ApplicationEventPublisher eventPublisher;

    public GamificationService(UserRepository userRepository,
            XpHistoryRepository xpHistoryRepository,
            BadgeRepository badgeRepository,
            UserBadgeRepository userBadgeRepository,
            ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.xpHistoryRepository = xpHistoryRepository;
        this.badgeRepository = badgeRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Adiciona XP a um usuário e registra no histórico.
     */
    @Transactional
    public void addXp(UUID userId, Integer amount, String reason) {
        addXp(userId, amount, 0, reason);
    }

    /**
     * Adiciona XP e moedas a um usuário de forma unificada e registra no histórico de conquistas.
     */
    @Transactional
    public void addXp(UUID userId, Integer amount, Integer coins, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para ganho de XP"));

        boolean levelUp = user.addXp(amount);
        if (coins != null && coins > 0) {
            user.setCoins(user.getCoins() + coins);
        }
        userRepository.save(user);

        XpHistory history = XpHistory.builder()
                .user(user)
                .amount(amount)
                .coins(coins != null ? coins : 0)
                .reason(reason)
                .build();

        xpHistoryRepository.save(history);

        if (levelUp) {
            eventPublisher.publishEvent(new UserLevelUpEvent(userId, user.getLevel()));
        }

        // Concessão resiliente e retroativa de medalhas de nível
        if (user.getLevel() >= 5) {
            awardBadge(userId, "EXPLORADOR_VETERANO");
        }
        if (user.getLevel() >= 10) {
            awardBadge(userId, "LENDA_URBANA");
        }
    }

    /**
     * Atribui uma medalha a um usuário se ele ainda não a possui.
     */
    @Transactional
    public void awardBadge(UUID userId, String badgeName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para atribuição de medalha"));

        Optional<Badge> badgeOpt = badgeRepository.findByName(badgeName);
        if (badgeOpt.isEmpty()) {
            System.err.println(
                    "WARN: Medalha não encontrada: " + badgeName + ". Ignorando erro para não travar a aplicação.");
            return;
        }
        Badge badge = badgeOpt.get();

        if (!userBadgeRepository.existsByUserAndBadge(user, badge)) {
            UserBadge userBadge = UserBadge.builder()
                    .user(user)
                    .badge(badge)
                    .build();
            userBadgeRepository.save(userBadge);
            BadgeUnlockTracker.add(badge);
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
        Optional<Badge> badgeOpt = badgeRepository.findByName(badgeName);
        if (badgeOpt.isEmpty()) {
            return false;
        }
        return userBadgeRepository.existsByUserAndBadge(user, badgeOpt.get());
    }

    /**
     * Adiciona moedas a um usuário.
     */
    @Transactional
    public void addCoins(UUID userId, Integer amount) {
        if (amount == null || amount <= 0)
            return;
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para ganho de moedas"));
        user.setCoins(user.getCoins() + amount);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public java.util.List<br.edu.ifpb.explorae.api.dto.XpHistoryResponseDTO> getXpHistory(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return xpHistoryRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(h -> new br.edu.ifpb.explorae.api.dto.XpHistoryResponseDTO(
                        h.getId(),
                        h.getAmount(),
                        h.getCoins(),
                        h.getReason(),
                        h.getCreatedAt()))
                .collect(java.util.stream.Collectors.toList());
    }
}
