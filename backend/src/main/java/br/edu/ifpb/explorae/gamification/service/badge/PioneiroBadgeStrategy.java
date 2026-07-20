package br.edu.ifpb.explorae.gamification.service.badge;

import br.edu.ifpb.explorae.user.domain.User;
import org.springframework.stereotype.Component;

@Component
public class PioneiroBadgeStrategy implements BadgeProgressStrategy {

    @Override
    public String getBadgeName() {
        return "PIONEIRO";
    }

    @Override
    public int getTargetValue() {
        return 1;
    }

    @Override
    public int calculateCurrentValue(User user) {
        boolean hasPrefs = user.getTravelPreference() != null 
                && user.getTravelPreference().getInterests() != null 
                && !user.getTravelPreference().getInterests().isEmpty();
        return hasPrefs ? 1 : 0;
    }
}
