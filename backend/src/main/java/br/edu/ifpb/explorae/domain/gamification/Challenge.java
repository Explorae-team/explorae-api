package br.edu.ifpb.explorae.domain.gamification;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "challenges")
@Getter
@Setter
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String type; // DAILY, WEEKLY, SPECIAL

    @Column(name = "action_type", nullable = false)
    private String actionType; // VISIT_ATTRACTION, CREATE_REVIEW, ADD_FAVORITE, EARN_XP

    @Column(name = "target_value", nullable = false)
    private Integer targetValue;

    @Column(name = "xp_reward", nullable = false)
    private Integer xpReward;

    @Column(name = "coins_reward", nullable = false)
    private Integer coinsReward;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
