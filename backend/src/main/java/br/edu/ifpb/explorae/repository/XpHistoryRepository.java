package br.edu.ifpb.explorae.repository;

import br.edu.ifpb.explorae.domain.gamification.XpHistory;
import br.edu.ifpb.explorae.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface XpHistoryRepository extends JpaRepository<XpHistory, UUID> {
    List<XpHistory> findByUserOrderByCreatedAtDesc(User user);
}
