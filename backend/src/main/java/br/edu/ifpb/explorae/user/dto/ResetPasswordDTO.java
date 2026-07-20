package br.edu.ifpb.explorae.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordDTO(
    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "O e-mail deve ser válido")
    String email,

    @NotBlank(message = "A nova senha é obrigatória")
    @Size(min = 8, max = 32, message = "A senha deve ter entre 8 e 32 caracteres")
    String password
) {}
