package br.edu.ifpb.explorae.attraction.controller;

import br.edu.ifpb.explorae.attraction.service.AttractionServiceFacade;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import br.edu.ifpb.explorae.attraction.dto.AttractionResponseDTO;
import java.util.List;
import java.util.UUID;
import org.springframework.http.MediaType;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
class AttractionControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @MockitoBean
    private AttractionServiceFacade attractionService;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    @DisplayName("Deve retornar 200 ao listar atrações (acesso público)")
    void shouldReturn200WhenListingAttractions() throws Exception {
        when(attractionService.findAll(any(), any(), any(), any(), any(), any(), any(), any(), any())).thenReturn(Page.empty());

        mockMvc.perform(get("/api/v1/attractions")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Atrações recuperadas com sucesso"))
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    @DisplayName("Deve retornar dados paginados corretamente")
    void shouldReturnPaginatedData() throws Exception {
        // Agora incluímos o 10º parâmetro: new CoordinateDTO(...)
        AttractionResponseDTO dto = new AttractionResponseDTO(
                UUID.randomUUID(), 
                "Farol", 
                "Cat", 
                "Short", 
                4.5, 
                "url", 
                "2.5 km", 
                2, 
                false,
                new AttractionResponseDTO.CoordinateDTO(-7.14, -34.80) 
        );
        
        Page<AttractionResponseDTO> page = new PageImpl<>(List.of(dto), PageRequest.of(0, 5), 1);

        when(attractionService.findAll(any(), any(), any(), any(), any(), any(), any(), any(), any())).thenReturn(page);

        mockMvc.perform(get("/api/v1/attractions?page=0&size=5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].name").value("Farol"))
                // Adicionamos a expectativa para o campo de coordenadas, garantindo a integração com o mapa
                .andExpect(jsonPath("$.data.content[0].coordinate.latitude").value(-7.14))
                .andExpect(jsonPath("$.data.content[0].coordinate.longitude").value(-34.80))
                .andExpect(jsonPath("$.data.totalElements").value(1))
                .andExpect(jsonPath("$.data.size").value(5));
    }
}
