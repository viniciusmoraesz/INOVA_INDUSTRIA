package br.com.fiap.config;

import org.flywaydb.core.Flyway;
import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseMigration {

    public static void migrate() {
        String url = EnvConfig.getDatabaseUrl();
        String user = EnvConfig.getDatabaseUser();
        String password = EnvConfig.getDatabasePassword();

        System.out.println("🔧 Tentando conectar ao banco...");
        System.out.println("  URL: " + url);
        System.out.println("  Usuário: " + user);
        System.out.println("  Senha definida: " + (!password.isEmpty() ? "✅" : "❌ NÃO DEFINIDA"));
        System.out.println("  Tamanho da senha: " + password.length());

        // Teste rápido de conexão antes de rodar Flyway
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("✅ Conexão Java direta OK!");
        } catch (Exception e) {
            throw new RuntimeException("❌ Falha ao conectar ao banco. Verifique usuário/senha/URL.", e);
        }

        // Rodando Flyway
        try {
            Flyway flyway = Flyway.configure()
                    .dataSource(url, user, password)
                    .locations("classpath:db/migration")
                    .baselineOnMigrate(true)
                    .load();

            System.out.println("🔄 Iniciando migrations...");
            flyway.migrate();
            System.out.println("✅ Flyway executou migrations com sucesso!");
        } catch (Exception e) {
            System.err.println("❌ Erro ao executar migrations do Flyway");
            e.printStackTrace();
        }
    }
}
