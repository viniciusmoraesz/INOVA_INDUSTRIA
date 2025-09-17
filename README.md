### Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina as seguintes ferramentas:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Java JDK](https://www.oracle.com/br/java/technologies/javase-downloads.html) (versão 11 ou superior)
- [PostgreSQL](https://www.postgresql.org/download/) (versão 12 ou superior)
- [Maven](https://maven.apache.org/download.cgi) (para gerenciamento de dependências Java)
- [Git](https://git-scm.com/)

### 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd [NOME_DO_REPOSITORIO]
   ```

2. **Configure o banco de dados**
   - Crie um banco de dados PostgreSQL chamado `sistema_gerenciamento`
   - Configure as credenciais do banco de dados no arquivo de configuração do backend

3. **Configure o backend**
   ```bash
   cd backend
   mvn clean install
   ```

4. **Configure o frontend**
   ```bash
   cd ../
   npm install
   ```

### 🚀 Executando a aplicação

1. **Inicie o servidor backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   O servidor estará disponível em `http://localhost:8080`

2. **Inicie o servidor frontend**
   ```bash
   cd ../
   npm run dev
   ```
   O frontend estará disponível em `http://localhost:5173`

## 🛠 Tecnologias utilizadas

- **Frontend**:
  - React.js
  - Vite
  - Styled Components
  - React Hook Form
  - React Router DOM
  - Lucide Icons

- **Backend**:
  - Java Spring Boot
  - JPA/Hibernate
  - PostgreSQL
  - Maven

## 📄 Estrutura do banco de dados

O banco de dados possui as seguintes tabelas principais:
- `TB_EMPRESA`: Armazena informações das empresas
- `TB_CLIENTE`: Armazena informações dos usuários/clientes
- `TB_PROJETO`: Armazena os projetos

> **Nota:** O script SQL completo de criação do banco de dados pode ser encontrado em:
> `backend/src/main/java/br/com/fiap/resource/db/migration/V1__init.sql`
> Este arquivo é executado automaticamente pelo Flyway na inicialização da aplicação.

## 🔧 Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```env
# Configurações do Banco de Dados
DB_URL=jdbc:postgresql://localhost:5432/sistema_gerenciamento
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# Configurações da Aplicação
APP_PORT=8080
APP_ENV=development  # development, test ou production

# Configurações de Autenticação JWT
JWT_SECRET=sua_chave_secreta_muito_segura
JWT_EXPIRATION_HOURS=24

# Chave da API GROQ (para integrações futuras)
GROQ_API_KEY=sua_chave_api_groq
```

### Importante:
- Nunca compartilhe ou faça commit do arquivo `.env` no controle de versão
- Adicione `.env` ao seu `.gitignore`
- Para produção, use variáveis de ambiente reais do servidor em vez do arquivo .env
