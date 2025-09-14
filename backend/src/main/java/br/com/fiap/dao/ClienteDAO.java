package br.com.fiap.dao;

import br.com.fiap.model.Cliente;
import br.com.fiap.factory.ConnectionFactory;

import java.sql.*;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ClienteDAO implements AutoCloseable {
    private static final Logger LOGGER = Logger.getLogger(ClienteDAO.class.getName());
    private final Connection conexao;

    public ClienteDAO() {
        try {
            this.conexao = ConnectionFactory.getConnection();
            LOGGER.info("Conexão com o banco de dados estabelecida para ClienteDAO");
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao conectar ao banco de dados para ClienteDAO", e);
            throw new RuntimeException("Falha ao conectar ao banco de dados", e);
        }
    }

    public long cadastrar(Cliente cliente) {
        String sql = """
            INSERT INTO TB_CLIENTE (
                id_empresa, nome, email, telefone, cpf,
                data_nascimento, cargo, departamento, role, senha
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?::tipo_role ,?)
            RETURNING id_cliente
            """;

        try (var stmt = conexao.prepareStatement(sql)) {
            LOGGER.info("Tentando cadastrar cliente: " + cliente.getNome());

            String cpfLimpo = cliente.getCpf().replaceAll("[^0-9]", "");

            if (existeCpf(cpfLimpo)) {
                LOGGER.warning("CPF já cadastrado: " + cpfLimpo);
                throw new SQLException("CPF já cadastrado", "23505");
            }

            stmt.setLong(1, cliente.getIdEmpresa());
            stmt.setString(2, cliente.getNome());
            stmt.setString(3, cliente.getEmail());
            stmt.setString(4, cliente.getTelefone());
            stmt.setString(5, cpfLimpo);
            if (cliente.getDataNascimento() != null) {
                stmt.setDate(6, Date.valueOf(cliente.getDataNascimento()));
            } else {
                stmt.setNull(6, Types.DATE);
            }
            stmt.setString(7, cliente.getCargo());
            stmt.setString(8, cliente.getDepartamento());
            stmt.setString(9, cliente.getRole());
            stmt.setString(10, cliente.getSenha());

            try (var rs = stmt.executeQuery()) {
                if (rs.next()) {
                    long id = rs.getLong(1);
                    LOGGER.info("Cliente cadastrado com sucesso. ID: " + id);
                    return id;
                }
                throw new SQLException("Falha ao obter ID do cliente");
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao cadastrar cliente", e);
            throw new RuntimeException("Erro ao cadastrar cliente: " + e.getMessage(), e);
        }
    }

    public Optional<Cliente> pesquisarPorId(long id) {
        String sql = "SELECT * FROM TB_CLIENTE WHERE id_cliente = ?";
        try (var stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (var rs = stmt.executeQuery()) {
                return rs.next() ? Optional.of(parseCliente(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar cliente por ID: " + id, e);
            throw new RuntimeException("Erro ao buscar cliente", e);
        }
    }

    public Optional<Cliente> pesquisarPorCpf(String cpf) {
        String cpfLimpo = cpf.replaceAll("[^0-9]", "");
        String sql = "SELECT * FROM TB_CLIENTE WHERE cpf = ?";
        try (var stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, cpfLimpo);
            try (var rs = stmt.executeQuery()) {
                return rs.next() ? Optional.of(parseCliente(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar cliente por CPF: " + cpf, e);
            throw new RuntimeException("Erro ao buscar cliente por CPF", e);
        }
    }

    public Optional<Cliente> buscarPorEmail(String email) {
        String sql = "SELECT * FROM TB_CLIENTE WHERE LOWER(email) = LOWER(?)";
        try (var stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, email);
            try (var rs = stmt.executeQuery()) {
                return rs.next() ? Optional.of(parseCliente(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar cliente por email: " + email, e);
            throw new RuntimeException("Erro ao buscar cliente por email", e);
        }
    }

    public List<Cliente> listarTodos() {
        String sql = "SELECT * FROM TB_CLIENTE ORDER BY nome";
        var clientes = new ArrayList<Cliente>();

        try (var stmt = conexao.createStatement();
             var rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                clientes.add(parseCliente(rs));
            }
            return clientes;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao listar clientes", e);
            throw new RuntimeException("Erro ao listar clientes", e);
        }
    }

    public void atualizar(Cliente cliente) {
        String sql = """
            UPDATE TB_CLIENTE SET
                id_empresa = ?,
                nome = ?,
                email = ?,
                telefone = ?,
                cpf = ?,
                data_nascimento = ?,
                cargo = ?,
                departamento = ?,
                role = ?::tipo_role,
                senha = ?
            WHERE id_cliente = ?
            """;

        try (var stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, cliente.getIdEmpresa());
            stmt.setString(2, cliente.getNome());
            stmt.setString(3, cliente.getEmail());
            stmt.setString(4, cliente.getTelefone());
            
            // Garante que o CPF está limpo (apenas números)
            String cpfLimpo = cliente.getCpf() != null ? 
                cliente.getCpf().replaceAll("[^0-9]", "") : null;
            stmt.setString(5, cpfLimpo);
            
            if (cliente.getDataNascimento() != null) {
                stmt.setDate(6, Date.valueOf(cliente.getDataNascimento()));
            } else {
                stmt.setNull(6, Types.DATE);
            }
            stmt.setString(7, cliente.getCargo());
            stmt.setString(8, cliente.getDepartamento());
            stmt.setString(9, cliente.getRole());
            stmt.setString(10, cliente.getSenha());
            stmt.setLong(11, cliente.getIdCliente());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Falha ao atualizar cliente, nenhuma linha afetada");
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao atualizar cliente ID: " + cliente.getIdCliente(), e);
            throw new RuntimeException("Erro ao atualizar cliente", e);
        }
    }

    public void remover(long id) {
        String sql = "DELETE FROM TB_CLIENTE WHERE id_cliente = ?";

        try (var stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, id);
            int affectedRows = stmt.executeUpdate();

            if (affectedRows == 0) {
                throw new SQLException("Cliente não encontrado com ID: " + id);
            }
            LOGGER.info("Cliente removido permanentemente. ID: " + id);
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao remover cliente permanentemente ID: " + id, e);
            throw new RuntimeException("Erro ao remover cliente permanentemente", e);
        }
    }

    public boolean existePorId(long id) {
        String sql = "SELECT 1 FROM TB_CLIENTE WHERE id_cliente = ?";

        try (var stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (var rs = stmt.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao verificar existência do cliente ID: " + id, e);
            throw new RuntimeException("Erro ao verificar cliente", e);
        }
    }

    private boolean existeCpf(String cpf) {
        String sql = "SELECT 1 FROM TB_CLIENTE WHERE cpf = ?";
        try (var stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, cpf);
            try (var rs = stmt.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao verificar CPF existente", e);
            return false;
        }
    }

    private Cliente parseCliente(ResultSet rs) throws SQLException {
        var cliente = new Cliente();
        cliente.setIdCliente(rs.getLong("id_cliente"));
        cliente.setIdEmpresa(rs.getLong("id_empresa"));
        cliente.setNome(rs.getString("nome"));
        cliente.setEmail(rs.getString("email"));
        cliente.setTelefone(rs.getString("telefone"));
        cliente.setCpf(rs.getString("cpf"));

        // Safely handle nullable date
        Date dataNascimento = rs.getDate("data_nascimento");
        if (dataNascimento != null) {
            cliente.setDataNascimento(dataNascimento.toLocalDate());
        } else {
            cliente.setDataNascimento(null);
        }

        cliente.setCargo(rs.getString("cargo"));
        cliente.setDepartamento(rs.getString("departamento"));
        cliente.setRole(rs.getString("role"));
        cliente.setSenha(rs.getString("senha"));

        // Converte o TIMESTAMP WITH TIME ZONE
        Timestamp dataCadastro = rs.getTimestamp("data_cadastro");
        cliente.setDataCadastro(dataCadastro.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());

        cliente.setAtivo(rs.getBoolean("ativo"));
        return cliente;
    }

    @Override
    public void close() {
        try {
            if (conexao != null && !conexao.isClosed()) {
                conexao.close();
                LOGGER.info("Conexão com o banco de dados fechada para ClienteDAO");
            }
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Erro ao fechar conexão", e);
        }
    }
}