package br.edu.ifpb.explorae.attraction.service;

import br.edu.ifpb.explorae.attraction.domain.Attraction;
import br.edu.ifpb.explorae.attraction.domain.UserInteraction;
import br.edu.ifpb.explorae.attraction.dto.AttractionResponseDTO;
import br.edu.ifpb.explorae.attraction.repository.AttractionRepository;
import br.edu.ifpb.explorae.attraction.repository.UserInteractionRepository;
import br.edu.ifpb.explorae.common.utils.GeoUtils;
import br.edu.ifpb.explorae.user.domain.Category;
import br.edu.ifpb.explorae.user.domain.TravelPreference;
import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.user.repository.TravelPreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttractionRecommendationService {

    private final AttractionRepository attractionRepository;
    private final TravelPreferenceRepository travelPreferenceRepository;
    private final UserInteractionRepository userInteractionRepository;

    @Transactional(readOnly = true)
    public Page<AttractionResponseDTO> getRecommendations(User user, Double latitude, Double longitude, Pageable pageable) {
        List<Attraction> attractions = attractionRepository.findAll();

        final TravelPreference pref = user != null ? travelPreferenceRepository.findByUser(user).orElse(null) : null;
        final List<UserInteraction> recentInteractions = user != null
                ? userInteractionRepository.findTop20ByUserIdAndInteractionTypeOrderByCreatedAtDesc(user.getId(), "VIEW")
                : List.of();

        Map<String, Double> implicitScores = calculateImplicitScores(recentInteractions);

        List<AttractionResponseDTO> scoredAttractions = attractions.stream().map(attr -> {
            double scoreExplicito = calculateExplicitScore(attr, pref);
            double scoreImplicito = implicitScores.getOrDefault(attr.getCategory().toLowerCase(),
                    recentInteractions.isEmpty() ? 0.5 : 0.0);

            double matchPerfilHibrido = (0.70 * scoreExplicito) + (0.30 * scoreImplicito);

            double distanciaKm = (latitude != null && longitude != null)
                    ? GeoUtils.calculateHaversineDistance(latitude, longitude, attr.getLatitude(), attr.getLongitude())
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
        if (interactions.isEmpty()) return new HashMap<>();
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
            if (parent.equals("cultura") && (attrCat.equals("cultura") || attrCat.equals("histórico") || attrCat.equals("historico"))) return 0.5;
            if (parent.equals("aventura") && (attrCat.equals("natureza") || attrCat.equals("praia") || attrCat.equals("lazer"))) return 0.5;
            if (parent.equals("relaxamento") && (attrCat.equals("natureza") || attrCat.equals("praia") || attrCat.equals("lazer"))) return 0.5;
            if (parent.equals("gastronomia") && attrCat.equals("lazer")) return 0.5;
            if (parent.equals("noite") && (attrCat.equals("lazer") || attrCat.equals("cultura"))) return 0.5;
        }
        return 0.0;
    }

    private record ScoredAttraction(AttractionResponseDTO dto, double score) {}
}
