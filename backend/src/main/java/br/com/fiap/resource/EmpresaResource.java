package br.com.fiap.resource;

import br.com.fiap.annotation.Secured;
import br.com.fiap.dao.EmpresaDAO;
import br.com.fiap.model.Empresa;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.util.List;

@Path("/empresas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
// @Secured // Temporarily disabled for testing
public class EmpresaResource {

    @GET
    public Response listarEmpresas() {
        System.out.println("Endpoint /api/empresas acessado"); // Log temporário
        try (EmpresaDAO dao = new EmpresaDAO()) {
            // Temporarily return all companies for testing (without authentication)
            List<Empresa> empresas = dao.listarTodos();
            System.out.println("Número de empresas encontradas: " + empresas.size()); // Log temporário
            return Response.ok(empresas).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"erro\":\"Erro ao listar empresas\"}")
                    .build();
        }
    }

    @POST
    public Response cadastrar(Empresa empresa, @Context SecurityContext securityContext) {
        try (EmpresaDAO dao = new EmpresaDAO()) {
            long id = dao.cadastrar(empresa);
            return Response.status(Response.Status.CREATED)
                    .entity("{\"id\":" + id + "}")
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"erro\":\"Erro ao cadastrar empresa\"}")
                    .build();
        }
    }

    @GET
    @Path("/{id}")
    public Response buscarPorId(@PathParam("id") Long id, @Context SecurityContext securityContext) {
        try (EmpresaDAO dao = new EmpresaDAO()) {
            return dao.pesquisarPorId(id)
                    .map(empresa -> Response.ok(empresa).build())
                    .orElse(Response.status(Response.Status.NOT_FOUND).build());
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"erro\":\"Erro ao buscar empresa\"}")
                    .build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, Empresa empresa, @Context SecurityContext securityContext) {
        try (EmpresaDAO dao = new EmpresaDAO()) {
            empresa.setIdEmpresa(id);
            dao.atualizar(empresa);
            return Response.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"erro\":\"Erro ao atualizar empresa\"}")
                    .build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response remover(@PathParam("id") Long id, @Context SecurityContext securityContext) {
        try (EmpresaDAO dao = new EmpresaDAO()) {
            dao.remover(id);
            return Response.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"erro\":\"Erro ao remover empresa\"}")
                    .build();
        }
    }

    @OPTIONS
    public Response options() {
        return Response.ok()
                .header("Access-Control-Allow-Origin", "http://localhost:5173")
                .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Origin")
                .header("Access-Control-Allow-Credentials", "true")
                .build();
    }
}