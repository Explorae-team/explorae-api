package br.edu.ifpb.explorae.integration.service;

import br.edu.ifpb.explorae.common.exception.BusinessException;
import br.edu.ifpb.explorae.gamification.domain.Partner;
import br.edu.ifpb.explorae.gamification.domain.Reward;
import br.edu.ifpb.explorae.gamification.domain.RewardType;
import br.edu.ifpb.explorae.gamification.dto.VoucherResponseDTO;
import br.edu.ifpb.explorae.gamification.repository.PartnerRepository;
import br.edu.ifpb.explorae.gamification.repository.RewardRepository;
import br.edu.ifpb.explorae.gamification.service.RewardService;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Nível 2 - Teste de Integração (Tabela de Decisão)")
public class RewardDecisaoIntegrationTest {

    @Autowired
    private RewardService rewardService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private PartnerRepository partnerRepository;

    private Partner savedPartner;

    @BeforeEach
    public void setupDb() {
        Partner partner = Partner.builder()
                .name("Parceiro Teste Decisão")
                .description("Parceiro oficial do Exploraê")
                .isActive(true)
                .build();
        this.savedPartner = partnerRepository.save(partner);
    }

    @Test
    @DisplayName("Regra 1 (V, V, V): Ativa, Com Estoque, Saldo Suficiente -> Persiste voucher e debita no banco")
    public void testIntegracaoRegra1_Sucesso() {
        Reward reward = Reward.builder()
                .partner(savedPartner)
                .name("Desconto Válido")
                .description("Recompensa ativa com estoque")
                .type(RewardType.DISCOUNT)
                .costInCoins(50)
                .stock(5)
                .isActive(true)
                .build();
        Reward savedReward = rewardRepository.save(reward);

        User user = User.builder()
                .name("Explorador com Saldo")
                .email("decisao.valido@teste.com")
                .passwordHash("senhaSegura123")
                .coins(100)
                .build();
        User savedUser = userRepository.save(user);

        VoucherResponseDTO response = rewardService.redeemReward(savedUser.getId(), savedReward.getId());

        assertNotNull(response);

        User userAtualizado = userRepository.findById(savedUser.getId()).orElseThrow();
        Reward rewardAtualizada = rewardRepository.findById(savedReward.getId()).orElseThrow();

        assertEquals(50, userAtualizado.getCoins());
        assertEquals(4, rewardAtualizada.getStock());
    }

    @Test
    @DisplayName("Regra 2 (F, -, -): Inativa no banco -> Aborta transação e não debita saldo")
    public void testIntegracaoRegra2_Inativa() {
        Reward rewardInativa = Reward.builder()
                .partner(savedPartner)
                .name("Recompensa Inativa")
                .description("Recompensa desativada no catálogo")
                .type(RewardType.DISCOUNT)
                .costInCoins(50)
                .stock(5)
                .isActive(false)
                .build();
        Reward savedReward = rewardRepository.save(rewardInativa);

        User user = User.builder()
                .name("Explorador")
                .email("decisao.inativa@teste.com")
                .passwordHash("senhaSegura123")
                .coins(100)
                .build();
        User savedUser = userRepository.save(user);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            rewardService.redeemReward(savedUser.getId(), savedReward.getId());
        });

        assertEquals("Esta recompensa está indisponível ou esgotada.", exception.getMessage());

        User userAposFalha = userRepository.findById(savedUser.getId()).orElseThrow();
        assertEquals(100, userAposFalha.getCoins());
    }

    @Test
    @DisplayName("Regra 3 (V, F, -): Sem estoque no banco -> Aborta transação e não debita saldo")
    public void testIntegracaoRegra3_SemEstoque() {
        Reward rewardSemEstoque = Reward.builder()
                .partner(savedPartner)
                .name("Recompensa Esgotada")
                .description("Recompensa sem unidades restantes")
                .type(RewardType.PRODUCT)
                .costInCoins(50)
                .stock(0)
                .isActive(true)
                .build();
        Reward savedReward = rewardRepository.save(rewardSemEstoque);

        User user = User.builder()
                .name("Explorador")
                .email("decisao.semestoque@teste.com")
                .passwordHash("senhaSegura123")
                .coins(100)
                .build();
        User savedUser = userRepository.save(user);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            rewardService.redeemReward(savedUser.getId(), savedReward.getId());
        });

        assertEquals("Esta recompensa está indisponível ou esgotada.", exception.getMessage());

        User userAposFalha = userRepository.findById(savedUser.getId()).orElseThrow();
        assertEquals(100, userAposFalha.getCoins());
    }

    @Test
    @DisplayName("Regra 4 (V, V, F): Saldo insuficiente no banco -> Aborta transação e mantém estoque intacto")
    public void testIntegracaoRegra4_SaldoInsuficiente() {
        Reward reward = Reward.builder()
                .partner(savedPartner)
                .name("Recompensa Normal")
                .description("Recompensa ativa com estoque")
                .type(RewardType.DISCOUNT)
                .costInCoins(50)
                .stock(5)
                .isActive(true)
                .build();
        Reward savedReward = rewardRepository.save(reward);

        User user = User.builder()
                .name("Explorador Sem Saldo")
                .email("decisao.semsaldo@teste.com")
                .passwordHash("senhaSegura123")
                .coins(20)
                .build();
        User savedUser = userRepository.save(user);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            rewardService.redeemReward(savedUser.getId(), savedReward.getId());
        });

        assertEquals("Saldo de moedas insuficiente para resgatar esta recompensa.", exception.getMessage());

        Reward rewardAposFalha = rewardRepository.findById(savedReward.getId()).orElseThrow();
        assertEquals(5, rewardAposFalha.getStock());
    }
}
