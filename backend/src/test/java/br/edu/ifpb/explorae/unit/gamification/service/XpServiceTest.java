package br.edu.ifpb.explorae.unit.gamification.service;

import br.edu.ifpb.explorae.gamification.domain.XpHistory;
import br.edu.ifpb.explorae.gamification.dto.XpHistoryResponseDTO;
import br.edu.ifpb.explorae.gamification.event.UserLevelUpEvent;
import br.edu.ifpb.explorae.gamification.repository.XpHistoryRepository;
import br.edu.ifpb.explorae.gamification.service.XpService;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * NÍVEL DE TESTE: UNIDADE (Unit Testing)
 * TÉCNICA: Cobertura de Código Estrutural (Statement Coverage, Branch/Decision Coverage)
 *
 * OBJETO SOB TESTE (SUT): XpService
 * OBJETIVO: Atingir 100% de cobertura de instruções (C0) e ramificações (C1/Branch Coverage),
 *           garantindo o isolamento absoluto da unidade via Mocks (Mockito).
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Testes de Unidade - XpService (Cobertura de Código)")
class XpServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private XpHistoryRepository xpHistoryRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private XpService xpService;

    @Nested
    @DisplayName("Cenários de addXp (Adição de Experiência e Moedas)")
    class AddXpScenarios {

        @Test
        @DisplayName("[Ramo 1: Sucesso sem Level Up e sem Moedas] Deve adicionar XP padrão via overload de 3 parâmetros")
        void shouldAddXpViaOverloadWithoutCoinsAndWithoutLevelUp() {
            // GIVEN
            UUID userId = UUID.randomUUID();
            User user = User.builder().id(userId).xp(10).level(1).coins(50).build();
            when(userRepository.findById(userId)).thenReturn(Optional.of(user));

            // WHEN
            xpService.addXp(userId, 40, "Check-in simples");

            // THEN
            assertThat(user.getXp()).isEqualTo(50);
            assertThat(user.getLevel()).isEqualTo(1);
            assertThat(user.getCoins()).isEqualTo(50); // Moedas inalteradas

            verify(userRepository, times(1)).save(user);

            ArgumentCaptor<XpHistory> historyCaptor = ArgumentCaptor.forClass(XpHistory.class);
            verify(xpHistoryRepository, times(1)).save(historyCaptor.capture());
            XpHistory savedHistory = historyCaptor.getValue();
            assertThat(savedHistory.getAmount()).isEqualTo(40);
            assertThat(savedHistory.getCoins()).isEqualTo(0);
            assertThat(savedHistory.getReason()).isEqualTo("Check-in simples");

            // Sem subida de nível, nenhum evento disparado
            verify(eventPublisher, never()).publishEvent(any());
        }

        @Test
        @DisplayName("[Ramo 2: Sucesso com Level Up e Moedas Válidas] Deve adicionar XP, moedas e publicar evento de Level Up")
        void shouldAddXpAndCoinsWithLevelUpAndPublishEvent() {
            // GIVEN
            UUID userId = UUID.randomUUID();
            // Nível 1 -> 2 exige 100 XP
            User user = User.builder().id(userId).xp(90).level(1).coins(10).build();
            when(userRepository.findById(userId)).thenReturn(Optional.of(user));

            // WHEN
            xpService.addXp(userId, 30, 25, "Conquista de Rota");

            // THEN
            assertThat(user.getXp()).isEqualTo(120);
            assertThat(user.getLevel()).isEqualTo(2);
            assertThat(user.getCoins()).isEqualTo(35); // 10 + 25

            verify(userRepository, times(1)).save(user);

            ArgumentCaptor<XpHistory> historyCaptor = ArgumentCaptor.forClass(XpHistory.class);
            verify(xpHistoryRepository, times(1)).save(historyCaptor.capture());
            assertThat(historyCaptor.getValue().getCoins()).isEqualTo(25);

            // Verifica publicação de UserLevelUpEvent
            ArgumentCaptor<UserLevelUpEvent> eventCaptor = ArgumentCaptor.forClass(UserLevelUpEvent.class);
            verify(eventPublisher, times(1)).publishEvent(eventCaptor.capture());
            UserLevelUpEvent publishedEvent = eventCaptor.getValue();
            assertThat(publishedEvent.userId()).isEqualTo(userId);
            assertThat(publishedEvent.newLevel()).isEqualTo(2);
        }

        @Test
        @DisplayName("[Ramo 3: Moedas Nulas] Deve ignorar incremento de moedas e salvar 0 moedas no histórico")
        void shouldHandleNullCoinsGracefully() {
            // GIVEN
            UUID userId = UUID.randomUUID();
            User user = User.builder().id(userId).xp(0).level(1).coins(20).build();
            when(userRepository.findById(userId)).thenReturn(Optional.of(user));

            // WHEN
            xpService.addXp(userId, 50, null, "Bônus sem moedas");

            // THEN
            assertThat(user.getCoins()).isEqualTo(20);
            verify(userRepository, times(1)).save(user);

            ArgumentCaptor<XpHistory> historyCaptor = ArgumentCaptor.forClass(XpHistory.class);
            verify(xpHistoryRepository, times(1)).save(historyCaptor.capture());
            assertThat(historyCaptor.getValue().getCoins()).isEqualTo(0);
        }

        @Test
        @DisplayName("[Ramo 4: Moedas Negativas ou Zero] Não deve incrementar moedas se valor <= 0")
        void shouldNotIncrementCoinsWhenZeroOrNegative() {
            // GIVEN
            UUID userId = UUID.randomUUID();
            User user = User.builder().id(userId).xp(0).level(1).coins(50).build();
            when(userRepository.findById(userId)).thenReturn(Optional.of(user));

            // WHEN
            xpService.addXp(userId, 20, 0, "Zero moedas");

            // THEN
            assertThat(user.getCoins()).isEqualTo(50);
            verify(userRepository, times(1)).save(user);

            ArgumentCaptor<XpHistory> historyCaptor = ArgumentCaptor.forClass(XpHistory.class);
            verify(xpHistoryRepository, times(1)).save(historyCaptor.capture());
            assertThat(historyCaptor.getValue().getCoins()).isEqualTo(0);
        }

        @Test
        @DisplayName("[Ramo 5: Usuário Inexistente] Deve lançar RuntimeException ao falhar busca de usuário")
        void shouldThrowExceptionWhenUserNotFoundForAddXp() {
            // GIVEN
            UUID userId = UUID.randomUUID();
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            // WHEN / THEN
            assertThatThrownBy(() -> xpService.addXp(userId, 100, 10, "Ganho Fantasma"))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessage("Usuário não encontrado para ganho de XP");

            verify(userRepository, never()).save(any());
            verify(xpHistoryRepository, never()).save(any());
            verify(eventPublisher, never()).publishEvent(any());
        }
    }

    @Nested
    @DisplayName("Cenários de addCoins (Adição de Moedas Isolada)")
    class AddCoinsScenarios {

        @Test
        @DisplayName("[Ramo 1: Amount Nulo] Deve retornar imediatamente sem interagir com repositórios")
        void shouldReturnEarlyWhenCoinsAmountIsNull() {
            UUID userId = UUID.randomUUID();

            xpService.addCoins(userId, null);

            verifyNoInteractions(userRepository);
        }

        @Test
        @DisplayName("[Ramo 2: Amount Menor ou Igual a Zero] Deve retornar imediatamente sem interagir com repositórios")
        void shouldReturnEarlyWhenCoinsAmountIsZeroOrNegative() {
            UUID userId = UUID.randomUUID();

            xpService.addCoins(userId, 0);
            xpService.addCoins(userId, -15);

            verifyNoInteractions(userRepository);
        }

        @Test
        @DisplayName("[Ramo 3: Usuário Inexistente] Deve lançar RuntimeException se usuário não for localizado")
        void shouldThrowExceptionWhenUserNotFoundForAddCoins() {
            UUID userId = UUID.randomUUID();
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> xpService.addCoins(userId, 50))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessage("Usuário não encontrado para ganho de moedas");

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("[Ramo 4: Sucesso] Deve somar moedas e persistir usuário")
        void shouldAddCoinsSuccessfully() {
            UUID userId = UUID.randomUUID();
            User user = User.builder().id(userId).coins(100).build();
            when(userRepository.findById(userId)).thenReturn(Optional.of(user));

            xpService.addCoins(userId, 50);

            assertThat(user.getCoins()).isEqualTo(150);
            verify(userRepository, times(1)).save(user);
        }
    }

    @Nested
    @DisplayName("Cenários de getXpHistory (Histórico de XP)")
    class GetXpHistoryScenarios {

        @Test
        @DisplayName("[Ramo 1: Usuário Inexistente] Deve lançar RuntimeException se usuário não existir")
        void shouldThrowExceptionWhenUserNotFoundForGetHistory() {
            UUID userId = UUID.randomUUID();
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> xpService.getXpHistory(userId))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessage("Usuário não encontrado");

            verifyNoInteractions(xpHistoryRepository);
        }

        @Test
        @DisplayName("[Ramo 2: Sucesso com Mapeamento Completo] Deve recuperar registros e mapear para DTOs")
        void shouldReturnMappedXpHistoryList() {
            // GIVEN
            UUID userId = UUID.randomUUID();
            User user = User.builder().id(userId).build();
            when(userRepository.findById(userId)).thenReturn(Optional.of(user));

            UUID h1Id = UUID.randomUUID();
            LocalDateTime now = LocalDateTime.now();
            XpHistory history1 = XpHistory.builder()
                    .id(h1Id)
                    .user(user)
                    .amount(100)
                    .coins(20)
                    .reason("Visita a Museu")
                    .createdAt(now)
                    .build();

            when(xpHistoryRepository.findByUserOrderByCreatedAtDesc(user))
                    .thenReturn(List.of(history1));

            // WHEN
            List<XpHistoryResponseDTO> result = xpService.getXpHistory(userId);

            // THEN
            assertThat(result).hasSize(1);
            XpHistoryResponseDTO dto = result.getFirst();
            assertThat(dto.id()).isEqualTo(h1Id);
            assertThat(dto.amount()).isEqualTo(100);
            assertThat(dto.coins()).isEqualTo(20);
            assertThat(dto.reason()).isEqualTo("Visita a Museu");
            assertThat(dto.createdAt()).isEqualTo(now);
        }
    }
}
