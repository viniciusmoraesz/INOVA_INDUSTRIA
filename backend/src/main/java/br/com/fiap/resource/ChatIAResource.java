package br.com.fiap.resource;

import br.com.fiap.dto.ChatIARequestDTO;
import br.com.fiap.dao.ProjetoDAO;
import br.com.fiap.dao.ClienteDAO;
import br.com.fiap.factory.ConnectionFactory;
import br.com.fiap.model.Projeto;
import br.com.fiap.model.Cliente;
import br.com.fiap.model.Empresa;
import br.com.fiap.dao.EmpresaDAO;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.core.Context;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.OutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;
import io.github.cdimascio.dotenv.Dotenv;

@Path("/ia-chat")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ChatIAResource {

    @POST
    public Response chatWithIA(ChatIARequestDTO req, @Context SecurityContext securityContext) {
        // Autorização: apenas ADMIN ou SUPER_ADMIN podem usar IA
        boolean isAdmin = securityContext != null && (securityContext.isUserInRole("ADMIN") || securityContext.isUserInRole("SUPER_ADMIN"));
        if (!isAdmin) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity("Acesso negado: recurso restrito a ADMIN/SUPER_ADMIN.")
                    .build();
        }
        String context = buildContextFromDb();
        String prompt = "Contexto: " + context + "\nTarefa: Responda de forma objetiva usando os dados acima. Pergunta: " + req.getMessage();
        String iaResponse = callGroqAPI(prompt);
        return Response.ok().entity(iaResponse).build();
    }

    private String buildContextFromDb() {
        StringBuilder sb = new StringBuilder();
        List<Projeto> projetos = Collections.emptyList();
        Map<Long, Cliente> clientesMap = new HashMap<>();
        Map<Long, Empresa> empresasMap = new HashMap<>();
        try (ProjetoDAO projetoDAO = new ProjetoDAO();
             ClienteDAO clienteDAO = new ClienteDAO();
             EmpresaDAO empresaDAO = new EmpresaDAO()) {
            projetos = projetoDAO.listarTodos();
            List<Cliente> clientes = clienteDAO.listarTodos();
            List<Empresa> empresas = empresaDAO.listarTodos();
            for (Cliente c : clientes) {
                clientesMap.put(c.getIdCliente(), c);
            }
            for (Empresa e : empresas) {
                empresasMap.put(e.getIdEmpresa(), e);
            }
            if (projetos == null || projetos.isEmpty()) {
                sb.append("Projetos: Nenhum projeto cadastrado.\n");
            } else {
                sb.append("Projetos (com dados completos):\n");
                for (Projeto p : projetos) {
                    sb.append(String.format("- Projeto #%d: %s\n", p.getIdProjeto(), p.getTitulo()));
                    sb.append(String.format("  Status: %s | Prazo: %s\n", p.getStatus(), p.getDataTerminoPrevista() != null ? p.getDataTerminoPrevista() : ""));
                    sb.append(String.format("  Descrição: %s\n", p.getDescricao()));
                    sb.append(String.format("  Orçamento: %s | Prioridade: %s\n", p.getOrcamento(), p.getPrioridade()));
                    // Cliente (id_gerente)
                    Cliente cliente = p.getIdGerente() != null ? clientesMap.get(p.getIdGerente()) : null;
                    if (cliente != null) {
                        sb.append("  Cliente (id_gerente):\n");
                        sb.append(String.format("    Nome: %s | Email: %s | Telefone: %s | CPF: %s | Cargo: %s | Departamento: %s | Role: %s\n", cliente.getNome(), cliente.getEmail(), cliente.getTelefone(), cliente.getCpf(), cliente.getCargo(), cliente.getDepartamento(), cliente.getRole()));
                    }
                    // Empresa
                    Empresa empresa = p.getIdEmpresa() != null ? empresasMap.get(p.getIdEmpresa()) : null;
                    if (empresa != null) {
                        sb.append("  Empresa:\n");
                        sb.append(String.format("    Razão Social: %s | Nome Fantasia: %s | CNPJ: %s | Email: %s | Telefone: %s\n", empresa.getRazaoSocial(), empresa.getNomeFantasia(), empresa.getCnpj(), empresa.getEmail(), empresa.getTelefone()));
                        sb.append(String.format("    Endereço: %s, %s, %s, %s, %s, %s, %s | CEP: %s\n", empresa.getEndereco(), empresa.getNumero(), empresa.getComplemento(), empresa.getBairro(), empresa.getCidade(), empresa.getEstado(), empresa.getSetorAtuacao(), empresa.getCep()));
                        sb.append(String.format("    Funcionários: %s | Fundação: %s\n", empresa.getQuantidadeFuncionarios(), empresa.getDataFundacao()));
                    }
                    sb.append("\n");
                }
            }
        } catch (Exception e) {
            sb.append("[WARN] Falha ao buscar dados desnormalizados: ").append(e.getMessage()).append("\n");
        }
        return sb.toString();
    }

    private String callGroqAPI(String prompt) {
        try {
            Dotenv dotenv = Dotenv.load();
            String apiKey = dotenv.get("GROQ_API_KEY");
            System.out.println("[DEBUG] GROQ_API_KEY=" + apiKey);
            URL url = new URL("https://api.groq.com/openai/v1/chat/completions");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Bearer " + apiKey);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            conn.setDoOutput(true);
            // Escapa conteúdo do prompt para JSON seguro (aspas, barras, quebras de linha, tabs)
            String safeContent = jsonEscape(prompt);
            String payload = String.format("{\"model\":\"%s\",\"messages\":[{\"role\":\"user\",\"content\":\"%s\"}]}",
                    "llama-3.3-70b-versatile", safeContent);
            try (OutputStream os = conn.getOutputStream()) {
                os.write(payload.getBytes(StandardCharsets.UTF_8));
            }
            int status = conn.getResponseCode();
            InputStream is = (status >= 200 && status < 300) ? conn.getInputStream() : conn.getErrorStream();
            String response = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            if (status >= 200 && status < 300) {
                return response;
            } else {
                return "Erro da Groq API (" + status + "): " + response;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Erro ao consultar IA: " + e.getMessage();
        }
    }

    // Escapa caracteres problemáticos para JSON string literal
    private static String jsonEscape(String s) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"': sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                case '\b': sb.append("\\b"); break;
                case '\f': sb.append("\\f"); break;
                default:
                    if (c < 0x20) {
                        sb.append(String.format("\\u%04x", (int)c));
                    } else {
                        sb.append(c);
                    }
            }
        }
        return sb.toString();
    }
}
