package br.edu.ifpb.explorae.gamification.service.badge;

import br.edu.ifpb.explorae.user.domain.User;
import br.edu.ifpb.explorae.attraction.repository.AttractionReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CriticoBadgeStrategy implements BadgeProgressStrategy {

    private final AttractionReviewRepository reviewRepository;

    @Override
    public String getBadgeName() {
        return "CRITICO";
    }

    @Override
    public int getTargetValue() {
        return 1;
    }

    @Override
    public int calculateCurrentValue(User user) {
        return (int) reviewRepository.countByUserId(user.getId());
    }
}
