package br.edu.ifpb.explorae.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserUpdateDTO(
    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
    String name,

    @Size(max = 20, message = "O telefone deve ter no máximo 20 caracteres")
    String phone,

    @Size(max = 150, message = "A bio deve ter no máximo 150 caracteres")
    String bio,

    @Size(max = 255, message = "A URL da foto deve ter no máximo 255 caracteres")
    String photoUrl
) {}
