-- Tipos ENUM
CREATE TYPE tipo_role AS ENUM ('GERENTE', 'CLIENTE', 'ACOMPANHANTE');
CREATE TYPE status_projeto AS ENUM ('PLANEJAMENTO', 'EM_ANDAMENTO', 'PAUSADO', 'CONCLUIDO', 'CANCELADO');
CREATE TYPE prioridade_projeto AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');
CREATE TYPE status_atividade AS ENUM ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');
CREATE TYPE prioridade_atividade AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');

CREATE TABLE TB_EMPRESA (
    id_empresa SERIAL PRIMARY KEY,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    razao_social VARCHAR(100) NOT NULL,
    nome_fantasia VARCHAR(100),
    email VARCHAR(100),
    telefone VARCHAR(20),
    endereco VARCHAR(200),
    cidade VARCHAR(100),
    estado CHAR(2),
    cep VARCHAR(10),
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE TB_CLIENTE (
    id_cliente SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14) NOT NULL,
    data_nascimento DATE,
    cargo VARCHAR(50),
    departamento VARCHAR(50),
    role tipo_role NOT NULL DEFAULT 'CLIENTE',
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_empresa FOREIGN KEY (id_empresa) 
        REFERENCES TB_EMPRESA(id_empresa) ON DELETE CASCADE
);

CREATE TABLE TB_PROJETO (
    id_projeto SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL,
    id_gerente INTEGER,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_termino_prevista DATE,
    data_termino_real DATE,
    orcamento NUMERIC(15,2),
    status status_projeto NOT NULL DEFAULT 'PLANEJAMENTO',
    prioridade prioridade_projeto NOT NULL DEFAULT 'MEDIA',
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_empresa_projeto FOREIGN KEY (id_empresa) 
        REFERENCES TB_EMPRESA(id_empresa) ON DELETE CASCADE,
    CONSTRAINT fk_gerente FOREIGN KEY (id_gerente) 
        REFERENCES TB_CLIENTE(id_cliente) ON DELETE SET NULL
);

SELECT * FROM tb_empresa;

CREATE TABLE TB_PROJETO_CLIENTE (
    id_projeto INTEGER,
    id_cliente INTEGER,
    data_entrada DATE DEFAULT CURRENT_DATE,
    papel VARCHAR(50),
    PRIMARY KEY (id_projeto, id_cliente),
    CONSTRAINT fk_projeto FOREIGN KEY (id_projeto) 
        REFERENCES TB_PROJETO(id_projeto) ON DELETE CASCADE,
    CONSTRAINT fk_cliente FOREIGN KEY (id_cliente) 
        REFERENCES TB_CLIENTE(id_cliente) ON DELETE CASCADE
);

CREATE TABLE TB_ATIVIDADE (
    id_atividade SERIAL PRIMARY KEY,
    id_projeto INTEGER NOT NULL,
    id_responsavel INTEGER,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_inicio_prevista DATE,
    data_termino_prevista DATE,
    data_termino_real DATE,
    status status_atividade NOT NULL DEFAULT 'PENDENTE',
    prioridade prioridade_atividade NOT NULL DEFAULT 'MEDIA',
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_projeto_atividade FOREIGN KEY (id_projeto) 
        REFERENCES TB_PROJETO(id_projeto) ON DELETE CASCADE,
    CONSTRAINT fk_responsavel FOREIGN KEY (id_responsavel) 
        REFERENCES TB_CLIENTE(id_cliente) ON DELETE SET NULL
);

-- Índices para TB_EMPRESA
CREATE INDEX idx_empresa_cnpj ON TB_EMPRESA(cnpj);
CREATE INDEX idx_empresa_ativo ON TB_EMPRESA(ativo);

-- Índices para TB_CLIENTE
CREATE UNIQUE INDEX idx_cliente_email ON TB_CLIENTE(email);
CREATE UNIQUE INDEX idx_cliente_cpf ON TB_CLIENTE(cpf);
CREATE INDEX idx_cliente_empresa ON TB_CLIENTE(id_empresa);
CREATE INDEX idx_cliente_ativo ON TB_CLIENTE(ativo);

-- Índices para TB_PROJETO
CREATE INDEX idx_projeto_empresa ON TB_PROJETO(id_empresa);
CREATE INDEX idx_projeto_gerente ON TB_PROJETO(id_gerente);
CREATE INDEX idx_projeto_status ON TB_PROJETO(status);

-- Índices para TB_PROJETO_CLIENTE
CREATE INDEX idx_projeto_cliente_projeto ON TB_PROJETO_CLIENTE(id_projeto);
CREATE INDEX idx_projeto_cliente_cliente ON TB_PROJETO_CLIENTE(id_cliente);

-- Índices para TB_ATIVIDADE
CREATE INDEX idx_atividade_projeto ON TB_ATIVIDADE(id_projeto);
CREATE INDEX idx_atividade_responsavel ON TB_ATIVIDADE(id_responsavel);
CREATE INDEX idx_atividade_status ON TB_ATIVIDADE(status);

ALTER TABLE TB_EMPRESA
ADD COLUMN IF NOT EXISTS inscricao_estadual VARCHAR(20),
ADD COLUMN IF NOT EXISTS inscricao_municipal VARCHAR(20),
ADD COLUMN IF NOT EXISTS complemento VARCHAR(100),
ADD COLUMN IF NOT EXISTS bairro VARCHAR(100),
ADD COLUMN IF NOT EXISTS quantidade_funcionarios INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS setor_atuacao VARCHAR(100),
ADD COLUMN IF NOT EXISTS data_fundacao DATE,
ADD COLUMN IF NOT EXISTS numero VARCHAR(20);

SELECT * FROM TB_EMPRESA;
SELECT * FROM TB_CLIENTE;

INSERT INTO TB_CLIENTE (
    id_empresa, 
    nome, 
    email, 
    cpf, 
    telefone, 
    cargo, 
    departamento, 
    role, 
    senha, 
    ativo
) VALUES (
    35, 
    'Admin', 
    'admin@teste.com', 
    '123.456.789-09',  -- CPF de exemplo
    '(11) 98765-4321', 
    'Administrador', 
    'TI', 
    'GERENTE', 
    'senha123', 
    true
);

SELECT * FROM TB_EMPRESA;

ALTER TYPE tipo_role ADD VALUE 'SUPER_ADMIN';
ALTER TABLE TB_CLIENTE ALTER COLUMN id_empresa DROP NOT NULL;

INSERT INTO TB_CLIENTE (
    id_empresa, 
    nome, 
    email, 
    cpf, 
    telefone, 
    cargo, 
    departamento, 
    role, 
    senha, 
    ativo
) VALUES (
    NULL, -- No company association for SUPER_ADMIN
    'Super Admin', 
    'superadmin@inova.com', 
    '00000000000',  -- Unique CPF for the admin
    '(11) 5555-5555', 
    'Site Owner', 
    'System', 
    'SUPER_ADMIN', 
    'super_secret', 
    true
);

SELECT * FROM TB_CLIENTE;
SELECT id_cliente, nome, senha, email, role, id_empresa FROM TB_CLIENTE WHERE email = 'superadmin@inova.com';
SELECT * FROM TB_PROJETO;

ALTER TYPE tipo_role ADD VALUE 'SUPER_ADMIN';
ALTER TYPE tipo_role ADD VALUE 'ADMIN';