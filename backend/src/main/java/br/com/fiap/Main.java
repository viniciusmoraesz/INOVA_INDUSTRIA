package br.com.fiap;

import br.com.fiap.config.CORSFilter;
import br.com.fiap.config.EnvConfig;
import br.com.fiap.filter.AuthenticationFilter;
import br.com.fiap.resource.AuthResource;
import br.com.fiap.resource.ClienteResource;
import br.com.fiap.resource.EmpresaResource;
import br.com.fiap.resource.ProjetoResource;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.flywaydb.core.Flyway;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;

import java.net.URI;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Main {
    private static final Logger LOGGER = Logger.getLogger(Main.class.getName());
    public static final String BASE_URI = "http://localhost:8080/";

    public static void main(String[] args) {

        try {
            // 1️⃣ Rodar migrations antes de subir o servidor
            runMigrations();

            // 2️⃣ Iniciar servidor
            HttpServer server = startServer();
            LOGGER.info(String.format("Jersey app started with WADL available at %sapplication.wadl", BASE_URI));
            LOGGER.info("Hit Ctrl-C to stop it...");

            // Mantém a thread principal viva
            Thread.currentThread().join();

        } catch (InterruptedException e) {
            LOGGER.log(Level.SEVERE, "Server was interrupted", e);
            Thread.currentThread().interrupt();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error starting the server", e);
        }
    }

    private static void runMigrations() {
        try {
            // Configura Flyway
            Flyway flyway = Flyway.configure()
                    .dataSource(
                            EnvConfig.getDatabaseUrl(),
                            EnvConfig.getDatabaseUser(),
                            EnvConfig.getDatabasePassword()
                    )
                    // Certifique-se que as migrations estão nessa pasta dentro do classpath
                    .locations("classpath:db/migration")
                    // Como apagamos tudo, não precisamos de baseline
                    .baselineOnMigrate(false)
                    .load();

            LOGGER.info("🔄 Iniciando migrations...");
            flyway.migrate();
            LOGGER.info("✅ Migrations aplicadas com sucesso!");
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "❌ Erro ao aplicar migrations com Flyway", e);
            throw new RuntimeException("Falha ao aplicar migrations", e);
        }
    }

    public static HttpServer startServer() {
        try {
            // Configura Jackson ObjectMapper com suporte a datas Java 8+
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            objectMapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

            JacksonJsonProvider jacksonProvider = new JacksonJsonProvider();
            jacksonProvider.setMapper(objectMapper);

            // Configuração de recursos e filtros
            final ResourceConfig rc = new ResourceConfig()
                    .packages("br.com.fiap.resource", "br.com.fiap.filter")
                    .register(jacksonProvider)
                    .register(CORSFilter.class)
                    .register(AuthResource.class)
                    .register(ClienteResource.class)
                    .register(EmpresaResource.class)
                    .register(ProjetoResource.class)
                    .register(AuthenticationFilter.class);

            LOGGER.info("Registered resources: " + rc.getClasses());

            HttpServer server = GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URI), rc);

            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                LOGGER.info("Shutting down server...");
                server.shutdownNow();
            }));

            return server;

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error creating HTTP server", e);
            throw new RuntimeException("Failed to start server", e);
        }
    }
}
