package br.edu.ifpb.explorae.api.dto;

import br.edu.ifpb.explorae.domain.reward.VoucherStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record VoucherResponseDTO(
    UUID id,
    UUID userId,
    RewardResponseDTO reward,
    String code,
    VoucherStatus status,
    LocalDateTime redeemedAt,
    LocalDateTime expiresAt,
    LocalDateTime usedAt
) {}
