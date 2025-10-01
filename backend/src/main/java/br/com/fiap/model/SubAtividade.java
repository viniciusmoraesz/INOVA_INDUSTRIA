package br.com.fiap.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

public class SubAtividade {
    private Long idSubAtividade;
    private Long idAtividade;
    private String titulo;
    private String descricao;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataInicioPrevista;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataTerminoPrevista;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataTerminoReal;
    private String status;        // Reaproveitando status_atividade
    private String prioridade;    // Reaproveitando prioridade_atividade
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dataCadastro;

    // Construtor vazio
    public SubAtividade() {
        this.status = "PENDENTE";
        this.prioridade = "MEDIA";
        this.dataCadastro = LocalDateTime.now();
    }

    // Construtor principal
    public SubAtividade(Long idAtividade, String titulo, String descricao,
                        LocalDate dataInicioPrevista, LocalDate dataTerminoPrevista,
                        LocalDate dataTerminoReal, String status, String prioridade) {
        this();
        this.idAtividade = idAtividade;
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataInicioPrevista = dataInicioPrevista;
        this.dataTerminoPrevista = dataTerminoPrevista;
        this.dataTerminoReal = dataTerminoReal;
        if(status != null) this.status = status;
        if(prioridade != null) this.prioridade = prioridade;
    }

    // Getters e Setters
    public Long getIdSubAtividade() {
        return idSubAtividade;
    }

    public void setIdSubAtividade(Long idSubAtividade) {
        this.idSubAtividade = idSubAtividade;
    }

    public Long getIdAtividade() {
        return idAtividade;
    }

    public void setIdAtividade(Long idAtividade) {
        this.idAtividade = idAtividade;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDate getDataInicioPrevista() {
        return dataInicioPrevista;
    }

    public void setDataInicioPrevista(LocalDate dataInicioPrevista) {
        this.dataInicioPrevista = dataInicioPrevista;
    }

    public LocalDate getDataTerminoPrevista() {
        return dataTerminoPrevista;
    }

    public void setDataTerminoPrevista(LocalDate dataTerminoPrevista) {
        this.dataTerminoPrevista = dataTerminoPrevista;
    }

    public LocalDate getDataTerminoReal() {
        return dataTerminoReal;
    }

    public void setDataTerminoReal(LocalDate dataTerminoReal) {
        this.dataTerminoReal = dataTerminoReal;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPrioridade() {
        return prioridade;
    }

    public void setPrioridade(String prioridade) {
        this.prioridade = prioridade;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    @Override
    public String toString() {
        return "SubAtividade{" +
                "idSubAtividade=" + idSubAtividade +
                ", idAtividade=" + idAtividade +
                ", titulo='" + titulo + '\'' +
                ", status='" + status + '\'' +
                ", prioridade='" + prioridade + '\'' +
                '}';
    }
}
