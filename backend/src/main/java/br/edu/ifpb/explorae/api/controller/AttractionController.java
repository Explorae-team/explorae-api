package br.edu.ifpb.explorae.api.controller;

import br.edu.ifpb.explorae.api.dto.AttractionDetailsResponseDTO;
import br.edu.ifpb.explorae.api.dto.AttractionResponseDTO;
import br.edu.ifpb.explorae.api.dto.AttractionReviewDTO;
import br.edu.ifpb.explorae.api.dto.AttractionReviewRequestDTO;
import br.edu.ifpb.explorae.api.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.api.dto.ReviewResponseDTO;
import br.edu.ifpb.explorae.api.dto.CheckInResponseDTO;
import br.edu.ifpb.explorae.api.dto.FavoriteResponseDTO;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.service.AttractionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import br.edu.ifpb.explorae.service.FileStorageService;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attractions")
@RequiredArgsConstructor
public class AttractionController {

    private final AttractionService attractionService;
    private final FileStorageService fileStorageService;

    @GetMapping
public ResponseEntity<StandardResponseDTO<Page<AttractionResponseDTO>>> getAll(
        @RequestParam(required = false) String category,
        @RequestParam(required = false, defaultValue = "false") boolean fetchAll,
        @PageableDefault(size = 10) Pageable pageable) {

    Pageable pageRequest = fetchAll ? Pageable.unpaged() : pageable;

    Page<AttractionResponseDTO> page = attractionService.findAll(category, pageRequest);
    
    return ResponseEntity.ok(StandardResponseDTO.success(
            "Atrações recuperadas com sucesso",
            page));
}

    @GetMapping("/recommendations")
    public ResponseEntity<StandardResponseDTO<Page<AttractionResponseDTO>>> getRecommendations(
            @AuthenticationPrincipal User principal,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @PageableDefault(size = 10) Pageable pageable) {
            
        Page<AttractionResponseDTO> page = attractionService.getRecommendations(principal, latitude, longitude, pageable);
        return ResponseEntity.ok(StandardResponseDTO.success(
                "Recomendações recuperadas com sucesso",
                page));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponseDTO<AttractionDetailsResponseDTO>> getAttractionDetails(
            @PathVariable UUID id,
            @AuthenticationPrincipal User principal) {

        AttractionDetailsResponseDTO dto = attractionService.getAttractionDetails(id, principal);

        return ResponseEntity.ok(StandardResponseDTO.success("Detalhes da atração recuperados com sucesso", dto));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<StandardResponseDTO<ReviewResponseDTO>> addReview(
            @PathVariable UUID id,
            @Valid @RequestBody AttractionReviewRequestDTO dto,
            @AuthenticationPrincipal User principal) {

        ReviewResponseDTO responseWrapper = attractionService.addReview(id, dto, principal.getId());
        return ResponseEntity.ok(StandardResponseDTO.success("Avaliação adicionada com sucesso", responseWrapper));
    }

    @PostMapping("/{id}/check-in")
    public ResponseEntity<StandardResponseDTO<CheckInResponseDTO>> checkIn(
            @PathVariable UUID id,
            @AuthenticationPrincipal User principal) {

        CheckInResponseDTO responseWrapper = attractionService.checkIn(id, principal.getId());
        return ResponseEntity.ok(StandardResponseDTO.success("Check-in realizado com sucesso", responseWrapper));
    }

    @GetMapping("/favorites")
    public ResponseEntity<StandardResponseDTO<List<AttractionResponseDTO>>> getSavedAttractions(
            @AuthenticationPrincipal User principal) {
        List<AttractionResponseDTO> list = attractionService.getSavedAttractions(principal.getId());
        return ResponseEntity.ok(StandardResponseDTO.success("Atrações salvas recuperadas com sucesso", list));
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<StandardResponseDTO<FavoriteResponseDTO>> toggleFavorite(
            @PathVariable UUID id,
            @AuthenticationPrincipal User principal) {

        FavoriteResponseDTO responseWrapper = attractionService.toggleFavorite(id, principal.getId());
        String msg = responseWrapper.isFavorite() ? "Atração favoritada com sucesso" : "Atração removida dos favoritos";
        return ResponseEntity.ok(StandardResponseDTO.success(msg, responseWrapper));
    }

    @PostMapping("/reviews/upload")
    public ResponseEntity<StandardResponseDTO<String>> uploadReviewPhoto(
            @AuthenticationPrincipal User principal,
            @RequestParam("file") MultipartFile file) {

        String photoUrl = fileStorageService.saveFile(file, "reviews");
        return ResponseEntity.ok(StandardResponseDTO.success("Imagem da dica enviada com sucesso", photoUrl));
    }
}
