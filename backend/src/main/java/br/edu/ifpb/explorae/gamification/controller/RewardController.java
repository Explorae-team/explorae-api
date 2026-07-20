package br.edu.ifpb.explorae.gamification.controller;
import br.edu.ifpb.explorae.gamification.domain.Voucher;

import br.edu.ifpb.explorae.gamification.dto.RewardResponseDTO;
import br.edu.ifpb.explorae.common.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.gamification.dto.VoucherResponseDTO;
import br.edu.ifpb.explorae.gamification.dto.VoucherTokenResponseDTO;
import br.edu.ifpb.explorae.gamification.dto.VoucherValidationRequestDTO;
import br.edu.ifpb.explorae.gamification.dto.VoucherValidationResponseDTO;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.gamification.service.RewardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    @GetMapping
    public ResponseEntity<StandardResponseDTO<List<RewardResponseDTO>>> getActiveRewards() {
        List<RewardResponseDTO> rewards = rewardService.getActiveRewards();
        return ResponseEntity.ok(StandardResponseDTO.success("Catálogo de recompensas recuperado com sucesso.", rewards));
    }

    @PostMapping("/redeem/{rewardId}")
    public ResponseEntity<StandardResponseDTO<VoucherResponseDTO>> redeemReward(
            @AuthenticationPrincipal(expression = "user") User user,
            @PathVariable UUID rewardId) {
        
        VoucherResponseDTO voucher = rewardService.redeemReward(user.getId(), rewardId);
        return ResponseEntity.ok(StandardResponseDTO.success("Recompensa resgatada com sucesso!", voucher));
    }

    @GetMapping("/my-vouchers")
    public ResponseEntity<StandardResponseDTO<List<VoucherResponseDTO>>> getUserVouchers(
            @AuthenticationPrincipal(expression = "user") User user) {
        
        List<VoucherResponseDTO> vouchers = rewardService.getUserVouchers(user.getId());
        return ResponseEntity.ok(StandardResponseDTO.success("Seus vouchers foram recuperados com sucesso.", vouchers));
    }

    @PostMapping("/vouchers/{voucherId}/token")
    public ResponseEntity<StandardResponseDTO<VoucherTokenResponseDTO>> generateVoucherToken(
            @AuthenticationPrincipal(expression = "user") User user,
            @PathVariable UUID voucherId) {
        
        VoucherTokenResponseDTO tokenResponse = rewardService.generateVoucherToken(user.getId(), voucherId);
        return ResponseEntity.ok(StandardResponseDTO.success("Token de validação dinâmico gerado com sucesso.", tokenResponse));
    }

    @PostMapping("/vouchers/validate")
    public ResponseEntity<StandardResponseDTO<VoucherValidationResponseDTO>> validateVoucher(
            @Valid @RequestBody VoucherValidationRequestDTO request) {
        
        VoucherValidationResponseDTO validationResponse = rewardService.validateVoucherToken(request.token());
        return ResponseEntity.ok(StandardResponseDTO.success("Voucher validado com sucesso pelo estabelecimento parceiro!", validationResponse));
    }
}
