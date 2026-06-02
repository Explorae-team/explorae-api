package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.api.dto.PartnerResponseDTO;
import br.edu.ifpb.explorae.api.dto.RewardResponseDTO;
import br.edu.ifpb.explorae.api.dto.VoucherResponseDTO;
import br.edu.ifpb.explorae.api.exception.BusinessException;
import br.edu.ifpb.explorae.api.exception.ResourceNotFoundException;
import br.edu.ifpb.explorae.api.mapper.RewardMapper;
import br.edu.ifpb.explorae.domain.reward.Partner;
import br.edu.ifpb.explorae.domain.reward.Reward;
import br.edu.ifpb.explorae.domain.reward.RewardType;
import br.edu.ifpb.explorae.domain.reward.Voucher;
import br.edu.ifpb.explorae.domain.reward.VoucherStatus;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.RewardRepository;
import br.edu.ifpb.explorae.repository.UserRepository;
import br.edu.ifpb.explorae.repository.VoucherRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RewardServiceTest {

    @Mock
    private RewardRepository rewardRepository;

    @Mock
    private VoucherRepository voucherRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RewardMapper rewardMapper;

    @InjectMocks
    private RewardService rewardService;

    @Test
    @DisplayName("Deve retornar recompensas ativas corretamente")
    void shouldGetActiveRewards() {
        // Arrange
        Reward reward = Reward.builder().id(UUID.randomUUID()).name("Recompensa 1").isActive(true).stock(10).build();
        List<Reward> rewards = List.of(reward);
        
        PartnerResponseDTO partnerDTO = new PartnerResponseDTO(UUID.randomUUID(), "Parceiro", "Desc", "Contato", "foto");
        RewardResponseDTO responseDTO = new RewardResponseDTO(reward.getId(), partnerDTO, "Recompensa 1", "Desc", RewardType.DISCOUNT, 100, 10, "imagem");
        
        when(rewardRepository.findByIsActiveTrueAndStockGreaterThan(0)).thenReturn(rewards);
        when(rewardMapper.toRewardDTOList(rewards)).thenReturn(List.of(responseDTO));

        // Act
        List<RewardResponseDTO> result = rewardService.getActiveRewards();

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).name()).isEqualTo("Recompensa 1");
    }

    @Test
    @DisplayName("Deve resgatar recompensa com sucesso")
    void shouldRedeemRewardSuccessfully() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UUID rewardId = UUID.randomUUID();

        User user = User.builder().id(userId).coins(500).build();
        Partner partner = Partner.builder().id(UUID.randomUUID()).name("Parceiro").build();
        Reward reward = Reward.builder().id(rewardId).partner(partner).name("Recompensa").costInCoins(200).stock(5).isActive(true).build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(rewardRepository.findById(rewardId)).thenReturn(Optional.of(reward));
        when(voucherRepository.save(any(Voucher.class))).thenAnswer(invocation -> invocation.getArgument(0));
        
        PartnerResponseDTO partnerDTO = new PartnerResponseDTO(partner.getId(), "Parceiro", "Desc", "Contato", "foto");
        RewardResponseDTO rewardDTO = new RewardResponseDTO(rewardId, partnerDTO, "Recompensa", "Desc", RewardType.DISCOUNT, 200, 4, "imagem");
        VoucherResponseDTO voucherDTO = new VoucherResponseDTO(UUID.randomUUID(), userId, rewardDTO, "EXP-12345678", VoucherStatus.ACTIVE, LocalDateTime.now(), LocalDateTime.now().plusDays(30));
        
        when(rewardMapper.toVoucherDTO(any(Voucher.class))).thenReturn(voucherDTO);

        // Act
        VoucherResponseDTO result = rewardService.redeemReward(userId, rewardId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(user.getCoins()).isEqualTo(300); // 500 - 200
        assertThat(reward.getStock()).isEqualTo(4); // 5 - 1
        verify(userRepository).save(user);
        verify(rewardRepository).save(reward);
        verify(voucherRepository).save(any(Voucher.class));
    }

    @Test
    @DisplayName("Deve falhar resgate quando usuário não for encontrado")
    void shouldFailRedeemWhenUserNotFound() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UUID rewardId = UUID.randomUUID();

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> rewardService.redeemReward(userId, rewardId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Usuário não encontrado.");
    }

    @Test
    @DisplayName("Deve falhar resgate quando recompensa não for encontrada")
    void shouldFailRedeemWhenRewardNotFound() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UUID rewardId = UUID.randomUUID();

        User user = User.builder().id(userId).build();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(rewardRepository.findById(rewardId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> rewardService.redeemReward(userId, rewardId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Recompensa não encontrada.");
    }

    @Test
    @DisplayName("Deve falhar resgate quando recompensa estiver inativa ou sem estoque")
    void shouldFailRedeemWhenRewardInactiveOrOutOfStock() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UUID rewardId = UUID.randomUUID();

        User user = User.builder().id(userId).coins(500).build();
        Reward reward = Reward.builder().id(rewardId).costInCoins(200).stock(0).isActive(true).build(); // stock = 0

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(rewardRepository.findById(rewardId)).thenReturn(Optional.of(reward));

        // Act & Assert
        assertThatThrownBy(() -> rewardService.redeemReward(userId, rewardId))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Esta recompensa está indisponível ou esgotada.");
    }

    @Test
    @DisplayName("Deve falhar resgate quando saldo de moedas for insuficiente")
    void shouldFailRedeemWhenInsufficientCoins() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UUID rewardId = UUID.randomUUID();

        User user = User.builder().id(userId).coins(100).build(); // coins = 100
        Reward reward = Reward.builder().id(rewardId).costInCoins(200).stock(5).isActive(true).build(); // cost = 200

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(rewardRepository.findById(rewardId)).thenReturn(Optional.of(reward));

        // Act & Assert
        assertThatThrownBy(() -> rewardService.redeemReward(userId, rewardId))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Saldo de moedas insuficiente para resgatar esta recompensa.");
    }

    @Test
    @DisplayName("Deve retornar vouchers do usuário logado")
    void shouldGetUserVouchers() {
        // Arrange
        UUID userId = UUID.randomUUID();
        Voucher voucher = Voucher.builder().id(UUID.randomUUID()).code("EXP-123").build();
        List<Voucher> vouchers = List.of(voucher);
        
        PartnerResponseDTO partnerDTO = new PartnerResponseDTO(UUID.randomUUID(), "Parceiro", "Desc", "Contato", "foto");
        RewardResponseDTO rewardDTO = new RewardResponseDTO(UUID.randomUUID(), partnerDTO, "Recompensa", "Desc", RewardType.DISCOUNT, 200, 4, "imagem");
        VoucherResponseDTO responseDTO = new VoucherResponseDTO(voucher.getId(), userId, rewardDTO, "EXP-123", VoucherStatus.ACTIVE, LocalDateTime.now(), LocalDateTime.now().plusDays(30));
        
        when(voucherRepository.findByUserIdOrderByRedeemedAtDesc(userId)).thenReturn(vouchers);
        when(rewardMapper.toVoucherDTOList(vouchers)).thenReturn(List.of(responseDTO));

        // Act
        List<VoucherResponseDTO> result = rewardService.getUserVouchers(userId);

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).code()).isEqualTo("EXP-123");
    }
}
