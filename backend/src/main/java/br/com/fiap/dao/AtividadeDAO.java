package br.com.fiap.dao;

import br.com.fiap.factory.ConnectionFactory;
import br.com.fiap.model.Atividade;
import br.com.fiap.model.SubAtividade;

import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AtividadeDAO implements AutoCloseable {
    private final Connection conexao;

    public AtividadeDAO() throws SQLException {
        this.conexao = ConnectionFactory.getConnection();
    }

    @Override
    public void close() throws SQLException {
        if (conexao != null && !conexao.isClosed()) {
            conexao.close();
        }
    }

    public Long cadastrar(Atividade atividade) throws SQLException {
        String sql = "INSERT INTO TB_ATIVIDADE (id_projeto, id_responsavel, titulo, descricao, data_inicio_prevista, data_termino_prevista, status, prioridade) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id_atividade";
        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, atividade.getIdProjeto());
            stmt.setObject(2, atividade.getIdResponsavel(), Types.BIGINT);
            stmt.setString(3, atividade.getTitulo());
            stmt.setString(4, atividade.getDescricao());
            stmt.setDate(5, atividade.getDataInicioPrevista() != null ? Date.valueOf(atividade.getDataInicioPrevista()) : null);
            stmt.setDate(6, atividade.getDataTerminoPrevista() != null ? Date.valueOf(atividade.getDataTerminoPrevista()) : null);
            stmt.setObject(7, atividade.getStatus().name(), Types.OTHER);
            stmt.setObject(8, atividade.getPrioridade().name(), Types.OTHER);

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getLong(1);
            }
        }
        return null;
    }

    public List<Atividade> listarPorProjeto(Long idProjeto) throws SQLException {
        String sql = "SELECT * FROM TB_ATIVIDADE WHERE id_projeto = ? ORDER BY data_inicio_prevista";
        List<Atividade> atividades = new ArrayList<>();

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setLong(1, idProjeto);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Atividade a = mapearAtividade(rs);
                // Carregar subatividades
                SubAtividadeDAO subDAO = new SubAtividadeDAO();
                a.setSubatividades(subDAO.listarPorAtividade(a.getIdAtividade()));
                atividades.add(a);
            }
        }
        return atividades;
    }

    private Atividade mapearAtividade(ResultSet rs) throws SQLException {
        Atividade a = new Atividade();
        a.setIdAtividade(rs.getLong("id_atividade"));
        a.setIdProjeto(rs.getLong("id_projeto"));
        a.setIdResponsavel(rs.getObject("id_responsavel") != null ? rs.getLong("id_responsavel") : null);
        a.setTitulo(rs.getString("titulo"));
        a.setDescricao(rs.getString("descricao"));
        Date inicio = rs.getDate("data_inicio_prevista");
        Date termino = rs.getDate("data_termino_prevista");
        if (inicio != null) a.setDataInicioPrevista(inicio.toLocalDate());
        if (termino != null) a.setDataTerminoPrevista(termino.toLocalDate());
        a.setStatus(Atividade.StatusAtividade.valueOf(rs.getString("status")));
        a.setPrioridade(Atividade.PrioridadeAtividade.valueOf(rs.getString("prioridade")));
        Timestamp cadastro = rs.getTimestamp("data_cadastro");
        if (cadastro != null) a.setDataCadastro(cadastro.toLocalDateTime());
        return a;
    }
}
