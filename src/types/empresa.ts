export interface Empresa {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  quantidadeFuncionarios: number;
  setorAtuacao: string;
  dataFundacao?: Date;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmpresaDTO {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  quantidadeFuncionarios: number;
  setorAtuacao: string;
  dataFundacao?: Date;
}

export interface UpdateEmpresaDTO extends Partial<CreateEmpresaDTO> {
  ativo?: boolean;
}
