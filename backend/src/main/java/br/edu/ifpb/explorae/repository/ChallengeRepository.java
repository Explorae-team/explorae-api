package br.edu.ifpb.explorae.repository;

import br.edu.ifpb.explorae.domain.gamification.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, UUID> {

    @Query("SELECT c FROM Challenge c WHERE c.startDate <= :now AND c.endDate >= :now")
    List<Challenge> findActiveChallenges(@Param("now") LocalDateTime now);

    List<Challenge> findByTypeAndStartDateBeforeAndEndDateAfter(String type, LocalDateTime now1, LocalDateTime now2);
}
