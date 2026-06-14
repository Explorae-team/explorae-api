package br.edu.ifpb.explorae.common.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Anotação para aplicar Rate Limiting de forma declarativa em endpoints.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimited {

    /**
     * O identificador do limite. Se vazio, o interceptor usará o path da requisição.
     */
    String key() default "";

    /**
     * A capacidade máxima do bucket e número de requisições permitidas por período.
     */
    int capacity();

    /**
     * O período de tempo em minutos para o refill do bucket.
     */
    int periodInMinutes();
}
