package br.edu.ifpb.explorae.attraction.service;

import br.edu.ifpb.explorae.attraction.domain.GeoCoordinate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.data.Offset.offset;

/**
 * Testes unitários para o GeoDistanceCalculator desenvolvidos no Ciclo 1 do TDD.
 */
class GeoDistanceCalculatorTest {

    private GeoDistanceCalculator calculator;

    // Coordenadas reais de pontos turísticos em João Pessoa - PB
    private static final GeoCoordinate FAROL_CABO_BRANCO = new GeoCoordinate(-7.1488, -34.7963);
    private static final GeoCoordinate PONTA_DOS_SEIXAS = new GeoCoordinate(-7.1528, -34.7932);

    @BeforeEach
    void setUp() {
        calculator = new GeoDistanceCalculator();
    }

    @Test
    @DisplayName("Deve retornar distância zero quando os pontos forem exatamente iguais")
    void shouldReturnZeroDistanceForSamePoint() {
        double distance = calculator.calculateDistanceInMeters(FAROL_CABO_BRANCO, FAROL_CABO_BRANCO);
        assertThat(distance).isZero();
    }

    @Test
    @DisplayName("Deve calcular com precisão a distância real entre o Farol do Cabo Branco e a Ponta dos Seixas (~560m)")
    void shouldCalculateAccurateDistanceBetweenKnownLandmarks() {
        // Distância real geodésica conhecida é de aproximadamente 564 metros
        double distance = calculator.calculateDistanceInMeters(FAROL_CABO_BRANCO, PONTA_DOS_SEIXAS);

        assertThat(distance).isCloseTo(564.0, offset(10.0));
    }

    @Test
    @DisplayName("Deve validar que a distância é simétrica (A até B == B até A)")
    void shouldBeSymmetric() {
        double distAB = calculator.calculateDistanceInMeters(FAROL_CABO_BRANCO, PONTA_DOS_SEIXAS);
        double distBA = calculator.calculateDistanceInMeters(PONTA_DOS_SEIXAS, FAROL_CABO_BRANCO);

        assertThat(distAB).isEqualTo(distBA);
    }

    @Test
    @DisplayName("Deve retornar true quando a distância estiver dentro do raio de 100 metros")
    void shouldReturnTrueWhenWithinRadius() {
        // Ponto a ~40 metros do Farol
        GeoCoordinate nearby = new GeoCoordinate(-7.1485, -34.7961);

        boolean withinRadius = calculator.isWithinRadius(FAROL_CABO_BRANCO, nearby, 100.0);

        assertThat(withinRadius).isTrue();
    }

    @Test
    @DisplayName("Deve retornar false quando a distância ultrapassar o raio limite")
    void shouldReturnFalseWhenExceedingRadius() {
        // Ponta dos Seixas está a ~564m do Farol, portanto fora do raio de 100m
        boolean withinRadius = calculator.isWithinRadius(FAROL_CABO_BRANCO, PONTA_DOS_SEIXAS, 100.0);

        assertThat(withinRadius).isFalse();
    }

    @Test
    @DisplayName("Deve lançar IllegalArgumentException quando alguma coordenada for nula")
    void shouldThrowExceptionWhenCoordinateIsNull() {
        assertThatThrownBy(() -> calculator.calculateDistanceInMeters(null, FAROL_CABO_BRANCO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("As coordenadas não podem ser nulas.");

        assertThatThrownBy(() -> calculator.calculateDistanceInMeters(FAROL_CABO_BRANCO, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("As coordenadas não podem ser nulas.");
    }

    @Test
    @DisplayName("Deve lançar IllegalArgumentException quando o raio for negativo")
    void shouldThrowExceptionWhenRadiusIsNegative() {
        assertThatThrownBy(() -> calculator.isWithinRadius(FAROL_CABO_BRANCO, PONTA_DOS_SEIXAS, -10.0))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("O raio máximo não pode ser negativo.");
    }

    @ParameterizedTest
    @CsvSource({
            "91.0, 0.0, Latitude inválida",
            "-90.1, 0.0, Latitude inválida",
            "0.0, 180.1, Longitude inválida",
            "0.0, -180.1, Longitude inválida"
    })
    @DisplayName("Deve rejeitar coordenadas inválidas fora dos limites terrestres")
    void shouldRejectInvalidCoordinates(double lat, double lon, String messagePrefix) {
        assertThatThrownBy(() -> new GeoCoordinate(lat, lon))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageStartingWith(messagePrefix);
    }
}
