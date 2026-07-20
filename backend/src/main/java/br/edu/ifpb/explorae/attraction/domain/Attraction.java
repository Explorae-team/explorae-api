package br.edu.ifpb.explorae.attraction.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "attractions")
@Getter
@Setter
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
public class Attraction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(name = "short_description", nullable = false)
    private String shortDescription;

    @Column(name = "long_description", columnDefinition = "TEXT")
    private String longDescription;

    @Column
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "opening_hours")
    private String openingHours;

    @Column(name = "price_range")
    private Integer priceRange; // 1 para 4 ($ para $$$$)

    @Builder.Default
    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    @Builder.Default
    @Column(name = "is_partner")
    private Boolean isPartner = false;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @org.hibernate.annotations.BatchSize(size = 20)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "attraction_images", joinColumns = @JoinColumn(name = "attraction_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();

    @org.hibernate.annotations.BatchSize(size = 20)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "attraction_highlights", joinColumns = @JoinColumn(name = "attraction_id"))
    @Column(name = "highlight")
    @Builder.Default
    private List<String> highlights = new ArrayList<>();
}
