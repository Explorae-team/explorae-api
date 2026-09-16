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
@DisplayName("Nível 3 - Teste de Sistema (Tabela de Decisão)")
public class RewardDecisaoSystemTest {

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

    @BeforeEach
    public void setupSystem() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        Partner partner = Partner.builder()
                .name("Parceiro Sistema Decisão")
                .description("Parceiro oficial do Exploraê")
                .isActive(true)
                .build();
        this.savedPartner = partnerRepository.save(partner);
    }

    @Test
    @DisplayName("Regra 1 (V, V, V): Sucesso -> Retorna HTTP 200 OK com JSON do Voucher")
    public void testSistemaRegra1_Sucesso() throws Exception {
        Reward reward = Reward.builder()
                .partner(savedPartner)
                .name("Almoço Executivo")
                .description("Recompensa válida")
                .type(RewardType.DISCOUNT)
                .costInCoins(50)
                .stock(5)
                .isActive(true)
                .build();
        Reward savedReward = rewardRepository.save(reward);

        User user = User.builder()
                .name("Turista com Moedas")
                .email("sistema.sucesso@teste.com")
                .passwordHash("senhaHash123")
                .coins(100)
                .build();
        User savedUser = userRepository.save(user);

        mockMvc.perform(post("/api/v1/rewards/redeem/" + savedReward.getId())
                        .with(user(new UserDetailsImpl(savedUser)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Recompensa resgatada com sucesso!"))
                .andExpect(jsonPath("$.data.code").isNotEmpty());
    }

    @Test
    @DisplayName("Regra 2 (F, -, -): Inativa -> Retorna HTTP 400 Bad Request")
    public void testSistemaRegra2_Inativa() throws Exception {
        Reward rewardInativa = Reward.builder()
                .partner(savedPartner)
                .name("Recompensa Desativada")
                .description("Recompensa inativa")
                .type(RewardType.DISCOUNT)
                .costInCoins(50)
                .stock(5)
                .isActive(false)
                .build();
        Reward savedReward = rewardRepository.save(rewardInativa);

        User user = User.builder()
                .name("Turista")
                .email("sistema.inativa@teste.com")
                .passwordHash("senhaHash123")
                .coins(100)
                .build();
        User savedUser = userRepository.save(user);

        mockMvc.perform(post("/api/v1/rewards/redeem/" + savedReward.getId())
                        .with(user(new UserDetailsImpl(savedUser)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Esta recompensa está indisponível ou esgotada."));
    }

    @Test
    @DisplayName("Regra 3 (V, F, -): Sem Estoque -> Retorna HTTP 400 Bad Request")
    public void testSistemaRegra3_SemEstoque() throws Exception {
        Reward rewardSemEstoque = Reward.builder()
                .partner(savedPartner)
                .name("Recompensa Esgotada")
                .description("Recompensa com estoque zerado")
                .type(RewardType.DISCOUNT)
                .costInCoins(50)
                .stock(0)
                .isActive(true)
                .build();
        Reward savedReward = rewardRepository.save(rewardSemEstoque);

        User user = User.builder()
                .name("Turista")
                .email("sistema.semestoque@teste.com")
                .passwordHash("senhaHash123")
                .coins(100)
                .build();
        User savedUser = userRepository.save(user);

        mockMvc.perform(post("/api/v1/rewards/redeem/" + savedReward.getId())
                        .with(user(new UserDetailsImpl(savedUser)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Esta recompensa está indisponível ou esgotada."));
    }

    @Test
    @DisplayName("Regra 4 (V, V, F): Saldo Insuficiente -> Retorna HTTP 400 Bad Request")
    public void testSistemaRegra4_SaldoInsuficiente() throws Exception {
        Reward reward = Reward.builder()
                .partner(savedPartner)
                .name("Recompensa Cara")
                .description("Recompensa ativa com estoque")
                .type(RewardType.DISCOUNT)
                .costInCoins(50)
                .stock(5)
                .isActive(true)
                .build();
        Reward savedReward = rewardRepository.save(reward);

        User userSemSaldo = User.builder()
                .name("Turista Sem Moedas")
                .email("sistema.semsaldo@teste.com")
                .passwordHash("senhaHash123")
                .coins(20)
                .build();
        User savedUser = userRepository.save(userSemSaldo);

        mockMvc.perform(post("/api/v1/rewards/redeem/" + savedReward.getId())
                        .with(user(new UserDetailsImpl(savedUser)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Saldo de moedas insuficiente para resgatar esta recompensa."));
    }
}
