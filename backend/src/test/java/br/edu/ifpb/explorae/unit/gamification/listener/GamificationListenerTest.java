package br.edu.ifpb.explorae.unit.gamification.listener;

import br.edu.ifpb.explorae.gamification.event.PreferenceCompletedEvent;
import br.edu.ifpb.explorae.gamification.service.GamificationService;
import br.edu.ifpb.explorae.gamification.listener.GamificationListener;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GamificationListenerTest {

    @Mock
    private GamificationService gamificationService;

    @InjectMocks
    private GamificationListener gamificationListener;

    @Test
    @DisplayName("Deve chamar GamificationService ao receber evento de preferências concluídas")
    void shouldCallGamificationServiceOnPreferenceCompleted() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        PreferenceCompletedEvent event = new PreferenceCompletedEvent(userId);

        // WHEN
        gamificationListener.handlePreferenceCompleted(event);

        // THEN
        verify(gamificationService, times(1)).addXp(eq(userId), eq(100), anyString());
        verify(gamificationService, times(1)).awardBadge(eq(userId), eq("PIONEIRO"));
    }
}
