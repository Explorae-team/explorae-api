package br.edu.ifpb.explorae.user.controller;

import br.edu.ifpb.explorae.common.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.user.dto.TravelPreferenceRequestDTO;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.service.TravelPreferenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/me/preferences")
@RequiredArgsConstructor
public class TravelPreferenceController {

    private final TravelPreferenceService travelPreferenceService;

    @GetMapping
    public ResponseEntity<StandardResponseDTO<java.util.List<String>>> getMyPreferences(
            @AuthenticationPrincipal User principal) {

        java.util.List<String> interests = travelPreferenceService.getPreferences(principal.getId());

        return ResponseEntity.ok(
                StandardResponseDTO.success("Preferências recuperadas com sucesso", interests));
    }

    @PutMapping
    public ResponseEntity<StandardResponseDTO<Void>> updateMyPreferences(
            @Valid @RequestBody TravelPreferenceRequestDTO dto,
            @AuthenticationPrincipal User currentUser) {

        travelPreferenceService.updatePreferences(currentUser.getId(), dto);

        return ResponseEntity.ok(
                StandardResponseDTO.success("Preferências atualizadas com sucesso", null));
    }
}
