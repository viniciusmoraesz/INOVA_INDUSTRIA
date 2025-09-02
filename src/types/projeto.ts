export interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  dataInicio: Date;
  dataFimPrevista?: Date;
  dataFimReal?: Date;
  orcamento?: number;
  status: 'rascunho' | 'planejamento' | 'andamento' | 'pausado' | 'concluido' | 'cancelado';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  empresaId: string;
  clienteId: string;
  responsavelId?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjetoDTO {
  nome: string;
  descricao: string;
  dataInicio: Date | string;
  dataFimPrevista?: Date | string;
  orcamento?: number;
  status: 'rascunho' | 'planejamento' | 'andamento' | 'pausado' | 'concluido' | 'cancelado';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  empresaId: string;
  clienteId: string;
  responsavelId?: string;
}

export interface UpdateProjetoDTO extends Partial<CreateProjetoDTO> {
  dataFimReal?: Date | string;
  ativo?: boolean;
}

export interface ProjetoWithDetails extends Projeto {
  empresa: {
    id: string;
    nomeFantasia: string;
    razaoSocial: string;
  };
  cliente: {
    id: string;
    nome: string;
    email: string;
  };
  responsavel?: {
    id: string;
    nome: string;
    email: string;
  };
}
