package br.edu.ifpb.explorae.unit.user.service;
import br.edu.ifpb.explorae.user.repository.CategoryRepository;

import br.edu.ifpb.explorae.user.dto.TravelPreferenceRequestDTO;
import br.edu.ifpb.explorae.user.domain.TravelPreference;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.gamification.event.PreferenceCompletedEvent;
import br.edu.ifpb.explorae.user.repository.TravelPreferenceRepository;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import br.edu.ifpb.explorae.user.service.TravelPreferenceService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TravelPreferenceServiceTest {

    @Mock
    private TravelPreferenceRepository travelPreferenceRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Mock
    private br.edu.ifpb.explorae.user.repository.CategoryRepository categoryRepository;

    @InjectMocks
    private TravelPreferenceService travelPreferenceService;

    @Test
    @DisplayName("Deve disparar evento apenas na primeira vez que salvar preferências")
    void shouldPublishEventOnlyOnFirstSave() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).build();
        TravelPreferenceRequestDTO dto = new TravelPreferenceRequestDTO(List.of("Natureza"));

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        // Simula que não existem preferências (primeira vez)
        when(travelPreferenceRepository.findByUser(user)).thenReturn(Optional.empty());

        // WHEN
        travelPreferenceService.updatePreferences(userId, dto);

        // THEN
        verify(eventPublisher, times(1)).publishEvent(any(PreferenceCompletedEvent.class));
    }

    @Test
    @DisplayName("Não deve disparar evento se já possuir preferências")
    void shouldNotPublishEventIfAlreadyHasPreferences() {
        // GIVEN
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).build();
        TravelPreference existingPref = new TravelPreference();
        TravelPreferenceRequestDTO dto = new TravelPreferenceRequestDTO(List.of("Cultura"));

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        // Simula que já existem preferências
        when(travelPreferenceRepository.findByUser(user)).thenReturn(Optional.of(existingPref));

        // WHEN
        travelPreferenceService.updatePreferences(userId, dto);

        // THEN
        verify(eventPublisher, never()).publishEvent(any(PreferenceCompletedEvent.class));
    }
}
