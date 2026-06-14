package br.edu.ifpb.explorae.gamification.controller;

import br.edu.ifpb.explorae.common.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.gamification.dto.XpHistoryResponseDTO;
import br.edu.ifpb.explorae.gamification.service.GamificationService;
import br.edu.ifpb.explorae.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users/me/xp-history")
@RequiredArgsConstructor
public class UserGamificationController {

    private final GamificationService gamificationService;

    @GetMapping
    public ResponseEntity<StandardResponseDTO<java.util.List<XpHistoryResponseDTO>>> getXpHistory(
            @AuthenticationPrincipal User principal) {
        
        return ResponseEntity.ok(StandardResponseDTO.success(
            "Histórico de XP recuperado com sucesso", 
            gamificationService.getXpHistory(principal.getId())
        ));
    }
}
