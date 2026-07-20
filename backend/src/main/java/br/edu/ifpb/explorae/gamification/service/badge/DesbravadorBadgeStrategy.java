package br.edu.ifpb.explorae.gamification.service.badge;

import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.attraction.repository.UserInteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DesbravadorBadgeStrategy implements BadgeProgressStrategy {

    private final UserInteractionRepository userInteractionRepository;

    @Override
    public String getBadgeName() {
        return "DESBRAVADOR";
    }

    @Override
    public int getTargetValue() {
        return 1;
    }

    @Override
    public int calculateCurrentValue(User user) {
        return (int) userInteractionRepository.countDistinctAttractionsByUserIdAndInteractionType(user.getId(), "CHECK_IN");
    }
}
