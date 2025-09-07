package br.com.fiap.factory;

import br.com.fiap.config.EnvConfig;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionFactory {

    private static final String URL = EnvConfig.getDatabaseUrl();
    private static final String USER = EnvConfig.getDatabaseUser();
    private static final String PASSWORD = EnvConfig.getDatabasePassword();

    static {
        // Log das configurações carregadas (sem expor senhas)
        EnvConfig.printLoadedConfig();
        
        // Validar se senha foi definida
        if (PASSWORD == null || PASSWORD.trim().isEmpty()) {
            System.err.println("❌ ERRO: Senha do banco não foi definida!");
            System.err.println("   Configure a variável DB_PASSWORD no arquivo .env ou como variável de sistema");
        }
    }

    public static Connection getConnection() throws SQLException {
        try {
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (SQLException e) {
            System.err.println("❌ Erro ao conectar com o banco de dados:");
            System.err.println("   URL: " + URL);
            System.err.println("   User: " + USER);
            System.err.println("   Erro: " + e.getMessage());
            throw e;
        }
    }

}
