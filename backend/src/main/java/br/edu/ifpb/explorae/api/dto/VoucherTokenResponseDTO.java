package br.edu.ifpb.explorae.api.dto;

import java.time.LocalDateTime;

public record VoucherTokenResponseDTO(
    String token,
    LocalDateTime expiresAt
) {}
