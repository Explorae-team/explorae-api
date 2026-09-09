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

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Nível 2 - Teste de Integração (Classes de Equivalência)")
public class RewardEquivalenciaIntegrationTest {

    @Autowired
    private RewardService rewardService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private PartnerRepository partnerRepository;

    private UUID rewardId;

    @BeforeEach
    public void setupDb() {
        Partner partner = Partner.builder()
                .name("Restaurante Parceiro Teste")
                .description("Parceiro oficial do Exploraê")
                .isActive(true)
                .build();
        Partner savedPartner = partnerRepository.save(partner);

        Reward reward = Reward.builder()
                .partner(savedPartner)
                .name("Desconto 10%")
                .description("Voucher de 10% de desconto")
                .type(RewardType.DISCOUNT)
                .costInCoins(50)
                .stock(10)
                .isActive(true)
                .build();
        Reward savedReward = rewardRepository.save(reward);
        this.rewardId = savedReward.getId();
    }

    @Test
    @DisplayName("Integração (Inválido): Acesso ao banco com saldo insuficiente (< 50) barra o resgate")
    public void testIntegracaoEquivalenciaInvalida() {

        User user = User.builder()
                .name("Usuário Teste Inválido")
                .email("invalido@teste.com")
                .passwordHash("senha123hash")
                .coins(30)
                .build();
        User savedUser = userRepository.save(user);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            rewardService.redeemReward(savedUser.getId(), rewardId);
        });

        assertEquals("Saldo de moedas insuficiente para resgatar esta recompensa.", exception.getMessage());
    }

    @Test
    @DisplayName("Integração (Válido): Acesso ao banco com saldo suficiente (>= 50) efetiva resgate")
    public void testIntegracaoEquivalenciaValida() {

        User user = User.builder()
                .name("Usuário Teste Válido")
                .email("valido@teste.com")
                .passwordHash("senha123hash")
                .coins(100)
                .build();
        User savedUser = userRepository.save(user);


        VoucherResponseDTO response = rewardService.redeemReward(savedUser.getId(), rewardId);

        User updatedUser = userRepository.findById(savedUser.getId()).orElseThrow();
        Reward updatedReward = rewardRepository.findById(rewardId).orElseThrow();

        assertNotNull(response);
        assertEquals(50, updatedUser.getCoins(), "O banco de dados deve atualizar o saldo para 50");
        assertEquals(9, updatedReward.getStock(), "O banco de dados deve atualizar o estoque para 9");
    }
}
