package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.domain.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

/**
 * fábrica de tokens.
 * assina os tokens com a chave secreta.
 */
@Service
public class TokenService {

    // Pega a chave e o tempo de expiração do application.properties.
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    /**
     * Gera novo Token JWT para um usuário recem logado.
     */
    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSecretKey())
                .compact();
    }

    /**
     * Gera um token dinâmico assinado para o QR Code do Voucher com validade de 15 minutos.
     */
    public String generateVoucherToken(java.util.UUID voucherId) {
        return Jwts.builder()
                .subject(voucherId.toString())
                .claim("type", "VOUCHER_VALIDATION")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000)) // 15 minutos
                .signWith(getSecretKey())
                .compact();
    }

    /**
     * Extrai e valida o UUID do voucher do token assinado.
     */
    public java.util.UUID extractVoucherIdFromToken(String token) {
        Claims claims = extractAllClaims(token);
        String type = claims.get("type", String.class);
        if (!"VOUCHER_VALIDATION".equals(type)) {
            throw new io.jsonwebtoken.JwtException("Tipo de token inválido para validação de voucher.");
        }
        return java.util.UUID.fromString(claims.getSubject());
    }


    /**
     * extrai o email do usuário do token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Verifica se o token é original e se não expirou.
     */
    public boolean isTokenValid(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Método para extrair qualquer informação (claim) do token.
     */
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Lê todo o conteúdo de um Token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Criptografa a SecretKey.
     */
    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
