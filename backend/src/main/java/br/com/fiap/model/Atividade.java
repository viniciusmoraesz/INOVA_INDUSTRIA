package br.com.fiap.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;

public class Atividade {

    public enum StatusAtividade { PENDENTE, EM_ANDAMENTO, CONCLUIDA }
    public enum PrioridadeAtividade { BAIXA, MEDIA, ALTA }

    private Long idAtividade;
    private Long idProjeto;
    private Long idResponsavel;
    private String titulo;
    private String descricao;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataInicioPrevista;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataTerminoPrevista;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataTerminoReal;
    private StatusAtividade status = StatusAtividade.PENDENTE;
    private PrioridadeAtividade prioridade = PrioridadeAtividade.MEDIA;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dataCadastro;
    private List<SubAtividade> subatividades;

    public Atividade() {}

    // Getters e Setters
    public Long getIdAtividade() { return idAtividade; }
    public void setIdAtividade(Long idAtividade) { this.idAtividade = idAtividade; }

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

    public LocalDate getDataTerminoReal() { return dataTerminoReal; }
    public void setDataTerminoReal(LocalDate dataTerminoReal) { this.dataTerminoReal = dataTerminoReal; }

    public StatusAtividade getStatus() { return status; }
    public void setStatus(StatusAtividade status) { this.status = status; }

    public PrioridadeAtividade getPrioridade() { return prioridade; }
    public void setPrioridade(PrioridadeAtividade prioridade) { this.prioridade = prioridade; }

    public LocalDateTime getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDateTime dataCadastro) { this.dataCadastro = dataCadastro; }

    public List<SubAtividade> getSubatividades() { return subatividades; }
    public void setSubatividades(List<SubAtividade> subatividades) { this.subatividades = subatividades; }
}
