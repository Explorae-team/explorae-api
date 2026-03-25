package br.edu.ifpb.explorae.api.dto;

public record StandardResponseDTO<T>(
    String message,
    T data
) {
    public static <T> StandardResponseDTO<T> success(String message, T data) {
        return new StandardResponseDTO<>(message, data);
    }

    public static <T> StandardResponseDTO<T> success(String message) {
        return new StandardResponseDTO<>(message, null);
    }

    public static <T> StandardResponseDTO<T> error(String message, T errors) {
        return new StandardResponseDTO<>(message, errors);
    }

    public static <T> StandardResponseDTO<T> error(String message) {
        return new StandardResponseDTO<>(message, null);
    }
}
