# 📋 Documentação Completa - Sistema Inova Industria

## 📖 Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Sistema de Autenticação](#sistema-de-autenticação)
6. [Banco de Dados](#banco-de-dados)
7. [API Backend](#api-backend)
8. [Frontend React](#frontend-react)
9. [Controle de Acesso](#controle-de-acesso)
10. [Como Executar](#como-executar)
11. [Endpoints da API](#endpoints-da-api)
12. [Componentes Principais](#componentes-principais)
13. [Fluxos de Trabalho](#fluxos-de-trabalho)
14. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O **Sistema Inova Industria** é uma aplicação web completa para gestão de projetos industriais, desenvolvida com arquitetura moderna separando frontend (React) e backend (Java/JAX-RS).

### Principais Funcionalidades:
- ✅ **Gestão de Empresas** - CRUD completo
- ✅ **Gestão de Clientes** - CRUD completo  
- ✅ **Gestão de Projetos** - CRUD completo com relacionamentos
- ✅ **Sistema de Autenticação JWT** - Segurança robusta
- ✅ **Controle de Acesso por Roles** - 3 níveis de permissão
- ✅ **Interface Responsiva** - Design moderno e intuitivo

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    JDBC    ┌─────────────────┐
│   Frontend      │ ◄──────────────► │    Backend      │ ◄─────────► │   PostgreSQL    │
│   React + Vite  │                 │   Java JAX-RS   │            │   Database      │
│   Port: 5173    │                 │   Port: 8080    │            │   Port: 5432    │
└─────────────────┘                 └─────────────────┘            └─────────────────┘
```

### Características da Arquitetura:
- **Frontend SPA**: Single Page Application com React
- **Backend API REST**: Microserviços Java com JAX-RS
- **Banco Relacional**: PostgreSQL com relacionamentos bem definidos
- **Autenticação Stateless**: JWT tokens para segurança
- **CORS Configurado**: Comunicação cross-origin segura

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Framework principal
- **Vite** - Build tool e dev server
- **React Router** - Roteamento SPA
- **Styled Components** - CSS-in-JS
- **React Hook Form** - Gerenciamento de formulários
- **Yup** - Validação de esquemas
- **React Icons** - Ícones modernos

### Backend
- **Java 17** - Linguagem principal
- **JAX-RS (Jersey)** - Framework REST
- **Jackson** - Serialização JSON
- **JWT (java-jwt)** - Autenticação
- **PostgreSQL JDBC** - Conexão com banco
- **Maven** - Gerenciamento de dependências

### Banco de Dados
- **PostgreSQL 15+** - Banco principal
- **Enums customizados** - Para status e prioridades
- **Relacionamentos FK** - Integridade referencial

---

## 📁 Estrutura do Projeto

```
backup/
├── backend/                    # API Java
│   ├── src/main/java/br/com/fiap/
│   │   ├── annotation/         # Anotações customizadas
│   │   │   └── Secured.java
│   │   ├── config/            # Configurações
│   │   │   └── CORSFilter.java
│   │   ├── dao/               # Data Access Objects
│   │   │   ├── ClienteDAO.java
│   │   │   ├── EmpresaDAO.java
│   │   │   └── ProjetoDAO.java
│   │   ├── dto/               # Data Transfer Objects
│   │   │   ├── CadastroClienteDTO.java
│   │   │   ├── CadastroProjetoDTO.java
│   │   │   └── ...
│   │   ├── factory/           # Factory patterns
│   │   │   └── ConnectionFactory.java
│   │   ├── filter/            # Filtros HTTP
│   │   │   └── AuthenticationFilter.java
│   │   ├── model/             # Entidades do domínio
│   │   │   ├── Cliente.java
│   │   │   ├── Empresa.java
│   │   │   ├── Projeto.java
│   │   │   └── enums/
│   │   ├── resource/          # Controllers REST
│   │   │   ├── AuthResource.java
│   │   │   ├── ClienteResource.java
│   │   │   ├── EmpresaResource.java
│   │   │   └── ProjetoResource.java
│   │   ├── service/           # Serviços de negócio
│   │   │   └── TokenService.java
│   │   └── Main.java          # Ponto de entrada
│   └── pom.xml               # Dependências Maven
├── src/                      # Frontend React
│   ├── Components/           # Componentes React
│   │   ├── CadastroProjeto.jsx
│   │   ├── EditarProjeto.jsx
│   │   ├── ListaEmpresas.jsx
│   │   ├── ListaClientes.jsx
│   │   └── ...
│   ├── components/           # Componentes utilitários
│   │   ├── PrivateRoute.jsx
│   │   └── RoleProtectedRoute.jsx
│   ├── contexts/             # Context API
│   │   └── AuthContext.jsx
│   ├── pages/                # Páginas principais
│   │   └── Login.jsx
│   ├── services/             # Serviços API
│   │   ├── clienteApiService.js
│   │   ├── empresaApiService.js
│   │   └── projetoApiService.js
│   ├── Styles/               # Styled Components
│   └── main.jsx              # Ponto de entrada
├── package.json              # Dependências NPM
└── README.md                 # Documentação básica
```

---

## 🔐 Sistema de Autenticação

### Fluxo de Autenticação JWT

1. **Login**: Usuario/senha → Backend valida → Gera JWT token
2. **Armazenamento**: Token salvo no localStorage do navegador
3. **Requisições**: Token enviado no header `Authorization: Bearer <token>`
4. **Validação**: Backend valida token em cada requisição protegida
5. **Expiração**: Tokens expiram em 2 horas

### Estrutura do JWT Token
```json
{
  "sub": "cliente.teste1@gmail.com",
  "role": "CLIENTE", 
  "idEmpresa": 35,
  "exp": 1694102400,
  "iat": 1694095200
}
```

### Implementação Backend
- **TokenService.java**: Geração e validação de tokens
- **AuthenticationFilter.java**: Intercepta requisições protegidas
- **@Secured**: Anotação para proteger endpoints

### Implementação Frontend
- **AuthContext.jsx**: Gerencia estado de autenticação
- **PrivateRoute.jsx**: Protege rotas que precisam de login
- **getAuthHeaders()**: Helper para incluir token nas requisições

---

## 🗄️ Banco de Dados

### Modelo de Dados

```sql
-- Tabela de Empresas
TB_EMPRESA (
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
TB_CLIENTE (
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
TB_PROJETO (
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

-- Enums customizados
CREATE TYPE tipo_role AS ENUM ('CLIENTE', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE status_projeto AS ENUM ('PLANEJAMENTO', 'EM_ANDAMENTO', 'PAUSADO', 'CONCLUIDO', 'CANCELADO');
CREATE TYPE prioridade_projeto AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');
CREATE TYPE empresa_porte AS ENUM ('MICRO', 'PEQUENA', 'MEDIA', 'GRANDE');
```

### Relacionamentos
- **Empresa 1:N Cliente** - Uma empresa pode ter vários clientes
- **Cliente 1:N Projeto** - Um cliente pode gerenciar vários projetos
- **Empresa 1:N Projeto** - Uma empresa pode ter vários projetos

---

## 🚀 API Backend

### Configuração Principal (Main.java)
```java
@ApplicationPath("/")
public class Main extends ResourceConfig {
    public Main() {
        // Registrar recursos
        register(AuthResource.class);
        register(EmpresaResource.class);
        register(ClienteResource.class);
        register(ProjetoResource.class);
        
        // Configurar CORS
        register(CORSFilter.class);
        
        // Configurar autenticação
        register(AuthenticationFilter.class);
        
        // Configurar Jackson para datas
        register(JacksonJsonProvider.class);
    }
}
```

### Padrão DAO (Data Access Object)
Cada entidade possui seu DAO para operações de banco:
- **Conexão**: ConnectionFactory gerencia pool de conexões
- **CRUD**: Métodos padronizados (cadastrar, listar, atualizar, remover)
- **Mapeamento**: ResultSet → Objeto Java
- **Transações**: Controle automático com try-with-resources

### Exemplo de Resource (Controller)
```java
@Path("/projetos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Secured
public class ProjetoResource {
    
    @GET
    public Response listarPorEmpresa(@QueryParam("empresa") Long empresaId, 
                                   @Context SecurityContext securityContext) {
        // Lógica de negócio
    }
    
    @POST
    public Response cadastrar(Projeto projeto) {
        // Validação e persistência
    }
}
```

---

## ⚛️ Frontend React

### Arquitetura de Componentes

#### Context API para Estado Global
```javascript
// AuthContext.jsx - Gerencia autenticação
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Métodos: login, logout, checkAuth
  // Estado: user, isLoading, isSuperAdmin
};
```

#### Serviços API
```javascript
// projetoApiService.js - Comunicação com backend
const projetoApiService = {
  async listarProjetos(idEmpresa) {
    const response = await fetch(`${API_BASE_URL}/projetos?empresa=${idEmpresa}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};
```

#### Componentes Principais
- **CadastroProjeto.jsx**: Lista e gerencia projetos
- **EditarProjeto.jsx**: Edição de projetos existentes
- **ListaEmpresas.jsx**: CRUD de empresas
- **ListaClientes.jsx**: CRUD de clientes
- **Login.jsx**: Autenticação de usuários

### Roteamento Protegido
```javascript
// main.jsx - Configuração de rotas
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/*" element={<PrivateRoute><App /></PrivateRoute>}>
    <Route path="projetos" element={<CadastroProjeto />} />
    <Route path="empresas" element={
      <RoleProtectedRoute allowedRoles={['ADMIN']}>
        <ListaEmpresas />
      </RoleProtectedRoute>
    } />
  </Route>
</Routes>
```

---

## 🔒 Controle de Acesso

### Hierarquia de Roles

#### 👑 SUPER_ADMIN
- **Acesso**: Total irrestrito
- **Projetos**: Vê todos os projetos de todas as empresas
- **Gestão**: Pode gerenciar empresas, clientes e usuários
- **Criação**: Pode criar projetos, empresas e clientes

#### 🏢 ADMIN (Administrador da Empresa)
- **Acesso**: Restrito à sua empresa
- **Projetos**: Vê apenas projetos da sua empresa
- **Gestão**: Pode gerenciar clientes da sua empresa
- **Criação**: Pode criar projetos e clientes

#### 👤 CLIENTE
- **Acesso**: Apenas visualização
- **Projetos**: Vê apenas projetos da sua empresa
- **Gestão**: Não pode gerenciar outros usuários
- **Criação**: Não pode criar novos registros

### Implementação de Segurança

#### Backend - Anotação @Secured
```java
@Secured
@Path("/projetos")
public class ProjetoResource {
    @GET
    public Response listar(@Context SecurityContext securityContext) {
        if (securityContext.isUserInRole("SUPER_ADMIN")) {
            // Retorna todos os projetos
        } else {
            // Retorna apenas projetos da empresa do usuário
        }
    }
}
```

#### Frontend - RoleProtectedRoute
```javascript
const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isSuperAdmin } = useAuth();
  
  if (isSuperAdmin) return children;
  
  const hasPermission = allowedRoles.includes(user?.role);
  if (!hasPermission) {
    return <Navigate to="/projetos" replace />;
  }
  
  return children;
};
```

---

## 🚀 Como Executar

### Pré-requisitos
- **Java 17+**
- **Node.js 18+**
- **PostgreSQL 15+**
- **Maven 3.8+**

### 1. Configurar Banco de Dados
```sql
-- Criar banco
CREATE DATABASE inova_industria;

-- Executar scripts de criação das tabelas
-- (Ver seção Banco de Dados para DDL completo)
```

### 2. Executar Backend
```bash
cd backend/
mvn clean compile exec:java
# Servidor rodará em http://localhost:8080
```

### 3. Executar Frontend
```bash
npm install
npm run dev
# Aplicação rodará em http://localhost:5173
```

### 4. Acessar Sistema
- **URL**: http://localhost:5173
- **SUPER_ADMIN**: superadmin@inova.com / super_secret
- **Admin Teste**: admin@teste.com / senha123

---

## 📡 Endpoints da API

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/logout` - Logout (limpa token)

### Empresas
- `GET /empresas` - Listar empresas
- `POST /empresas` - Criar empresa
- `GET /empresas/{id}` - Buscar empresa por ID
- `PUT /empresas/{id}` - Atualizar empresa
- `DELETE /empresas/{id}` - Remover empresa

### Clientes
- `GET /clientes` - Listar clientes
- `POST /clientes` - Criar cliente
- `GET /clientes/{id}` - Buscar cliente por ID
- `PUT /clientes/{id}` - Atualizar cliente
- `DELETE /clientes/{id}` - Remover cliente

### Projetos
- `GET /projetos?empresa={id}` - Listar projetos por empresa
- `POST /projetos` - Criar projeto (apenas ADMIN/SUPER_ADMIN)
- `GET /projetos/{id}` - Buscar projeto por ID
- `PUT /projetos/{id}` - Atualizar projeto
- `DELETE /projetos/{id}` - Remover projeto

### Headers Obrigatórios
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

---

## 🧩 Componentes Principais

### CadastroProjeto.jsx
**Funcionalidades**:
- Lista todos os projetos (filtrados por empresa/role)
- Filtros por status e busca textual
- Botões para editar/excluir projetos
- Navegação para criar novo projeto (se permitido)

**Estados**:
- `projects`: Lista de projetos
- `statusFilter`: Filtro de status ativo
- `searchTerm`: Termo de busca
- `isLoading`: Estado de carregamento

### EditarProjeto.jsx
**Funcionalidades**:
- Carrega dados do projeto existente
- Campos empresa/cliente como read-only
- Validação com Yup schema
- Atualização via PUT API

**Características Especiais**:
- Busca robusta de empresa/cliente com fallbacks
- Tratamento de tipos (string vs number) para IDs
- Logs detalhados para debugging

### ListaEmpresas.jsx / ListaClientes.jsx
**Funcionalidades**:
- CRUD completo para entidades
- Paginação e filtros
- Modais de confirmação para exclusão
- Navegação para páginas de edição

---

## 🔄 Fluxos de Trabalho

### Fluxo de Login
1. Usuário acessa `/login`
2. Insere credenciais
3. Frontend envia POST `/auth/login`
4. Backend valida no banco
5. Retorna JWT token + dados do usuário
6. Frontend salva no localStorage
7. Redireciona para `/projetos`

### Fluxo de Criação de Projeto
1. ADMIN clica "Novo Projeto"
2. Carrega empresas e clientes
3. Preenche formulário
4. Validação frontend (Yup)
5. POST `/projetos` com dados
6. Backend valida permissões
7. Salva no banco
8. Retorna sucesso
9. Redireciona para lista

### Fluxo de Edição de Projeto
1. Usuário clica "Editar" no projeto
2. Navega para `/projetos/editar/{id}`
3. Carrega dados: projeto + empresas + clientes
4. Busca empresa/cliente pelos IDs
5. Exibe formulário preenchido
6. Empresa/cliente como read-only
7. Submete alterações via PUT
8. Atualiza banco mantendo relacionamentos

---

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. CORS Error
**Sintoma**: `Access to fetch blocked by CORS policy`
**Solução**: Verificar se CORSFilter está registrado e porta correta (5173)

#### 2. 401 Unauthorized
**Sintoma**: Requisições retornam 401
**Causas**:
- Token expirado (2h de validade)
- Token malformado
- AuthenticationFilter não registrado

**Solução**: 
- Fazer logout/login
- Verificar localStorage
- Verificar logs do backend

#### 3. 400 Bad Request - "ID da empresa é obrigatório"
**Sintoma**: Erro ao listar projetos para usuário CLIENTE
**Causa**: Frontend não está enviando parâmetro `empresa`
**Solução**: Verificar se `user.idEmpresa` está presente no localStorage

#### 4. Campos "Carregando..." na edição
**Sintoma**: Empresa/cliente aparecem como "Carregando..."
**Causa**: IDs não encontrados na busca
**Solução**: Verificar logs do console, pode ser problema de tipos (string vs number)

#### 5. Erro de Conexão com Banco
**Sintoma**: SQLException no backend
**Verificar**:
- PostgreSQL rodando na porta 5432
- Credenciais corretas no ConnectionFactory
- Banco `inova_industria` existe
- Tabelas criadas com DDL correto

### Logs Úteis

#### Backend
```java
System.out.println("📋 GET /projetos - Listando projetos para empresa: " + empresaId);
System.out.println("👑 SUPER_ADMIN - Listando todos os projetos");
System.out.println("✅ Projetos encontrados: " + projetos.size());
```

#### Frontend
```javascript
console.log('Usuário logado:', user);
console.log('EmpresaId obtido:', empresaId);
console.log('Fazendo requisição para:', url);
```

---

## 📈 Melhorias Futuras

### Funcionalidades
- [ ] Sistema de atividades/tarefas por projeto
- [ ] Dashboard com métricas e gráficos
- [ ] Notificações em tempo real
- [ ] Upload de arquivos/documentos
- [ ] Relatórios em PDF/Excel
- [ ] Histórico de alterações (audit log)

### Técnicas
- [ ] Testes unitários (Jest + JUnit)
- [ ] Cache Redis para performance
- [ ] Containerização com Docker
- [ ] CI/CD com GitHub Actions
- [ ] Monitoramento com logs estruturados
- [ ] Backup automático do banco

### UX/UI
- [ ] Tema escuro
- [ ] Responsividade mobile
- [ ] PWA (Progressive Web App)
- [ ] Internacionalização (i18n)
- [ ] Acessibilidade (WCAG)

---

## 👥 Equipe e Contato

**Desenvolvedor Principal**: Vinicius Moraes
**Projeto**: Sistema Inova Industria
**Versão**: 1.0.0
**Data**: Setembro 2025

---

*Esta documentação é um documento vivo e deve ser atualizada conforme o projeto evolui.*
