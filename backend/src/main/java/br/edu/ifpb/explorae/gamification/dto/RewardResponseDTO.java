package br.edu.ifpb.explorae.gamification.dto;

import br.edu.ifpb.explorae.gamification.domain.RewardType;
import java.util.UUID;

public record RewardResponseDTO(
    UUID id,
    PartnerResponseDTO partner,
    String name,
    String description,
    RewardType type,
    Integer costInCoins,
    Integer stock,
    String imageUrl
) {}
