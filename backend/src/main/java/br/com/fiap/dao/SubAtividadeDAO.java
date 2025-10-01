package br.com.fiap.dao;

import br.com.fiap.factory.ConnectionFactory;
import br.com.fiap.model.SubAtividade;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

public class SubAtividadeDAO implements AutoCloseable {
    private static final Logger LOGGER = Logger.getLogger(SubAtividadeDAO.class.getName());
    private final Connection conexao;

    public SubAtividadeDAO() {
        try {
            this.conexao = ConnectionFactory.getConnection();
            LOGGER.info("Conexão com o banco de dados estabelecida para SubAtividadeDAO");
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao conectar ao banco de dados para SubAtividadeDAO", e);
            throw new RuntimeException("Falha ao conectar ao banco de dados", e);
        }
    }

    @Override
    public void close() {
        try {
            if (conexao != null && !conexao.isClosed()) {
                conexao.close();
                LOGGER.info("Conexão com o banco de dados fechada para SubAtividadeDAO");
            }
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Erro ao fechar conexão", e);
        }
    }

    public Long cadastrar(SubAtividade subAtividade) throws SQLException {
        String sql = "INSERT INTO TB_SUBATIVIDADE (id_atividade, titulo, descricao, " +
                     "data_inicio_prevista, data_termino_prevista, data_termino_real, " +
                     "status, prioridade, data_cadastro) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id_subatividade";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, subAtividade.getIdAtividade());
            stmt.setString(2, subAtividade.getTitulo());
            stmt.setString(3, subAtividade.getDescricao());
            setDateOrNull(stmt, 4, subAtividade.getDataInicioPrevista());
            setDateOrNull(stmt, 5, subAtividade.getDataTerminoPrevista());
            setDateOrNull(stmt, 6, subAtividade.getDataTerminoReal());
            stmt.setString(7, subAtividade.getStatus());
            stmt.setString(8, subAtividade.getPrioridade());
            stmt.setTimestamp(9, Timestamp.valueOf(subAtividade.getDataCadastro()));

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getLong(1);
                }
            }
        }
        throw new SQLException("Falha ao obter o ID da SubAtividade");
    }

    public Optional<SubAtividade> pesquisarPorId(Long id) throws SQLException {
        String sql = "SELECT * FROM TB_SUBATIVIDADE WHERE id_subatividade = ?";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapearSubAtividade(rs));
                }
            }
        }
        return Optional.empty();
    }

    public List<SubAtividade> listarPorAtividade(Long idAtividade) throws SQLException {
        String sql = "SELECT * FROM TB_SUBATIVIDADE WHERE id_atividade = ? ORDER BY data_inicio_prevista";
        List<SubAtividade> subAtividades = new ArrayList<>();
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, idAtividade);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    subAtividades.add(mapearSubAtividade(rs));
                }
            }
        }
        return subAtividades;
    }

    public void atualizar(SubAtividade subAtividade) throws SQLException {
        String sql = "UPDATE TB_SUBATIVIDADE SET titulo = ?, descricao = ?, " +
                     "data_inicio_prevista = ?, data_termino_prevista = ?, data_termino_real = ?, " +
                     "status = ?, prioridade = ? WHERE id_subatividade = ?";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, subAtividade.getTitulo());
            stmt.setString(2, subAtividade.getDescricao());
            setDateOrNull(stmt, 3, subAtividade.getDataInicioPrevista());
            setDateOrNull(stmt, 4, subAtividade.getDataTerminoPrevista());
            setDateOrNull(stmt, 5, subAtividade.getDataTerminoReal());
            stmt.setString(6, subAtividade.getStatus());
            stmt.setString(7, subAtividade.getPrioridade());
            stmt.setLong(8, subAtividade.getIdSubAtividade());
            stmt.executeUpdate();
        }
    }

    public void remover(Long id) throws SQLException {
        String sql = "DELETE FROM TB_SUBATIVIDADE WHERE id_subatividade = ?";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, id);
            stmt.executeUpdate();
        }
    }

    private SubAtividade mapearSubAtividade(ResultSet rs) throws SQLException {
        SubAtividade sub = new SubAtividade();
        sub.setIdSubAtividade(rs.getLong("id_subatividade"));
        sub.setIdAtividade(rs.getLong("id_atividade"));
        sub.setTitulo(rs.getString("titulo"));
        sub.setDescricao(rs.getString("descricao"));
        setLocalDateFromResultSet(rs, "data_inicio_prevista", sub::setDataInicioPrevista);
        setLocalDateFromResultSet(rs, "data_termino_prevista", sub::setDataTerminoPrevista);
        setLocalDateFromResultSet(rs, "data_termino_real", sub::setDataTerminoReal);
        sub.setStatus(rs.getString("status"));
        sub.setPrioridade(rs.getString("prioridade"));
        Timestamp ts = rs.getTimestamp("data_cadastro");
        if (ts != null) sub.setDataCadastro(ts.toLocalDateTime());
        return sub;
    }

    private void setDateOrNull(PreparedStatement stmt, int index, LocalDate date) throws SQLException {
        if (date != null) {
            stmt.setDate(index, Date.valueOf(date));
        } else {
            stmt.setNull(index, Types.DATE);
        }
    }

    private void setLocalDateFromResultSet(ResultSet rs, String column, java.util.function.Consumer<LocalDate> setter) throws SQLException {
        Date date = rs.getDate(column);
        if (date != null) setter.accept(date.toLocalDate());
    }
}
