package br.edu.ifpb.explorae.unit.service;

import br.edu.ifpb.explorae.domain.gamification.Badge;
import br.edu.ifpb.explorae.domain.gamification.UserBadge;
import br.edu.ifpb.explorae.domain.gamification.XpHistory;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.BadgeRepository;
import br.edu.ifpb.explorae.repository.UserBadgeRepository;
import br.edu.ifpb.explorae.repository.UserRepository;
import br.edu.ifpb.explorae.repository.XpHistoryRepository;
import br.edu.ifpb.explorae.service.GamificationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GamificationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private XpHistoryRepository xpHistoryRepository;

    @Mock
    private BadgeRepository badgeRepository;

    @Mock
    private UserBadgeRepository userBadgeRepository;

    @InjectMocks
    private GamificationService gamificationService;

    @Test
    @DisplayName("Deve adicionar XP e salvar no histórico sem subir de nível")
    void shouldAddXpAndSaveHistoryWithoutLevelUp() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).xp(0).level(1).build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // WHEN
        gamificationService.addXp(userId, 50, "Teste");

        // THEN
        assertThat(user.getXp()).isEqualTo(50);
        assertThat(user.getLevel()).isEqualTo(1);
        verify(xpHistoryRepository, times(1)).save(any(XpHistory.class));
        verify(userRepository, times(1)).save(user);
    }

    @Test
    @DisplayName("Deve subir de nível quando XP atingir o limite")
    void shouldLevelUpWhenXpThresholdReached() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        // Nível 1 -> 2: precisa de 100 XP (Total: 100 XP)
        User user = User.builder().id(userId).xp(90).level(1).build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // WHEN
        gamificationService.addXp(userId, 20, "Level Up");

        // THEN
        assertThat(user.getXp()).isEqualTo(110);
        assertThat(user.getLevel()).isEqualTo(2);
        verify(userRepository, times(1)).save(user);
    }

    @Test
    @DisplayName("Deve subir para o nível 3 somente ao atingir o limite cumulativo de 300 XP")
    void shouldLevelUpToLevel3WhenCumulativeThresholdReached() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        // Nível 2 -> 3: precisa de 300 XP totais acumulados
        User user = User.builder().id(userId).xp(280).level(2).build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // WHEN
        gamificationService.addXp(userId, 30, "Level Up");

        // THEN
        assertThat(user.getXp()).isEqualTo(310);
        assertThat(user.getLevel()).isEqualTo(3);
        verify(userRepository, times(1)).save(user);
    }

    @Test
    @DisplayName("Deve conceder medalha se o usuário ainda não a possui")
    void shouldAwardBadgeIfUserDoesNotHaveIt() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).build();
        Badge badge = Badge.builder().name("PIONEIRO").build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(badgeRepository.findByName("PIONEIRO")).thenReturn(Optional.of(badge));
        when(userBadgeRepository.existsByUserAndBadge(user, badge)).thenReturn(false);

        // WHEN
        gamificationService.awardBadge(userId, "PIONEIRO");

        // THEN
        verify(userBadgeRepository, times(1)).save(any(UserBadge.class));
    }

    @Test
    @DisplayName("Não deve conceder medalha duplicada")
    void shouldNotAwardDuplicateBadge() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).build();
        Badge badge = Badge.builder().name("PIONEIRO").build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(badgeRepository.findByName("PIONEIRO")).thenReturn(Optional.of(badge));
        when(userBadgeRepository.existsByUserAndBadge(user, badge)).thenReturn(true);

        // WHEN
        gamificationService.awardBadge(userId, "PIONEIRO");

        // THEN
        verify(userBadgeRepository, never()).save(any(UserBadge.class));
    }
}
