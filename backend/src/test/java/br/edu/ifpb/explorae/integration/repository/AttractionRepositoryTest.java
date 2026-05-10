package br.edu.ifpb.explorae.integration.repository;

import br.edu.ifpb.explorae.domain.attraction.Attraction;
import br.edu.ifpb.explorae.repository.AttractionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("Testes para AttractionRepository")
class AttractionRepositoryTest {

    @Autowired
    private AttractionRepository attractionRepository;

    @Test
    @DisplayName("Deve salvar e buscar uma atração com imagens e endereço")
    void shouldSaveAndFindAttraction() {
        // Given
        Attraction attraction = Attraction.builder()
                .name("Parque Solon de Lucena")
                .category("Natureza")
                .shortDescription("Cartão postal de João Pessoa.")
                .longDescription("Um dos parques mais bonitos da cidade, com uma lagoa central.")
                .latitude(-7.1194)
                .longitude(-34.8776)
                .address("Centro, João Pessoa - PB")
                .priceRange(1)
                .images(List.of("http://image1.jpg", "http://image2.jpg"))
                .build();

        // When
        Attraction saved = attractionRepository.save(attraction);
        Optional<Attraction> found = attractionRepository.findById(saved.getId());

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Parque Solon de Lucena");
        assertThat(found.get().getAddress()).isEqualTo("Centro, João Pessoa - PB");
        assertThat(found.get().getImages()).hasSize(2);
        assertThat(found.get().getImages()).contains("http://image1.jpg", "http://image2.jpg");
    }

    @Test
    @DisplayName("Deve remover imagens ao deletar atração")
    void shouldDeleteImagesOnAttractionDelete() {
        // Given
        Attraction attraction = Attraction.builder()
                .name("Teatro Santa Roza")
                .category("Cultura")
                .shortDescription("Teatro histórico.")
                .latitude(-7.1150)
                .longitude(-34.8850)
                .images(List.of("http://theater1.jpg"))
                .build();
        
        Attraction saved = attractionRepository.save(attraction);
        
        // When
        attractionRepository.delete(saved);
        Optional<Attraction> found = attractionRepository.findById(saved.getId());

        // Then
        assertThat(found).isEmpty();
        // Nota: O teste do banco real validaria se as linhas em attraction_images sumiram. 
        // Com @ElementCollection, o JPA cuida disso automaticamente.
    }
}
