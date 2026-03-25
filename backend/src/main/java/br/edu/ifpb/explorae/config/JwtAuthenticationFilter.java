package br.edu.ifpb.explorae.config;

import br.edu.ifpb.explorae.service.TokenService;
import br.edu.ifpb.explorae.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Esse Filtro é o segurança.
 * Toda requisição passa por ele antes de chegar no endpoint.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UserService userService;

    public JwtAuthenticationFilter(TokenService tokenService, UserService userService) {
        this.tokenService = tokenService;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // 1. Pega o cabeçalho 'Authorization' da requisição.
        String authHeader = request.getHeader("Authorization");
        
        // 2. Se o cabeçalho estiver vazio ou não começar com "Bearer ",
        // apenas deixa passar (pode ser uma rota pública como o login ou cadastro).
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extraí o token (tirando o prefixo "Bearer ").
        String jwt = authHeader.substring(7);

        // 4.TokenService le o email que tá no token.
        String userEmail = tokenService.extractUsername(jwt);

        // 5. Se tiver um email e o usuário ainda não estiver autenticado na sessão atual do Spring
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Busca os detalhes do usuário no banco.
            UserDetails userDetails = this.userService.loadUserByUsername(userEmail);

            // 6. Valida se o token é original e não expirou.
            if (tokenService.isTokenValid(jwt)) {
                // Se estiver ok, cria um crachá de autenticação.
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                // Vincula os detalhes da requisição ao crachá.
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                // Colocam o crachá no contexto do Spring para que ele saiba
                // que esse usuário está autorizado para essa requisição.
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // 7. Libera a requisição para seguir seu caminho até o Controller.
        filterChain.doFilter(request, response);
    }
}
