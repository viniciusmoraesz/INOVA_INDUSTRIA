package br.com.fiap.config;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * Classe para carregar configurações de variáveis de ambiente
 * Suporta tanto arquivo .env quanto variáveis de sistema
 */
public class EnvConfig {
    private static Properties properties = new Properties();
    private static boolean loaded = false;

    static {
        loadEnvironmentVariables();
    }

    private static void loadEnvironmentVariables() {
        if (loaded) return;

        try {
            // Tentar carregar do arquivo .env primeiro
            String envFile = System.getProperty("user.dir") + "/.env";
            try (FileInputStream fis = new FileInputStream(envFile)) {
                properties.load(fis);
                System.out.println("✅ Arquivo .env carregado com sucesso");
            } catch (IOException e) {
                System.out.println("⚠️ Arquivo .env não encontrado, usando variáveis de sistema");
            }

            loaded = true;
        } catch (Exception e) {
            System.err.println("❌ Erro ao carregar configurações: " + e.getMessage());
        }
    }

    /**
     * Obtém uma variável de ambiente
     * Prioridade: 1. Variável de sistema, 2. Arquivo .env, 3. Valor padrão
     */
    public static String get(String key, String defaultValue) {
        // Primeiro tenta variável de sistema
        String systemValue = System.getenv(key);
        if (systemValue != null && !systemValue.trim().isEmpty()) {
            return systemValue;
        }

        // Depois tenta arquivo .env
        String envValue = properties.getProperty(key);
        if (envValue != null && !envValue.trim().isEmpty()) {
            return envValue;
        }

        // Por último usa valor padrão
        return defaultValue;
    }

    public static String get(String key) {
        return get(key, null);
    }

    // Métodos específicos para configurações do banco
    public static String getDatabaseUrl() {
        return get("DB_URL", "jdbc:postgresql://localhost:5432/DB_INOVA_INDUSTRIA");
    }

    public static String getDatabaseUser() {
        return get("DB_USER", "postgres");
    }

    public static String getDatabasePassword() {
        return get("DB_PASSWORD", "");
    }

    // Métodos para JWT
    public static String getJwtSecret() {
        return get("JWT_SECRET", "default-secret-key-change-in-production");
    }

    public static int getJwtExpirationHours() {
        String hours = get("JWT_EXPIRATION_HOURS", "2");
        try {
            return Integer.parseInt(hours);
        } catch (NumberFormatException e) {
            return 2;
        }
    }

    // Método para debug (não expõe senhas)
    public static void printLoadedConfig() {
        System.out.println("🔧 Configurações carregadas:");
        System.out.println("  DB_URL: " + getDatabaseUrl());
        System.out.println("  DB_USER: " + getDatabaseUser());
        System.out.println("  DB_PASSWORD: " + (getDatabasePassword().isEmpty() ? "❌ NÃO DEFINIDA" : "✅ DEFINIDA"));
        System.out.println("  JWT_SECRET: " + (getJwtSecret().equals("default-secret-key-change-in-production") ? "⚠️ USANDO PADRÃO" : "✅ PERSONALIZADA"));
        System.out.println("  JWT_EXPIRATION: " + getJwtExpirationHours() + "h");
    }
}
