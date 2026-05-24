package br.edu.ifpb.explorae.service.badge;

import br.edu.ifpb.explorae.domain.user.User;
import org.springframework.stereotype.Component;

@Component
public class LendaUrbanaBadgeStrategy implements BadgeProgressStrategy {

    @Override
    public String getBadgeName() {
        return "LENDA_URBANA";
    }

    @Override
    public int getTargetValue() {
        return 10;
    }

    @Override
    public int calculateCurrentValue(User user) {
        return user.getLevel() != null ? user.getLevel() : 1;
    }
}
