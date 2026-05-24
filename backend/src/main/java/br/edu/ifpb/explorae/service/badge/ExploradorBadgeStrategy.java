package br.edu.ifpb.explorae.service.badge;

import br.edu.ifpb.explorae.domain.user.User;
import br.edu.ifpb.explorae.repository.UserInteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ExploradorBadgeStrategy implements BadgeProgressStrategy {

    private final UserInteractionRepository userInteractionRepository;

    @Override
    public String getBadgeName() {
        return "EXPLORADOR";
    }

    @Override
    public int getTargetValue() {
        return 3;
    }

    @Override
    public int calculateCurrentValue(User user) {
        return (int) userInteractionRepository.countDistinctAttractionsByUserIdAndInteractionType(user.getId(), "CHECK_IN");
    }
}
