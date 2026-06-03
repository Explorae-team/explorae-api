package br.edu.ifpb.explorae.api.dto;

import jakarta.validation.constraints.NotBlank;

public record VoucherValidationRequestDTO(
    @NotBlank(message = "O token de validação é obrigatório.")
    String token
) {}
