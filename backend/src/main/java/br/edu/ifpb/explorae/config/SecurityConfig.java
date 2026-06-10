package br.edu.ifpb.explorae.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import br.edu.ifpb.explorae.common.security.RateLimitFilter;

import java.util.List;

/**
 * Regras de Segurança
 * Quem entra, quem precisa de token e como as portas são vigiadas.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${cors.allowed.origins:*}")
    private String allowedOrigins;

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final RateLimitFilter rateLimitFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, RateLimitFilter rateLimitFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.rateLimitFilter = rateLimitFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Desativamos o CSRF, API REST com JWT não usa Cookies/Sessão.
                .csrf(AbstractHttpConfigurer::disable)

                // Aplica as regras de quem pode acessar o quê (CORS direto na SecurityFilterChain).
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // API é STATELESS, o servidor não guarda "quem está logado", cada requisição
                // tem que se identificar do zero usando o Token JWT.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Portas da API
                .authorizeHttpRequests(auth -> auth
                        // Porta da Saúde: Aberta para o monitoramento.
                        .requestMatchers("/api/v1/health").permitAll()
                        // Porta de Cadastro: Aberta para o cadastro do novo usuário.
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/register").permitAll()
                        // Porta de Login: Aberta para o login do usuário.
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
                        // Feed de Atrações: Público para o Explore.
                        .requestMatchers(HttpMethod.GET, "/api/v1/attractions", "/api/v1/attractions/**").permitAll()
                        // Imagens de Upload: Aberta para visualização pública.
                        .requestMatchers("/uploads/**").permitAll()
                        // Qualquer outra porta: Só entra quem estiver autenticado.
                        .anyRequest().authenticated())
                // O filtro de Rate Limit vem primeiro para evitar processamento inútil de
                // ataques.
                .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
                // O filtro JWT valida o Token.
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Valida o email e senha, comparando com o banco
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // hash BCrypt.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configurações de CORS do Spring Security
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        if ("*".equals(allowedOrigins)) {
            // Se for "*", usamos allowedOriginPatterns para suportar credenciais e cabeçalhos de forma flexível
            configuration.setAllowedOriginPatterns(List.of("*"));
        } else {
            // Caso contrário, dividimos as origens configuradas por vírgula
            configuration.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        }
        
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); // Permitir envio de headers de autenticação (Authorization)
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); 
        return source;
    }
}
