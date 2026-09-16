package br.edu.ifpb.explorae.unit.gamification.service;

import br.edu.ifpb.explorae.common.exception.BusinessException;
import br.edu.ifpb.explorae.gamification.domain.Reward;
import br.edu.ifpb.explorae.gamification.domain.Voucher;
import br.edu.ifpb.explorae.gamification.dto.VoucherResponseDTO;
import br.edu.ifpb.explorae.gamification.mapper.RewardMapper;
import br.edu.ifpb.explorae.gamification.repository.RewardRepository;
import br.edu.ifpb.explorae.gamification.repository.VoucherRepository;
import br.edu.ifpb.explorae.gamification.service.RewardService;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Nível 1 - Teste de Unidade (Tabela de Decisão)")
public class RewardDecisaoUnitTest {

    @InjectMocks
    private RewardService rewardService;

    @Mock private UserRepository userRepository;
    @Mock private RewardRepository rewardRepository;
    @Mock private VoucherRepository voucherRepository;
    @Mock private RewardMapper rewardMapper;

    @Test
    @DisplayName("Regra 1 (V, V, V): Ativa, Com Estoque, Saldo Suficiente -> Aprova e emite voucher")
    public void testRegra1_Sucesso() {
        UUID userId = UUID.randomUUID();
        UUID rewardId = UUID.randomUUID();

        User mockUser = new User();
        mockUser.setCoins(100);

        Reward mockReward = new Reward();
        mockReward.setIsActive(true);
        mockReward.setStock(5);
        mockReward.setCostInCoins(50);

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(rewardRepository.findById(rewardId)).thenReturn(Optional.of(mockReward));
        when(voucherRepository.save(any(Voucher.class))).thenReturn(new Voucher());
        when(rewardMapper.toVoucherDTO(any(Voucher.class))).thenReturn(mock(VoucherResponseDTO.class));

        VoucherResponseDTO response = rewardService.redeemReward(userId, rewardId);

        assertNotNull(response);
        assertEquals(50, mockUser.getCoins());
        assertEquals(4, mockReward.getStock());
        verify(voucherRepository, times(1)).save(any(Voucher.class));
    }

    @Test
    @DisplayName("Regra 2 (F, -, -): Inativa -> Rejeita com erro de indisponibilidade")
    public void testRegra2_RecompensaInativa() {
        UUID userId = UUID.randomUUID();
        UUID rewardId = UUID.randomUUID();

        User mockUser = new User();
        mockUser.setCoins(100);

        Reward mockReward = new Reward();
        mockReward.setIsActive(false);
        mockReward.setStock(5);
        mockReward.setCostInCoins(50);

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(rewardRepository.findById(rewardId)).thenReturn(Optional.of(mockReward));

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            rewardService.redeemReward(userId, rewardId);
        });

        assertEquals("Esta recompensa está indisponível ou esgotada.", exception.getMessage());
        verify(voucherRepository, never()).save(any(Voucher.class));
    }

    @Test
    @DisplayName("Regra 3 (V, F, -): Ativa, Sem Estoque -> Rejeita com erro de esgotada")
    public void testRegra3_SemEstoque() {
        UUID userId = UUID.randomUUID();
        UUID rewardId = UUID.randomUUID();

        User mockUser = new User();
        mockUser.setCoins(100);

        Reward mockReward = new Reward();
        mockReward.setIsActive(true);
        mockReward.setStock(0);
        mockReward.setCostInCoins(50);

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(rewardRepository.findById(rewardId)).thenReturn(Optional.of(mockReward));

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            rewardService.redeemReward(userId, rewardId);
        });

        assertEquals("Esta recompensa está indisponível ou esgotada.", exception.getMessage());
        verify(voucherRepository, never()).save(any(Voucher.class));
    }

    @Test
    @DisplayName("Regra 4 (V, V, F): Ativa, Com Estoque, Saldo Insuficiente -> Rejeita com erro de saldo")
    public void testRegra4_SaldoInsuficiente() {
        UUID userId = UUID.randomUUID();
        UUID rewardId = UUID.randomUUID();

        User mockUser = new User();
        mockUser.setCoins(30);

        Reward mockReward = new Reward();
        mockReward.setIsActive(true);
        mockReward.setStock(5);
        mockReward.setCostInCoins(50);

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(rewardRepository.findById(rewardId)).thenReturn(Optional.of(mockReward));

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            rewardService.redeemReward(userId, rewardId);
        });

        assertEquals("Saldo de moedas insuficiente para resgatar esta recompensa.", exception.getMessage());
        verify(voucherRepository, never()).save(any(Voucher.class));
    }
}
