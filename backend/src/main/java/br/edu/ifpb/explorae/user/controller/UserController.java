package br.edu.ifpb.explorae.user.controller;

import br.edu.ifpb.explorae.common.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.user.dto.UserResponseDTO;
import br.edu.ifpb.explorae.user.dto.UserUpdateDTO;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.service.UserService;
import br.edu.ifpb.explorae.user.service.UserProfileService;
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

    private final UserService userService;
    private final UserProfileService userProfileService;

    @GetMapping("/me")
    public ResponseEntity<StandardResponseDTO<UserResponseDTO>> getMe(@AuthenticationPrincipal User principal) {
        UserResponseDTO responseDTO = userProfileService.getUserProfile(principal.getId());
        return ResponseEntity.ok(StandardResponseDTO.success("Perfil recuperado com sucesso", responseDTO));
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<StandardResponseDTO<String>> uploadAvatar(
            @AuthenticationPrincipal User principal,
            @RequestParam("file") MultipartFile file) {

        String photoUrl = userProfileService.uploadAvatar(principal, file);

        return ResponseEntity.ok(
                StandardResponseDTO.success("Avatar enviado com sucesso", photoUrl));
    }

    @PutMapping("/me")
    public ResponseEntity<StandardResponseDTO<UserResponseDTO>> updateMe(
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody UserUpdateDTO dto) {

        UserResponseDTO responseDTO = userProfileService.updateUser(principal.getId(), dto);

        return ResponseEntity.ok(StandardResponseDTO.success("Perfil atualizado com sucesso", responseDTO));
    }

    @DeleteMapping("/me")
    public ResponseEntity<StandardResponseDTO<Void>> deleteMe(@AuthenticationPrincipal User principal) {

        userService.deleteUser(principal.getId());

        return ResponseEntity.ok(
                StandardResponseDTO.success("Conta deletada com sucesso", null));
    }
}


