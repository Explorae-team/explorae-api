package br.edu.ifpb.explorae.gamification.controller;

import br.edu.ifpb.explorae.gamification.dto.BadgeResponseDTO;
import br.edu.ifpb.explorae.common.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.gamification.service.BadgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/badges")
@RequiredArgsConstructor
public class BadgeController {

    private final BadgeService badgeService;

    @GetMapping
    public ResponseEntity<StandardResponseDTO<List<BadgeResponseDTO>>> getAllBadges(@AuthenticationPrincipal User principal) {
        List<BadgeResponseDTO> badges = badgeService.getAllBadgesWithProgress(principal);
        return ResponseEntity.ok(StandardResponseDTO.success("Medalhas recuperadas com sucesso", badges));
    }
}
