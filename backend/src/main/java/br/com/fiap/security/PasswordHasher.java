package br.com.fiap.security;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;

/**
 * Utility for hashing and verifying passwords using Argon2id.
 */
public final class PasswordHasher {
    // Reasonable defaults; adjust if needed based on server resources.
    private static final int ITERATIONS = 3;         // time cost
    private static final int MEMORY_KIB = 1 << 14;   // 16 MiB
    private static final int PARALLELISM = 2;        // lanes

    private static final Argon2 ARGON2 = Argon2Factory.create(Argon2Factory.Argon2Types.ARGON2id);

    private PasswordHasher() {}

    public static String hash(char[] plainPassword) {
        try {
            // argon2.hash returns an encoded hash string with parameters and salt
            return ARGON2.hash(ITERATIONS, MEMORY_KIB, PARALLELISM, plainPassword);
        } finally {
            // Wipe the char[] we received
            if (plainPassword != null) {
                java.util.Arrays.fill(plainPassword, '\0');
            }
        }
    }

    public static boolean verify(String encodedHash, char[] plainPassword) {
        try {
            return ARGON2.verify(encodedHash, plainPassword);
        } finally {
            if (plainPassword != null) {
                java.util.Arrays.fill(plainPassword, '\0');
            }
        }
    }
}
