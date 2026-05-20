# Phase 2: [SDGEU-211] Popular Banco com Seeds de Atrações Iniciais - Context

**Gathered:** 2026-05-10
**Status:** Ready for planning
**Source:** Web Research & Project Requirements

<domain>
## Phase Boundary
Esta fase foca na criação de dados iniciais (seeds) para o catálogo de atrações. O objetivo é permitir que o feed e as telas de busca tenham conteúdo real para testes e demonstração do MVP.

</domain>

<decisions>
## Implementation Decisions

### Data Source
Utilizaremos 20 atrações icônicas de João Pessoa (PB):
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

### Technical Format
- **Liquibase**: Usaremos um novo arquivo de changelog `010-seed-initial-attractions.xml`.
- **Imagens**: Usaremos URLs de imagens reais (ou placeholders de alta qualidade) para garantir que o frontend tenha o que exibir.
- **Relacionamento**: As imagens serão inseridas na tabela `attraction_images` referenciando os IDs gerados para as atrações.

</decisions>

<canonical_refs>
## Canonical References
- `backend/src/main/resources/db/changelog/changes/009-add-address-and-images-to-attractions.xml` — Estrutura das tabelas.
- `backend/src/main/java/br/edu/ifpb/explorae/domain/attraction/Attraction.java` — Entidade alvo.

</canonical_refs>

---
*Phase: 02-popular-banco-com-seeds-de-atracoes-iniciais-liquibase*
