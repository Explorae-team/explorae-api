# Debug Session: compilation-error-data-jpa-test

## Status
- **Phase**: Investigation
- **Severity**: High (Blocks Phase 1 completion)
- **Slug**: compilation-error-data-jpa-test

## Symptoms
- [ERROR] `/home/italo/Área de trabalho/explorae/backend/src/test/java/br/edu/ifpb/explorae/repository/TravelPreferenceRepositoryTest.java:[8,59] package org.springframework.boot.test.autoconfigure.orm.jpa does not exist`
- [ERROR] `symbol: class DataJpaTest`
- Build failure during `testCompile` goal.

## Hypotheses
1. **H1: Invalid Spring Boot Version**: The `pom.xml` uses version `4.0.3`. Since Spring Boot 4 does not exist (stable is 3.x), Maven might be failing to resolve the parent POM and its managed dependencies correctly.
2. **H2: Missing Dependency**: `spring-boot-starter-test` might not be including `spring-boot-test-autoconfigure` due to the version mismatch or misconfiguration.
3. **H3: Classpath/Cache Corruption**: The Maven local repository or IDE cache might be in an inconsistent state (though `clean` was run).

## Investigation Log
- [2026-05-08 11:20] User ran `./mvnw test` and got compilation error.
- [2026-05-08 11:23] AI removed explicit `spring-boot-test-autoconfigure` (Hypothesis: redundancy conflict).
- [2026-05-08 11:25] User ran `./mvnw clean test` and error persisted.

## Root Cause Analysis
O projeto utiliza o **Spring Boot 4.0.3**. Identificamos dois problemas em cascata:

1.  **Modularização de Testes:** A anotação `@DataJpaTest` foi movida para `org.springframework.boot.data.jpa.test.autoconfigure` e agora exige a dependência `spring-boot-starter-data-jpa-test`. (Resolvido anteriormente).
2.  **Banco de Dados Embarcado Ausente:** A anotação `@DataJpaTest` tenta, por padrão, substituir o DataSource real por um banco de dados embarcado (H2, HSQL ou Derby). Como nenhuma dessas dependências estava no `pom.xml`, o carregamento do contexto falhou com `IllegalStateException: Failed to replace DataSource with an embedded database`.

## Fix Applied
1.  Adicionada a dependência `spring-boot-starter-data-jpa-test` ao `pom.xml`.
2.  Atualizado o import da anotação `@DataJpaTest` na classe `TravelPreferenceRepositoryTest`.
3.  Adicionada a dependência `com.h2database:h2` com escopo `test` ao `pom.xml` para permitir o uso de banco de dados embarcado durante os testes.

## Resolution
- [x] Compilation error fixed.
- [x] Dependency resolution verified.
- [x] ApplicationContext load failure fixed.
- **Status**: Resolved
