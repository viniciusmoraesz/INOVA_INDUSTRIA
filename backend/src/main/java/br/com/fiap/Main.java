package br.com.fiap;

import br.com.fiap.config.CORSFilter;
import br.com.fiap.filter.AuthenticationFilter;
import br.com.fiap.resource.AuthResource;
import br.com.fiap.resource.ClienteResource;
import br.com.fiap.resource.EmpresaResource;
import br.com.fiap.resource.ProjetoResource;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
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
            startServer();
            LOGGER.info(String.format("Jersey app started with WADL available at %sapplication.wadl", BASE_URI));
            LOGGER.info("Hit Ctrl-C to stop it...");

            // Keep the main thread alive
            Thread.currentThread().join();

        } catch (InterruptedException e) {
            LOGGER.log(Level.SEVERE, "Server was interrupted", e);
            Thread.currentThread().interrupt();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error starting the server", e);
        }
    }

    public static HttpServer startServer() {
        try {
            // Configure Jackson ObjectMapper with JSR310 support
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            objectMapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            
            // Create Jackson JSON provider with configured ObjectMapper
            JacksonJsonProvider jacksonProvider = new JacksonJsonProvider();
            jacksonProvider.setMapper(objectMapper);

            // Create a resource config that scans for JAX-RS resources and providers
            final ResourceConfig rc = new ResourceConfig()
                    // Add the filter package to be scanned
                    .packages("br.com.fiap.resource", "br.com.fiap.filter")
                    .register(jacksonProvider)
                    .register(CORSFilter.class)
                    .register(AuthResource.class)
                    .register(ClienteResource.class)
                    .register(EmpresaResource.class)
                    .register(ProjetoResource.class)
                    // Register the AuthenticationFilter
                    .register(AuthenticationFilter.class);

            // Log all registered resources
            LOGGER.info("Registered resources: " + rc.getClasses());

            // Create and start a new instance of grizzly http server
            HttpServer server = GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URI), rc);

            // Add shutdown hook
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
