# Phase 2: [SDGEU-211] Popular Banco com Seeds de Atrações Iniciais (Liquibase)

## Objective
Popular o banco de dados com um conjunto inicial de atrações turísticas de João Pessoa (PB), garantindo que o catálogo tenha conteúdo diversificado para o desenvolvimento do feed e das recomendações.

## Context
Após a Phase 1, já possuímos a estrutura de tabelas necessária (`attractions` e `attraction_images`). Esta fase foca exclusivamente no preenchimento desses dados via migração do Liquibase.

## Implementation Decisions
- **Atrações Selecionadas**: 
1. **Farol do Cabo Branco** (Cultura/Marco)
2. **Praia de Tambaú** (Praia/Lazer)
3. **Centro Cultural São Francisco** (Histórico/Religioso)
4. **Parque Solon de Lucena** (Natureza/Lazer)
5. **Mercado de Artesanato Paraibano - MAP** (Compras/Cultura)
6. **Estação Cabo Branco** (Cultura/Ciência)
7. **Pôr do Sol na Praia do Jacaré** (Lazer/Experiência)
8. **Piscinas Naturais de Picãozinho** (Natureza/Passeio)
9. **Ilha de Areia Vermelha** (Natureza/Lazer)
10. **Centro Histórico (Praça Antenor Navarro)** (Histórico/Arquitetura)
11. **Igreja de Nossa Senhora do Carmo** (Histórico/Religioso)
12. **Praia do Bessa** (Praia/Lazer)
13. **Jardim Botânico Benjamin Maranhão** (Natureza/Preservação)
14. **Praia de Manaíra** (Praia/Gastronomia)
15. **Hotel Globo** (Histórico/Vista Panorâmica)
16. **Casa do Artista Popular** (Cultura/Arte)
17. **Praia de Cabo Branco** (Praia/Esportes)
18. **Largo do Tambiá** (Lazer/Histórico)
19. **Bica (Parque Zoobotânico Arruda Câmara)** (Natureza/Lazer)
20. **Praia do Seixas** (Natureza/Ponto Extremo)
- **Campos**: Preencheremos todos os campos obrigatórios (latitude, longitude, categoria, descrição curta e longa, endereço).
- **Imagens**: Cada atração terá ao menos 2 imagens associadas para testar carrosséis futuramente.
- **UUIDs**: Gerar UUIDs fixos para os seeds para garantir idempotência e consistência em diferentes ambientes.

## Proposed Changes

### Backend

#### [DB] Liquibase Seeds (`backend/src/main/resources/db/changelog/changes/010-seed-initial-attractions.xml`)
- Criar `changeSet` com comandos `<insert>` para a tabela `attractions`.
- Criar `changeSet` com comandos `<insert>` para a tabela `attraction_images`.

#### [DB] Liquibase Master (`backend/src/main/resources/db/changelog/db.changelog-master.xml`)
- Incluir o novo arquivo de seeds.

## Verification Plan

### Manual Verification
- Executar o backend e verificar os logs do Liquibase para confirmar o sucesso das inserções.
- Acessar o banco de dados H2 (ou o PostgreSQL se configurado) e executar `SELECT * FROM attractions;` e `SELECT * FROM attraction_images;`.
- Validar se as URLs das imagens e os endereços estão corretos.

### Integration Tests
- Opcional: Criar um teste simples que valide se o número total de atrações no banco após a inicialização é igual a 20.
