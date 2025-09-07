package br.com.fiap.resource;

import br.com.fiap.annotation.Secured;
import br.com.fiap.dao.ProjetoDAO;
import br.com.fiap.model.Projeto;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.sql.SQLException;
import java.util.List;

@Path("/projetos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Secured
public class ProjetoResource {

    @OPTIONS
    public Response options() {
        return Response.ok()
                .header("Access-Control-Allow-Origin", "http://localhost:5173")
                .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Origin")
                .header("Access-Control-Allow-Credentials", "true")
                .build();
    }

    @GET
    public Response listarPorEmpresa(@QueryParam("empresa") Long empresaId, @Context SecurityContext securityContext) {
        System.out.println("📋 GET /projetos - Listando projetos para empresa: " + empresaId);
        try (ProjetoDAO dao = new ProjetoDAO()) {
            List<Projeto> projetos;

            if (securityContext.isUserInRole("SUPER_ADMIN")) {
                System.out.println("👑 SUPER_ADMIN - Listando todos os projetos");
                projetos = dao.listarTodos();
            } else {
                System.out.println("👤 Usuário regular - Listando projetos da empresa: " + empresaId);
                if (empresaId == null) {
                    System.out.println("❌ ID da empresa é obrigatório para usuários regulares");
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity("{\"erro\":\"ID da empresa é obrigatório\"}")
                            .build();
                }
                projetos = dao.listarPorEmpresa(empresaId);
            }

            System.out.println("✅ Projetos encontrados: " + projetos.size());
            return Response.ok(projetos).build();
        } catch (SQLException e) {
            System.err.println("❌ Erro SQL ao listar projetos: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"erro\":\"Erro ao listar projetos\"}")
                    .build();
        }
    }

    @POST
    public Response cadastrar(Projeto projeto, @Context SecurityContext securityContext) {
        System.out.println("🚀 POST /projetos - Cadastrando novo projeto");
        
        try {
            System.out.println("📋 Dados recebidos:");
            System.out.println("  - Titulo: " + (projeto != null ? projeto.getTitulo() : "null"));
            System.out.println("  - IdEmpresa: " + (projeto != null ? projeto.getIdEmpresa() : "null"));
            System.out.println("  - IdGerente: " + (projeto != null ? projeto.getIdGerente() : "null"));
            System.out.println("  - DataInicio: " + (projeto != null ? projeto.getDataInicio() : "null"));
            System.out.println("  - Status: " + (projeto != null ? projeto.getStatus() : "null"));
            System.out.println("  - Prioridade: " + (projeto != null ? projeto.getPrioridade() : "null"));

            if (projeto == null) {
                System.err.println("❌ Projeto recebido é null");
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"erro\":\"Dados do projeto não foram recebidos\"}")
                        .build();
            }

            if (projeto.getTitulo() == null || projeto.getTitulo().trim().isEmpty()) {
                System.err.println("❌ Título do projeto é obrigatório");
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"erro\":\"Título do projeto é obrigatório\"}")
                        .build();
            }

            if (projeto.getIdEmpresa() == null) {
                System.err.println("❌ ID da empresa é obrigatório");
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"erro\":\"ID da empresa é obrigatório\"}")
                        .build();
            }

            System.out.println("📊 Criando DAO...");
            try (ProjetoDAO dao = new ProjetoDAO()) {
                if (!securityContext.isUserInRole("SUPER_ADMIN")) {
                    System.out.println("👤 Usuário regular tentando criar projeto");
                    System.err.println("❌ Clientes não podem criar projetos");
                    return Response.status(Response.Status.FORBIDDEN)
                            .entity("{\"erro\":\"Clientes não têm permissão para criar projetos\"}")
                            .build();
                } else {
                    System.out.println("👑 SUPER_ADMIN criando projeto");
                }

                System.out.println("💾 Chamando dao.cadastrar()...");
                Long id = dao.cadastrar(projeto);
                System.out.println("✅ Projeto criado com ID: " + id);

                return Response.status(Response.Status.CREATED)
                        .entity("{\"id\":" + id + "}")
                        .build();
            }
        } catch (SQLException e) {
            System.err.println("❌ Erro SQL ao cadastrar projeto: " + e.getMessage());
            System.err.println("❌ SQL State: " + e.getSQLState());
            System.err.println("❌ Error Code: " + e.getErrorCode());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"erro\":\"Erro SQL: " + e.getMessage() + "\"}")
                    .build();
        } catch (Exception e) {
            System.err.println("❌ Erro geral ao cadastrar projeto: " + e.getMessage());
            System.err.println("❌ Tipo da exceção: " + e.getClass().getName());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"erro\":\"Erro interno: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    @GET
    @Path("/{id}")
    public Response buscarPorId(@PathParam("id") Long id) {
        System.out.println("🔍 GET /projetos/" + id + " - Buscando projeto por ID");
        try (ProjetoDAO dao = new ProjetoDAO()) {
            return dao.pesquisarPorId(id)
                    .map(projeto -> {
                        System.out.println("✅ Projeto encontrado: " + projeto);
                        return Response.ok(projeto).build();
                    })
                    .orElse(Response.status(Response.Status.NOT_FOUND).build());
        } catch (SQLException e) {
            System.err.println("❌ Erro SQL ao buscar projeto: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"erro\":\"Erro ao buscar projeto\"}")
                    .build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, Projeto projeto) {
        System.out.println("🔄 PUT /projetos/" + id + " - Atualizando projeto");
        System.out.println("📋 Novos dados: " + projeto);

        try (ProjetoDAO dao = new ProjetoDAO()) {
            projeto.setIdProjeto(id);
            dao.atualizar(projeto);
            System.out.println("✅ Projeto atualizado com sucesso");
            return Response.ok().build();
        } catch (SQLException e) {
            System.err.println("❌ Erro SQL ao atualizar projeto: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"erro\":\"Erro ao atualizar projeto\"}")
                    .build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response remover(@PathParam("id") Long id) {
        System.out.println("🗑️ DELETE /projetos/" + id + " - Removendo projeto");
        try (ProjetoDAO dao = new ProjetoDAO()) {
            dao.remover(id);
            System.out.println("✅ Projeto removido com sucesso");
            return Response.ok().build();
        } catch (SQLException e) {
            System.err.println("❌ Erro SQL ao remover projeto: " + e.getMessage());
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"erro\":\"Erro ao remover projeto\"}")
                    .build();
        }
    }
}