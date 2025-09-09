package br.com.fiap.security;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class PasswordHasherTest {
    @Test
    void hashAndVerifyShouldWork() {
        String pwd = "S3nh@F0rte!";
        String hash = PasswordHasher.hash(pwd.toCharArray());
        assertNotNull(hash);
        assertTrue(hash.startsWith("$argon2id$"));
        assertTrue(PasswordHasher.verify(hash, pwd.toCharArray()));
        assertFalse(PasswordHasher.verify(hash, "wrong".toCharArray()));
    }
}
