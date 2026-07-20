package br.edu.ifpb.explorae.gamification.service;

import br.edu.ifpb.explorae.gamification.domain.Challenge;
import br.edu.ifpb.explorae.gamification.repository.ChallengeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ChallengeScheduler {

    private final ChallengeRepository challengeRepository;
    private final Random random = new Random();

    @EventListener(ApplicationReadyEvent.class)
    public void initChallengesOnStartup() {
        LocalDateTime now = LocalDateTime.now();
        
        // Verificar e gerar desafios diários se não houver nenhum ativo para o dia
        List<Challenge> activeDailies = challengeRepository.findByTypeAndStartDateBeforeAndEndDateAfter("DAILY", now, now);
        if (activeDailies.isEmpty()) {
            System.out.println("Nenhum desafio diário ativo encontrado na inicialização. Gerando desafios diários...");
            generateDailyChallenges();
        }

        // Verificar e gerar desafios semanais se não houver nenhum ativo para a semana
        List<Challenge> activeWeeklies = challengeRepository.findByTypeAndStartDateBeforeAndEndDateAfter("WEEKLY", now, now);
        if (activeWeeklies.isEmpty()) {
            System.out.println("Nenhum desafio semanal ativo encontrado na inicialização. Gerando desafios semanais...");
            generateWeeklyChallenges();
        }
    }

    private static final List<ChallengeTemplate> DAILY_TEMPLATES = List.of(
        new ChallengeTemplate("Explorador Matinal", "Visite 1 atração qualquer hoje.", "VISIT_ATTRACTION", 1, 50, 10),
        new ChallengeTemplate("Crítico Local", "Escreva 1 avaliação de atração.", "CREATE_REVIEW", 1, 60, 15),
        new ChallengeTemplate("Colecionador", "Favorite 1 atração hoje.", "ADD_FAVORITE", 1, 40, 5),
        new ChallengeTemplate("Maratonista Diário", "Visite 2 atrações hoje.", "VISIT_ATTRACTION", 2, 100, 20)
    );

    private static final List<ChallengeTemplate> WEEKLY_TEMPLATES = List.of(
        new ChallengeTemplate("Desbravador da Semana", "Visite 3 atrações esta semana.", "VISIT_ATTRACTION", 3, 200, 50),
        new ChallengeTemplate("Guia Turístico", "Escreva 3 avaliações esta semana.", "CREATE_REVIEW", 3, 250, 60),
        new ChallengeTemplate("Favoritador em Série", "Favorite 3 atrações esta semana.", "ADD_FAVORITE", 3, 150, 30)
    );

    @Scheduled(cron = "0 0 0 * * *")
    public void generateDailyChallenges() {
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);

        // Escolhe 2 templates aleatórios diferentes
        int firstIndex = random.nextInt(DAILY_TEMPLATES.size());
        int secondIndex = (firstIndex + 1 + random.nextInt(DAILY_TEMPLATES.size() - 1)) % DAILY_TEMPLATES.size();

        createChallenge(DAILY_TEMPLATES.get(firstIndex), "DAILY", startOfDay, endOfDay);
        createChallenge(DAILY_TEMPLATES.get(secondIndex), "DAILY", startOfDay, endOfDay);
    }

    @Scheduled(cron = "0 0 0 * * SUN")
    public void generateWeeklyChallenges() {
        LocalDateTime startOfWeek = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfWeek = startOfWeek.plusDays(6).with(LocalTime.MAX);

        int index = random.nextInt(WEEKLY_TEMPLATES.size());

        createChallenge(WEEKLY_TEMPLATES.get(index), "WEEKLY", startOfWeek, endOfWeek);
    }

    private void createChallenge(ChallengeTemplate temp, String type, LocalDateTime start, LocalDateTime end) {
        Challenge challenge = Challenge.builder()
                .title(temp.title())
                .description(temp.description())
                .type(type)
                .actionType(temp.actionType())
                .targetValue(temp.targetValue())
                .xpReward(temp.xpReward())
                .coinsReward(temp.coinsReward())
                .startDate(start)
                .endDate(end)
                .build();
        challengeRepository.save(challenge);
    }

    private record ChallengeTemplate(
        String title,
        String description,
        String actionType,
        Integer targetValue,
        Integer xpReward,
        Integer coinsReward
    ) {}
}
