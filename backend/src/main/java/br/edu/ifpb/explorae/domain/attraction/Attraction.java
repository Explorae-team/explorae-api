package br.edu.ifpb.explorae.domain.attraction;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "attractions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attraction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(name = "short_description", nullable = false)
    private String shortDescription;

    @Column(name = "long_description", columnDefinition = "TEXT")
    private String longDescription;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "opening_hours")
    private String openingHours;

    @Column(name = "price_range")
    private Integer priceRange; // 1 to 4 ($ to $$$$)

    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    @Column(name = "is_partner")
    private Boolean isPartner = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.averageRating == null) this.averageRating = 0.0;
        if (this.isPartner == null) this.isPartner = false;
    }
}
