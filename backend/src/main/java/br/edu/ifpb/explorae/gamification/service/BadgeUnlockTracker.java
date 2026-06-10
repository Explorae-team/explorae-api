package br.edu.ifpb.explorae.gamification.service;

import br.edu.ifpb.explorae.gamification.domain.Badge;
import java.util.ArrayList;
import java.util.List;

public class BadgeUnlockTracker {
    private static final ThreadLocal<List<Badge>> unlockedBadges = ThreadLocal.withInitial(ArrayList::new);

    public static void add(Badge badge) {
        unlockedBadges.get().add(badge);
    }

    public static List<Badge> getAndClear() {
        List<Badge> badges = new ArrayList<>(unlockedBadges.get());
        unlockedBadges.get().clear();
        return badges;
    }

    public static void clear() {
        unlockedBadges.get().clear();
    }
}
