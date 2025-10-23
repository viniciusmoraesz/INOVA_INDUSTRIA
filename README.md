# 🏭 Sistema Inova Industria

Sistema completo de gestão de projetos industriais com arquitetura moderna separando frontend React e backend Java.

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Funcionalidades](#-funcionalidades)
3. [Tecnologias](#-tecnologias)
4. [Pré-requisitos](#-pré-requisitos)
5. [Instalação e Configuração](#-instalação-e-configuração)
6. [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)
7. [Executando a Aplicação](#-executando-a-aplicação)
8. [Como Usar o Sistema](#-como-usar-o-sistema)
9. [Estrutura do Projeto](#-estrutura-do-projeto)
10. [API Endpoints](#-api-endpoints)
11. [Troubleshooting](#-troubleshooting)
12. [FAQ](#-faq)

---

## 🎯 Visão Geral

O **Sistema Inova Industria** é uma aplicação web moderna para gestão de projetos industriais, desenvolvida com:
- **Frontend**: React 18 + Vite
- **Backend**: Java 21 + JAX-RS (Jersey)
- **Banco**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)

### Arquitetura
```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    JDBC    ┌─────────────────┐
│   Frontend      │ ◄──────────────► │    Backend      │ ◄─────────► │   PostgreSQL    │
│   React + Vite  │                 │   Java JAX-RS   │            │   Database      │
│   Port: 5173    │                 │   Port: 8080    │            │   Port: 5432    │
└─────────────────┘                 └─────────────────┘            └─────────────────┘
```

---

## ✨ Funcionalidades

### 🏢 Gestão de Empresas
- ✅ Cadastro completo de empresas
- ✅ Edição e exclusão
- ✅ Dados: CNPJ, razão social, endereço, setor, porte

### 👥 Gestão de Clientes
- ✅ Cadastro de clientes por empresa
- ✅ Controle de acesso por roles (CLIENTE, ADMIN, SUPER_ADMIN)
- ✅ Dados: nome, email, CPF, cargo, departamento

### 📊 Gestão de Projetos
- ✅ Criação e edição de projetos
- ✅ Status: Planejamento, Em Andamento, Pausado, Concluído, Cancelado
- ✅ Prioridades: Baixa, Média, Alta, Urgente
- ✅ Controle de orçamento e prazos

### 🔐 Sistema de Segurança
- ✅ Autenticação JWT
- ✅ Controle de acesso por roles
- ✅ Sessões seguras com expiração

---

## 🛠️ Tecnologias

### Frontend
- **React 18** - Framework principal
- **Vite** - Build tool e dev server
- **React Router** - Roteamento SPA
- **Styled Components** - CSS-in-JS
- **React Hook Form** - Gerenciamento de formulários
- **Yup** - Validação de esquemas
- **Lucide React** - Ícones modernos

### Backend
- **Java 21** - Linguagem principal
- **JAX-RS (Jersey)** - Framework REST
- **Jackson** - Serialização JSON
- **JWT** - Autenticação
- **PostgreSQL JDBC** - Conexão com banco
- **Maven** - Gerenciamento de dependências

### Banco de Dados
- **PostgreSQL 15+** - Banco principal
- **Enums customizados** - Para status e prioridades
- **Relacionamentos FK** - Integridade referencial

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Obrigatórios
- **Java 21** ou superior
  - [Download Oracle JDK](https://www.oracle.com/java/technologies/downloads/)
  - [Download OpenJDK](https://openjdk.org/)
- **Node.js 18** ou superior
  - [Download Node.js](https://nodejs.org/)
- **PostgreSQL 15** ou superior
  - [Download PostgreSQL](https://www.postgresql.org/download/)
- **Maven 3.8** ou superior
  - [Download Maven](https://maven.apache.org/download.cgi)

### Verificar Instalações
```bash
# Verificar Java
java -version

# Verificar Node.js
node --version
npm --version

# Verificar PostgreSQL
psql --version

# Verificar Maven
mvn --version
```

---

## 🚀 Instalação e Configuração

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd backup
```

### 2. Instalar Dependências do Frontend
```bash
# Na raiz do projeto
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inova_industria
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# Configurações JWT
JWT_SECRET=sua_chave_secreta_muito_forte_aqui
JWT_EXPIRATION=7200

# Configurações do Servidor
SERVER_PORT=8080
FRONTEND_URL=http://localhost:5173

# API GROQ (para funcionalidades de IA)
GROQ_API_KEY=sua_chave_da_api_groq_aqui
```

---

## 🗄️ Configuração do Banco de Dados

### 1. Criar o Banco de Dados
```sql
-- Conectar ao PostgreSQL como superusuário
psql -U postgres

-- Criar banco
CREATE DATABASE inova_industria;

-- Conectar ao banco criado
\c inova_industria;
```

### 2. Criar Tipos Enum
```sql
-- Tipos customizados
CREATE TYPE tipo_role AS ENUM ('CLIENTE', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE status_projeto AS ENUM ('PLANEJAMENTO', 'EM_ANDAMENTO', 'PAUSADO', 'CONCLUIDO', 'CANCELADO');
CREATE TYPE prioridade_projeto AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');
CREATE TYPE empresa_porte AS ENUM ('MICRO', 'PEQUENA', 'MEDIA', 'GRANDE');
```

### 3. Criar Tabelas
```sql
-- Tabela de Empresas
CREATE TABLE TB_EMPRESA (
    id_empresa SERIAL PRIMARY KEY,
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    telefone VARCHAR(20),
    email VARCHAR(255),
    endereco TEXT,
    data_fundacao DATE,
    setor_atividade VARCHAR(100),
    porte empresa_porte,
    situacao_cadastral VARCHAR(50),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT true
);

-- Tabela de Clientes
CREATE TABLE TB_CLIENTE (
    id_cliente SERIAL PRIMARY KEY,
    id_empresa INTEGER REFERENCES TB_EMPRESA(id_empresa),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(11),
    data_nascimento DATE,
    cargo VARCHAR(100),
    departamento VARCHAR(100),
    role tipo_role NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT true
);

-- Tabela de Projetos
CREATE TABLE TB_PROJETO (
    id_projeto SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL REFERENCES TB_EMPRESA(id_empresa),
    id_gerente INTEGER REFERENCES TB_CLIENTE(id_cliente),
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_termino_prevista DATE,
    data_termino_real DATE,
    orcamento DECIMAL(15,2),
    status status_projeto NOT NULL,
    prioridade prioridade_projeto NOT NULL
);
```

### 4. Inserir Dados Iniciais
```sql
-- Empresa de teste
INSERT INTO TB_EMPRESA (cnpj, razao_social, nome_fantasia, email, porte, setor_atividade) 
VALUES ('12345678000195', 'Empresa Teste LTDA', 'Teste Corp', 'contato@teste.com', 'MEDIA', 'Tecnologia');

-- Super Admin (senha: super_secret)
INSERT INTO TB_CLIENTE (id_empresa, nome, email, role, senha) 
VALUES (1, 'Super Administrador', 'superadmin@inova.com', 'SUPER_ADMIN', '$argon2id$v=19$m=65536,t=3,p=4$hash_da_senha');

-- Admin de teste (senha: senha123)
INSERT INTO TB_CLIENTE (id_empresa, nome, email, role, senha) 
VALUES (1, 'Admin Teste', 'admin@teste.com', 'ADMIN', '$argon2id$v=19$m=65536,t=3,p=4$hash_da_senha');

-- Cliente de teste (senha: cliente123)
INSERT INTO TB_CLIENTE (id_empresa, nome, email, role, senha) 
VALUES (1, 'Cliente Teste', 'cliente@teste.com', 'CLIENTE', '$argon2id$v=19$m=65536,t=3,p=4$hash_da_senha');
```

---

## ▶️ Executando a Aplicação

### 1. Executar o Backend
```bash
# Navegar para o diretório backend
cd backend

# Compilar e executar
mvn clean compile exec:java

# Ou executar diretamente o JAR
mvn clean package
java -jar target/api-inova-industria-1.0-SNAPSHOT.jar
```

**✅ Backend rodando em:** `http://localhost:8080`

### 2. Executar o Frontend
```bash
# Em outro terminal, na raiz do projeto
npm run dev
```

**✅ Frontend rodando em:** `http://localhost:5173`

### 3. Verificar se está funcionando
- Acesse: `http://localhost:5173`
- Teste API: `http://localhost:8080/empresas` (deve retornar 401 sem token)

---

## 📱 Como Usar o Sistema

### 1. Primeiro Acesso - Login
1. Acesse `http://localhost:5173`
2. Use uma das credenciais de teste:
   - **Super Admin**: `superadmin@inova.com` / `super_secret`
   - **Admin**: `admin@teste.com` / `senha123`
   - **Cliente**: `cliente@teste.com` / `cliente123`

### 2. Navegação Principal
Após o login, você verá o menu lateral com opções baseadas no seu nível de acesso:

#### 👑 SUPER_ADMIN - Acesso Total
- **Projetos**: Visualiza todos os projetos de todas as empresas
- **Empresas**: Gerencia todas as empresas do sistema
- **Clientes**: Gerencia todos os clientes do sistema
- **Criar**: Pode criar empresas, clientes e projetos

#### 🏢 ADMIN - Administrador da Empresa
- **Projetos**: Visualiza apenas projetos da sua empresa
- **Clientes**: Gerencia apenas clientes da sua empresa
- **Criar**: Pode criar clientes e projetos para sua empresa

#### 👤 CLIENTE - Visualização
- **Projetos**: Visualiza apenas projetos da sua empresa
- **Perfil**: Pode visualizar seus dados

### 3. Gestão de Empresas (SUPER_ADMIN)
1. Clique em **"Empresas"** no menu
2. **Criar Nova Empresa**:
   - Clique em "Nova Empresa"
   - Preencha: CNPJ, Razão Social, Nome Fantasia, etc.
   - Clique em "Salvar"
3. **Editar Empresa**:
   - Clique no ícone de edição
   - Modifique os dados necessários
   - Salve as alterações
4. **Excluir Empresa**:
   - Clique no ícone de lixeira
   - Confirme a exclusão no modal

### 4. Gestão de Clientes (ADMIN/SUPER_ADMIN)
1. Clique em **"Clientes"** no menu
2. **Criar Novo Cliente**:
   - Clique em "Novo Cliente"
   - Preencha: Nome, Email, CPF, Cargo, etc.
   - Selecione a empresa (SUPER_ADMIN) ou use a empresa atual (ADMIN)
   - Defina o role: CLIENTE, ADMIN ou SUPER_ADMIN
   - Clique em "Salvar"
3. **Editar/Excluir**: Similar ao processo de empresas

### 5. Gestão de Projetos
1. Clique em **"Projetos"** no menu
2. **Visualizar Projetos**:
   - Lista mostra projetos baseados no seu nível de acesso
   - Use filtros por status: Todos, Planejamento, Em Andamento, etc.
   - Use a busca para encontrar projetos específicos
3. **Criar Novo Projeto** (ADMIN/SUPER_ADMIN):
   - Clique em "Novo Projeto"
   - Preencha: Título, Descrição, Datas, Orçamento
   - Selecione: Empresa, Gerente, Status, Prioridade
   - Clique em "Salvar"
4. **Editar Projeto**:
   - Clique no ícone de edição
   - Modifique os dados (empresa e gerente são read-only)
   - Salve as alterações
5. **Excluir Projeto**:
   - Clique no ícone de lixeira
   - Confirme a exclusão

### 6. Filtros e Busca
- **Filtro por Status**: Use os botões coloridos para filtrar projetos
- **Busca Textual**: Digite no campo de busca para encontrar por título/descrição
- **Combinação**: Filtros e busca funcionam em conjunto

### 7. Logout
- Clique no botão "Sair" no menu lateral
- Você será redirecionado para a tela de login
- O token JWT será removido automaticamente

---

## 📁 Estrutura do Projeto

```
backup/
├── backend/                    # API Java
│   ├── src/main/java/br/com/fiap/
│   │   ├── annotation/         # @Secured
│   │   ├── config/            # CORSFilter
│   │   ├── dao/               # Data Access Objects
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── factory/           # ConnectionFactory
│   │   ├── filter/            # AuthenticationFilter
│   │   ├── model/             # Entidades (Cliente, Empresa, Projeto)
│   │   ├── resource/          # Controllers REST
│   │   ├── service/           # TokenService
│   │   └── Main.java          # Ponto de entrada
│   └── pom.xml               # Dependências Maven
├── src/                      # Frontend React
│   ├── Components/           # Componentes principais
│   ├── components/           # Componentes utilitários
│   ├── contexts/             # AuthContext
│   ├── pages/                # Login
│   ├── services/             # API Services
│   ├── Styles/               # Styled Components
│   └── main.jsx              # Ponto de entrada
├── package.json              # Dependências NPM
├── .env                      # Variáveis de ambiente
└── README.md                 # Esta documentação
```

---

## 📡 API Endpoints

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/logout` - Logout

### Empresas
- `GET /empresas` - Listar empresas
- `POST /empresas` - Criar empresa
- `GET /empresas/{id}` - Buscar por ID
- `PUT /empresas/{id}` - Atualizar
- `DELETE /empresas/{id}` - Remover

### Clientes
- `GET /clientes` - Listar clientes
- `POST /clientes` - Criar cliente
- `GET /clientes/{id}` - Buscar por ID
- `PUT /clientes/{id}` - Atualizar
- `DELETE /clientes/{id}` - Remover

### Projetos
- `GET /projetos?empresa={id}` - Listar por empresa
- `POST /projetos` - Criar projeto
- `GET /projetos/{id}` - Buscar por ID
- `PUT /projetos/{id}` - Atualizar
- `DELETE /projetos/{id}` - Remover

### Headers Necessários
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

---

## 🔧 Troubleshooting

### ❌ Problema: "CORS Error"
**Sintoma**: `Access to fetch blocked by CORS policy`
**Solução**:
1. Verificar se backend está rodando na porta 8080
2. Verificar se CORSFilter está registrado
3. Confirmar URL do frontend (deve ser localhost:5173)

### ❌ Problema: "401 Unauthorized"
**Sintoma**: Requisições retornam 401
**Causas Possíveis**:
- Token expirado (válido por 2 horas)
- Token malformado
- Usuário não autenticado

**Soluções**:
1. Fazer logout e login novamente
2. Verificar localStorage no navegador (F12 → Application → Local Storage)
3. Verificar logs do backend

### ❌ Problema: "Connection refused"
**Sintoma**: Frontend não consegue conectar ao backend
**Soluções**:
1. Verificar se backend está rodando: `http://localhost:8080`
2. Verificar se não há firewall bloqueando
3. Confirmar porta no arquivo de configuração

### ❌ Problema: "Database connection failed"
**Sintoma**: Erro de conexão com PostgreSQL
**Soluções**:
1. Verificar se PostgreSQL está rodando
2. Confirmar credenciais no `.env`
3. Verificar se banco `inova_industria` existe
4. Testar conexão: `psql -U usuario -d inova_industria`

### ❌ Problema: "Campos aparecem como 'Carregando...'"
**Sintoma**: Na edição, empresa/cliente não carregam
**Soluções**:
1. Verificar logs do console (F12)
2. Confirmar se IDs existem no banco
3. Verificar se relacionamentos estão corretos

---

## ❓ FAQ

### **P: Como criar o primeiro usuário SUPER_ADMIN?**
**R**: Execute o script SQL de dados iniciais ou insira manualmente no banco:
```sql
INSERT INTO TB_CLIENTE (id_empresa, nome, email, role, senha) 
VALUES (1, 'Super Admin', 'superadmin@inova.com', 'SUPER_ADMIN', 'senha_hash');
```

### **P: Como alterar a porta do backend?**
**R**: Modifique no arquivo `Main.java`:
```java
URI baseUri = UriBuilder.fromUri("http://localhost/").port(NOVA_PORTA).build();
```

### **P: Como alterar a porta do frontend?**
**R**: Modifique no `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: NOVA_PORTA
  }
})
```

### **P: Como resetar senha de um usuário?**
**R**: Atualize diretamente no banco (use hash Argon2):
```sql
UPDATE TB_CLIENTE SET senha = 'novo_hash' WHERE email = 'usuario@email.com';
```

### **P: Como fazer backup do banco?**
**R**: Use pg_dump:
```bash
pg_dump -U usuario -d inova_industria > backup.sql
```

### **P: Como restaurar backup do banco?**
**R**: Use psql:
```bash
psql -U usuario -d inova_industria < backup.sql
```

### **P: O sistema funciona em produção?**
**R**: Sim, mas você precisa:
1. Configurar HTTPS
2. Usar banco em servidor dedicado
3. Configurar variáveis de ambiente de produção
4. Fazer build do frontend: `npm run build`

### **P: Como adicionar novos campos às entidades?**
**R**: 
1. Altere a tabela no banco (ALTER TABLE)
2. Atualize a classe Java da entidade
3. Atualize o DAO para incluir o campo
4. Atualize o formulário no frontend

---

## 📞 Suporte

Para dúvidas ou problemas:

1. **Verifique os logs**: Console do navegador (F12) e terminal do backend
2. **Consulte a documentação**: `DOCUMENTACAO.md` tem detalhes técnicos
3. **Teste isoladamente**: Verifique cada componente (banco, backend, frontend)

---

## 📄 Licença

Este projeto é desenvolvido para fins educacionais e de demonstração.

---

**🚀 Pronto para usar! Siga este guia passo a passo e você terá o Sistema Inova Industria funcionando perfeitamente.**, use variáveis de ambiente reais do servidor em vez do arquivo .env
