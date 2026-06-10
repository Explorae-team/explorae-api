package br.edu.ifpb.explorae.user.controller;

import br.edu.ifpb.explorae.user.dto.AuthLoginResponseDTO;
import br.edu.ifpb.explorae.user.dto.LoginDTO;
import br.edu.ifpb.explorae.common.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.user.dto.ResetPasswordDTO;
import br.edu.ifpb.explorae.user.dto.UserRegistrationDTO;
import br.edu.ifpb.explorae.user.dto.UserResponseDTO;
import br.edu.ifpb.explorae.user.service.AuthService;
import br.edu.ifpb.explorae.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * O usuário apresenta suas credenciais
 * e ganha o Token JWT.
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    /**
     * Endpoint de Cadastro:
     * Recebe os dados, valida, e cadastra o usuário.
     */
    @PostMapping("/register")
    public ResponseEntity<StandardResponseDTO<UserResponseDTO>> register(@Valid @RequestBody UserRegistrationDTO dto) {
        UserResponseDTO responseDTO = userService.registerUser(dto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(StandardResponseDTO.success("Usuário cadastrado com sucesso", responseDTO));
    }

    /**
     * Endpoint de Login:
     * 1. Recebe email e senha do usuário.
     * 2. Confere se estão certos.
     * 3. Cria e devolve o Token JWT.
     */
    @PostMapping("/login")
    public ResponseEntity<StandardResponseDTO<AuthLoginResponseDTO>> login(@RequestBody @Valid LoginDTO loginDTO) {
        AuthLoginResponseDTO responseDTO = authService.login(loginDTO);

        return ResponseEntity.ok(StandardResponseDTO.success(
                "Show! Login realizado com sucesso. Bem-vindo de volta!", responseDTO));
    }

    /**
     * Endpoint de Redefinição de Senha:
     * Redefine a senha de um usuário existente.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<StandardResponseDTO<Void>> resetPassword(@RequestBody @Valid ResetPasswordDTO dto) {
        userService.resetPassword(dto.email(), dto.password());
        return ResponseEntity.ok(StandardResponseDTO.success("Senha redefinida com sucesso!", null));
    }
}
