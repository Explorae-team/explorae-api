package br.edu.ifpb.explorae.gamification.service.badge;

import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.attraction.repository.AttractionReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DesbravadorVerdeBadgeStrategy implements BadgeProgressStrategy {

    private final AttractionReviewRepository reviewRepository;

    @Override
    public String getBadgeName() {
        return "DESBRAVADOR_VERDE";
    }

    @Override
    public int getTargetValue() {
        return 3;
    }

    @Override
    public int calculateCurrentValue(User user) {
        return (int) reviewRepository.countByUserIdAndAttractionCategoryIgnoreCase(user.getId(), "aventura");
    }
}
