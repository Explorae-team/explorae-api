package br.edu.ifpb.explorae.system;

import br.edu.ifpb.explorae.common.security.UserDetailsImpl;
import br.edu.ifpb.explorae.gamification.domain.Partner;
import br.edu.ifpb.explorae.gamification.domain.Reward;
import br.edu.ifpb.explorae.gamification.domain.RewardType;
import br.edu.ifpb.explorae.gamification.repository.PartnerRepository;
import br.edu.ifpb.explorae.gamification.repository.RewardRepository;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.util.UUID;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Nível 3 - Teste de Sistema (Classes de Equivalência)")
public class RewardEquivalenciaSystemTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private PartnerRepository partnerRepository;

    private UUID rewardId;

    @BeforeEach
    public void setupSystem() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        Partner partner = Partner.builder()
                .name("Restaurante Parceiro Oficial")
                .description("Parceiro credenciado no Exploraê")
                .isActive(true)
                .build();
        Partner savedPartner = partnerRepository.save(partner);

        Reward reward = Reward.builder()
                .partner(savedPartner)
                .name("Almoço Executivo 15% OFF")
                .description("Voucher de desconto em alimentação")
                .type(RewardType.DISCOUNT)
                .costInCoins(50)
                .stock(10)
                .isActive(true)
                .build();
        Reward savedReward = rewardRepository.save(reward);
        this.rewardId = savedReward.getId();
    }

    @Test
    @DisplayName("Sistema (Inválido): Requisição HTTP com saldo insuficiente (< 50) retorna HTTP 400 Bad Request")
    public void testSistemaEquivalenciaInvalida_Http400() throws Exception {
        User userInvalido = User.builder()
                .name("Turista Sem Moedas")
                .email("turista.invalido@teste.com")
                .passwordHash("hashSeguro123")
                .coins(25)
                .build();
        User savedUser = userRepository.save(userInvalido);

        mockMvc.perform(post("/api/v1/rewards/redeem/" + rewardId)
                        .with(user(new UserDetailsImpl(savedUser)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Saldo de moedas insuficiente para resgatar esta recompensa."));
    }

    @Test
    @DisplayName("Sistema (Válido): Requisição HTTP com saldo suficiente (>= 50) retorna HTTP 200 OK e JSON com Voucher")
    public void testSistemaEquivalenciaValida_Http200() throws Exception {
        User userValido = User.builder()
                .name("Turista Explorador")
                .email("turista.valido@teste.com")
                .passwordHash("hashSeguro123")
                .coins(150)
                .build();
        User savedUser = userRepository.save(userValido);

        mockMvc.perform(post("/api/v1/rewards/redeem/" + rewardId)
                        .with(user(new UserDetailsImpl(savedUser)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Recompensa resgatada com sucesso!"))
                .andExpect(jsonPath("$.data.code").isNotEmpty());
    }
}
