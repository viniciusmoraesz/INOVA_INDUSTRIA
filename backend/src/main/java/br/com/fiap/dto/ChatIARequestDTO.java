package br.com.fiap.dto;

import java.util.List;

public class ChatIARequestDTO {
    private String message;
    private List<ProjetoResumoDTO> projetos;
    // Opcional: usuários do sistema para contexto ampliado
    private List<UsuarioResumoDTO> usuarios;
    // Opcional: relação projeto -> usuários responsáveis (ids)
    private List<ProjetoResponsavelDTO> responsaveis;

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<ProjetoResumoDTO> getProjetos() { return projetos; }
    public void setProjetos(List<ProjetoResumoDTO> projetos) { this.projetos = projetos; }

    public List<UsuarioResumoDTO> getUsuarios() { return usuarios; }
    public void setUsuarios(List<UsuarioResumoDTO> usuarios) { this.usuarios = usuarios; }

    public List<ProjetoResponsavelDTO> getResponsaveis() { return responsaveis; }
    public void setResponsaveis(List<ProjetoResponsavelDTO> responsaveis) { this.responsaveis = responsaveis; }

    public static class ProjetoResumoDTO {
        private Long id;
        private String titulo;
        private String status;
        private String prazo;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitulo() { return titulo; }
        public void setTitulo(String titulo) { this.titulo = titulo; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getPrazo() { return prazo; }
        public void setPrazo(String prazo) { this.prazo = prazo; }
    }

    public static class UsuarioResumoDTO {
        private Long id;
        private String nome;
        private String email;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class ProjetoResponsavelDTO {
        private Long idProjeto;
        private List<Long> idsUsuarios;

        public Long getIdProjeto() { return idProjeto; }
        public void setIdProjeto(Long idProjeto) { this.idProjeto = idProjeto; }
        public List<Long> getIdsUsuarios() { return idsUsuarios; }
        public void setIdsUsuarios(List<Long> idsUsuarios) { this.idsUsuarios = idsUsuarios; }
    }
}
