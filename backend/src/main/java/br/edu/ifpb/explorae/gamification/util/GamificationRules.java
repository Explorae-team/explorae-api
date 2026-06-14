package br.edu.ifpb.explorae.gamification.util;

public final class GamificationRules {
    
    private GamificationRules() {
        // Classe utilitária privada
    }

    /**
     * Fórmula RPG Cumulativa:
     * Nível 1 -> 2: 100 XP (Total: 100 XP)
     * Nível 2 -> 3: 200 XP (Total: 300 XP)
     * Nível 3 -> 4: 300 XP (Total: 600 XP)
     * Limite para nível L = 50 * L * (L - 1)
     */
    public static int getXpThresholdForLevel(int l) {
        if (l <= 1) return 0;
        return 50 * l * (l - 1);
    }

    /**
     * Determina o título/nível do explorador com base no XP total acumulado.
     */
    public static String getLevelName(Integer xp) {
        if (xp == null || xp < 1000) return "Explorador Bronze";
        if (xp < 2000) return "Explorador Prata";
        if (xp < 3000) return "Explorador Ouro";
        return "Explorador Platina";
    }
}
