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
@DisplayName("Nível 1 - Teste de Unidade (Classes de Equivalência)")
public class RewardEquivalenciaUnitTest {

    @InjectMocks
    private RewardService rewardService;

    @Mock private UserRepository userRepository;
    @Mock private RewardRepository rewardRepository;
    @Mock private VoucherRepository voucherRepository;
    @Mock private RewardMapper rewardMapper;

    @Test
    @DisplayName("Classe Inválida: Deve negar resgate quando moedas forem insuficientes (< 50)")
    public void testClasseEquivalenciaInvalida_SaldoInsuficiente() {
        UUID userId = UUID.randomUUID();
        UUID rewardId = UUID.randomUUID();

        User mockUser = new User();
        mockUser.setCoins(20);

        Reward mockReward = new Reward();
        mockReward.setIsActive(true);
        mockReward.setStock(10);
        mockReward.setCostInCoins(50);

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(rewardRepository.findById(rewardId)).thenReturn(Optional.of(mockReward));

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            rewardService.redeemReward(userId, rewardId);
        });
        assertEquals("Saldo de moedas insuficiente para resgatar esta recompensa.", exception.getMessage());
    }

    @Test
    @DisplayName("Classe Válida: Deve aprovar resgate e deduzir moedas quando saldo for suficiente (>= 50)")
    public void testClasseEquivalenciaValida_Sucesso() {
        UUID userId = UUID.randomUUID();
        UUID rewardId = UUID.randomUUID();

        User mockUser = new User();
        mockUser.setCoins(100);

        Reward mockReward = new Reward();
        mockReward.setIsActive(true);
        mockReward.setStock(10);
        mockReward.setCostInCoins(50);

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(rewardRepository.findById(rewardId)).thenReturn(Optional.of(mockReward));
        when(voucherRepository.save(any(Voucher.class))).thenReturn(new Voucher());
        when(rewardMapper.toVoucherDTO(any(Voucher.class))).thenReturn(mock(VoucherResponseDTO.class));

        VoucherResponseDTO response = rewardService.redeemReward(userId, rewardId);

        assertEquals(50, mockUser.getCoins());
        assertEquals(9, mockReward.getStock());
        assertNotNull(response);

        verify(userRepository, times(1)).save(mockUser);
        verify(rewardRepository, times(1)).save(mockReward);
        verify(voucherRepository, times(1)).save(any(Voucher.class));
    }
}
