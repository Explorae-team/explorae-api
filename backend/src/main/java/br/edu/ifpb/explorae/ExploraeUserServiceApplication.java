package br.edu.ifpb.explorae;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ExploraeUserServiceApplication {

	public static void main(String[] args) {
		// Carrega o arquivo .env e injeta no sistema para o Spring Boot reconhecer as variáveis
		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.load();
		
		dotenv.entries().forEach(entry -> {
			if (System.getProperty(entry.getKey()) == null) {
				System.setProperty(entry.getKey(), entry.getValue());
			}
		});

		SpringApplication.run(ExploraeUserServiceApplication.class, args);
	}

}
