package br.edu.ifpb.explorae.service.badge;

import br.edu.ifpb.explorae.domain.user.User;

public interface BadgeProgressStrategy {
    String getBadgeName();
    int getTargetValue();
    int calculateCurrentValue(User user);
}
