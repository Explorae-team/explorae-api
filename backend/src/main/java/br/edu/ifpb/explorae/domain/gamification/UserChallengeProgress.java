package br.edu.ifpb.explorae.domain.gamification;

import br.edu.ifpb.explorae.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_challenge_progress", uniqueConstraints = {
        @UniqueConstraint(name = "uq_user_challenge", columnNames = {"user_id", "challenge_id"})
})
@Getter
@Setter
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
public class UserChallengeProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    private Challenge challenge;

    @Builder.Default
    @Column(name = "current_value", nullable = false)
    private Integer currentValue = 0;

    @Builder.Default
    @Column(nullable = false)
    private Boolean completed = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Builder.Default
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
