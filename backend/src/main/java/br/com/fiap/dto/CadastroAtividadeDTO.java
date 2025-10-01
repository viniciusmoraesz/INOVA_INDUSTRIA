package br.com.fiap.dto;

import br.com.fiap.model.Atividade.PrioridadeAtividade;
import br.com.fiap.model.Atividade.StatusAtividade;
import java.time.LocalDate;

public class CadastroAtividadeDTO {
    private Long idProjeto;
    private Long idResponsavel;
    private String titulo;
    private String descricao;
    private LocalDate dataInicioPrevista;
    private LocalDate dataTerminoPrevista;
    private StatusAtividade status;
    private PrioridadeAtividade prioridade;

    // Getters e Setters
    public Long getIdProjeto() { return idProjeto; }
    public void setIdProjeto(Long idProjeto) { this.idProjeto = idProjeto; }

    public Long getIdResponsavel() { return idResponsavel; }
    public void setIdResponsavel(Long idResponsavel) { this.idResponsavel = idResponsavel; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public LocalDate getDataInicioPrevista() { return dataInicioPrevista; }
    public void setDataInicioPrevista(LocalDate dataInicioPrevista) { this.dataInicioPrevista = dataInicioPrevista; }

    public LocalDate getDataTerminoPrevista() { return dataTerminoPrevista; }
    public void setDataTerminoPrevista(LocalDate dataTerminoPrevista) { this.dataTerminoPrevista = dataTerminoPrevista; }

    public StatusAtividade getStatus() { return status; }
    public void setStatus(StatusAtividade status) { this.status = status; }

    public PrioridadeAtividade getPrioridade() { return prioridade; }
    public void setPrioridade(PrioridadeAtividade prioridade) { this.prioridade = prioridade; }
}
