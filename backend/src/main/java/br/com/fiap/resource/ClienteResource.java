package br.com.fiap.resource;

import br.com.fiap.dao.ClienteDAO;
import br.com.fiap.dto.CadastroClienteDTO;
import br.com.fiap.dto.ClienteResponseDTO;
import br.com.fiap.model.Cliente;
import jakarta.ws.rs.*;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;


@Path("/clientes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClienteResource {
    private static final Logger LOGGER = Logger.getLogger(ClienteResource.class.getName());

    @POST
    @Transactional
    public Response cadastrarCliente(CadastroClienteDTO dto) {
        LOGGER.log(Level.INFO, "Recebendo requisição para cadastrar cliente: {0}", dto.getNome());

        // Validação básica
        if (dto.getCpf() == null || dto.getCpf().trim().isEmpty()) {
            return error(Response.Status.BAD_REQUEST, "CPF é obrigatório");
        }
        if (dto.getIdEmpresa() == null) {
            return error(Response.Status.BAD_REQUEST, "ID da empresa é obrigatório");
        }

        try (var dao = new ClienteDAO()) {
            // Verifica se já existe cliente com o mesmo CPF ou e-mail
            String cpfLimpo = dto.getCpf().replaceAll("[^0-9]", "");
            if (dao.pesquisarPorCpf(cpfLimpo).isPresent()) {
                LOGGER.warning("Tentativa de cadastrar CPF duplicado: " + cpfLimpo);
                return error(Response.Status.CONFLICT,
                        "Já existe um cliente cadastrado com este CPF");
            }

            // Cria e salva o cliente
            var cliente = new Cliente(
                    dto.getIdEmpresa(),
                    dto.getNome(),
                    dto.getEmail(),
                    dto.getTelefone(),
                    cpfLimpo,
                    dto.getDataNascimento(),
                    dto.getCargo(),
                    dto.getDepartamento(),
                    dto.getRole(),
                    dto.getSenha()
            );

            long id = dao.cadastrar(cliente);
            cliente = dao.pesquisarPorId(id)
                    .orElseThrow(() -> new WebApplicationException(
                            "Erro ao recuperar cliente cadastrado",
                            Response.Status.INTERNAL_SERVER_ERROR
                    ));

            return Response
                    .status(Response.Status.CREATED)
                    .entity(toDto(cliente))
                    .build();

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Erro ao processar requisição", e);
            return error(Response.Status.INTERNAL_SERVER_ERROR,
                    "Erro ao processar a requisição: " + e.getMessage());
        }
    }

    @GET
    @Path("/{id}")
    public Response buscarPorId(@PathParam("id") long id) {
        LOGGER.log(Level.INFO, "Buscando cliente ID: {0}", id);

        try (var dao = new ClienteDAO()) {
            return dao.pesquisarPorId(id)
                    .map(cliente -> {
                        LOGGER.info("Cliente encontrado: " + cliente.getNome());
                        return Response.ok(toDto(cliente)).build();
                    })
                    .orElseGet(() -> {
                        LOGGER.warning("Cliente não encontrado com ID: " + id);
                        return error(Response.Status.NOT_FOUND,
                                "Cliente não encontrado: " + id);
                    });
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar cliente", e);
            return error(Response.Status.INTERNAL_SERVER_ERROR,
                    "Erro ao buscar cliente");
        }
    }

    @GET
    public Response listarTodos() {
        LOGGER.info("Listando todos os clientes");

        try (var dao = new ClienteDAO()) {
            List<ClienteResponseDTO> clientes = dao.listarTodos().stream()
                    .map(this::toDto)
                    .collect(Collectors.toList());

            LOGGER.info("Total de clientes encontrados: " + clientes.size());
            return Response.ok(clientes).build();

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Erro ao listar clientes", e);
            return error(Response.Status.INTERNAL_SERVER_ERROR,
                    "Erro ao listar clientes");
        }
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response atualizarCliente(
            @PathParam("id") long id,
            CadastroClienteDTO dto) {

        LOGGER.log(Level.INFO, "Atualizando cliente ID: {0}", id);

        try (var dao = new ClienteDAO()) {
            // Busca o cliente existente
            var cliente = dao.pesquisarPorId(id)
                    .orElseThrow(() -> {
                        LOGGER.warning("Cliente não encontrado para atualização: " + id);
                        return new WebApplicationException(
                                "Cliente não encontrado: " + id,
                                Response.Status.NOT_FOUND
                        );
                    });

            // Atualiza os dados do cliente com os valores do DTO
            // Verifique se os campos não são nulos antes de atualizar
            if (dto.getIdEmpresa() != null) {
                cliente.setIdEmpresa(dto.getIdEmpresa());
            }
            if (dto.getNome() != null) {
                cliente.setNome(dto.getNome());
            }
            if (dto.getEmail() != null) {
                cliente.setEmail(dto.getEmail());
            }
            if (dto.getTelefone() != null) {
                cliente.setTelefone(dto.getTelefone());
            }
            if (dto.getDataNascimento() != null) {
                cliente.setDataNascimento(dto.getDataNascimento());
            }
            if (dto.getCargo() != null) {
                cliente.setCargo(dto.getCargo());
            }
            if (dto.getDepartamento() != null) {
                cliente.setDepartamento(dto.getDepartamento());
            }
            if (dto.getRole() != null) {
                cliente.setRole(dto.getRole());
            }

            // CORREÇÃO: VERIFICAR SE A SENHA NÃO É NULA ANTES DE ATUALIZAR
            if (dto.getSenha() != null && !dto.getSenha().trim().isEmpty()) {
                cliente.setSenha(dto.getSenha());
            }

            if (dto.getCpf() != null) {
                cliente.setCpf(dto.getCpf());
            }

            // Salva as alterações
            dao.atualizar(cliente);
            LOGGER.info("Cliente atualizado com sucesso: " + id);

            return Response.ok(toDto(cliente)).build();

        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Erro ao atualizar cliente", e);
            return error(Response.Status.INTERNAL_SERVER_ERROR,
                    "Erro ao atualizar cliente: " + e.getMessage());
        }
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response removerCliente(@PathParam("id") long id) {
        LOGGER.log(Level.INFO, "Removendo permanentemente cliente ID: {0}", id);

        try (var dao = new ClienteDAO()) {
            if (!dao.existePorId(id)) {
                LOGGER.warning("Tentativa de remover cliente inexistente: " + id);
                return error(Response.Status.NOT_FOUND,
                        "Cliente não encontrado: " + id);
            }

            // Realiza a exclusão
            dao.remover(id);
            LOGGER.info("Cliente removido permanentemente com sucesso: " + id);
            return Response.noContent().build();

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Erro ao remover cliente", e);
            return error(Response.Status.INTERNAL_SERVER_ERROR,
                    "Erro ao remover cliente: " + e.getMessage());
        }
    }

    // Métodos utilitários

    private ClienteResponseDTO toDto(Cliente cliente) {
        if (cliente == null) {
            return null;
        }

        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.setIdCliente(cliente.getIdCliente());
        dto.setIdEmpresa(cliente.getIdEmpresa());
        dto.setNome(cliente.getNome());
        dto.setEmail(cliente.getEmail());
        dto.setTelefone(cliente.getTelefone());
        dto.setCpf(cliente.getCpf());
        dto.setDataNascimento(cliente.getDataNascimento());
        dto.setCargo(cliente.getCargo());
        dto.setDepartamento(cliente.getDepartamento());
        dto.setRole(cliente.getRole());
        dto.setAtivo(cliente.isAtivo());
        dto.setDataCadastro(cliente.getDataCadastro());
        return dto;
    }

    private Response error(Response.Status status, String message) {
        LOGGER.warning("Erro " + status.getStatusCode() + ": " + message);
        return Response.status(status)
                .entity("{\"error\": \"" + message + "\"}")
                .type(MediaType.APPLICATION_JSON)
                .build();
    }

    @OPTIONS
    @Path("{path:.*}")
    public Response options() {
        return Response.ok()
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,HEAD")
                .header("Access-Control-Allow-Headers", "Content-Type,Authorization")
                .build();
    }
}