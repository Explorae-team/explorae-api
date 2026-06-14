package br.edu.ifpb.explorae.unit.gamification.service;

import br.edu.ifpb.explorae.gamification.domain.Badge;
import br.edu.ifpb.explorae.gamification.domain.UserBadge;
import br.edu.ifpb.explorae.gamification.repository.BadgeRepository;
import br.edu.ifpb.explorae.gamification.repository.UserBadgeRepository;
import br.edu.ifpb.explorae.gamification.service.BadgeService;
import br.edu.ifpb.explorae.gamification.service.BadgeUnlockTracker;
import br.edu.ifpb.explorae.gamification.service.badge.BadgeProgressStrategy;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BadgeServiceTest {

    @Mock
    private BadgeRepository badgeRepository;

    @Mock
    private UserBadgeRepository userBadgeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BadgeUnlockTracker badgeUnlockTracker;

    @Mock
    private BadgeProgressStrategy mockStrategy;

    private BadgeService badgeService;

    @BeforeEach
    void setUp() {
        lenient().when(mockStrategy.getBadgeName()).thenReturn("PIONEIRO");
        badgeService = new BadgeService(badgeRepository, userBadgeRepository, userRepository, badgeUnlockTracker, List.of(mockStrategy));
    }

    @Test
    @DisplayName("Deve conceder medalha se o usuário ainda não a possui e atingiu o objetivo")
    void shouldAwardBadgeIfTargetReached() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).build();
        Badge badge = Badge.builder().name("PIONEIRO").build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(badgeRepository.findByName("PIONEIRO")).thenReturn(Optional.of(badge));
        when(userBadgeRepository.existsByUserAndBadge(user, badge)).thenReturn(false);

        when(mockStrategy.calculateCurrentValue(user)).thenReturn(10);
        when(mockStrategy.getTargetValue()).thenReturn(10);

        // WHEN
        badgeService.evaluateAndAward(userId, "PIONEIRO");

        // THEN
        verify(userBadgeRepository, times(1)).save(any(UserBadge.class));
        verify(badgeUnlockTracker, times(1)).add(badge);
    }

    @Test
    @DisplayName("Não deve conceder medalha se o objetivo não foi atingido")
    void shouldNotAwardBadgeIfTargetNotReached() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).build();
        Badge badge = Badge.builder().name("PIONEIRO").build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(badgeRepository.findByName("PIONEIRO")).thenReturn(Optional.of(badge));
        when(userBadgeRepository.existsByUserAndBadge(user, badge)).thenReturn(false);

        when(mockStrategy.calculateCurrentValue(user)).thenReturn(5);
        when(mockStrategy.getTargetValue()).thenReturn(10);

        // WHEN
        badgeService.evaluateAndAward(userId, "PIONEIRO");

        // THEN
        verify(userBadgeRepository, never()).save(any(UserBadge.class));
        verify(badgeUnlockTracker, never()).add(badge);
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
        badgeService.evaluateAndAward(userId, "PIONEIRO");

        // THEN
        verify(userBadgeRepository, never()).save(any(UserBadge.class));
    }
}
