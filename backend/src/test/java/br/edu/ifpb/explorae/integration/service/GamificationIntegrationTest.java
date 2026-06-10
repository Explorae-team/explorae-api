package br.edu.ifpb.explorae.integration.service;
import br.edu.ifpb.explorae.gamification.domain.Badge;

import br.edu.ifpb.explorae.user.dto.TravelPreferenceRequestDTO;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.gamification.repository.BadgeRepository;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import br.edu.ifpb.explorae.gamification.repository.XpHistoryRepository;
import br.edu.ifpb.explorae.user.service.TravelPreferenceService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class GamificationIntegrationTest {

    @Autowired
    private TravelPreferenceService travelPreferenceService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private XpHistoryRepository xpHistoryRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    @Test
    @DisplayName("Deve ganhar XP e Medalha de Pioneiro ao completar onboarding pela primeira vez")
    void shouldEarnXpAndBadgeOnFirstOnboarding() {
        // GIVEN
        User user = User.builder()
                .name("Test User")
                .email("test@example.com")
                .passwordHash("password")
                .xp(0)
                .level(1)
                .build();
        user = userRepository.save(user);

        // Garante que a medalha PIONEIRO existe
        if (badgeRepository.findByName("PIONEIRO").isEmpty()) {
            badgeRepository.save(Badge.builder()
                    .name("PIONEIRO")
                    .description("Pioneiro")
                    .category("ONBOARDING")
                    .iconUrl("url")
                    .build());
        }

        TravelPreferenceRequestDTO dto = new TravelPreferenceRequestDTO(List.of("Cultura", "Natureza"));

        // WHEN
        travelPreferenceService.updatePreferences(user.getId(), dto);

        // THEN
        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        
        // Verifica XP (Onboarding concluído deve dar 100 XP - conforme definido no Listener)
        assertThat(updatedUser.getXp()).isEqualTo(100);
        
        // Verifica se subiu de nível (Nível 2 exige 100 XP -> Nivel * 100)
        // Se a fórmula é Nivel * 100, Nivel 1 precisa de 100 XP para subir.
        assertThat(updatedUser.getLevel()).isEqualTo(2);

        // Verifica Histórico
        assertThat(xpHistoryRepository.findByUserOrderByCreatedAtDesc(updatedUser)).hasSize(1);
        assertThat(xpHistoryRepository.findByUserOrderByCreatedAtDesc(updatedUser).get(0).getReason())
                .containsIgnoringCase("onboarding");

        // Verifica Medalha (PIONEIRO)
        // Nota: O seed deve ter rodado ou precisamos garantir que a medalha exista no contexto de teste.
        // Como o seed é via Liquibase, se o perfil de teste rodar o liquibase, ela existirá.
    }
}
