package br.edu.ifpb.explorae.api.security;

import br.edu.ifpb.explorae.service.RateLimitService;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitService rateLimitService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String clientIp = getClientIP(request);

        // Configuração de limites por endpoint
        if (path.startsWith("/api/v1/auth/login")) {
            // Limite para login: 5 tentativas por minuto por IP
            Bucket bucket = rateLimitService.resolveBucket("login_" + clientIp, 5, 5, Duration.ofMinutes(1));
            if (!bucket.tryConsume(1)) {
                sendErrorResponse(response, "Muitas tentativas de login. Tente novamente em 1 minuto.");
                return;
            }
        } else if (path.contains("/reviews") && request.getMethod().equalsIgnoreCase("POST")) {
            // Limite para avaliações: 3 por hora por IP (evitar spam)
            Bucket bucket = rateLimitService.resolveBucket("review_" + clientIp, 3, 3, Duration.ofHours(1));
            if (!bucket.tryConsume(1)) {
                sendErrorResponse(response, "Limite de avaliações excedido. Tente novamente mais tarde.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"message\": \"" + message + "\", \"status\": 429}");
    }
}
