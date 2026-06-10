package br.edu.ifpb.explorae.gamification.repository;

import br.edu.ifpb.explorae.gamification.domain.Challenge;
import br.edu.ifpb.explorae.gamification.domain.UserChallengeProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserChallengeProgressRepository extends JpaRepository<UserChallengeProgress, UUID> {

    Optional<UserChallengeProgress> findByUserIdAndChallengeId(UUID userId, UUID challengeId);

    List<UserChallengeProgress> findByUserIdAndChallengeIn(UUID userId, List<Challenge> challenges);

    @Query("SELECT COUNT(ucp) FROM UserChallengeProgress ucp WHERE ucp.user.id = :userId AND ucp.challenge.type = 'DAILY' AND ucp.completed = true")
    long countCompletedDailyChallengesByUserId(@Param("userId") UUID userId);
}
