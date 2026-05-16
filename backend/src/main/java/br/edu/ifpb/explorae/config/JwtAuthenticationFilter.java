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
import org.springframework.context.annotation.Lazy;
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

    public JwtAuthenticationFilter(TokenService tokenService, @Lazy UserService userService) {
        this.tokenService = tokenService;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // deixa passar (pode ser uma rota pública como o login ou cadastro).
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extrai o token (tirando o prefixo "Bearer ").
        String jwt = authHeader.substring(7);

        try {
            String userEmail = tokenService.extractUsername(jwt);

            // Se o usuário ainda não estiver autenticado
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Busca os detalhes do usuário no banco.
                UserDetails userDetails = this.userService.loadUserByUsername(userEmail);

                // Valida se o token é original e não expirou.
                if (tokenService.isTokenValid(jwt)) {
                    // Se estiver ok, cria um crachá de autenticação.
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    // Vincula os detalhes da requisição ao crachá.
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // Colocam o crachá no contexto do Spring para que ele saiba
                    // que esse usuário está autorizado para essa requisição.
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Se o token for inválido ou expirar, apenas ignoramos e deixamos o Spring Security
            // decidir se a rota exige autenticação ou não.
            logger.error("Erro ao processar Token JWT: " + e.getMessage());
        }

        // Libera a requisição para seguir seu caminho até o Controller.
        filterChain.doFilter(request, response);
    }
}
