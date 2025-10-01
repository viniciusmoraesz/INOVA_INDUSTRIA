package br.com.fiap.dto;

import br.com.fiap.model.Atividade.StatusAtividade;
import br.com.fiap.model.Atividade.PrioridadeAtividade;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class AtividadeResponseDTO {
    private Long idAtividade;
    private Long idProjeto;
    private Long idResponsavel;
    private String titulo;
    private String descricao;
    private LocalDate dataInicioPrevista;
    private LocalDate dataTerminoPrevista;
    private LocalDate dataTerminoReal;
    private StatusAtividade status;
    private PrioridadeAtividade prioridade;
    private LocalDateTime dataCadastro;
    private List<SubAtividadeResponseDTO> subatividades;

    // Construtores
    public AtividadeResponseDTO() {
    }

    public AtividadeResponseDTO(Long idAtividade, Long idProjeto, Long idResponsavel, 
                              String titulo, String descricao, 
                              LocalDate dataInicioPrevista, LocalDate dataTerminoPrevista,
                              LocalDate dataTerminoReal, StatusAtividade status,
                              PrioridadeAtividade prioridade, LocalDateTime dataCadastro,
                              List<SubAtividadeResponseDTO> subatividades) {
        this.idAtividade = idAtividade;
        this.idProjeto = idProjeto;
        this.idResponsavel = idResponsavel;
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataInicioPrevista = dataInicioPrevista;
        this.dataTerminoPrevista = dataTerminoPrevista;
        this.dataTerminoReal = dataTerminoReal;
        this.status = status;
        this.prioridade = prioridade;
        this.dataCadastro = dataCadastro;
        this.subatividades = subatividades;
    }

    // Getters e Setters
    public Long getIdAtividade() { 
        return idAtividade; 
    }
    
    public void setIdAtividade(Long idAtividade) { 
        this.idAtividade = idAtividade; 
    }

    public Long getIdProjeto() { 
        return idProjeto; 
    }
    
    public void setIdProjeto(Long idProjeto) { 
        this.idProjeto = idProjeto; 
    }

    public Long getIdResponsavel() { 
        return idResponsavel; 
    }
    
    public void setIdResponsavel(Long idResponsavel) { 
        this.idResponsavel = idResponsavel; 
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
    
    public StatusAtividade getStatus() {
        return status;
    }
    
    public void setStatus(StatusAtividade status) {
        this.status = status;
    }
    
    public PrioridadeAtividade getPrioridade() {
        return prioridade;
    }
    
    public void setPrioridade(PrioridadeAtividade prioridade) {
        this.prioridade = prioridade;
    }
    
    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }
    
    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }
    
    public List<SubAtividadeResponseDTO> getSubatividades() {
        return subatividades;
    }
    
    public void setSubatividades(List<SubAtividadeResponseDTO> subatividades) {
        this.subatividades = subatividades;
    }
}
