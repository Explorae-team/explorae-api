package br.edu.ifpb.explorae.api.controller;

import br.edu.ifpb.explorae.api.dto.LoginDTO;
import br.edu.ifpb.explorae.api.dto.StandardResponseDTO;
import br.edu.ifpb.explorae.api.dto.TokenResponseDTO;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.service.TokenService;
import jakarta.validation.Valid;
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

    public AuthController(AuthenticationManager authenticationManager, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    /**
     * Endpoint de Login:
     * 1. Recebe email e senha do usuário.
     * 2. Confere se estão certos.
     * 3. Cria e devolve o Token JWT.
     */
    @PostMapping("/login")
    public ResponseEntity<StandardResponseDTO<TokenResponseDTO>> login(@RequestBody @Valid LoginDTO loginDTO) {

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

        // Devolve o Token pra ele usar nas próximas requisições.
        return ResponseEntity.ok(StandardResponseDTO.success(
                "Show! Login realizado com sucesso. Bem-vindo de volta!",
                new TokenResponseDTO(token)
        ));
    }
}
