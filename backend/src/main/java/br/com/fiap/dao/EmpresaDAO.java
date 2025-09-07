package br.com.fiap.dao;

import br.com.fiap.model.Empresa;
import br.com.fiap.factory.ConnectionFactory;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

public class EmpresaDAO implements AutoCloseable {
    private static final Logger LOGGER = Logger.getLogger(EmpresaDAO.class.getName());
    private final Connection conexao;

    public EmpresaDAO() {
        try {
            this.conexao = ConnectionFactory.getConnection();
            LOGGER.info("Conexão com o banco de dados estabelecida");
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao conectar ao banco de dados", e);
            throw new RuntimeException("Falha ao conectar ao banco de dados", e);
        }
    }

    public long cadastrar(Empresa empresa) {
        String sql = """
            INSERT INTO TB_EMPRESA (
                cnpj, razao_social, nome_fantasia, inscricao_estadual,
                inscricao_municipal, email, telefone, endereco, numero,
                complemento, bairro, cidade, estado, cep,
                quantidade_funcionarios, setor_atuacao, data_fundacao
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING id_empresa
            """;

        try (var stmt = conexao.prepareStatement(sql)) {
            LOGGER.info("Tentando cadastrar empresa: " + empresa.getRazaoSocial());

            // Normaliza CNPJ
            String cnpjLimpo = empresa.getCnpj().replaceAll("[^0-9]", "");

            // Verifica duplicado
            if (existeCnpj(cnpjLimpo)) {
                LOGGER.warning("CNPJ já cadastrado: " + cnpjLimpo);
                throw new SQLException("CNPJ já cadastrado", "23505");
            }

            // Seta parâmetros
            int paramIndex = 1;
            stmt.setString(paramIndex++, cnpjLimpo);
            stmt.setString(paramIndex++, empresa.getRazaoSocial());
            stmt.setString(paramIndex++, empresa.getNomeFantasia());
            stmt.setString(paramIndex++, empresa.getInscricaoEstadual());
            stmt.setString(paramIndex++, empresa.getInscricaoMunicipal());
            stmt.setString(paramIndex++, empresa.getEmail());
            stmt.setString(paramIndex++, empresa.getTelefone());
            stmt.setString(paramIndex++, empresa.getEndereco());
            stmt.setString(paramIndex++, empresa.getNumero());
            stmt.setString(paramIndex++, empresa.getComplemento());
            stmt.setString(paramIndex++, empresa.getBairro());
            stmt.setString(paramIndex++, empresa.getCidade());
            stmt.setString(paramIndex++, empresa.getEstado());
            stmt.setString(paramIndex++, empresa.getCep());
            stmt.setObject(paramIndex++, empresa.getQuantidadeFuncionarios(), Types.INTEGER);
            stmt.setString(paramIndex++, empresa.getSetorAtuacao());
            stmt.setDate(paramIndex++, empresa.getDataFundacao() != null ?
                    Date.valueOf(empresa.getDataFundacao()) : null);

            try (var rs = stmt.executeQuery()) {
                if (rs.next()) {
                    long id = rs.getLong(1);
                    LOGGER.info("Empresa cadastrada com sucesso. ID: " + id);
                    return id;
                }
                throw new SQLException("Falha ao obter ID da empresa");
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao cadastrar empresa", e);
            throw new RuntimeException("Erro ao cadastrar empresa: " + e.getMessage(), e);
        }
    }

    public Optional<Empresa> pesquisarPorId(long id) {
        String sql = "SELECT * FROM TB_EMPRESA WHERE id_empresa = ?";
        try (var stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (var rs = stmt.executeQuery()) {
                return rs.next() ? Optional.of(parseEmpresa(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar empresa por ID: " + id, e);
            throw new RuntimeException("Erro ao buscar empresa", e);
        }
    }

    public Optional<Empresa> pesquisarPorCnpj(String cnpj) {
        String cnpjLimpo = cnpj.replaceAll("[^0-9]", "");
        String sql = "SELECT * FROM TB_EMPRESA WHERE cnpj = ?";
        try (var stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, cnpjLimpo);
            try (var rs = stmt.executeQuery()) {
                return rs.next() ? Optional.of(parseEmpresa(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar empresa por CNPJ: " + cnpj, e);
            throw new RuntimeException("Erro ao buscar empresa por CNPJ", e);
        }
    }

    public List<Empresa> listarTodos() {
        String sql = "SELECT * FROM TB_EMPRESA ORDER BY razao_social";
        var empresas = new ArrayList<Empresa>();

        try (var stmt = conexao.createStatement();
             var rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                empresas.add(parseEmpresa(rs));
            }
            return empresas;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao listar empresas", e);
            throw new RuntimeException("Erro ao listar empresas", e);
        }
    }

    public void atualizar(Empresa empresa) {
        String sql = """
            UPDATE TB_EMPRESA SET
                razao_social = ?,
                nome_fantasia = ?,
                inscricao_estadual = ?,
                inscricao_municipal = ?,
                email = ?,
                telefone = ?,
                endereco = ?,
                numero = ?,
                complemento = ?,
                bairro = ?,
                cidade = ?,
                estado = ?,
                cep = ?,
                quantidade_funcionarios = ?,
                setor_atuacao = ?,
                data_fundacao = ?
            WHERE id_empresa = ?
            """;

        try (var stmt = conexao.prepareStatement(sql)) {
            int paramIndex = 1;
            stmt.setString(paramIndex++, empresa.getRazaoSocial());
            stmt.setString(paramIndex++, empresa.getNomeFantasia());
            stmt.setString(paramIndex++, empresa.getInscricaoEstadual());
            stmt.setString(paramIndex++, empresa.getInscricaoMunicipal());
            stmt.setString(paramIndex++, empresa.getEmail());
            stmt.setString(paramIndex++, empresa.getTelefone());
            stmt.setString(paramIndex++, empresa.getEndereco());
            stmt.setString(paramIndex++, empresa.getNumero());
            stmt.setString(paramIndex++, empresa.getComplemento());
            stmt.setString(paramIndex++, empresa.getBairro());
            stmt.setString(paramIndex++, empresa.getCidade());
            stmt.setString(paramIndex++, empresa.getEstado());
            stmt.setString(paramIndex++, empresa.getCep());
            stmt.setObject(paramIndex++, empresa.getQuantidadeFuncionarios(), Types.INTEGER);
            stmt.setString(paramIndex++, empresa.getSetorAtuacao());
            stmt.setDate(paramIndex++, empresa.getDataFundacao() != null ?
                    Date.valueOf(empresa.getDataFundacao()) : null);
            stmt.setLong(paramIndex, empresa.getIdEmpresa());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Falha ao atualizar empresa, nenhuma linha afetada");
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao atualizar empresa ID: " + empresa.getIdEmpresa(), e);
            throw new RuntimeException("Erro ao atualizar empresa", e);
        }
    }

    public void remover(long id) {
        String sql = "DELETE FROM TB_EMPRESA WHERE id_empresa = ?";

        try (var stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, id);
            int affectedRows = stmt.executeUpdate();

            if (affectedRows == 0) {
                throw new SQLException("Empresa não encontrada com ID: " + id);
            }
            LOGGER.info("Empresa removida permanentemente. ID: " + id);
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao remover empresa permanentemente ID: " + id, e);
            throw new RuntimeException("Erro ao remover empresa permanentemente", e);
        }
    }

    public boolean existePorId(long id) {
        String sql = "SELECT 1 FROM TB_EMPRESA WHERE id_empresa = ?";

        try (var stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (var rs = stmt.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao verificar existência da empresa ID: " + id, e);
            throw new RuntimeException("Erro ao verificar empresa", e);
        }
    }

    private boolean existeCnpj(String cnpj) {
        String sql = "SELECT 1 FROM TB_EMPRESA WHERE cnpj = ?";
        try (var stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, cnpj);
            try (var rs = stmt.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao verificar CNPJ existente", e);
            return false;
        }
    }

    private Empresa parseEmpresa(ResultSet rs) throws SQLException {
        var empresa = new Empresa(
                rs.getString("cnpj"),
                rs.getString("razao_social"),
                rs.getString("nome_fantasia"),
                rs.getString("inscricao_estadual"),
                rs.getString("inscricao_municipal"),
                rs.getString("email"),
                rs.getString("telefone"),
                rs.getString("endereco"),
                rs.getString("numero"),
                rs.getString("complemento"),
                rs.getString("bairro"),
                rs.getString("cidade"),
                rs.getString("estado"),
                rs.getString("cep"),
                rs.getObject("quantidade_funcionarios", Integer.class),
                rs.getString("setor_atuacao"),
                rs.getDate("data_fundacao") != null ?
                        rs.getDate("data_fundacao").toLocalDate() : null
        );

        empresa.setIdEmpresa(rs.getLong("id_empresa"));
        empresa.setDataCadastro(rs.getTimestamp("data_cadastro").toLocalDateTime());
        empresa.setAtivo(rs.getBoolean("ativo"));
        return empresa;
    }

    @Override
    public void close() {
        try {
            if (conexao != null && !conexao.isClosed()) {
                conexao.close();
                LOGGER.info("Conexão com o banco de dados fechada");
            }
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Erro ao fechar conexão", e);
        }
    }
}
