package br.edu.ifpb.explorae.gamification.service.badge;

import br.edu.ifpb.explorae.user.domain.User;

public interface BadgeProgressStrategy {
    String getBadgeName();
    int getTargetValue();
    int calculateCurrentValue(User user);
}
