package br.edu.ifpb.explorae.api.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthLoginResponseDTO(
        @NotBlank(message = "O token é obrigatório") String token,
        @NotBlank(message = "O usuário é obrigatório") UserResponseDTO user) {
}
