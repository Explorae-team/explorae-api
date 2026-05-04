package br.edu.ifpb.explorae.api.controller;

import br.edu.ifpb.explorae.api.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.api.dto.TravelPreferenceRequestDTO;
import br.edu.ifpb.explorae.api.dto.UserResponseDTO;
import br.edu.ifpb.explorae.api.dto.UserUpdateDTO;
import br.edu.ifpb.explorae.api.mapper.UserMapper;
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
    private final UserMapper userMapper;
    private final TravelPreferenceService travelPreferenceService;
    private final FileStorageService fileStorageService;

    @GetMapping("/me")
    public ResponseEntity<StandardResponseDTO<UserResponseDTO>> getMe(@AuthenticationPrincipal User principal) {
        User user = userService.findById(principal.getId());
        UserResponseDTO responseDTO = userMapper.toResponseDTO(user);
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

        User updatedUser = userService.updateUser(principal.getId(), dto);
        UserResponseDTO responseDTO = userMapper.toResponseDTO(updatedUser);

        return ResponseEntity.ok(StandardResponseDTO.success("Perfil atualizado com sucesso", responseDTO));
    }

    @PutMapping("/me/preferences")
    public ResponseEntity<StandardResponseDTO<Void>> updateMyPreferences(
            @Valid @RequestBody TravelPreferenceRequestDTO dto,
            Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();

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
}
