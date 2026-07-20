package br.edu.ifpb.explorae.gamification.dto;

import jakarta.validation.constraints.NotBlank;

public record VoucherValidationRequestDTO(
    @NotBlank(message = "O token de validação é obrigatório.")
    String token
) {}
