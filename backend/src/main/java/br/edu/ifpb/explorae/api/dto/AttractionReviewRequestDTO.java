package br.edu.ifpb.explorae.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AttractionReviewRequestDTO(
    @NotBlank(message = "O conteúdo da avaliação não pode ser vazio")
    @Size(max = 500, message = "A avaliação deve ter no máximo 500 caracteres")
    String content,

    @NotNull(message = "A nota é obrigatória")
    @Min(value = 1, message = "A nota mínima é 1")
    @Max(value = 5, message = "A nota máxima é 5")
    Integer rating
) {}
