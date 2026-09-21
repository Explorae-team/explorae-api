package br.edu.ifpb.explorae.system;

import br.edu.ifpb.explorae.common.security.UserDetailsImpl;
import br.edu.ifpb.explorae.gamification.domain.Partner;
import br.edu.ifpb.explorae.gamification.domain.Reward;
import br.edu.ifpb.explorae.gamification.domain.RewardType;
import br.edu.ifpb.explorae.gamification.domain.Voucher;
import br.edu.ifpb.explorae.gamification.domain.VoucherStatus;
import br.edu.ifpb.explorae.gamification.repository.PartnerRepository;
import br.edu.ifpb.explorae.gamification.repository.RewardRepository;
import br.edu.ifpb.explorae.gamification.repository.VoucherRepository;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import br.edu.ifpb.explorae.user.service.TokenService;
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

import java.time.LocalDateTime;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Nível de Sistema - Transição de Estados (Ciclo de Vida do Voucher)")
public class VoucherTransicaoEstadosSystemTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private PartnerRepository partnerRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private TokenService tokenService;

    private User savedUser;
    private Reward savedReward;

    @BeforeEach
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        User user = User.builder()
                .name("Explorador Turista")
                .email("turista.transicao@teste.com")
                .passwordHash("senhaSegura123")
                .coins(200)
                .build();
        this.savedUser = userRepository.save(user);

        Partner partner = Partner.builder()
                .name("Restaurante Beira Mar")
                .description("Parceiro oficial do Exploraê")
                .isActive(true)
                .build();
        Partner savedPartner = partnerRepository.save(partner);

        Reward reward = Reward.builder()
                .partner(savedPartner)
                .name("Almoço Executivo Cortesia")
                .description("Recompensa para teste de transição")
                .type(RewardType.PRODUCT)
                .costInCoins(50)
                .stock(10)
                .isActive(true)
                .build();
        this.savedReward = rewardRepository.save(reward);
    }

    @Test
    @DisplayName("Transição Válida: ACTIVE -> USED e Bloqueio de Transição Inválida: USED -> USED (Fraude de Gasto Duplo)")
    public void testTransicaoValida_ActiveParaUsed_E_BloqueioGastoDuplo() throws Exception {
        Voucher voucherAtivo = Voucher.builder()
                .user(savedUser)
                .reward(savedReward)
                .code("EXP-VAL12345")
                .status(VoucherStatus.ACTIVE)
                .expiresAt(LocalDateTime.now().plusDays(30))
                .build();
        Voucher savedVoucher = voucherRepository.save(voucherAtivo);

        String tokenQrCode = tokenService.generateVoucherToken(savedVoucher.getId());

        String requestBody = """
                {
                    "token": "%s"
                }
                """.formatted(tokenQrCode);

        mockMvc.perform(post("/api/v1/rewards/vouchers/validate")
                        .with(user(new UserDetailsImpl(savedUser)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Voucher validado com sucesso pelo estabelecimento parceiro!"))
                .andExpect(jsonPath("$.data.voucherCode").value("EXP-VAL12345"));

        mockMvc.perform(post("/api/v1/rewards/vouchers/validate")
                        .with(user(new UserDetailsImpl(savedUser)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Este voucher já foi utilizado."));
    }

    @Test
    @DisplayName("Transição Inválida: ACTIVE -> EXPIRED por decurso de prazo ao tentar validar")
    public void testTransicaoInvalida_VoucherExpirado() throws Exception {
        Voucher voucherExpirado = Voucher.builder()
                .user(savedUser)
                .reward(savedReward)
                .code("EXP-EXP99999")
                .status(VoucherStatus.ACTIVE)
                .expiresAt(LocalDateTime.now().minusDays(1))
                .build();
        Voucher savedVoucher = voucherRepository.save(voucherExpirado);

        String tokenQrCode = tokenService.generateVoucherToken(savedVoucher.getId());

        String requestBody = """
                {
                    "token": "%s"
                }
                """.formatted(tokenQrCode);

        mockMvc.perform(post("/api/v1/rewards/vouchers/validate")
                        .with(user(new UserDetailsImpl(savedUser)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Este voucher expirou e não pode ser validado."));
    }
}
