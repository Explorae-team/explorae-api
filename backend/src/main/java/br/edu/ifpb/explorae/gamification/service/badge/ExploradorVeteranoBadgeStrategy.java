package br.edu.ifpb.explorae.gamification.service.badge;

import br.edu.ifpb.explorae.user.domain.User;
import org.springframework.stereotype.Component;

@Component
public class ExploradorVeteranoBadgeStrategy implements BadgeProgressStrategy {

    @Override
    public String getBadgeName() {
        return "EXPLORADOR_VETERANO";
    }

    @Override
    public int getTargetValue() {
        return 5;
    }

    @Override
    public int calculateCurrentValue(User user) {
        return user.getLevel() != null ? user.getLevel() : 1;
    }
}
