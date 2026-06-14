package br.edu.ifpb.explorae.gamification.service;
import br.edu.ifpb.explorae.gamification.dto.XpHistoryResponseDTO;

import br.edu.ifpb.explorae.gamification.dto.XpHistoryResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifpb.explorae.gamification.dto.XpHistoryResponseDTO;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GamificationService {

    private final XpService xpService;
    private final BadgeService badgeService;

    @Transactional
    public void addXp(UUID userId, Integer amount, String reason) {
        xpService.addXp(userId, amount, reason);
    }

    @Transactional
    public void addXp(UUID userId, Integer amount, Integer coins, String reason) {
        xpService.addXp(userId, amount, coins, reason);
    }

    @Transactional
    public void awardBadge(UUID userId, String badgeName) {
        badgeService.evaluateAndAward(userId, badgeName);
    }

    @Transactional(readOnly = true)
    public boolean hasBadge(UUID userId, String badgeName) {
        return badgeService.hasBadge(userId, badgeName);
    }

    @Transactional
    public void addCoins(UUID userId, Integer amount) {
        xpService.addCoins(userId, amount);
    }

    @Transactional(readOnly = true)
    public List<XpHistoryResponseDTO> getXpHistory(UUID userId) {
        return xpService.getXpHistory(userId);
    }
}
