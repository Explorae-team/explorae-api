package br.edu.ifpb.explorae.service.badge;

import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.AttractionReviewRepository;
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
