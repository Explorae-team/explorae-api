package br.edu.ifpb.explorae.attraction.service;

import br.edu.ifpb.explorae.attraction.domain.GeoCoordinate;
import org.springframework.stereotype.Component;

/**
 * Calculador de distâncias geodésicas utilizando a fórmula de Haversine.
 * Desenvolvido estritamente através do ciclo Red-Green-Refactor do TDD.
 */
@Component
public class GeoDistanceCalculator {

    /**
     * Raio médio volumétrico da Terra em metros (WGS-84 / IUGG).
     */
    public static final double EARTH_RADIUS_METERS = 6_371_000.0;

    /**
     * Calcula a distância em metros entre duas coordenadas na superfície da Terra.
     *
     * @param start Coordenada de origem
     * @param end   Coordenada de destino
     * @return Distância geodésica em metros
     */
    public double calculateDistanceInMeters(GeoCoordinate start, GeoCoordinate end) {
        if (start == null || end == null) {
            throw new IllegalArgumentException("As coordenadas não podem ser nulas.");
        }

        double latDistance = Math.toRadians(end.latitude() - start.latitude());
        double lonDistance = Math.toRadians(end.longitude() - start.longitude());

        // Na fórmula de Haversine, representa o quadrado da metade da corda esférica
        double chordLengthSquared = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(start.latitude())) * Math.cos(Math.toRadians(end.latitude()))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        // Representa a distância angular (ângulo central em radianos) subtendida no centro da Terra
        double angularDistanceInRadians = 2 * Math.atan2(Math.sqrt(chordLengthSquared), Math.sqrt(1 - chordLengthSquared));

        return EARTH_RADIUS_METERS * angularDistanceInRadians;
    }

    /**
     * Verifica se duas coordenadas estão dentro de um raio de tolerância especificado.
     *
     * @param point1            Primeira coordenada
     * @param point2            Segunda coordenada
     * @param maxRadiusInMeters Raio limite em metros
     * @return true se a distância for menor ou igual ao raio, false caso contrário
     */
    public boolean isWithinRadius(GeoCoordinate point1, GeoCoordinate point2, double maxRadiusInMeters) {
        if (maxRadiusInMeters < 0) {
            throw new IllegalArgumentException("O raio máximo não pode ser negativo.");
        }
        return calculateDistanceInMeters(point1, point2) <= maxRadiusInMeters;
    }
}
