export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  empresaId: string;
  cargo: string;
  departamento: string;
  dataNascimento?: Date;
  ativo: boolean;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClienteDTO {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  empresaId: string;
  cargo: string;
  departamento: string;
  dataNascimento?: Date;
  observacoes?: string;
}

export interface UpdateClienteDTO extends Partial<CreateClienteDTO> {
  ativo?: boolean;
}
