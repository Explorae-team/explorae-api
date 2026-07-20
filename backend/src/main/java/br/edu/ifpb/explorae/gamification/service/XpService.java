package br.edu.ifpb.explorae.gamification.service;

import br.edu.ifpb.explorae.gamification.domain.XpHistory;
import br.edu.ifpb.explorae.gamification.dto.XpHistoryResponseDTO;
import br.edu.ifpb.explorae.gamification.event.UserLevelUpEvent;
import br.edu.ifpb.explorae.gamification.repository.XpHistoryRepository;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class XpService {

    private final UserRepository userRepository;
    private final XpHistoryRepository xpHistoryRepository;
    private final ApplicationEventPublisher eventPublisher;

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
    }

    /**
     * Adiciona moedas a um usuário.
     */
    @Transactional
    public void addCoins(UUID userId, Integer amount) {
        if (amount == null || amount <= 0) return;
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para ganho de moedas"));
        user.setCoins(user.getCoins() + amount);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<XpHistoryResponseDTO> getXpHistory(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return xpHistoryRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(h -> new XpHistoryResponseDTO(
                        h.getId(),
                        h.getAmount(),
                        h.getCoins(),
                        h.getReason(),
                        h.getCreatedAt()))
                .collect(Collectors.toList());
    }
}
