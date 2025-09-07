package br.com.fiap.dto;

import java.time.LocalDate;

public class CadastroEmpresaDTO {
        private String cnpj;
        private String razaoSocial;
        private String nomeFantasia;
        private String inscricaoEstadual;
        private String inscricaoMunicipal;
        private String email;
        private String telefone;
        private String endereco;
        private String numero;
        private String complemento;
        private String bairro;
        private String cidade;
        private String estado;
        private String cep;
        private Integer quantidadeFuncionarios;
        private String setorAtuacao;
        private LocalDate dataFundacao;

        // Getters and Setters
        public String getCnpj() { return cnpj; }
        public void setCnpj(String cnpj) { this.cnpj = cnpj; }

        public String getRazaoSocial() { return razaoSocial; }
        public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }

        public String getNomeFantasia() { return nomeFantasia; }
        public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }

        public String getInscricaoEstadual() { return inscricaoEstadual; }
        public void setInscricaoEstadual(String inscricaoEstadual) { this.inscricaoEstadual = inscricaoEstadual; }

        public String getInscricaoMunicipal() { return inscricaoMunicipal; }
        public void setInscricaoMunicipal(String inscricaoMunicipal) { this.inscricaoMunicipal = inscricaoMunicipal; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getTelefone() { return telefone; }
        public void setTelefone(String telefone) { this.telefone = telefone; }

        public String getEndereco() { return endereco; }
        public void setEndereco(String endereco) { this.endereco = endereco; }

        public String getNumero() { return numero; }
        public void setNumero(String numero) { this.numero = numero; }

        public String getComplemento() { return complemento; }
        public void setComplemento(String complemento) { this.complemento = complemento; }

        public String getBairro() { return bairro; }
        public void setBairro(String bairro) { this.bairro = bairro; }

        public String getCidade() { return cidade; }
        public void setCidade(String cidade) { this.cidade = cidade; }

        public String getEstado() { return estado; }
        public void setEstado(String estado) { this.estado = estado; }

        public String getCep() { return cep; }
        public void setCep(String cep) { this.cep = cep; }

        public Integer getQuantidadeFuncionarios() { return quantidadeFuncionarios; }
        public void setQuantidadeFuncionarios(Integer quantidadeFuncionarios) {
                this.quantidadeFuncionarios = quantidadeFuncionarios;
        }

        public String getSetorAtuacao() { return setorAtuacao; }
        public void setSetorAtuacao(String setorAtuacao) { this.setorAtuacao = setorAtuacao; }

        public LocalDate getDataFundacao() { return dataFundacao; }
        public void setDataFundacao(LocalDate dataFundacao) { this.dataFundacao = dataFundacao; }
}