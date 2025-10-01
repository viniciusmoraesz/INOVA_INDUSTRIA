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

    // Método auxiliar para gerar hash a partir de String
    public static String hash(String plainText) {
        if (plainText == null) {
            return null;
        }
        return hash(plainText.toCharArray());
    }
    
    public static boolean verify(String encodedHash, char[] plainPassword) {
        try {
            System.out.println("\n=== INÍCIO DA VERIFICAÇÃO DE SENHA ===");
            System.out.println("Hash armazenado: " + encodedHash);
            System.out.println("Tamanho do hash: " + (encodedHash != null ? encodedHash.length() : 0));
            System.out.println("Senha fornecida: '" + new String(plainPassword) + "'");
            
            // Verifica se o hash está no formato esperado
            if (encodedHash == null || !encodedHash.startsWith("$argon2id$")) {
                System.out.println("ERRO: Formato de hash inválido. Deve começar com $argon2id$");
                return false;
            }
            
            // Extrai os parâmetros do hash para debug
            String[] parts = encodedHash.split("\\$");
            if (parts.length >= 6) {
                System.out.println("Parâmetros do hash:");
                System.out.println("- Algoritmo: " + parts[1]);
                System.out.println("- Versão: " + parts[2]);
                System.out.println("- m (memória): " + parts[3].substring(2));
                System.out.println("- t (iterações): " + parts[3].substring(0, 1));
                System.out.println("- p (paralelismo): " + parts[3].substring(4));
                System.out.println("- Salt: " + parts[4].substring(0, Math.min(10, parts[4].length())) + "...");
                System.out.println("- Hash: " + parts[5].substring(0, Math.min(10, parts[5].length())) + "...");
            }
            
            // Tenta verificar a senha usando o verificador Argon2
            try {
                System.out.println("\nIniciando verificação Argon2...");
                boolean result = ARGON2.verify(encodedHash, plainPassword);
                System.out.println("Resultado da verificação: " + result);
                
                if (!result) {
                    // Se falhar, tenta verificar se há problemas com caracteres especiais
                    String passwordStr = new String(plainPassword);
                    System.out.println("=== FALHA NA VERIFICAÇÃO ===");
                    System.out.println("1. Verificando se há espaços em branco: '" + passwordStr.trim() + "'");
                    System.out.println("2. Tamanho da senha: " + passwordStr.length());
                    
                    // Tenta verificar com a senha sem espaços em branco
                    String trimmedPassword = passwordStr.trim();
                    if (!passwordStr.equals(trimmedPassword)) {
                        System.out.println("Aviso: A senha contém espaços em branco extras");
                        result = ARGON2.verify(encodedHash, trimmedPassword.toCharArray());
                        System.out.println("Resultado após remoção de espaços: " + result);
                    }
                }
                
                return result;
                
            } catch (Exception e) {
                System.out.println("Erro durante a verificação: " + e.getMessage());
                e.printStackTrace();
                return false;
            }
        } finally {
            if (plainPassword != null) {
                java.util.Arrays.fill(plainPassword, '\0');
            }
        }
    }
    
    // Método para testar a verificação de senha
    public static void testPasswordVerification(String storedHash, String password) {
        System.out.println("\n=== TESTE DE VERIFICAÇÃO DE SENHA ===");
        System.out.println("Hash armazenado: " + storedHash);
        System.out.println("Senha para teste: '" + password + "'");
        
        try {
            char[] passwordChars = (password != null) ? password.toCharArray() : null;
            boolean result = verify(storedHash, passwordChars);
            System.out.println("Resultado da verificação: " + result);
        } catch (Exception e) {
            System.out.println("Erro durante a verificação: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Método main para testar a verificação de senha
    // Método para gerar o hash de uma senha e retornar como string
    public static String generateHashForPassword(String password) {
        if (password == null) {
            throw new IllegalArgumentException("A senha não pode ser nula");
        }
        return hash(password.toCharArray());
    }
    
    public static void main(String[] args) {
        // Gera o hash para "super_secret"
        System.out.println("=== HASH PARA 'super_secret' ===");
        String superSecretHash = hash("super_secret".toCharArray());
        System.out.println(superSecretHash);

        // Encerra o programa após exibir o hash
        System.exit(0);
    }
}
