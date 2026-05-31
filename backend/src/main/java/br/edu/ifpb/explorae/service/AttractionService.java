package br.edu.ifpb.explorae.service;

import br.edu.ifpb.explorae.api.dto.AttractionDetailsResponseDTO;
import br.edu.ifpb.explorae.api.dto.AttractionResponseDTO;
import br.edu.ifpb.explorae.api.dto.AttractionReviewDTO;
import br.edu.ifpb.explorae.api.dto.AttractionReviewRequestDTO;
import br.edu.ifpb.explorae.api.dto.ReviewResponseDTO;
import br.edu.ifpb.explorae.api.dto.CheckInResponseDTO;
import br.edu.ifpb.explorae.api.dto.BadgeResponseDTO;
import br.edu.ifpb.explorae.api.mapper.AttractionMapper;
import br.edu.ifpb.explorae.api.mapper.BadgeMapper;
import br.edu.ifpb.explorae.domain.attraction.Attraction;
import br.edu.ifpb.explorae.domain.attraction.AttractionReview;
import br.edu.ifpb.explorae.domain.attraction.SavedAttraction;
import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.UserRepository;
import br.edu.ifpb.explorae.api.exception.ResourceNotFoundException;
import br.edu.ifpb.explorae.repository.AttractionRepository;
import br.edu.ifpb.explorae.repository.AttractionReviewRepository;
import br.edu.ifpb.explorae.repository.SavedAttractionRepository;
import br.edu.ifpb.explorae.event.ReviewCreatedEvent;
import br.edu.ifpb.explorae.event.DestinationReachedEvent;
import br.edu.ifpb.explorae.event.FavoriteCreatedEvent;
import br.edu.ifpb.explorae.api.dto.FavoriteResponseDTO;
import br.edu.ifpb.explorae.service.BadgeUnlockTracker;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import br.edu.ifpb.explorae.domain.attraction.UserInteraction;
import br.edu.ifpb.explorae.domain.user.Category;
import br.edu.ifpb.explorae.domain.user.TravelPreference;
import br.edu.ifpb.explorae.repository.TravelPreferenceRepository;
import br.edu.ifpb.explorae.repository.UserInteractionRepository;
import org.springframework.data.domain.PageImpl;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AttractionService {

    private final AttractionRepository attractionRepository;
    private final AttractionReviewRepository reviewRepository;
    private final SavedAttractionRepository savedAttractionRepository;
    private final UserRepository userRepository;
    private final AttractionMapper attractionMapper;
    private final TravelPreferenceRepository travelPreferenceRepository;
    private final UserInteractionRepository userInteractionRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final BadgeMapper badgeMapper;

    @Transactional(readOnly = true)
    public Page<AttractionResponseDTO> findAll(String category, Pageable pageable) {
        Page<Attraction> page;
        if (category != null && !category.isEmpty()) {
            page = attractionRepository.findByCategory(category, pageable);
        } else {
            page = attractionRepository.findAll(pageable);
        }
        return page.map(attraction -> AttractionResponseDTO.fromEntity(attraction, "1.2 km"));

    }

    @Transactional
    public AttractionDetailsResponseDTO getAttractionDetails(UUID attractionId, User principal) {
        Attraction attraction = attractionRepository.findById(attractionId)
                .orElseThrow(() -> new ResourceNotFoundException("Atração não encontrada"));

        boolean isSaved = false;
        if (principal != null) {
            isSaved = savedAttractionRepository.existsByUserIdAndAttractionId(principal.getId(), attractionId);

            UserInteraction interaction = UserInteraction.builder()
                    .user(principal)
                    .attraction(attraction)
                    .interactionType("VIEW")
                    .build();
            userInteractionRepository.save(interaction);
        }

        List<AttractionReview> reviews = reviewRepository.findByAttractionIdOrderByCreatedAtDesc(attractionId);

        List<AttractionReviewDTO> reviewDTOs = reviews.stream()
                .map(attractionMapper::toReviewDTO)
                .collect(Collectors.toList());

        return attractionMapper.toDetailsDTO(attraction, isSaved, reviewDTOs);
    }

    @Transactional
    public ReviewResponseDTO addReview(UUID attractionId, AttractionReviewRequestDTO dto, UUID userId) {
        BadgeUnlockTracker.clear();

        Attraction attraction = attractionRepository.findById(attractionId)
                .orElseThrow(() -> new ResourceNotFoundException("Atração não encontrada"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        AttractionReview review = AttractionReview.builder()
                .attraction(attraction)
                .user(user)
                .content(dto.content())
                .rating(dto.rating())
                .photoUrl(dto.photoUrl())
                .build();

        AttractionReview savedReview = reviewRepository.save(review);
        eventPublisher.publishEvent(new ReviewCreatedEvent(userId));

        // Recalcular e atualizar a média de avaliações (averageRating) da atração
        List<AttractionReview> reviews = reviewRepository.findByAttractionIdOrderByCreatedAtDesc(attractionId);
        double averageRating = reviews.stream()
                .mapToInt(AttractionReview::getRating)
                .average()
                .orElse(0.0);
        attraction.setAverageRating(averageRating);
        attractionRepository.save(attraction);

        AttractionReviewDTO reviewDto = attractionMapper.toReviewDTO(savedReview);
        List<BadgeResponseDTO> unlockedBadges = badgeMapper.toBadgeDTOList(BadgeUnlockTracker.getAndClear());

        return new ReviewResponseDTO(reviewDto, unlockedBadges);
    }

    @Transactional
    public CheckInResponseDTO checkIn(UUID attractionId, UUID userId) {
        BadgeUnlockTracker.clear();

        Attraction attraction = attractionRepository.findById(attractionId)
                .orElseThrow(() -> new ResourceNotFoundException("Atração não encontrada"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        UserInteraction interaction = UserInteraction.builder()
                .user(user)
                .attraction(attraction)
                .interactionType("CHECK_IN")
                .build();
        userInteractionRepository.save(interaction);

        eventPublisher.publishEvent(new DestinationReachedEvent(userId));

        List<BadgeResponseDTO> unlockedBadges = badgeMapper.toBadgeDTOList(BadgeUnlockTracker.getAndClear());

        return new CheckInResponseDTO("success", unlockedBadges);
    }

    @Transactional(readOnly = true)
    public Page<AttractionResponseDTO> getRecommendations(User user, Double latitude, Double longitude,
            Pageable pageable) {
        List<Attraction> attractions = attractionRepository.findAll();

        final TravelPreference pref = user != null ? travelPreferenceRepository.findByUser(user).orElse(null) : null;
        final List<UserInteraction> recentInteractions = user != null
                ? userInteractionRepository.findTop20ByUserIdAndInteractionTypeOrderByCreatedAtDesc(user.getId(),
                        "VIEW")
                : List.of();

        Map<String, Double> implicitScores = calculateImplicitScores(recentInteractions);

        List<AttractionResponseDTO> scoredAttractions = attractions.stream().map(attr -> {
            double scoreExplicito = calculateExplicitScore(attr, pref);
            double scoreImplicito = implicitScores.getOrDefault(attr.getCategory().toLowerCase(),
                    recentInteractions.isEmpty() ? 0.5 : 0.0);

            double matchPerfilHibrido = (0.70 * scoreExplicito) + (0.30 * scoreImplicito);

            double distanciaKm = (latitude != null && longitude != null)
                    ? calculateHaversineDistance(latitude, longitude, attr.getLatitude(), attr.getLongitude())
                    : 0.0;
            double fatorDistancia = (latitude != null && longitude != null) ? (1.0 / (1.0 + distanciaKm)) : 1.0;

            double ratingNormalizado = attr.getAverageRating() != null ? attr.getAverageRating() / 5.0 : 0.0;
            double boostParceiro = Boolean.TRUE.equals(attr.getIsPartner()) ? 1.0 : 0.0;

            double finalScore = (0.40 * matchPerfilHibrido) + (0.30 * fatorDistancia) + (0.20 * ratingNormalizado)
                    + (0.10 * boostParceiro);

            String distanceStr = (latitude != null && longitude != null)
                    ? String.format("%.1f km", distanciaKm).replace(".", ",")
                    : "Localizando...";

            AttractionResponseDTO dto = AttractionResponseDTO.fromEntity(attr, distanceStr);
            return new ScoredAttraction(dto, finalScore);
        })
                .sorted(Comparator.comparing(ScoredAttraction::score).reversed())
                .map(ScoredAttraction::dto)
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), scoredAttractions.size());

        List<AttractionResponseDTO> pageContent = start <= end ? scoredAttractions.subList(start, end) : List.of();
        return new PageImpl<>(pageContent, pageable, scoredAttractions.size());
    }

    private Map<String, Double> calculateImplicitScores(List<UserInteraction> interactions) {
        if (interactions.isEmpty())
            return new HashMap<>();
        Map<String, Integer> counts = new HashMap<>();
        for (UserInteraction ui : interactions) {
            String cat = ui.getAttraction().getCategory().toLowerCase();
            counts.put(cat, counts.getOrDefault(cat, 0) + 1);
        }
        Map<String, Double> scores = new HashMap<>();
        for (Map.Entry<String, Integer> entry : counts.entrySet()) {
            scores.put(entry.getKey(), (double) entry.getValue() / interactions.size());
        }
        return scores;
    }

    private double calculateExplicitScore(Attraction attraction, TravelPreference pref) {
        if (pref == null || pref.getInterests() == null || pref.getInterests().isEmpty()) {
            return 0.5;
        }
        String attrCat = attraction.getCategory() != null ? attraction.getCategory().toLowerCase() : "";
        for (Category interest : pref.getInterests()) {
            String slug = interest.getSlug().toLowerCase();
            String parent = interest.getParentCategory() != null ? interest.getParentCategory().toLowerCase() : "";

            if (attrCat.equals(slug) || attrCat.contains(slug) || slug.contains(attrCat)) {
                return 1.0;
            }
            if (parent.equals("cultura")
                    && (attrCat.equals("cultura") || attrCat.equals("histórico") || attrCat.equals("historico")))
                return 0.5;
            if (parent.equals("aventura")
                    && (attrCat.equals("natureza") || attrCat.equals("praia") || attrCat.equals("lazer")))
                return 0.5;
            if (parent.equals("relaxamento")
                    && (attrCat.equals("natureza") || attrCat.equals("praia") || attrCat.equals("lazer")))
                return 0.5;
            if (parent.equals("gastronomia") && attrCat.equals("lazer"))
                return 0.5;
            if (parent.equals("noite") && (attrCat.equals("lazer") || attrCat.equals("cultura")))
                return 0.5;
        }
        return 0.0;
    }

    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    @Transactional
    public FavoriteResponseDTO toggleFavorite(UUID attractionId, UUID userId) {
        BadgeUnlockTracker.clear();

        Attraction attraction = attractionRepository.findById(attractionId)
                .orElseThrow(() -> new ResourceNotFoundException("Atração não encontrada"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Optional<SavedAttraction> savedOpt = savedAttractionRepository.findByUserIdAndAttractionId(userId,
                attractionId);

        boolean isFavorite;
        if (savedOpt.isPresent()) {
            savedAttractionRepository.delete(savedOpt.get());
            isFavorite = false;
        } else {
            SavedAttraction saved = SavedAttraction.builder()
                    .user(user)
                    .attraction(attraction)
                    .build();
            savedAttractionRepository.save(saved);

            eventPublisher.publishEvent(new FavoriteCreatedEvent(userId));
            isFavorite = true;
        }

        List<BadgeResponseDTO> unlockedBadges = badgeMapper.toBadgeDTOList(BadgeUnlockTracker.getAndClear());
        return new FavoriteResponseDTO(isFavorite, unlockedBadges);
    }

    @Transactional(readOnly = true)
    public List<AttractionResponseDTO> getSavedAttractions(UUID userId) {
        List<SavedAttraction> savedList = savedAttractionRepository.findAllByUserId(userId);
        return savedList.stream()
                .map(SavedAttraction::getAttraction)
                .map(attraction -> AttractionResponseDTO.fromEntity(attraction, "Salvo"))
                .collect(Collectors.toList());
    }

    private record ScoredAttraction(AttractionResponseDTO dto, double score) {
    }
}
