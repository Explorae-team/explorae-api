package br.edu.ifpb.explorae.user.domain;
import br.edu.ifpb.explorae.gamification.domain.UserBadge;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
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
public class User {
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

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserBadge> userBadges = new java.util.ArrayList<>();



    public boolean addXp(Integer amount) {
        if (amount == null || amount <= 0) return false;
        int oldLevel = this.level != null ? this.level : 1;
        this.xp = (this.xp != null ? this.xp : 0) + amount;

        int currentLevel = oldLevel;
        while (this.xp >= br.edu.ifpb.explorae.gamification.util.GamificationRules.getXpThresholdForLevel(currentLevel + 1)) {
            currentLevel++;
        }
        if (currentLevel > oldLevel) {
            this.level = currentLevel;
            return true;
        }
        return false;
    }
}
