package br.edu.ifpb.explorae.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DatabaseCleanupRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseCleanupRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        log.info("🛠️ [DatabaseCleanupRunner] Iniciando limpeza de colunas legadas...");

        try {
            jdbcTemplate.execute("ALTER TABLE travel_preferences DROP COLUMN IF EXISTS budget CASCADE");
            log.info("✅ [DatabaseCleanupRunner] Coluna 'budget' removida com sucesso.");
        } catch (Exception e) {
            log.warn("⚠️ [DatabaseCleanupRunner] Não foi possível remover a coluna 'budget': {}", e.getMessage());
        }

        try {
            jdbcTemplate.execute("ALTER TABLE travel_preferences DROP COLUMN IF EXISTS preferred_transport CASCADE");
            log.info("✅ [DatabaseCleanupRunner] Coluna 'preferred_transport' removida com sucesso.");
        } catch (Exception e) {
            log.warn("⚠️ [DatabaseCleanupRunner] Não foi possível remover a coluna 'preferred_transport': {}", e.getMessage());
        }
    }
}
