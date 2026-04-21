package br.edu.ifpb.explorae.api.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record TravelPreferenceRequestDTO(
    @NotEmpty(message = "Pelo menos um interesse deve ser informado.")
    List<String> interests
) {}
