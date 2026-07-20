package br.edu.ifpb.explorae.user.controller;

import br.edu.ifpb.explorae.common.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.user.dto.UserResponseDTO;
import br.edu.ifpb.explorae.user.dto.UserUpdateDTO;
import br.edu.ifpb.explorae.user.dto.TravelPreferenceRequestDTO;
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

    private static final String MSG_PROFILE_SUCCESS = "Perfil recuperado com sucesso";
    private static final String MSG_AVATAR_SUCCESS = "Avatar enviado com sucesso";
    private static final String MSG_UPDATE_SUCCESS = "Perfil atualizado com sucesso";
    private static final String MSG_DELETE_SUCCESS = "Conta deletada com sucesso";

    private final UserService userService;
    private final UserProfileService userProfileService;

    @GetMapping("/me")
    public ResponseEntity<StandardResponseDTO<UserResponseDTO>> getMe(@AuthenticationPrincipal(expression = "user") User principal) {
        UserResponseDTO responseDTO = userProfileService.getUserProfile(principal.getId());
        return ResponseEntity.ok(StandardResponseDTO.success(MSG_PROFILE_SUCCESS, responseDTO));
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<StandardResponseDTO<String>> uploadAvatar(
            @AuthenticationPrincipal(expression = "user") User principal,
            @RequestParam("file") MultipartFile file) {

        String photoUrl = userProfileService.uploadAvatar(principal, file);

        return ResponseEntity.ok(
                StandardResponseDTO.success(MSG_AVATAR_SUCCESS, photoUrl));
    }

    @PutMapping("/me")
    public ResponseEntity<StandardResponseDTO<UserResponseDTO>> updateMe(
            @AuthenticationPrincipal(expression = "user") User principal,
            @Valid @RequestBody UserUpdateDTO dto) {

        UserResponseDTO responseDTO = userProfileService.updateUser(principal.getId(), dto);

        return ResponseEntity.ok(StandardResponseDTO.success(MSG_UPDATE_SUCCESS, responseDTO));
    }



    @DeleteMapping("/me")
    public ResponseEntity<StandardResponseDTO<Void>> deleteMe(@AuthenticationPrincipal(expression = "user") User principal) {

        userService.deleteUser(principal.getId());

        return ResponseEntity.ok(
                StandardResponseDTO.success(MSG_DELETE_SUCCESS, null));
    }
}
