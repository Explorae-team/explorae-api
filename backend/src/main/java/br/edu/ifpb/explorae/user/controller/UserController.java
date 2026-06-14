package br.edu.ifpb.explorae.user.controller;
import br.edu.ifpb.explorae.gamification.dto.XpHistoryResponseDTO;
import br.edu.ifpb.explorae.gamification.service.GamificationService;

import br.edu.ifpb.explorae.common.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.user.dto.TravelPreferenceRequestDTO;
import br.edu.ifpb.explorae.user.dto.UserResponseDTO;
import br.edu.ifpb.explorae.user.dto.UserUpdateDTO;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.common.storage.FileStorageService;
import br.edu.ifpb.explorae.user.service.TravelPreferenceService;
import br.edu.ifpb.explorae.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private static final String MSG_PROFILE_SUCCESS = "Perfil recuperado com sucesso";
    private static final String MSG_AVATAR_SUCCESS = "Avatar enviado com sucesso";
    private static final String MSG_UPDATE_SUCCESS = "Perfil atualizado com sucesso";
    private static final String MSG_PREFERENCES_SUCCESS = "Preferências recuperadas com sucesso";
    private static final String MSG_PREFERENCES_UPDATE_SUCCESS = "Preferências atualizadas com sucesso";
    private static final String MSG_DELETE_SUCCESS = "Conta deletada com sucesso";
    private static final String MSG_XP_HISTORY_SUCCESS = "Histórico de XP recuperado com sucesso";

    private final UserService userService;
    private final TravelPreferenceService travelPreferenceService;
    private final FileStorageService fileStorageService;

    @GetMapping("/me")
    public ResponseEntity<StandardResponseDTO<UserResponseDTO>> getMe(@AuthenticationPrincipal(expression = "user") User principal) {
        UserResponseDTO responseDTO = userService.getUserProfile(principal.getId());
        return ResponseEntity.ok(StandardResponseDTO.success(MSG_PROFILE_SUCCESS, responseDTO));
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<StandardResponseDTO<String>> uploadAvatar(
            @AuthenticationPrincipal(expression = "user") User principal,
            @RequestParam("file") MultipartFile file) {

        String photoUrl = fileStorageService.saveFile(file, "avatars");

        // Remove a foto antiga se existir e for local
        if (principal.getPhotoUrl() != null) {
            fileStorageService.deleteFile(principal.getPhotoUrl());
        }

        userService.updateAvatar(principal.getId(), photoUrl);

        return ResponseEntity.ok(
                StandardResponseDTO.success(MSG_AVATAR_SUCCESS, photoUrl));
    }

    @PutMapping("/me")
    public ResponseEntity<StandardResponseDTO<UserResponseDTO>> updateMe(
            @AuthenticationPrincipal(expression = "user") User principal,
            @Valid @RequestBody UserUpdateDTO dto) {

        UserResponseDTO responseDTO = userService.updateUser(principal.getId(), dto);

        return ResponseEntity.ok(StandardResponseDTO.success(MSG_UPDATE_SUCCESS, responseDTO));
    }

    @GetMapping("/me/preferences")
    public ResponseEntity<StandardResponseDTO<java.util.List<String>>> getMyPreferences(
            @AuthenticationPrincipal(expression = "user") User principal) {

        java.util.List<String> interests = travelPreferenceService.getPreferences(principal.getId());

        return ResponseEntity.ok(
                StandardResponseDTO.success(MSG_PREFERENCES_SUCCESS, interests));
    }

    @PutMapping("/me/preferences")
    public ResponseEntity<StandardResponseDTO<Void>> updateMyPreferences(
            @Valid @RequestBody TravelPreferenceRequestDTO dto,
            @AuthenticationPrincipal(expression = "user") User currentUser) {

        travelPreferenceService.updatePreferences(currentUser.getId(), dto);

        return ResponseEntity.ok(
                StandardResponseDTO.success(MSG_PREFERENCES_UPDATE_SUCCESS, null));
    }

    @DeleteMapping("/me")
    public ResponseEntity<StandardResponseDTO<Void>> deleteMe(@AuthenticationPrincipal(expression = "user") User principal) {

        userService.deleteUser(principal.getId());

        return ResponseEntity.ok(
                StandardResponseDTO.success(MSG_DELETE_SUCCESS, null));
    }

    @GetMapping("/me/xp-history")
    public ResponseEntity<StandardResponseDTO<java.util.List<XpHistoryResponseDTO>>> getXpHistory(
            @AuthenticationPrincipal(expression = "user") User principal) {
        
        return ResponseEntity.ok(StandardResponseDTO.success(
            MSG_XP_HISTORY_SUCCESS, 
            userService.getXpHistory(principal.getId())
        ));
    }
}
