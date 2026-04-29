package br.edu.ifpb.explorae;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Disabled;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Requer PostgreSQL rodando. Ignorado durante a build de CI local sem banco.")
class ExploraeUserServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}
