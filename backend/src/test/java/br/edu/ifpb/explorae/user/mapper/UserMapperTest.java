package br.edu.ifpb.explorae.user.mapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
class UserMapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    void shouldCalculateCorrectLevelNameForBronze() {
        assertEquals("Explorador Bronze", userMapper.calculateLevelName(0));
        assertEquals("Explorador Bronze", userMapper.calculateLevelName(500));
        assertEquals("Explorador Bronze", userMapper.calculateLevelName(999));
    }

    @Test
    void shouldCalculateCorrectLevelNameForSilver() {
        assertEquals("Explorador Prata", userMapper.calculateLevelName(1000));
        assertEquals("Explorador Prata", userMapper.calculateLevelName(1500));
        assertEquals("Explorador Prata", userMapper.calculateLevelName(1999));
    }

    @Test
    void shouldCalculateCorrectLevelNameForGold() {
        assertEquals("Explorador Ouro", userMapper.calculateLevelName(2000));
        assertEquals("Explorador Ouro", userMapper.calculateLevelName(2500));
        assertEquals("Explorador Ouro", userMapper.calculateLevelName(2999));
    }

    @Test
    void shouldCalculateCorrectLevelNameForPlatinum() {
        assertEquals("Explorador Platina", userMapper.calculateLevelName(3000));
        assertEquals("Explorador Platina", userMapper.calculateLevelName(5000));
    }

    @Test
    void shouldHandleNullXp() {
        assertEquals("Explorador Bronze", userMapper.calculateLevelName(null));
    }
}
