package br.edu.ifpb.explorae.integration.service;

import br.edu.ifpb.explorae.api.dto.AttractionResponseDTO;
import br.edu.ifpb.explorae.domain.attraction.Attraction;
import br.edu.ifpb.explorae.domain.attraction.UserInteraction;
import br.edu.ifpb.explorae.domain.user.Category;
import br.edu.ifpb.explorae.domain.user.TravelPreference;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.AttractionRepository;
import br.edu.ifpb.explorae.repository.CategoryRepository;
import br.edu.ifpb.explorae.repository.TravelPreferenceRepository;
import br.edu.ifpb.explorae.repository.UserInteractionRepository;
import br.edu.ifpb.explorae.repository.UserRepository;
import br.edu.ifpb.explorae.service.AttractionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class RecommendationIntegrationTest {

    @Autowired
    private AttractionService attractionService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AttractionRepository attractionRepository;

    @Autowired
    private TravelPreferenceRepository travelPreferenceRepository;

    @Autowired
    private UserInteractionRepository userInteractionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    @DisplayName("Deve priorizar atração com match híbrido (explícito e implícito)")
    void shouldPrioritizeHybridMatch() {
        // GIVEN
        User user = User.builder()
                .name("Test User")
                .email("test-rec@example.com")
                .passwordHash("password")
                .xp(0)
                .level(1)
                .build();
        user = userRepository.save(user);

        Attraction a1 = attractionRepository.save(Attraction.builder()
                .name("Praia do Jacaré")
                .category("Praia")
                .shortDescription("Pôr do sol ao som do Bolero de Ravel")
                .latitude(-7.0347)
                .longitude(-34.8465)
                .isPartner(true)
                .averageRating(4.5)
                .build());

        Attraction a2 = attractionRepository.save(Attraction.builder()
                .name("Centro Histórico")
                .category("Histórico")
                .shortDescription("Igrejas e construções antigas")
                .latitude(-7.1150)
                .longitude(-34.8631)
                .isPartner(false)
                .averageRating(4.0)
                .build());

        Category cat = Category.builder()
                .slug("Praia")
                .name("Praia")
                .parentCategory("Natureza")
                .build();
        cat = categoryRepository.save(cat);
        
        TravelPreference pref = TravelPreference.builder()
                .user(user)
                .interests(java.util.Set.of(cat))
                .build();
        travelPreferenceRepository.save(pref);

        userInteractionRepository.save(UserInteraction.builder()
                .user(user)
                .attraction(a1)
                .interactionType("VIEW")
                .build());

        // WHEN
        Page<AttractionResponseDTO> recommendations = attractionService.getRecommendations(user, null, null, PageRequest.of(0, 10));

        // THEN
        assertThat(recommendations.getContent()).isNotEmpty();
        assertThat(recommendations.getContent().get(0).name()).isEqualTo("Praia do Jacaré");
    }

    @Test
    @DisplayName("Deve calcular corretamente a distância caso localização seja fornecida")
    void shouldCalculateDistanceWhenLocationProvided() {
        // GIVEN
        User user = userRepository.save(User.builder()
                .name("Dist User")
                .email("test-dist@example.com")
                .passwordHash("password")
                .xp(0)
                .level(1)
                .build());

        Attraction a1 = attractionRepository.save(Attraction.builder()
                .name("Local Perto")
                .category("Cultura")
                .shortDescription("Fica do lado")
                .latitude(-7.1000) 
                .longitude(-34.8000)
                .build());

        // WHEN
        Page<AttractionResponseDTO> recommendations = attractionService.getRecommendations(user, -7.1000, -34.8000, PageRequest.of(0, 10));

        // THEN
        assertThat(recommendations.getContent()).isNotEmpty();
        AttractionResponseDTO dto = recommendations.getContent().stream()
                .filter(a -> a.name().equals("Local Perto"))
                .findFirst()
                .orElseThrow();
        assertThat(dto.distance()).isEqualTo("0,0 km");
    }
}
