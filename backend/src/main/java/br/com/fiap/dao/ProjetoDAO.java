package br.com.fiap.dao;

import br.com.fiap.factory.ConnectionFactory;
import br.com.fiap.model.Projeto;
import br.com.fiap.model.Projeto.PrioridadeProjeto;
import br.com.fiap.model.Projeto.StatusProjeto;
import br.com.fiap.model.Atividade;
import br.com.fiap.model.SubAtividade;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ProjetoDAO implements AutoCloseable {
    private static final Logger LOGGER = Logger.getLogger(ProjetoDAO.class.getName());
    private final Connection conexao;

    public ProjetoDAO() {
        try {
            // FIX: Use the ConnectionFactory to get a valid database connection
            this.conexao = ConnectionFactory.getConnection();
            LOGGER.info("Conexão com o banco de dados estabelecida para ProjetoDAO");
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao conectar ao banco de dados para ProjetoDAO", e);
            throw new RuntimeException("Falha ao conectar ao banco de dados", e);
        }
    }

    @Override
    public void close() {
        try {
            if (conexao != null && !conexao.isClosed()) {
                conexao.close();
                LOGGER.info("Conexão com o banco de dados fechada para ProjetoDAO");
            }
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Erro ao fechar conexão", e);
        }
    }

    public Long cadastrar(Projeto projeto) throws SQLException {
        String sql = "INSERT INTO TB_PROJETO (id_empresa, id_gerente, titulo, descricao, " +
                "data_inicio, data_termino_prevista, data_termino_real, orcamento, status, prioridade) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) " +
                "RETURNING id_projeto";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, projeto.getIdEmpresa());
            setLongOrNull(stmt, 2, projeto.getIdGerente());
            stmt.setString(3, projeto.getTitulo());
            stmt.setString(4, projeto.getDescricao());
            setDateOrNull(stmt, 5, projeto.getDataInicio());
            setDateOrNull(stmt, 6, projeto.getDataTerminoPrevista());
            setDateOrNull(stmt, 7, projeto.getDataTerminoReal());
            setDoubleOrNull(stmt, 8, projeto.getOrcamento());
            stmt.setObject(9, projeto.getStatus().name(), java.sql.Types.OTHER);
            stmt.setObject(10, projeto.getPrioridade().name(), java.sql.Types.OTHER);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Long projetoId = rs.getLong(1);
                    
                    // Se há um gerente/cliente definido, criar relacionamento na TB_PROJETO_CLIENTE
                    if (projeto.getIdGerente() != null) {
                        String sqlRelacionamento = "INSERT INTO TB_PROJETO_CLIENTE (id_projeto, id_cliente, papel) VALUES (?, ?, ?)";
                        try (PreparedStatement stmtRel = conexao.prepareStatement(sqlRelacionamento)) {
                            stmtRel.setLong(1, projetoId);
                            stmtRel.setLong(2, projeto.getIdGerente());
                            stmtRel.setString(3, "CLIENTE_PRINCIPAL");
                            stmtRel.executeUpdate();
                        }
                    }
                    
                    return projetoId;
                }
                throw new SQLException("Falha ao obter o ID do projeto");
            }
        }
    }

    public Optional<Projeto> pesquisarPorId(Long id) throws SQLException {
        String sql = "SELECT p.*, c.nome as cliente_nome " +
                    "FROM TB_PROJETO p " +
                    "LEFT JOIN TB_CLIENTE c ON p.id_gerente = c.id_cliente " +
                    "WHERE p.id_projeto = ?";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapearProjetoComCliente(rs));
                }
                return Optional.empty();
            }
        }
    }

    public List<Projeto> listarPorEmpresa(Long idEmpresa) throws SQLException {
        String sql = "SELECT p.*, c.nome as cliente_nome " +
                    "FROM TB_PROJETO p " +
                    "LEFT JOIN TB_CLIENTE c ON p.id_gerente = c.id_cliente " +
                    "WHERE p.id_empresa = ? " +
                    "ORDER BY p.data_inicio DESC";
        List<Projeto> projetos = new ArrayList<>();

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, idEmpresa);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    projetos.add(mapearProjetoComCliente(rs));
                }
            }
        }
        return projetos;
    }

    public void atualizar(Projeto projeto) throws SQLException {
        String sql = "UPDATE TB_PROJETO SET " +
                "id_gerente = ?, titulo = ?, descricao = ?, " +
                "data_inicio = ?, data_termino_prevista = ?, data_termino_real = ?, " +
                "orcamento = ?, status = ?, prioridade = ? " +
                "WHERE id_projeto = ?";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            setLongOrNull(stmt, 1, projeto.getIdGerente());
            stmt.setString(2, projeto.getTitulo());
            stmt.setString(3, projeto.getDescricao());
            setDateOrNull(stmt, 4, projeto.getDataInicio());
            setDateOrNull(stmt, 5, projeto.getDataTerminoPrevista());
            setDateOrNull(stmt, 6, projeto.getDataTerminoReal());
            setDoubleOrNull(stmt, 7, projeto.getOrcamento());
            stmt.setObject(8, projeto.getStatus().name(), java.sql.Types.OTHER);
            stmt.setObject(9, projeto.getPrioridade().name(), java.sql.Types.OTHER);
            stmt.setLong(10, projeto.getIdProjeto());

            stmt.executeUpdate();
        }
    }

    public void remover(Long id) throws SQLException {
        String sql = "DELETE FROM TB_PROJETO WHERE id_projeto = ?";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, id);
            stmt.executeUpdate();
        }
    }

    private Projeto mapearProjeto(ResultSet rs) throws SQLException {
        Projeto projeto = new Projeto();
        projeto.setIdProjeto(rs.getLong("id_projeto"));
        projeto.setIdEmpresa(rs.getLong("id_empresa"));
        // Fix PostgreSQL int4 to Long conversion
        Object idGerenteObj = rs.getObject("id_gerente");
        if (idGerenteObj != null) {
            if (idGerenteObj instanceof Integer) {
                projeto.setIdGerente(((Integer) idGerenteObj).longValue());
            } else if (idGerenteObj instanceof Long) {
                projeto.setIdGerente((Long) idGerenteObj);
            }
        }
        projeto.setTitulo(rs.getString("titulo"));
        projeto.setDescricao(rs.getString("descricao"));

        // FIX: Safely handle nullable dates
        Date dataInicio = rs.getDate("data_inicio");
        if (dataInicio != null) {
            projeto.setDataInicio(dataInicio.toLocalDate());
        }

        Date dataTerminoPrevista = rs.getDate("data_termino_prevista");
        if (dataTerminoPrevista != null) {
            projeto.setDataTerminoPrevista(dataTerminoPrevista.toLocalDate());
        }

        Date dataTerminoReal = rs.getDate("data_termino_real");
        if (dataTerminoReal != null) {
            projeto.setDataTerminoReal(dataTerminoReal.toLocalDate());
        }

        // Fix PostgreSQL numeric to Double conversion
        Object orcamentoObj = rs.getObject("orcamento");
        if (orcamentoObj != null) {
            if (orcamentoObj instanceof java.math.BigDecimal) {
                projeto.setOrcamento(((java.math.BigDecimal) orcamentoObj).doubleValue());
            } else if (orcamentoObj instanceof Double) {
                projeto.setOrcamento((Double) orcamentoObj);
            }
        }
        projeto.setStatus(StatusProjeto.valueOf(rs.getString("status")));
        projeto.setPrioridade(PrioridadeProjeto.valueOf(rs.getString("prioridade")));

        Timestamp dataCadastro = rs.getTimestamp("data_cadastro");
        if(dataCadastro != null) {
            projeto.setDataCadastro(dataCadastro.toLocalDateTime());
        }

        return projeto;
    }

    public List<Projeto> listarTodos() throws SQLException {
        String sql = "SELECT p.*, c.nome as cliente_nome " +
                    "FROM TB_PROJETO p " +
                    "LEFT JOIN TB_CLIENTE c ON p.id_gerente = c.id_cliente " +
                    "ORDER BY p.data_inicio DESC";
        List<Projeto> projetos = new ArrayList<>();

        try (PreparedStatement stmt = conexao.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                projetos.add(mapearProjetoComCliente(rs));
            }
        }
        return projetos;
    }

    private Projeto mapearProjetoComCliente(ResultSet rs) throws SQLException {
        Projeto projeto = mapearProjeto(rs);
        
        // Adicionar informações do cliente se disponível
        String clienteNome = rs.getString("cliente_nome");
        if (clienteNome != null) {
            projeto.setClienteNome(clienteNome);
        }
        
        return projeto;
    }

    private void setLongOrNull(PreparedStatement stmt, int parameterIndex, Long value) throws SQLException {
        if (value != null) {
            stmt.setLong(parameterIndex, value);
        } else {
            stmt.setNull(parameterIndex, Types.BIGINT);
        }
    }

    private void setDateOrNull(PreparedStatement stmt, int parameterIndex, LocalDate date) throws SQLException {
        if (date != null) {
            stmt.setDate(parameterIndex, Date.valueOf(date));
        } else {
            stmt.setNull(parameterIndex, Types.DATE);
        }
    }

    private void setDoubleOrNull(PreparedStatement stmt, int parameterIndex, Double value) throws SQLException {
        if (value != null) {
            stmt.setDouble(parameterIndex, value);
        } else {
            stmt.setNull(parameterIndex, Types.DOUBLE);
        }
    }
    
    public Optional<Projeto> pesquisarPorIdComAtividades(Long id) throws SQLException {
        // Primeiro, busca o projeto básico
        Optional<Projeto> projetoOpt = pesquisarPorId(id);
        if (!projetoOpt.isPresent()) {
            return Optional.empty();
        }

        Projeto projeto = projetoOpt.get();
        
        // Busca as atividades do projeto
        String sqlAtividades = "SELECT a.*, " +
                "sa.id_subatividade, sa.titulo as sub_titulo, sa.descricao as sub_descricao, " +
                "sa.data_inicio_prevista as sub_data_inicio, sa.data_termino_prevista as sub_data_termino, " +
                "sa.data_termino_real as sub_data_termino_real, sa.status as sub_status, " +
                "sa.prioridade as sub_prioridade, sa.data_cadastro as sub_data_cadastro " +
                "FROM TB_ATIVIDADE a " +
                "LEFT JOIN TB_SUBATIVIDADE sa ON a.id_atividade = sa.id_atividade " +
                "WHERE a.id_projeto = ? " +
                "ORDER BY a.data_cadastro, sa.data_cadastro";

        try (PreparedStatement stmt = conexao.prepareStatement(sqlAtividades)) {
            stmt.setLong(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                List<Atividade> atividades = new ArrayList<>();
                Atividade atividadeAtual = null;
                
                while (rs.next()) {
                    Long idAtividade = rs.getLong("id_atividade");
                    
                    // Se é uma nova atividade
                    if (atividadeAtual == null || !idAtividade.equals(atividadeAtual.getIdAtividade())) {
                        if (atividadeAtual != null) {
                            atividades.add(atividadeAtual);
                        }
                        
                        atividadeAtual = new Atividade();
                        atividadeAtual.setIdAtividade(idAtividade);
                        atividadeAtual.setIdProjeto(rs.getLong("id_projeto"));
                        atividadeAtual.setIdResponsavel(rs.getLong("id_responsavel"));
                        atividadeAtual.setTitulo(rs.getString("titulo"));
                        atividadeAtual.setDescricao(rs.getString("descricao"));
                        atividadeAtual.setDataInicioPrevista(rs.getDate("data_inicio_prevista") != null ? 
                                rs.getDate("data_inicio_prevista").toLocalDate() : null);
                        atividadeAtual.setDataTerminoPrevista(rs.getDate("data_termino_prevista") != null ? 
                                rs.getDate("data_termino_prevista").toLocalDate() : null);
                        atividadeAtual.setDataTerminoReal(rs.getDate("data_termino_real") != null ? 
                                rs.getDate("data_termino_real").toLocalDate() : null);
                        atividadeAtual.setStatus(Atividade.StatusAtividade.valueOf(rs.getString("status")));
                        atividadeAtual.setPrioridade(Atividade.PrioridadeAtividade.valueOf(rs.getString("prioridade")));
                        atividadeAtual.setDataCadastro(rs.getTimestamp("data_cadastro").toLocalDateTime());
                        atividadeAtual.setSubatividades(new ArrayList<>());
                    }
                    
                    // Adiciona subatividade se existir
                    Long idSubatividade = rs.getLong("id_subatividade");
                    if (!rs.wasNull()) {
                        SubAtividade subatividade = new SubAtividade();
                        subatividade.setIdSubAtividade(idSubatividade);
                        subatividade.setIdAtividade(idAtividade);
                        subatividade.setTitulo(rs.getString("sub_titulo"));
                        subatividade.setDescricao(rs.getString("sub_descricao"));
                        subatividade.setDataInicioPrevista(rs.getDate("sub_data_inicio") != null ? 
                                rs.getDate("sub_data_inicio").toLocalDate() : null);
                        subatividade.setDataTerminoPrevista(rs.getDate("sub_data_termino") != null ? 
                                rs.getDate("sub_data_termino").toLocalDate() : null);
                        subatividade.setDataTerminoReal(rs.getDate("sub_data_termino_real") != null ? 
                                rs.getDate("sub_data_termino_real").toLocalDate() : null);
                        subatividade.setStatus(rs.getString("sub_status"));
                        subatividade.setPrioridade(rs.getString("sub_prioridade"));
                        subatividade.setDataCadastro(rs.getTimestamp("sub_data_cadastro").toLocalDateTime());
                        
                        atividadeAtual.getSubatividades().add(subatividade);
                    }
                }
                
                // Adiciona a última atividade processada
                if (atividadeAtual != null) {
                    atividades.add(atividadeAtual);
                }
                
                projeto.setAtividades(atividades);
            }
        }
        
        return Optional.of(projeto);
    }
}