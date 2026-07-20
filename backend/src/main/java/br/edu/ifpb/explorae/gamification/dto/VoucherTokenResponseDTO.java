package br.edu.ifpb.explorae.gamification.dto;

import java.time.LocalDateTime;

public record VoucherTokenResponseDTO(
    String token,
    LocalDateTime expiresAt
) {}
