package br.edu.ifpb.explorae.api.controller;

import br.edu.ifpb.explorae.api.dto.AttractionDetailsResponseDTO;
import br.edu.ifpb.explorae.api.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.service.AttractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import br.edu.ifpb.explorae.api.dto.AttractionReviewRequestDTO;
import br.edu.ifpb.explorae.api.dto.AttractionReviewDTO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/attractions")
@RequiredArgsConstructor
public class AttractionController {

    private final AttractionService attractionService;

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponseDTO<AttractionDetailsResponseDTO>> getAttractionDetails(
            @PathVariable UUID id,
            @AuthenticationPrincipal User principal) {

        AttractionDetailsResponseDTO dto = attractionService.getAttractionDetails(id, principal);

        return ResponseEntity.ok(StandardResponseDTO.success("Detalhes da atração recuperados com sucesso", dto));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<StandardResponseDTO<AttractionReviewDTO>> addReview(
            @PathVariable UUID id,
            @Valid @RequestBody AttractionReviewRequestDTO dto,
            @AuthenticationPrincipal User principal) {

        AttractionReviewDTO responseDto = attractionService.addReview(id, dto, principal.getId());
        return ResponseEntity.ok(StandardResponseDTO.success("Avaliação adicionada com sucesso", responseDto));
    }
}
