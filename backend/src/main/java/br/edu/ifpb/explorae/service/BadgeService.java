package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.api.dto.BadgeResponseDTO;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.BadgeRepository;
import br.edu.ifpb.explorae.repository.UserBadgeRepository;
import br.edu.ifpb.explorae.repository.UserRepository;
import br.edu.ifpb.explorae.service.badge.BadgeProgressStrategy;
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
    private final Map<String, BadgeProgressStrategy> strategyMap;

    public BadgeService(
            BadgeRepository badgeRepository,
            UserBadgeRepository userBadgeRepository,
            UserRepository userRepository,
            List<BadgeProgressStrategy> strategies
    ) {
        this.badgeRepository = badgeRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.userRepository = userRepository;
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
}
