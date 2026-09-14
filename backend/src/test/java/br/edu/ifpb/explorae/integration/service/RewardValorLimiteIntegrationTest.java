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
@DisplayName("Nível 2 - Teste de Integração (Valor Limite - Estoque)")
public class RewardValorLimiteIntegrationTest {

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
                .name("Parceiro Teste Limite")
                .description("Parceiro oficial para testes de estoque")
                .isActive(true)
                .build();
        this.savedPartner = partnerRepository.save(partner);
    }

    @Test
    @DisplayName("Integração - Valor Limite Inválido (Estoque = 0): Não permite resgate no banco")
    public void testIntegracaoValorLimiteInvalido_EstoqueZero() {
        Reward rewardEsgotada = Reward.builder()
                .partner(savedPartner)
                .name("Café Cortesia Esgotado")
                .description("Voucher sem estoque")
                .type(RewardType.PRODUCT)
                .costInCoins(50)
                .stock(0)
                .isActive(true)
                .build();
        Reward savedReward = rewardRepository.save(rewardEsgotada);

        User user = User.builder()
                .name("Turista com Moedas")
                .email("limite0@teste.com")
                .passwordHash("senhaHash123")
                .coins(100)
                .build();
        User savedUser = userRepository.save(user);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            rewardService.redeemReward(savedUser.getId(), savedReward.getId());
        });

        assertEquals("Esta recompensa está indisponível ou esgotada.", exception.getMessage());
        
        User userAposTentativa = userRepository.findById(savedUser.getId()).orElseThrow();
        assertEquals(100, userAposTentativa.getCoins());
    }

    @Test
    @DisplayName("Integração - Valor Limite Válido (Estoque = 1): Resgata última unidade e atualiza banco para 0")
    public void testIntegracaoValorLimiteValido_EstoqueUm() {
        Reward rewardUltimaUnidade = Reward.builder()
                .partner(savedPartner)
                .name("Último Café Cortesia")
                .description("Voucher com 1 unidade restante")
                .type(RewardType.PRODUCT)
                .costInCoins(50)
                .stock(1)
                .isActive(true)
                .build();
        Reward savedReward = rewardRepository.save(rewardUltimaUnidade);

        User user = User.builder()
                .name("Turista que Pegou a Última")
                .email("limite1@teste.com")
                .passwordHash("senhaHash123")
                .coins(100)
                .build();
        User savedUser = userRepository.save(user);

        VoucherResponseDTO response = rewardService.redeemReward(savedUser.getId(), savedReward.getId());

        assertNotNull(response);

        Reward rewardAtualizada = rewardRepository.findById(savedReward.getId()).orElseThrow();
        User userAtualizado = userRepository.findById(savedUser.getId()).orElseThrow();

        assertEquals(0, rewardAtualizada.getStock());
        assertEquals(50, userAtualizado.getCoins());
    }
}
