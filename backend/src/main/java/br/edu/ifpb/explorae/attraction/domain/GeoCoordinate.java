package br.edu.ifpb.explorae.attraction.domain;

/**
 * Value Object imutável representando uma coordenada geográfica no globo terrestre.
 * Nascido via TDD para garantir a integridade dos dados de geolocalização.
 */
public record GeoCoordinate(double latitude, double longitude) {

    public GeoCoordinate {
        if (latitude < -90.0 || latitude > 90.0) {
            throw new IllegalArgumentException("Latitude inválida: deve estar entre -90.0 e 90.0 graus.");
        }
        if (longitude < -180.0 || longitude > 180.0) {
            throw new IllegalArgumentException("Longitude inválida: deve estar entre -180.0 e 180.0 graus.");
        }
    }
}
