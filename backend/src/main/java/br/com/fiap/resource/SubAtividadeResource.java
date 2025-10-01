package br.com.fiap.resource;

import br.com.fiap.dao.SubAtividadeDAO;
import br.com.fiap.dto.CadastroSubAtividadeDTO;
import br.com.fiap.dto.SubAtividadeResponseDTO;
import br.com.fiap.model.SubAtividade;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

@Path("/subatividades")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SubAtividadeResource {

    @POST
    public Response cadastrarSubAtividade(CadastroSubAtividadeDTO dto) {
        try (SubAtividadeDAO dao = new SubAtividadeDAO()) {
            SubAtividade sub = new SubAtividade();
            sub.setIdAtividade(dto.getIdAtividade());
            sub.setTitulo(dto.getTitulo());
            sub.setDescricao(dto.getDescricao());
            sub.setDataInicioPrevista(dto.getDataInicioPrevista());
            sub.setDataTerminoPrevista(dto.getDataTerminoPrevista());
            sub.setDataTerminoReal(dto.getDataTerminoReal());
            sub.setStatus(dto.getStatus());
            sub.setPrioridade(dto.getPrioridade());

            Long id = dao.cadastrar(sub);
            sub.setIdSubAtividade(id);

            return Response.status(Response.Status.CREATED)
                    .entity(toDTO(sub))
                    .build();
        } catch (SQLException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erro ao cadastrar subatividade: " + e.getMessage())
                    .build();
        }
    }

    @GET
    @Path("/{id}")
    public Response buscarPorId(@PathParam("id") Long id) {
        try (SubAtividadeDAO dao = new SubAtividadeDAO()) {
            SubAtividade sub = dao.pesquisarPorId(id)
                    .orElseThrow(() -> new NotFoundException("Subatividade não encontrada"));
            return Response.ok(toDTO(sub)).build();
        } catch (SQLException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erro ao buscar subatividade: " + e.getMessage())
                    .build();
        }
    }

    @GET
    @Path("/atividade/{idAtividade}")
    public Response listarPorAtividade(@PathParam("idAtividade") Long idAtividade) {
        try (SubAtividadeDAO dao = new SubAtividadeDAO()) {
            List<SubAtividade> lista = dao.listarPorAtividade(idAtividade);
            List<SubAtividadeResponseDTO> dtos = lista.stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
            return Response.ok(dtos).build();
        } catch (SQLException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erro ao listar subatividades: " + e.getMessage())
                    .build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, CadastroSubAtividadeDTO dto) {
        try (SubAtividadeDAO dao = new SubAtividadeDAO()) {
            SubAtividade sub = dao.pesquisarPorId(id)
                    .orElseThrow(() -> new NotFoundException("Subatividade não encontrada"));

            sub.setTitulo(dto.getTitulo());
            sub.setDescricao(dto.getDescricao());
            sub.setDataInicioPrevista(dto.getDataInicioPrevista());
            sub.setDataTerminoPrevista(dto.getDataTerminoPrevista());
            sub.setDataTerminoReal(dto.getDataTerminoReal());
            sub.setStatus(dto.getStatus());
            sub.setPrioridade(dto.getPrioridade());

            dao.atualizar(sub);
            return Response.ok(toDTO(sub)).build();
        } catch (SQLException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erro ao atualizar subatividade: " + e.getMessage())
                    .build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response remover(@PathParam("id") Long id) {
        try (SubAtividadeDAO dao = new SubAtividadeDAO()) {
            dao.remover(id);
            return Response.noContent().build();
        } catch (SQLException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erro ao remover subatividade: " + e.getMessage())
                    .build();
        }
    }

    private SubAtividadeResponseDTO toDTO(SubAtividade sub) {
        SubAtividadeResponseDTO dto = new SubAtividadeResponseDTO();
        dto.setIdSubAtividade(sub.getIdSubAtividade());
        dto.setIdAtividade(sub.getIdAtividade());
        dto.setTitulo(sub.getTitulo());
        dto.setDescricao(sub.getDescricao());
        dto.setDataInicioPrevista(sub.getDataInicioPrevista());
        dto.setDataTerminoPrevista(sub.getDataTerminoPrevista());
        dto.setDataTerminoReal(sub.getDataTerminoReal());
        dto.setStatus(sub.getStatus());
        dto.setPrioridade(sub.getPrioridade());
        dto.setDataCadastro(sub.getDataCadastro());
        return dto;
    }
}
