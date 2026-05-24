package br.edu.ifpb.explorae.service.badge;

import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.UserChallengeProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MaratonistaBadgeStrategy implements BadgeProgressStrategy {

    private final UserChallengeProgressRepository progressRepository;

    @Override
    public String getBadgeName() {
        return "MARATONISTA";
    }

    @Override
    public int getTargetValue() {
        return 5;
    }

    @Override
    public int calculateCurrentValue(User user) {
        return (int) progressRepository.countCompletedDailyChallengesByUserId(user.getId());
    }
}
