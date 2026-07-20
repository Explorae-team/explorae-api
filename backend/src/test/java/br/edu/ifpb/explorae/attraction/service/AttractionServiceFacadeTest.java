package br.edu.ifpb.explorae.attraction.service;

import br.edu.ifpb.explorae.attraction.dto.AttractionResponseDTO;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AttractionServiceFacadeTest {

    @Mock
    private AttractionSearchService searchService;

    @InjectMocks
    private AttractionServiceFacade service;

    @Test
    @DisplayName("Deve listar atrações paginadas corretamente")
    void shouldListAttractionsPaginated() {
        // Arrange
        AttractionResponseDTO dto = new AttractionResponseDTO(UUID.randomUUID(), "Teste", null, null, null, null, null, null, null, null);
        Pageable pageable = PageRequest.of(0, 5);
        Page<AttractionResponseDTO> page = new PageImpl<>(List.of(dto), pageable, 1);
        
        when(searchService.findAll(null, null, null, null, null, null, null, null, pageable)).thenReturn(page);

        // Act
        Page<AttractionResponseDTO> result = service.findAll(null, null, null, null, null, null, null, null, pageable);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).name()).isEqualTo("Teste");
    }
}
