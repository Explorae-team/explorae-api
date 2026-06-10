package br.edu.ifpb.explorae.gamification.service;
import br.edu.ifpb.explorae.user.service.TokenService;

import br.edu.ifpb.explorae.gamification.dto.RewardResponseDTO;
import br.edu.ifpb.explorae.gamification.dto.VoucherResponseDTO;
import br.edu.ifpb.explorae.gamification.dto.VoucherTokenResponseDTO;
import br.edu.ifpb.explorae.gamification.dto.VoucherValidationResponseDTO;
import br.edu.ifpb.explorae.common.exception.BusinessException;
import br.edu.ifpb.explorae.common.exception.ResourceNotFoundException;
import br.edu.ifpb.explorae.gamification.mapper.RewardMapper;
import br.edu.ifpb.explorae.gamification.domain.Reward;
import br.edu.ifpb.explorae.gamification.domain.Voucher;
import br.edu.ifpb.explorae.gamification.domain.VoucherStatus;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.gamification.repository.RewardRepository;
import br.edu.ifpb.explorae.user.repository.UserRepository;
import br.edu.ifpb.explorae.gamification.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final RewardRepository rewardRepository;
    private final VoucherRepository voucherRepository;
    private final UserRepository userRepository;
    private final RewardMapper rewardMapper;
    private final TokenService tokenService;

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

    @Transactional(readOnly = true)
    public VoucherTokenResponseDTO generateVoucherToken(UUID userId, UUID voucherId) {
        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher não encontrado."));

        if (!voucher.getUser().getId().equals(userId)) {
            throw new BusinessException("Acesso negado. Este voucher não pertence a você.");
        }

        if (voucher.getStatus() != VoucherStatus.ACTIVE) {
            throw new BusinessException("Apenas vouchers ATIVOS podem ter QR Codes gerados.");
        }

        if (voucher.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Este voucher expirou e não pode mais ser utilizado.");
        }

        String token = tokenService.generateVoucherToken(voucherId);
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15);

        return new VoucherTokenResponseDTO(token, expiresAt);
    }

    @Transactional
    public VoucherValidationResponseDTO validateVoucherToken(String token) {
        UUID voucherId;
        try {
            voucherId = tokenService.extractVoucherIdFromToken(token);
        } catch (Exception e) {
            throw new BusinessException("QR Code inválido, corrompido ou expirado.");
        }

        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher não encontrado no sistema."));

        if (voucher.getStatus() != VoucherStatus.ACTIVE) {
            if (voucher.getStatus() == VoucherStatus.USED) {
                throw new BusinessException("Este voucher já foi utilizado.");
            }
            throw new BusinessException("Este voucher está inativo ou expirado.");
        }

        if (voucher.getExpiresAt().isBefore(LocalDateTime.now())) {
            voucher.setStatus(VoucherStatus.EXPIRED);
            voucherRepository.save(voucher);
            throw new BusinessException("Este voucher expirou e não pode ser validado.");
        }

        voucher.setStatus(VoucherStatus.USED);
        voucher.setUsedAt(LocalDateTime.now());
        Voucher savedVoucher = voucherRepository.save(voucher);

        return new VoucherValidationResponseDTO(
                savedVoucher.getCode(),
                savedVoucher.getReward().getName(),
                savedVoucher.getReward().getPartner().getName(),
                savedVoucher.getUser().getName(),
                savedVoucher.getUsedAt()
        );
    }
}
