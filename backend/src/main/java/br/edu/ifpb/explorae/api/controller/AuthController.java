package br.edu.ifpb.explorae.api.controller;

import br.edu.ifpb.explorae.api.dto.AuthLoginResponseDTO;
import br.edu.ifpb.explorae.api.dto.LoginDTO;
import br.edu.ifpb.explorae.api.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.api.dto.UserRegistrationDTO;
import br.edu.ifpb.explorae.api.dto.UserResponseDTO;
import br.edu.ifpb.explorae.api.mapper.UserMapper;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.service.TokenService;
import br.edu.ifpb.explorae.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UserService userService;
    private final UserMapper userMapper;

    public AuthController(AuthenticationManager authenticationManager, TokenService tokenService, UserService userService, UserMapper userMapper) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.userService = userService;
        this.userMapper = userMapper;
    }

    /**
     * Endpoint de Cadastro:
     * Recebe os dados, valida, e cadastra o usuário.
     */
    @PostMapping("/register")
    public ResponseEntity<StandardResponseDTO<UserResponseDTO>> register(@Valid @RequestBody UserRegistrationDTO dto) {
        User registeredUser = userService.registerUser(dto);
        UserResponseDTO responseDTO = userMapper.toResponseDTO(registeredUser);
        
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

        // Cria um envelope com as credenciais.
        UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(loginDTO.email(), loginDTO.password());

        // Pede pro Spring conferir se esse envelope confere com o banco.
        // Se não confere, lançauma exceção.
        Authentication authentication = authenticationManager.authenticate(authToken);

        // Se passamr pelo authenticate, pegamos os dados do usuário.
        User user = (User) authentication.getPrincipal();
        
        // Fabrica o Token pra esse usuário.
        String token = tokenService.generateToken(user);
        
        // Mapeia os dados do Usuário
        UserResponseDTO userResponse = userMapper.toResponseDTO(user);

        // Devolve o Token e os dados pra ele usar nas próximas requisições.
        return ResponseEntity.ok(StandardResponseDTO.success(
                "Show! Login realizado com sucesso. Bem-vindo de volta!",
                new AuthLoginResponseDTO(token, userResponse)
        ));
    }
}
