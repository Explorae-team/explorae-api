package br.edu.ifpb.explorae.system;

import br.edu.ifpb.explorae.common.security.UserDetailsImpl;
import br.edu.ifpb.explorae.gamification.domain.*;
import br.edu.ifpb.explorae.gamification.repository.PartnerRepository;
import br.edu.ifpb.explorae.gamification.repository.RewardRepository;
import br.edu.ifpb.explorae.gamification.repository.VoucherRepository;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import br.edu.ifpb.explorae.user.service.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * NÍVEL DE TESTE: SISTEMA (System Testing)
 * TÉCNICA: Descoberta de Erro (Error Guessing / Suposição de Falhas)
 *
 * ESCOPO DO TESTE DE SISTEMA:
 * Avaliação da aplicação ponta a ponta (End-to-End) sob condições anômalas,
 * hostis e não-convencionais baseadas em catálogo empírico de falhas (Fault Checklist).
 *
 * CAMADAS AVALIADAS:
 * - Filtros de Rede e Segurança (Spring Security, JWT)
 * - Rate Limiter contra força bruta (Bucket4j / RateLimitInterceptor)
 * - Validação de Contrato de Dados (Jakarta Bean Validation)
 * - Resiliência do Tratador Global de Exceções (GlobalExceptionHandler)
 * - Integridade Transacional do Banco de Dados
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Nível de Sistema - Descoberta de Erros (Error Guessing)")
public class ErrorGuessingSystemTest {

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

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User savedUser;
    private Reward savedReward;

    @BeforeEach
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        savedUser = userRepository.save(User.builder()
                .name("Explorador Adversário")
                .email("adversario@teste.com")
                .passwordHash(passwordEncoder.encode("senhaSegura123"))
                .coins(300)
                .build());

        Partner partner = partnerRepository.save(Partner.builder()
                .name("Restaurante do Penedo")
                .description("Parceiro gastronômico regional.")
                .build());

        savedReward = rewardRepository.save(Reward.builder()
                .partner(partner)
                .name("Almoço Típico 20% OFF")
                .description("Voucher de desconto em pratos típicos.")
                .type(RewardType.DISCOUNT)
                .costInCoins(100)
                .stock(10)
                .isActive(true)
                .build());
    }

    @Nested
    @DisplayName("Catálogo EG-01 a EG-03: Falhas de Entrada e Injeção de Payload")
    class PayloadInjectionErrors {

        @Test
        @DisplayName("[EG-01: Senha em Branco ou Espaços] Cadastro com senha formada exclusivamente por espaços deve ser barrado")
        void shouldRejectRegistrationWithWhitespacePassword() throws Exception {
            // Hipótese de Falha: Desenvolvedor checa apenas null, permitindo senhas como "   "
            String payload = """
                {
                    "name": "Explorador Hacker",
                    "email": "hacker.blank@teste.com",
                    "password": "   "
                }
            """;

            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(payload))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Erro de validação nos campos"))
                    .andExpect(jsonPath("$.data.password").exists());
        }

        @Test
        @DisplayName("[EG-02: Formato de E-mail Bizarro] E-mail sem domínio ou com caracteres inválidos deve falhar no Bean Validation")
        void shouldRejectRegistrationWithMalformedEmail() throws Exception {
            // Hipótese de Falha: Regex ingênua aceita formatos sem TLD ou com múltiplos '@'
            String payload = """
                {
                    "name": "Explorador Bizarro",
                    "email": "usuario@@teste..com",
                    "password": "senhaValida123"
                }
            """;

            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(payload))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Erro de validação nos campos"))
                    .andExpect(jsonPath("$.data.email").exists());
        }

        @Test
        @DisplayName("[EG-03: JSON Truncado / Payload Corrompido] Envio de JSON incompleto sem fechamento de chaves")
        void shouldHandleMalformedTruncatedJsonGracefully() throws Exception {
            // Hipótese de Falha: Jackson lança erro de parsing não capturado, vazando StackTrace ou 500
            String brokenJson = "{\"name\": \"Incompleto\", \"email\": \"truncado@teste.com\", \"password\":";

            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(brokenJson))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Corpo da requisição inválido ou JSON malformado."));
        }
    }

    @Nested
    @DisplayName("Catálogo EG-04 a EG-05: Falhas de Segurança, Autenticação e Rate Limiting")
    class SecurityAndRateLimitingErrors {

        @Test
        @DisplayName("[EG-04: Bypass de Token] Tentativa de resgate com cabeçalho de autorização forjado/falso")
        void shouldBlockRedeemWithForgedOrMissingToken() throws Exception {
            // Hipótese de Falha: Endpoint não intercepta requisição não autenticada e causa NullPointerException
            mockMvc.perform(post("/api/v1/rewards/redeem/" + savedReward.getId())
                            .header("Authorization", "Bearer token_totalmente_falso_e_forjado"))
                    .andExpect(status().isForbidden()); // Bloqueado pelo Spring Security
        }

        @Test
        @DisplayName("[EG-05: Ataque de Força Bruta / DoS] Excesso de tentativas de login deve ativar Rate Limiting (429)")
        void shouldTriggerRateLimiterWhenLoginThresholdExceeded() throws Exception {
            // Hipótese de Falha: Sistema permite requisições infinitas sem limitar por IP
            String validCredentials = """
                {
                    "email": "adversario@teste.com",
                    "password": "senhaSegura123"
                }
            """;

            // Capacidade configurada na anotação @RateLimited: 5 requisições por minuto
            for (int i = 1; i <= 5; i++) {
                mockMvc.perform(post("/api/v1/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(validCredentials))
                        .andExpect(status().isOk());
            }

            // A 6ª requisição no mesmo minuto deve ser sumariamente bloqueada com 429
            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(validCredentials))
                    .andExpect(status().isTooManyRequests())
                    .andExpect(jsonPath("$.status").value(429))
                    .andExpect(jsonPath("$.message").value("Muitas requisições. Tente novamente mais tarde."));
        }
    }

    @Nested
    @DisplayName("Catálogo EG-06 a EG-07: Falhas de Parâmetros de Rota e Ciclo de Vida de Voucher")
    class BusinessAndLifecycleErrors {

        @Test
        @DisplayName("[EG-06: UUID Inválido na URL] Rota protegida chamada com UUID contendo texto arbitrário")
        void shouldHandleMalformedUuidInPathVariable() throws Exception {
            // Hipótese de Falha: Conversor do Spring quebra e vaza detalhes de infraestrutura
            UserDetailsImpl userDetails = new UserDetailsImpl(savedUser);

            mockMvc.perform(post("/api/v1/rewards/redeem/isto-nao-eh-um-uuid-valido")
                            .with(user(userDetails)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Parâmetro inválido na URL: rewardId"));
        }

        @Test
        @DisplayName("[EG-07: Reutilização Fraudulenta de Voucher] Tentativa de validar duas vezes o mesmo token")
        void shouldPreventDoubleSpendOfSameVoucherToken() throws Exception {
            // Hipótese de Falha: Voucher validado continua como ACTIVE ou permite múltiplas leituras de QR Code
            UserDetailsImpl userDetails = new UserDetailsImpl(savedUser);

            Voucher voucher = voucherRepository.save(Voucher.builder()
                    .user(savedUser)
                    .reward(savedReward)
                    .code("EXP-FRAUD-TEST")
                    .status(VoucherStatus.ACTIVE)
                    .expiresAt(LocalDateTime.now().plusDays(5))
                    .build());

            String dynamicToken = tokenService.generateVoucherToken(voucher.getId());

            String payload = "{\"token\": \"" + dynamicToken + "\"}";

            // 1ª Validação: Deve suceder e marcar como USED
            mockMvc.perform(post("/api/v1/rewards/vouchers/validate")
                            .with(user(userDetails))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(payload))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.voucherCode").value("EXP-FRAUD-TEST"));

            // 2ª Validação: Deve ser rejeitada com BusinessException (400)
            mockMvc.perform(post("/api/v1/rewards/vouchers/validate")
                            .with(user(userDetails))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(payload))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Este voucher já foi utilizado."));
        }
    }
}
