package br.edu.ifpb.explorae.api.controller;

import br.edu.ifpb.explorae.api.dto.RewardResponseDTO;
import br.edu.ifpb.explorae.api.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.api.dto.VoucherResponseDTO;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.service.RewardService;
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
            @AuthenticationPrincipal User user,
            @PathVariable UUID rewardId) {
        
        VoucherResponseDTO voucher = rewardService.redeemReward(user.getId(), rewardId);
        return ResponseEntity.ok(StandardResponseDTO.success("Recompensa resgatada com sucesso!", voucher));
    }

    @GetMapping("/my-vouchers")
    public ResponseEntity<StandardResponseDTO<List<VoucherResponseDTO>>> getUserVouchers(
            @AuthenticationPrincipal User user) {
        
        List<VoucherResponseDTO> vouchers = rewardService.getUserVouchers(user.getId());
        return ResponseEntity.ok(StandardResponseDTO.success("Seus vouchers foram recuperados com sucesso.", vouchers));
    }
}
