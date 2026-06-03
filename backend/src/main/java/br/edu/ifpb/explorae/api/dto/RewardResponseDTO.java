package br.edu.ifpb.explorae.api.dto;

import br.edu.ifpb.explorae.domain.reward.RewardType;
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
