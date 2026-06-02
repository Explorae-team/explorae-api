package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.api.dto.RewardResponseDTO;
import br.edu.ifpb.explorae.api.dto.VoucherResponseDTO;
import br.edu.ifpb.explorae.api.exception.BusinessException;
import br.edu.ifpb.explorae.api.exception.ResourceNotFoundException;
import br.edu.ifpb.explorae.api.mapper.RewardMapper;
import br.edu.ifpb.explorae.domain.reward.Reward;
import br.edu.ifpb.explorae.domain.reward.Voucher;
import br.edu.ifpb.explorae.domain.reward.VoucherStatus;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.RewardRepository;
import br.edu.ifpb.explorae.repository.UserRepository;
import br.edu.ifpb.explorae.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final RewardRepository rewardRepository;
    private final VoucherRepository voucherRepository;
    private final UserRepository userRepository;
    private final RewardMapper rewardMapper;

    @Transactional(readOnly = true)
    public List<RewardResponseDTO> getActiveRewards() {
        List<Reward> rewards = rewardRepository.findByIsActiveTrueAndStockGreaterThan(0);
        return rewardMapper.toRewardDTOList(rewards);
    }

    @Transactional
    public VoucherResponseDTO redeemReward(UUID userId, UUID rewardId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new ResourceNotFoundException("Recompensa não encontrada."));

        if (!reward.getIsActive() || reward.getStock() <= 0) {
            throw new BusinessException("Esta recompensa está indisponível ou esgotada.");
        }

        if (user.getCoins() < reward.getCostInCoins()) {
            throw new BusinessException("Saldo de moedas insuficiente para resgatar esta recompensa.");
        }

        // Debita moedas
        user.setCoins(user.getCoins() - reward.getCostInCoins());
        userRepository.save(user);

        // Decrementa estoque
        reward.setStock(reward.getStock() - 1);
        rewardRepository.save(reward);

        // Gera código de cupom
        String couponCode = "EXP-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();

        Voucher voucher = Voucher.builder()
                .user(user)
                .reward(reward)
                .code(couponCode)
                .status(VoucherStatus.ACTIVE)
                .expiresAt(java.time.LocalDateTime.now().plusDays(30))
                .build();

        Voucher savedVoucher = voucherRepository.save(voucher);

        return rewardMapper.toVoucherDTO(savedVoucher);
    }

    @Transactional(readOnly = true)
    public List<VoucherResponseDTO> getUserVouchers(UUID userId) {
        List<Voucher> vouchers = voucherRepository.findByUserIdOrderByRedeemedAtDesc(userId);
        return rewardMapper.toVoucherDTOList(vouchers);
    }
}
