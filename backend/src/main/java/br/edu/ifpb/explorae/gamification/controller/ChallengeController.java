package br.edu.ifpb.explorae.gamification.controller;

import br.edu.ifpb.explorae.gamification.dto.ChallengeProgressDTO;
import br.edu.ifpb.explorae.common.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.gamification.service.ChallengeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/challenges")
@RequiredArgsConstructor
public class ChallengeController {

    private final ChallengeService challengeService;

    @GetMapping
    public ResponseEntity<StandardResponseDTO<List<ChallengeProgressDTO>>> getActiveChallenges(
            @AuthenticationPrincipal(expression = "user") User principal) {
        
        List<ChallengeProgressDTO> progress = challengeService.getActiveChallengesForUser(principal.getId());
        return ResponseEntity.ok(StandardResponseDTO.success("Desafios recuperados com sucesso", progress));
    }
}
