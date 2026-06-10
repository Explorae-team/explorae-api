package br.edu.ifpb.explorae.common.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public Bucket resolveBucket(String key, int capacity, int tokensPerPeriod, Duration period) {
        return buckets.computeIfAbsent(key, k -> createNewBucket(capacity, tokensPerPeriod, period));
    }

    private Bucket createNewBucket(int capacity, int tokensPerPeriod, Duration period) {
        Bandwidth limit = Bandwidth.builder()
                .capacity(capacity)
                .refillGreedy(tokensPerPeriod, period)
                .build();

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}
