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

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Nível 3 - Teste de Sistema (Valor Limite - Estoque)")
public class RewardValorLimiteSystemTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private PartnerRepository partnerRepository;

    private Partner savedPartner;
    private User savedUser;

    @BeforeEach
    public void setupSystem() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        Partner partner = Partner.builder()
                .name("Restaurante Oficial Limite")
                .description("Parceiro oficial do Exploraê")
                .isActive(true)
                .build();
        this.savedPartner = partnerRepository.save(partner);

        User user = User.builder()
                .name("Explorador com Saldo")
                .email("explorador.sistema@teste.com")
                .passwordHash("senhaSegura123")
                .coins(150)
                .build();
        this.savedUser = userRepository.save(user);
    }

    @Test
    @DisplayName("Sistema - Valor Limite Inválido (Estoque = 0): Retorna HTTP 400 Bad Request")
    public void testSistemaValorLimiteInvalido_EstoqueZero() throws Exception {
        Reward rewardEsgotada = Reward.builder()
                .partner(savedPartner)
                .name("Sobremesa Esgotada")
                .description("Recompensa com estoque zerado")
                .type(RewardType.DISCOUNT)
                .costInCoins(50)
                .stock(0)
                .isActive(true)
                .build();
        Reward savedReward = rewardRepository.save(rewardEsgotada);

        mockMvc.perform(post("/api/v1/rewards/redeem/" + savedReward.getId())
                        .with(user(new UserDetailsImpl(savedUser)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Esta recompensa está indisponível ou esgotada."));
    }

    @Test
    @DisplayName("Sistema - Valor Limite Válido (Estoque = 1): Retorna HTTP 200 OK e emite Voucher")
    public void testSistemaValorLimiteValido_EstoqueUm() throws Exception {
        Reward rewardUltimaUnidade = Reward.builder()
                .partner(savedPartner)
                .name("Última Sobremesa")
                .description("Recompensa com exatamente 1 unidade")
                .type(RewardType.DISCOUNT)
                .costInCoins(50)
                .stock(1)
                .isActive(true)
                .build();
        Reward savedReward = rewardRepository.save(rewardUltimaUnidade);

        mockMvc.perform(post("/api/v1/rewards/redeem/" + savedReward.getId())
                        .with(user(new UserDetailsImpl(savedUser)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Recompensa resgatada com sucesso!"))
                .andExpect(jsonPath("$.data.code").isNotEmpty());
    }
}
