package br.edu.ifpb.explorae.unit.gamification.util;

import br.edu.ifpb.explorae.gamification.util.GamificationRules;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * NÍVEL DE TESTE: UNIDADE (Unit Testing)
 * TÉCNICA: Cobertura de Código Estrutural (Statement Coverage, Branch/Decision Coverage)
 *
 * OBJETO SOB TESTE (SUT): GamificationRules
 * OBJETIVO: 100% de cobertura de ramos e instruções na classe utilitária de regras de gamificação.
 */
@DisplayName("Testes de Unidade - GamificationRules (Cobertura Estrutural)")
class GamificationRulesTest {

    @Test
    @DisplayName("Deve garantir cobertura do construtor privado via Reflection")
    void shouldCoverPrivateConstructor() throws Exception {
        Constructor<GamificationRules> constructor = GamificationRules.class.getDeclaredConstructor();
        constructor.setAccessible(true);
        GamificationRules instance = constructor.newInstance();
        assertThat(instance).isNotNull();
    }

    @Nested
    @DisplayName("Testes da Fórmula getXpThresholdForLevel(l)")
    class XpThresholdTests {

        @ParameterizedTest(name = "Nível {0} deve retornar 0 de threshold mínimo")
        @ValueSource(ints = {-5, 0, 1})
        @DisplayName("[Ramo 1: l <= 1] Retorna 0 para níveis inferiores ou iguais a 1")
        void shouldReturnZeroForLevelsLessOrEqualToOne(int level) {
            assertThat(GamificationRules.getXpThresholdForLevel(level)).isEqualTo(0);
        }

        @ParameterizedTest(name = "Nível {0} deve exigir threshold cumulativo de {1} XP")
        @CsvSource({
                "2, 100",   // 50 * 2 * 1 = 100
                "3, 300",   // 50 * 3 * 2 = 300
                "4, 600",   // 50 * 4 * 3 = 600
                "5, 1000"   // 50 * 5 * 4 = 1000
        })
        @DisplayName("[Ramo 2: l > 1] Retorna a fórmula quadrática 50 * l * (l - 1)")
        void shouldReturnQuadraticXpThresholdForLevelsGreaterThanOne(int level, int expectedXp) {
            assertThat(GamificationRules.getXpThresholdForLevel(level)).isEqualTo(expectedXp);
        }
    }

    @Nested
    @DisplayName("Testes de Título de Nível getLevelName(xp)")
    class LevelNameTests {

        @Test
        @DisplayName("[Ramo 1: XP Nulo] Retorna Explorador Bronze")
        void shouldReturnBronzeWhenXpIsNull() {
            assertThat(GamificationRules.getLevelName(null)).isEqualTo("Explorador Bronze");
        }

        @ParameterizedTest(name = "XP {0} deve retornar Explorador Bronze")
        @ValueSource(ints = {0, 500, 999})
        @DisplayName("[Ramo 2: XP < 1000] Retorna Explorador Bronze")
        void shouldReturnBronzeForXpBelow1000(int xp) {
            assertThat(GamificationRules.getLevelName(xp)).isEqualTo("Explorador Bronze");
        }

        @ParameterizedTest(name = "XP {0} deve retornar Explorador Prata")
        @ValueSource(ints = {1000, 1500, 1999})
        @DisplayName("[Ramo 3: 1000 <= XP < 2000] Retorna Explorador Prata")
        void shouldReturnPrataForXpBetween1000And1999(int xp) {
            assertThat(GamificationRules.getLevelName(xp)).isEqualTo("Explorador Prata");
        }

        @ParameterizedTest(name = "XP {0} deve retornar Explorador Ouro")
        @ValueSource(ints = {2000, 2500, 2999})
        @DisplayName("[Ramo 4: 2000 <= XP < 3000] Retorna Explorador Ouro")
        void shouldReturnOuroForXpBetween2000And2999(int xp) {
            assertThat(GamificationRules.getLevelName(xp)).isEqualTo("Explorador Ouro");
        }

        @ParameterizedTest(name = "XP {0} deve retornar Explorador Platina")
        @ValueSource(ints = {3000, 4500, 10000})
        @DisplayName("[Ramo 5: XP >= 3000] Retorna Explorador Platina")
        void shouldReturnPlatinaForXpFrom3000(int xp) {
            assertThat(GamificationRules.getLevelName(xp)).isEqualTo("Explorador Platina");
        }
    }
}
