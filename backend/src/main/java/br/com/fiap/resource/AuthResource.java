package br.com.fiap.resource;

import br.com.fiap.dao.ClienteDAO;
import br.com.fiap.model.Cliente;
import br.com.fiap.service.TokenService;
import br.com.fiap.security.PasswordHasher;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.HashMap;
import java.util.Map;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @GET
    @Path("/generate-hash/{senha}")
    public Response generateHash(@PathParam("senha") String senha) {
        try {
            String hash = PasswordHasher.hash(senha);
            return Response.ok("{\"hash\":\"" + hash + "\"}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Erro ao gerar hash: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    @POST
    @Path("/login")
    public Response login(String rawJson) {
        System.out.println("=== RAW JSON RECEIVED ===");
        System.out.println("Raw JSON: " + rawJson);

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(rawJson);

            String email = jsonNode.get("email").asText();
            String senha = jsonNode.get("senha").asText();

            System.out.println("Extracted - Email: " + email + ", Senha: " + senha);

            try (ClienteDAO dao = new ClienteDAO()) {
                Cliente cliente = dao.buscarPorEmail(email)
                        .orElseThrow(() -> new WebApplicationException("Credenciais inválidas", Response.Status.UNAUTHORIZED));

                System.out.println("Cliente found: " + cliente.getNome());


                // Use Argon2 verify for password check
                if (cliente.getSenha() == null || !PasswordHasher.verify(cliente.getSenha(), senha.toCharArray())) {
                    System.out.println("Password mismatch");
                    throw new WebApplicationException("Credenciais inválidas", Response.Status.UNAUTHORIZED);
                }

                System.out.println("Password matches, creating response");

                // Generate the real JWT token
                TokenService tokenService = new TokenService();
                String token = tokenService.generateToken(cliente);

                Map<String, Object> response = new HashMap<>();
                response.put("id", cliente.getIdCliente());
                response.put("nome", cliente.getNome());
                response.put("email", cliente.getEmail());
                response.put("role", cliente.getRole());
                response.put("idEmpresa", cliente.getIdEmpresa());
                response.put("token", token); // Real JWT token

                System.out.println("Login successful for: " + cliente.getEmail());
                return Response.ok(response)
                        .header("Access-Control-Allow-Origin", "*")
                        .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                        .header("Access-Control-Allow-Headers", "Content-Type, Authorization")
                        .build();
            }

        } catch (WebApplicationException e) {
            System.out.println("WebApplicationException: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.out.println("Error parsing JSON: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"erro\":\"Invalid JSON format\"}")
                    .header("Access-Control-Allow-Origin", "*")
                    .build();
        }
    }
}