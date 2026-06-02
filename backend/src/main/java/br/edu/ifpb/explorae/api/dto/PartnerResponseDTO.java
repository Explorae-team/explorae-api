package br.edu.ifpb.explorae.api.dto;

import java.util.UUID;

public record PartnerResponseDTO(
    UUID id,
    String name,
    String description,
    String contactInfo,
    String photoUrl
) {}
