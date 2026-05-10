package br.edu.ifpb.explorae.api.controller;

import br.edu.ifpb.explorae.api.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.api.dto.TravelPreferenceRequestDTO;
import br.edu.ifpb.explorae.api.dto.UserResponseDTO;
import br.edu.ifpb.explorae.api.dto.UserUpdateDTO;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.service.FileStorageService;
import br.edu.ifpb.explorae.service.TravelPreferenceService;
import br.edu.ifpb.explorae.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final TravelPreferenceService travelPreferenceService;
    private final FileStorageService fileStorageService;
    private final br.edu.ifpb.explorae.service.GamificationService gamificationService;

    @GetMapping("/me")
    public ResponseEntity<StandardResponseDTO<UserResponseDTO>> getMe(@AuthenticationPrincipal User principal) {
        UserResponseDTO responseDTO = userService.getUserProfile(principal.getId());
        return ResponseEntity.ok(StandardResponseDTO.success("Perfil recuperado com sucesso", responseDTO));
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<StandardResponseDTO<String>> uploadAvatar(
            @AuthenticationPrincipal User principal,
            @RequestParam("file") MultipartFile file) {

        String photoUrl = fileStorageService.saveFile(file, "avatars");

        // Remove a foto antiga se existir e for local
        if (principal.getPhotoUrl() != null) {
            fileStorageService.deleteFile(principal.getPhotoUrl());
        }

        userService.updateAvatar(principal.getId(), photoUrl);

        return ResponseEntity.ok(
                StandardResponseDTO.success("Avatar enviado com sucesso", photoUrl));
    }

    @PutMapping("/me")
    public ResponseEntity<StandardResponseDTO<UserResponseDTO>> updateMe(
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody UserUpdateDTO dto) {

        UserResponseDTO responseDTO = userService.updateUser(principal.getId(), dto);

        return ResponseEntity.ok(StandardResponseDTO.success("Perfil atualizado com sucesso", responseDTO));
    }

    @GetMapping("/me/preferences")
    public ResponseEntity<StandardResponseDTO<java.util.List<String>>> getMyPreferences(
            @AuthenticationPrincipal User principal) {

        java.util.List<String> interests = travelPreferenceService.getPreferences(principal.getId());

        return ResponseEntity.ok(
                StandardResponseDTO.success("Preferências recuperadas com sucesso", interests));
    }

    @PutMapping("/me/preferences")
    public ResponseEntity<StandardResponseDTO<Void>> updateMyPreferences(
            @Valid @RequestBody TravelPreferenceRequestDTO dto,
            @AuthenticationPrincipal User currentUser) {

        travelPreferenceService.updatePreferences(currentUser.getId(), dto);

        return ResponseEntity.ok(
                StandardResponseDTO.success("Preferências atualizadas com sucesso", null));
    }

    @DeleteMapping("/me")
    public ResponseEntity<StandardResponseDTO<Void>> deleteMe(@AuthenticationPrincipal User principal) {

        userService.deleteUser(principal.getId());

        return ResponseEntity.ok(
                StandardResponseDTO.success("Conta deletada com sucesso", null));
    }

    @GetMapping("/me/xp-history")
    public ResponseEntity<StandardResponseDTO<java.util.List<br.edu.ifpb.explorae.api.dto.XpHistoryResponseDTO>>> getXpHistory(
            @AuthenticationPrincipal User principal) {
        
        // GamificationService é injetado ou acessado via UserService?
        // Vou injetar GamificationService no UserController para acesso direto aos stats de gamificação.
        return ResponseEntity.ok(StandardResponseDTO.success(
            "Histórico de XP recuperado com sucesso", 
            gamificationService.getXpHistory(principal.getId())
        ));
    }
}
