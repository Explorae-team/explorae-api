package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.domain.gamification.Badge;
import br.edu.ifpb.explorae.domain.gamification.UserBadge;
import br.edu.ifpb.explorae.domain.gamification.XpHistory;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.BadgeRepository;
import br.edu.ifpb.explorae.repository.UserBadgeRepository;
import br.edu.ifpb.explorae.repository.UserRepository;
import br.edu.ifpb.explorae.repository.XpHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class GamificationService {

    private final UserRepository userRepository;
    private final XpHistoryRepository xpHistoryRepository;
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;

    public GamificationService(UserRepository userRepository, 
                               XpHistoryRepository xpHistoryRepository, 
                               BadgeRepository badgeRepository, 
                               UserBadgeRepository userBadgeRepository) {
        this.userRepository = userRepository;
        this.xpHistoryRepository = xpHistoryRepository;
        this.badgeRepository = badgeRepository;
        this.userBadgeRepository = userBadgeRepository;
    }

    /**
     * Adiciona XP a um usuário e registra no histórico.
     */
    @Transactional
    public void addXp(UUID userId, Integer amount, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para ganho de XP"));

        user.addXp(amount);
        userRepository.save(user);

        XpHistory history = XpHistory.builder()
                .user(user)
                .amount(amount)
                .reason(reason)
                .build();
        
        xpHistoryRepository.save(history);
    }

    /**
     * Atribui uma medalha a um usuário se ele ainda não a possui.
     */
    @Transactional
    public void awardBadge(UUID userId, String badgeName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para atribuição de medalha"));

        java.util.Optional<Badge> badgeOpt = badgeRepository.findByName(badgeName);
        if (badgeOpt.isEmpty()) {
            System.err.println("WARN: Medalha não encontrada: " + badgeName + ". Ignorando erro para não travar a aplicação.");
            return;
        }
        Badge badge = badgeOpt.get();

        if (!userBadgeRepository.existsByUserAndBadge(user, badge)) {
            UserBadge userBadge = UserBadge.builder()
                    .user(user)
                    .badge(badge)
                    .build();
            userBadgeRepository.save(userBadge);
        }
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
                        h.getReason(),
                        h.getCreatedAt()
                ))
                .collect(java.util.stream.Collectors.toList());
    }
}
