package br.edu.ifpb.explorae.unit.user.domain;

import br.edu.ifpb.explorae.user.domain.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * NÍVEL DE TESTE: UNIDADE (Unit Testing)
 * TÉCNICA: Cobertura de Código Estrutural (Statement & Branch Coverage)
 *
 * OBJETO SOB TESTE (SUT): User.addXp(Integer amount)
 * OBJETIVO: 100% de cobertura de todas as ramificações e condições booleanas do método de domínio.
 */
@DisplayName("Testes de Unidade - User.addXp (Cobertura Estrutural de Domínio)")
class UserXpUnitTest {

    @Test
    @DisplayName("[Ramo 1: Amount Nulo] Retorna false e não altera XP nem Nível")
    void shouldReturnFalseWhenAmountIsNull() {
        User user = User.builder().xp(50).level(1).build();

        boolean leveledUp = user.addXp(null);

        assertThat(leveledUp).isFalse();
        assertThat(user.getXp()).isEqualTo(50);
        assertThat(user.getLevel()).isEqualTo(1);
    }

    @ParameterizedTest(name = "Amount {0} deve retornar false")
    @ValueSource(ints = {0, -1, -50})
    @DisplayName("[Ramo 2: Amount Menor ou Igual a Zero] Retorna false sem alterar estado")
    void shouldReturnFalseWhenAmountIsZeroOrNegative(int amount) {
        User user = User.builder().xp(20).level(1).build();

        boolean leveledUp = user.addXp(amount);

        assertThat(leveledUp).isFalse();
        assertThat(user.getXp()).isEqualTo(20);
        assertThat(user.getLevel()).isEqualTo(1);
    }

    @Test
    @DisplayName("[Ramo 3: Campos Iniciais Nulos] Trata level e xp nulos usando defaults 1 e 0")
    void shouldHandleNullInitialLevelAndXpGracefully() {
        User user = new User();
        user.setLevel(null);
        user.setXp(null);

        boolean leveledUp = user.addXp(50);

        assertThat(leveledUp).isFalse();
        assertThat(user.getXp()).isEqualTo(50);
        assertThat(user.getLevel()).isNull(); // Não subiu de nível, nível original permaneceu
    }

    @Test
    @DisplayName("[Ramo 4: Sem Level Up] Acumula XP mas permanece no mesmo nível")
    void shouldAccumulateXpWithoutLevelUp() {
        User user = User.builder().xp(10).level(1).build();

        boolean leveledUp = user.addXp(30);

        assertThat(leveledUp).isFalse();
        assertThat(user.getXp()).isEqualTo(40);
        assertThat(user.getLevel()).isEqualTo(1);
    }

    @Test
    @DisplayName("[Ramo 5: Level Up Simples] Sobe exatamente 1 nível quando atinge o threshold")
    void shouldLevelUpByOneLevelWhenThresholdReached() {
        // Nível 1 -> 2 exige 100 XP
        User user = User.builder().xp(90).level(1).build();

        boolean leveledUp = user.addXp(10);

        assertThat(leveledUp).isTrue();
        assertThat(user.getXp()).isEqualTo(100);
        assertThat(user.getLevel()).isEqualTo(2);
    }

    @Test
    @DisplayName("[Ramo 6: Salto Multi-nível] Sobe múltiplos níveis em um único ganho massivo de XP")
    void shouldHandleMultiLevelJumpWithLargeXpGain() {
        // Nível 1: 0 XP
        // Nível 2: 100 XP
        // Nível 3: 300 XP
        // Nível 4: 600 XP
        User user = User.builder().xp(0).level(1).build();

        boolean leveledUp = user.addXp(650);

        assertThat(leveledUp).isTrue();
        assertThat(user.getXp()).isEqualTo(650);
        assertThat(user.getLevel()).isEqualTo(4);
    }
}
