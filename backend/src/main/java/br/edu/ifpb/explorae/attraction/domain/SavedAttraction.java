package br.edu.ifpb.explorae.attraction.domain;

import br.edu.ifpb.explorae.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "saved_attractions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "attraction_id"})
})
@Getter
@Setter
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
public class SavedAttraction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attraction_id", nullable = false)
    private Attraction attraction;

    @Builder.Default
    @Column(name = "saved_at", updatable = false)
    private LocalDateTime savedAt = LocalDateTime.now();
}
