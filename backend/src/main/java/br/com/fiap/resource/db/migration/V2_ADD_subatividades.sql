-- V2_ADD_subatividades.sql
-- Adiciona a tabela de subatividades e dados de exemplo

-- Criação da tabela de subatividades
CREATE TABLE TB_SUBATIVIDADE (
    id_subatividade SERIAL PRIMARY KEY,
    id_atividade INTEGER NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_inicio_prevista DATE,
    data_termino_prevista DATE,
    data_termino_real DATE,
    status status_atividade NOT NULL DEFAULT 'PENDENTE',
    prioridade prioridade_atividade NOT NULL DEFAULT 'MEDIA',
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_atividade_subatividade FOREIGN KEY (id_atividade) 
        REFERENCES TB_ATIVIDADE(id_atividade) ON DELETE CASCADE
);

-- Índices para melhorar o desempenho
CREATE INDEX idx_subatividade_atividade ON TB_SUBATIVIDADE(id_atividade);
CREATE INDEX idx_subatividade_status ON TB_SUBATIVIDADE(status);

-- Inserção de atividades e subatividades de exemplo
DO $$
DECLARE
    v_id_atividade1 INTEGER;
    v_id_atividade2 INTEGER;
BEGIN
    -- Inserir a primeira atividade
    INSERT INTO TB_ATIVIDADE (
        id_projeto,
        titulo, 
        descricao, 
        data_inicio_prevista,
        data_termino_prevista, 
        status, 
        prioridade
    ) VALUES (
        1,  -- ID do projeto
        'Implementar tela de login', 
        'Desenvolver a interface e lógica de autenticação', 
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '7 days',
        'PENDENTE'::status_atividade, 
        'ALTA'::prioridade_atividade
    ) RETURNING id_atividade INTO v_id_atividade1;

    -- Inserir subatividades para a primeira atividade
    INSERT INTO TB_SUBATIVIDADE (
        id_atividade,
        titulo, 
        descricao, 
        data_termino_prevista, 
        status, 
        prioridade
    ) VALUES 
    (
        v_id_atividade1,
        'Criar formulário de login', 
        'Desenvolver o formulário com campos de email e senha', 
        CURRENT_DATE + INTERVAL '2 days',
        'PENDENTE'::status_atividade, 
        'ALTA'::prioridade_atividade
    ),
    (
        v_id_atividade1,
        'Implementar validação de formulário', 
        'Adicionar validação de campos obrigatórios e formato de email', 
        CURRENT_DATE + INTERVAL '3 days',
        'PENDENTE'::status_atividade, 
        'ALTA'::prioridade_atividade
    );

    -- Inserir a segunda atividade
    INSERT INTO TB_ATIVIDADE (
        id_projeto,
        titulo, 
        descricao, 
        data_inicio_prevista,
        data_termino_prevista, 
        status, 
        prioridade
    ) VALUES (
        1,  -- ID do projeto
        'Desenvolver dashboard', 
        'Criar painel administrativo com métricas', 
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '14 days',
        'PENDENTE'::status_atividade, 
        'ALTA'::prioridade_atividade
    ) RETURNING id_atividade INTO v_id_atividade2;

    -- Inserir subatividades para a segunda atividade
    INSERT INTO TB_SUBATIVIDADE (
        id_atividade,
        titulo, 
        descricao, 
        data_termino_prevista, 
        status, 
        prioridade
    ) VALUES 
    (
        v_id_atividade2,
        'Criar layout do dashboard', 
        'Desenvolver o design do painel principal', 
        CURRENT_DATE + INTERVAL '3 days',
        'PENDENTE'::status_atividade, 
        'ALTA'::prioridade_atividade
    ),
    (
        v_id_atividade2,
        'Implementar gráficos', 
        'Desenvolver visualizações de dados para as métricas', 
        CURRENT_DATE + INTERVAL '7 days',
        'PENDENTE'::status_atividade, 
        'MEDIA'::prioridade_atividade
    );
END $$;