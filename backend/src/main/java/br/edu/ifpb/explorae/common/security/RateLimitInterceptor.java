package br.edu.ifpb.explorae.common.security;

import br.edu.ifpb.explorae.common.service.RateLimitService;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimitService rateLimitService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (handler instanceof HandlerMethod handlerMethod) {
            RateLimited rateLimited = handlerMethod.getMethodAnnotation(RateLimited.class);
            if (rateLimited != null) {
                String clientIp = getClientIP(request);
                String keyPrefix = rateLimited.key().isEmpty() ? request.getRequestURI() : rateLimited.key();
                String cacheKey = keyPrefix + "_" + clientIp;

                Bucket bucket = rateLimitService.resolveBucket(
                        cacheKey,
                        rateLimited.capacity(),
                        rateLimited.capacity(),
                        Duration.ofMinutes(rateLimited.periodInMinutes())
                );

                if (!bucket.tryConsume(1)) {
                    sendErrorResponse(response, "Muitas requisições. Tente novamente mais tarde.");
                    return false;
                }
            }
        }
        return true;
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws Exception {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"message\": \"" + message + "\", \"status\": 429}");
    }
}
