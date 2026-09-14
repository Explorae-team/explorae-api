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
@DisplayName("Nível 1 - Teste de Unidade (Valor Limite - Estoque)")
public class RewardValorLimiteUnitTest {

    @InjectMocks
    private RewardService rewardService;

    @Mock private UserRepository userRepository;
    @Mock private RewardRepository rewardRepository;
    @Mock private VoucherRepository voucherRepository;
    @Mock private RewardMapper rewardMapper;

    @Test
    @DisplayName("Valor Limite Inválido (Estoque = 0): Deve rejeitar resgate de recompensa esgotada")
    public void testValorLimiteInvalido_EstoqueZero() {
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
        verify(rewardRepository, never()).save(any(Reward.class));
    }

    @Test
    @DisplayName("Valor Limite Válido (Estoque = 1): Deve aprovar resgate e zerar o estoque")
    public void testValorLimiteValido_EstoqueUm() {
        UUID userId = UUID.randomUUID();
        UUID rewardId = UUID.randomUUID();

        User mockUser = new User();
        mockUser.setCoins(100);

        Reward mockReward = new Reward();
        mockReward.setIsActive(true);
        mockReward.setStock(1);
        mockReward.setCostInCoins(50);

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(rewardRepository.findById(rewardId)).thenReturn(Optional.of(mockReward));
        when(voucherRepository.save(any(Voucher.class))).thenReturn(new Voucher());
        when(rewardMapper.toVoucherDTO(any(Voucher.class))).thenReturn(mock(VoucherResponseDTO.class));

        VoucherResponseDTO response = rewardService.redeemReward(userId, rewardId);

        assertNotNull(response);
        assertEquals(0, mockReward.getStock());
        assertEquals(50, mockUser.getCoins());

        verify(rewardRepository, times(1)).save(mockReward);
        verify(voucherRepository, times(1)).save(any(Voucher.class));
    }
}
