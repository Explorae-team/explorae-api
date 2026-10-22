package br.edu.ifpb.explorae.attraction.service;

import br.edu.ifpb.explorae.attraction.domain.Attraction;
import br.edu.ifpb.explorae.attraction.domain.GeoCoordinate;
import br.edu.ifpb.explorae.attraction.domain.UserInteraction;
import br.edu.ifpb.explorae.attraction.dto.CheckInRequestDTO;
import br.edu.ifpb.explorae.attraction.dto.ProximityCheckInResponseDTO;
import br.edu.ifpb.explorae.attraction.repository.AttractionRepository;
import br.edu.ifpb.explorae.attraction.repository.UserInteractionRepository;
import br.edu.ifpb.explorae.common.exception.BusinessException;
import br.edu.ifpb.explorae.common.exception.ResourceNotFoundException;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Testes unitários para o ProximityCheckInService desenvolvidos através do ciclo Red-Green-Refactor do TDD.
 */
@ExtendWith(MockitoExtension.class)
class ProximityCheckInServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AttractionRepository attractionRepository;

    @Mock
    private UserInteractionRepository userInteractionRepository;

    @Mock
    private GeoDistanceCalculator geoDistanceCalculator;

    @InjectMocks
    private ProximityCheckInService checkInService;

    private UUID userId;
    private UUID attractionId;
    private User user;
    private Attraction attraction;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        attractionId = UUID.randomUUID();

        user = User.builder()
                .id(userId)
                .name("Explorador Paraibano")
                .xp(100)
                .coins(20)
                .level(1)
                .build();

        attraction = Attraction.builder()
                .id(attractionId)
                .name("Farol do Cabo Branco")
                .latitude(-7.1488)
                .longitude(-34.7963)
                .category("HISTORICO")
                .shortDescription("Ponto mais oriental das Américas")
                .build();
    }

    @Test
    @DisplayName("Ciclo 1 & 2 (TDD): Deve executar check-in com sucesso quando turista estiver a menos de 100m da atração")
    void shouldExecuteCheckInSuccessfullyWhenWithin100Meters() {
        // Arrange: Turista a 35 metros do Farol
        CheckInRequestDTO request = new CheckInRequestDTO(userId, attractionId, -7.1485, -34.7961);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(attractionRepository.findById(attractionId)).thenReturn(Optional.of(attraction));
        when(geoDistanceCalculator.calculateDistanceInMeters(any(GeoCoordinate.class), any(GeoCoordinate.class)))
                .thenReturn(35.4);
        when(userInteractionRepository.existsByUserIdAndAttractionIdAndInteractionTypeAndCreatedAtAfter(
                eq(userId), eq(attractionId), eq("CHECK_IN"), any(LocalDateTime.class)))
                .thenReturn(false);

        UserInteraction savedInteraction = UserInteraction.builder()
                .id(UUID.randomUUID())
                .user(user)
                .attraction(attraction)
                .interactionType("CHECK_IN")
                .createdAt(LocalDateTime.now())
                .build();
        when(userInteractionRepository.save(any(UserInteraction.class))).thenReturn(savedInteraction);

        // Act
        ProximityCheckInResponseDTO response = checkInService.executeCheckIn(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.attractionName()).isEqualTo("Farol do Cabo Branco");
        assertThat(response.distanceInMeters()).isEqualTo(35.4);
        assertThat(response.xpEarned()).isEqualTo(50);
        assertThat(response.coinsEarned()).isEqualTo(10);

        // Verifica premiação do usuário (+50 XP e +10 Coins)
        assertThat(user.getXp()).isEqualTo(150);
        assertThat(user.getCoins()).isEqualTo(30);

        verify(userRepository).save(user);
        verify(userInteractionRepository).save(any(UserInteraction.class));
    }

    @Test
    @DisplayName("Ciclo 2 (TDD): Deve rejeitar check-in e lançar BusinessException quando turista estiver fora do raio de 100m")
    void shouldRejectCheckInWhenUserIsTooFarFromAttraction() {
        // Arrange: Turista a 450 metros do Farol
        CheckInRequestDTO request = new CheckInRequestDTO(userId, attractionId, -7.1528, -34.7932);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(attractionRepository.findById(attractionId)).thenReturn(Optional.of(attraction));
        when(geoDistanceCalculator.calculateDistanceInMeters(any(GeoCoordinate.class), any(GeoCoordinate.class)))
                .thenReturn(450.0);

        // Act & Assert
        assertThatThrownBy(() -> checkInService.executeCheckIn(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("450,0 metros")
                .hasMessageContaining("máximo 100 metros");

        // Garante que o usuário não recebeu XP e nenhuma interação foi salva
        assertThat(user.getXp()).isEqualTo(100);
        assertThat(user.getCoins()).isEqualTo(20);
        verify(userRepository, never()).save(any());
        verify(userInteractionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ciclo 3 (TDD): Deve prevenir check-in duplicado no mesmo dia (Anti-Fraude)")
    void shouldPreventDuplicateCheckInOnSameDay() {
        // Arrange: Turista dentro do raio (50m), mas já realizou check-in hoje
        CheckInRequestDTO request = new CheckInRequestDTO(userId, attractionId, -7.1487, -34.7962);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(attractionRepository.findById(attractionId)).thenReturn(Optional.of(attraction));
        when(geoDistanceCalculator.calculateDistanceInMeters(any(GeoCoordinate.class), any(GeoCoordinate.class)))
                .thenReturn(50.0);
        when(userInteractionRepository.existsByUserIdAndAttractionIdAndInteractionTypeAndCreatedAtAfter(
                eq(userId), eq(attractionId), eq("CHECK_IN"), any(LocalDateTime.class)))
                .thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> checkInService.executeCheckIn(request))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Você já realizou check-in nesta atração hoje. Volte amanhã para explorar novamente!");

        verify(userRepository, never()).save(user);
        verify(userInteractionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ciclo 1 (TDD): Deve falhar com 404 quando o usuário não for encontrado")
    void shouldThrowExceptionWhenUserNotFound() {
        CheckInRequestDTO request = new CheckInRequestDTO(userId, attractionId, -7.1488, -34.7963);
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> checkInService.executeCheckIn(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Usuário não encontrado.");
    }

    @Test
    @DisplayName("Ciclo 1 (TDD): Deve falhar com 404 quando a atração não for encontrada")
    void shouldThrowExceptionWhenAttractionNotFound() {
        CheckInRequestDTO request = new CheckInRequestDTO(userId, attractionId, -7.1488, -34.7963);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(attractionRepository.findById(attractionId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> checkInService.executeCheckIn(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Atração turística não encontrada.");
    }

    @Test
    @DisplayName("Ciclo 2 (TDD - Teste de Fronteira): Deve aceitar check-in exatamente no limite de 100.0 metros")
    void shouldAcceptCheckInExactlyAt100MetersBoundary() {
        CheckInRequestDTO request = new CheckInRequestDTO(userId, attractionId, -7.1488, -34.7963);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(attractionRepository.findById(attractionId)).thenReturn(Optional.of(attraction));
        when(geoDistanceCalculator.calculateDistanceInMeters(any(), any())).thenReturn(100.0);
        when(userInteractionRepository.existsByUserIdAndAttractionIdAndInteractionTypeAndCreatedAtAfter(
                any(), any(), any(), any())).thenReturn(false);

        UserInteraction savedInteraction = UserInteraction.builder()
                .id(UUID.randomUUID())
                .user(user)
                .attraction(attraction)
                .createdAt(LocalDateTime.now())
                .build();
        when(userInteractionRepository.save(any())).thenReturn(savedInteraction);

        ProximityCheckInResponseDTO response = checkInService.executeCheckIn(request);

        assertThat(response).isNotNull();
        assertThat(response.distanceInMeters()).isEqualTo(100.0);
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("Ciclo 2 (TDD - Teste de Fronteira): Deve rejeitar check-in imediatamente acima do limite (100.1 metros)")
    void shouldRejectCheckInImmediatelyAboveBoundary() {
        CheckInRequestDTO request = new CheckInRequestDTO(userId, attractionId, -7.1488, -34.7963);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(attractionRepository.findById(attractionId)).thenReturn(Optional.of(attraction));
        when(geoDistanceCalculator.calculateDistanceInMeters(any(), any())).thenReturn(100.1);

        assertThatThrownBy(() -> checkInService.executeCheckIn(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("100,1 metros");

        verify(userRepository, never()).save(any());
    }
}
