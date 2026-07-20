package br.edu.ifpb.explorae.unit.gamification.util;

import br.edu.ifpb.explorae.gamification.util.GamificationRules;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class GamificationRulesTest {

    @Test
    void getXpThresholdForLevel_validLevels_returnsCorrectThreshold() {
        assertEquals(0, GamificationRules.getXpThresholdForLevel(0));
        assertEquals(0, GamificationRules.getXpThresholdForLevel(1));
        assertEquals(100, GamificationRules.getXpThresholdForLevel(2));
        assertEquals(300, GamificationRules.getXpThresholdForLevel(3));
        assertEquals(600, GamificationRules.getXpThresholdForLevel(4));
        assertEquals(1000, GamificationRules.getXpThresholdForLevel(5));
    }

    @Test
    void getLevelName_validXp_returnsCorrectLevelName() {
        assertEquals("Explorador Bronze", GamificationRules.getLevelName(null));
        assertEquals("Explorador Bronze", GamificationRules.getLevelName(0));
        assertEquals("Explorador Bronze", GamificationRules.getLevelName(999));
        
        assertEquals("Explorador Prata", GamificationRules.getLevelName(1000));
        assertEquals("Explorador Prata", GamificationRules.getLevelName(1999));

        assertEquals("Explorador Ouro", GamificationRules.getLevelName(2000));
        assertEquals("Explorador Ouro", GamificationRules.getLevelName(2999));

        assertEquals("Explorador Platina", GamificationRules.getLevelName(3000));
        assertEquals("Explorador Platina", GamificationRules.getLevelName(5000));
    }
}
