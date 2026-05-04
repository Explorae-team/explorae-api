package br.edu.ifpb.explorae.domain.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Preferências de Viagem
 * O perfil do usuário: o que ele gosta.
 */
@Entity
@Table(name = "travel_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TravelPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Relaciona com o Usuário. Cada usuário tem sua preferência única.
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Interesses (Separados por vírgula)
    @Column(length = 500)
    private String interests;
}
