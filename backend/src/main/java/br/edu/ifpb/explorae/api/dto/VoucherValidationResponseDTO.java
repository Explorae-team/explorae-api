package br.edu.ifpb.explorae.api.dto;

import java.time.LocalDateTime;

public record VoucherValidationResponseDTO(
    String voucherCode,
    String rewardName,
    String partnerName,
    String userName,
    LocalDateTime validatedAt
) {}
