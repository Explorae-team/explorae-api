package br.edu.ifpb.explorae.config;

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

import java.util.List;

/**
 * Regras de Segurança
 * Quem entra, quem precisa de token e como as portas são vigiadas.
 */
// proxyBeanMethods=false: evita CGLIB proxy que conflita com o RestartClassLoader do DevTools no Spring Boot 4.
@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Desativamos o CSRF porque em APIs REST com JWT não usamos Cookies/Sessão,
                // então esse tipo de ataque não faz sentido aqui.
                .csrf(AbstractHttpConfigurer::disable)
                
                // Aplicamos as regras de quem pode acessar o quê (CORS) lá de baixo.
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // IMPORTANTE: Definimos que nossa API é STATELESS (sem estado).
                // Isso significa que o servidor não guarda "quem está logado". 
                // Cada requisição tem que se identificar do zero usando o Token JWT.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // Aqui configuramos os "portões" da nossa API:
                .authorizeHttpRequests(auth -> auth
                        // Preflight OPTIONS: Deve passar livre antes de qualquer filtro JWT.
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Porta da Saúde: Aberta para o monitoramento saber se o sistema tá vivo.
                        .requestMatchers("/api/v1/health").permitAll()
                        // Porta de Cadastro: Aberta porque o usuário ainda não tem conta.
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/register").permitAll()
                        // Porta de Login: Aberta para o usuário trocar a senha pelo Token.
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
                        // Qualquer outra porta: Só entra quem estiver autenticado.
                        .anyRequest().authenticated()
                )
                
                // Aqui dizemos ao Spring: "Antes de checar qualquer coisa, 
                // passa pelo jwtAuthFilter para ver se ele tem um Token".
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    //Valida o email e senha, comparando com o banco
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }


     // hash BCrypt.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //Configurações de CORS: Permite que o Frontend converse com a API
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Origens permitidas em desenvolvimento. Em produção, trocar pelos domínios reais.
        configuration.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
