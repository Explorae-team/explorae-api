package br.edu.ifpb.explorae.gamification.service;

import br.edu.ifpb.explorae.gamification.domain.Badge;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import java.util.ArrayList;
import java.util.List;

@Component
@RequestScope
public class BadgeUnlockTracker {
    private final List<Badge> unlockedBadges = new ArrayList<>();

    public void add(Badge badge) {
        unlockedBadges.add(badge);
    }

    public List<Badge> getAndClear() {
        List<Badge> badges = new ArrayList<>(unlockedBadges);
        unlockedBadges.clear();
        return badges;
    }

    public void clear() {
        unlockedBadges.clear();
    }
}
