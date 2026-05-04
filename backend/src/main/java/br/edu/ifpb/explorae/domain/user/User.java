package br.edu.ifpb.explorae.domain.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 20)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "photo_url")
    private String photoUrl;

    // Atributos de gamificação
    @Builder.Default
    private Integer xp = 0;
    @Builder.Default
    private Integer level = 1;
    @Builder.Default
    private Integer coins = 0;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Perfil de Preferências.
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private TravelPreference travelPreference;

    /**
     * Adiciona XP e verifica se subiu de nível.
     * Retorna true se houve level up.
     */
    public boolean addXp(Integer amount) {
        if (amount == null || amount <= 0)
            return false;
        this.xp += amount;
        return checkLevelUp();
    }

    private boolean checkLevelUp() {
        int oldLevel = this.level;
        // XP necessário para o próximo nível = nivel * 100
        while (this.xp >= getXpForNextLevel()) {
            this.level++;
        }
        return this.level > oldLevel;
    }

    public int getXpForNextLevel() {
        return this.level * 100;
    }


    /**
     * Define as permisões do usuário.
     * Ao logar ganha a permissão "USER".
     * No futuro, pode ter "ADMIN", "MODERADOR", etc.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    // Travas de segurança
    // Se algum retornar 'false', o usuário não consegue logar.
    // Por enquanto, todo mundo liberado (true).

    @Override
    public boolean isAccountNonExpired() {
        return true; // A conta nunca expira
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // A conta nunca tá bloqueada
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // A senha nunca expira
    }

    @Override
    public boolean isEnabled() {
        return true; // O usuário tá sempre ativo
    }
}
