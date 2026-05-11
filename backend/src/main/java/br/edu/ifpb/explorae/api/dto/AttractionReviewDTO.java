package br.edu.ifpb.explorae.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AttractionReviewDTO(
    UUID id,
    String userName,
    String userPhotoUrl,
    String content,
    Integer rating,
    LocalDateTime createdAt
) {}
