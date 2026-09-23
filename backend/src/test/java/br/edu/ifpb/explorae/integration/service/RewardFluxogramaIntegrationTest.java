package br.edu.ifpb.explorae.integration.service;

import br.edu.ifpb.explorae.common.exception.BusinessException;
import br.edu.ifpb.explorae.common.exception.ResourceNotFoundException;
import br.edu.ifpb.explorae.gamification.domain.Partner;
import br.edu.ifpb.explorae.gamification.domain.Reward;
import br.edu.ifpb.explorae.gamification.domain.RewardType;
import br.edu.ifpb.explorae.gamification.domain.Voucher;
import br.edu.ifpb.explorae.gamification.domain.VoucherStatus;
import br.edu.ifpb.explorae.gamification.dto.VoucherResponseDTO;
import br.edu.ifpb.explorae.gamification.repository.PartnerRepository;
import br.edu.ifpb.explorae.gamification.repository.RewardRepository;
import br.edu.ifpb.explorae.gamification.repository.VoucherRepository;
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

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * NÍVEL DE TESTE: INTEGRAÇÃO (Integration Testing)
 * TÉCNICA: Teste Baseado em Fluxograma / Caminho Básico (Basis Path Testing - McCabe, 1976)
 *
 * OBJETO SOB TESTE (SUT): RewardService.redeemReward(userId, rewardId)
 * ESCOPO DA INTEGRAÇÃO: Orquestração entre RewardService, UserRepository, RewardRepository,
 *                       VoucherRepository e mecanismo de transações JPA/Hibernate.
 *
 * MODELAGEM DO GRAFO DE FLUXO DE CONTROLE (CFG):
 * Nós (N = 11):
 *  - Nó 1: Início e busca do usuário no banco (userRepository.findById)
 *  - Nó 2: [Exceção 1] Usuário não encontrado -> Lança ResourceNotFoundException
 *  - Nó 3: Usuário encontrado -> Busca recompensa no banco (rewardRepository.findById)
 *  - Nó 4: [Exceção 2] Recompensa não encontrada -> Lança ResourceNotFoundException
 *  - Nó 5: Recompensa encontrada -> Avalia Predicado de Ativação (!reward.getIsActive())
 *  - Nó 6: [Exceção 3] Indisponível/Esgotada -> Lança BusinessException
 *  - Nó 7: Ativa == true -> Avalia Predicado de Estoque (reward.getStock() <= 0)
 *  - Nó 8: Estoque > 0 -> Avalia Predicado de Saldo (user.getCoins() < reward.getCostInCoins())
 *  - Nó 9: [Exceção 4] Saldo insuficiente -> Lança BusinessException (Garante Rollback)
 *  - Nó 10: Saldo suficiente -> Débito de moedas, decremento de estoque e persistência do voucher
 *  - Nó 11: Retorno com DTO de Sucesso (Commit da transação)
 *
 * MÉTRICA DE MCCABE:
 * Arestas (E) = 15, Nós (N) = 11, Componentes (P) = 1
 * Nós Predicados (P_nodes) = 5 (Nó 1, Nó 3, Nó 5, Nó 7, Nó 8)
 * Complexidade Ciclomática V(G) = E - N + 2P = 15 - 11 + 2(1) = 6
 * ou V(G) = P_nodes + 1 = 5 + 1 = 6
 *
 * CONJUNTO BASE DE CAMINHOS INDEPENDENTES (6 Casos de Teste):
 * - CB1: 1 -> 2                                           (Usuário inexistente)
 * - CB2: 1 -> 3 -> 4                                      (Recompensa inexistente)
 * - CB3: 1 -> 3 -> 5 -> 6                                 (Recompensa inativa)
 * - CB4: 1 -> 3 -> 5 -> 7 -> 6                            (Recompensa com estoque zerado)
 * - CB5: 1 -> 3 -> 5 -> 7 -> 8 -> 9                       (Saldo insuficiente / Rollback)
 * - CB6: 1 -> 3 -> 5 -> 7 -> 8 -> 10 -> 11                (Caminho feliz / Transação completa)
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Nível de Integração - Teste de Caminho Básico / Fluxograma (McCabe)")
public class RewardFluxogramaIntegrationTest {

    @Autowired
    private RewardService rewardService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private PartnerRepository partnerRepository;

    private Partner savedPartner;
    private User savedUser;

    @BeforeEach
    public void setup() {
        Partner partner = Partner.builder()
                .name("Parceiro Gastronômico Oficial")
                .description("Restaurante e Cafeteria Parceira")
                .isActive(true)
                .build();
        this.savedPartner = partnerRepository.save(partner);

        User user = User.builder()
                .name("Turista Explorador")
                .email("explorador.fluxo@teste.com")
                .passwordHash("senhaForte123")
                .coins(100)
                .build();
        this.savedUser = userRepository.save(user);
    }

    @Test
    @DisplayName("CB1: 1 -> 2 | Usuário inexistente no banco -> ResourceNotFoundException")
    public void testCB1_UsuarioNaoEncontrado() {
        UUID usuarioInexistenteId = UUID.randomUUID();
        UUID rewardIdValido = UUID.randomUUID();

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> rewardService.redeemReward(usuarioInexistenteId, rewardIdValido),
                "Deveria lançar ResourceNotFoundException para usuário inexistente."
        );

        assertEquals("Usuário não encontrado.", exception.getMessage());
    }

    @Test
    @DisplayName("CB2: 1 -> 3 -> 4 | Usuário existe, Recompensa inexistente no banco -> ResourceNotFoundException")
    public void testCB2_RecompensaNaoEncontrada() {
        UUID recompensaInexistenteId = UUID.randomUUID();

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> rewardService.redeemReward(savedUser.getId(), recompensaInexistenteId),
                "Deveria lançar ResourceNotFoundException para recompensa inexistente."
        );

        assertEquals("Recompensa não encontrada.", exception.getMessage());
    }

    @Test
    @DisplayName("CB3: 1 -> 3 -> 5 -> 6 | Recompensa Inativa (!isActive) -> BusinessException")
    public void testCB3_RecompensaInativa() {
        Reward rewardInativa = Reward.builder()
                .partner(savedPartner)
                .name("Café Espresso Cortesia")
                .description("Item temporariamente suspenso")
                .type(RewardType.PRODUCT)
                .costInCoins(30)
                .stock(10)
                .isActive(false) // Condição de disparo do Nó 5 -> Nó 6
                .build();
        Reward savedReward = rewardRepository.save(rewardInativa);

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> rewardService.redeemReward(savedUser.getId(), savedReward.getId()),
                "Deveria rejeitar resgate de recompensa inativa."
        );

        assertEquals("Esta recompensa está indisponível ou esgotada.", exception.getMessage());
    }

    @Test
    @DisplayName("CB4: 1 -> 3 -> 5 -> 7 -> 6 | Recompensa Ativa com Estoque Esgotado (stock <= 0) -> BusinessException")
    public void testCB4_RecompensaEstoqueEsgotado() {
        Reward rewardEsgotada = Reward.builder()
                .partner(savedPartner)
                .name("Almoço Especial")
                .description("Item com estoque zerado")
                .type(RewardType.PRODUCT)
                .costInCoins(50)
                .stock(0) // Condição de disparo do Nó 7 -> Nó 6
                .isActive(true)
                .build();
        Reward savedReward = rewardRepository.save(rewardEsgotada);

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> rewardService.redeemReward(savedUser.getId(), savedReward.getId()),
                "Deveria rejeitar resgate de recompensa com estoque zerado."
        );

        assertEquals("Esta recompensa está indisponível ou esgotada.", exception.getMessage());
    }

    @Test
    @DisplayName("CB5: 1 -> 3 -> 5 -> 7 -> 8 -> 9 | Saldo Insuficiente -> BusinessException e Integridade de Rollback")
    public void testCB5_SaldoInsuficiente_GaranteRollback() {
        Reward rewardCara = Reward.builder()
                .partner(savedPartner)
                .name("Jantar Panorâmico")
                .description("Custa mais moedas do que o usuário possui")
                .type(RewardType.EXPERIENCE)
                .costInCoins(150) // Usuário tem 100
                .stock(5)
                .isActive(true)
                .build();
        Reward savedReward = rewardRepository.save(rewardCara);

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> rewardService.redeemReward(savedUser.getId(), savedReward.getId()),
                "Deveria rejeitar por saldo insuficiente."
        );

        assertEquals("Saldo de moedas insuficiente para resgatar esta recompensa.", exception.getMessage());

        // Verificação profunda de Integração: Garante que nada foi debitado e o estoque permaneceu íntegro
        User userAposTentativa = userRepository.findById(savedUser.getId()).orElseThrow();
        assertEquals(100, userAposTentativa.getCoins(), "O saldo do usuário não pode ter sido alterado.");

        Reward rewardAposTentativa = rewardRepository.findById(savedReward.getId()).orElseThrow();
        assertEquals(5, rewardAposTentativa.getStock(), "O estoque da recompensa deve permanecer inalterado.");
    }

    @Test
    @DisplayName("CB6: 1 -> 3 -> 5 -> 7 -> 8 -> 10 -> 11 | Caminho Feliz: Débito de saldo, baixa no estoque e emissão de voucher")
    public void testCB6_CaminhoFeliz_SucessoTransacional() {
        Reward rewardValida = Reward.builder()
                .partner(savedPartner)
                .name("Sobremesa Gourmet")
                .description("Recompensa válida e disponível")
                .type(RewardType.PRODUCT)
                .costInCoins(40) // Usuário tem 100 -> Restarão 60
                .stock(8)        // Estoque 8 -> Restarão 7
                .isActive(true)
                .build();
        Reward savedReward = rewardRepository.save(rewardValida);

        VoucherResponseDTO response = rewardService.redeemReward(savedUser.getId(), savedReward.getId());

        // 1. Validações do DTO de resposta (Record)
        assertNotNull(response, "A resposta do voucher emitido não deve ser nula.");
        assertNotNull(response.id(), "O ID do voucher gerado deve ser preenchido.");
        assertTrue(response.code().startsWith("EXP-"), "O código do voucher deve seguir o padrão EXP-XXXX.");
        assertEquals(VoucherStatus.ACTIVE, response.status(), "O voucher deve nascer com status ACTIVE.");
        assertNotNull(response.expiresAt(), "A data de expiração do voucher deve ser calculada.");

        // 2. Validações de Integração de Persistência no Banco de Dados
        User userAtualizado = userRepository.findById(savedUser.getId()).orElseThrow();
        assertEquals(60, userAtualizado.getCoins(), "O saldo do usuário deve ter sido debitado (100 - 40 = 60).");

        Reward rewardAtualizada = rewardRepository.findById(savedReward.getId()).orElseThrow();
        assertEquals(7, rewardAtualizada.getStock(), "O estoque no banco deve ter sido decrementado (8 - 1 = 7).");

        Optional<Voucher> voucherNoBanco = voucherRepository.findById(response.id());
        assertTrue(voucherNoBanco.isPresent(), "O voucher deve estar fisicamente persistido no banco.");
        assertEquals(savedUser.getId(), voucherNoBanco.get().getUser().getId(), "O voucher deve estar associado ao usuário correto.");
        assertEquals(savedReward.getId(), voucherNoBanco.get().getReward().getId(), "O voucher deve estar associado à recompensa correta.");
    }
}
