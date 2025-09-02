import { Projeto, CreateProjetoDTO, UpdateProjetoDTO, ProjetoWithDetails } from '../types/projeto';
import { empresaService } from './empresaService';
import { clienteService } from './clienteService';

// Chave para armazenar no localStorage
const STORAGE_KEY = 'projetos_data';

// Função para carregar projetos do localStorage
const loadProjetos = (): Projeto[] => {
  console.log('Carregando projetos do localStorage...');
  
  if (typeof window === 'undefined') {
    console.log('Fora do navegador, retornando array vazio');
    return [];
  }
  
  const saved = localStorage.getItem(STORAGE_KEY);
  console.log('Dados de projetos salvos no localStorage:', saved);
  
  if (saved) {
    try {
      const parsed = JSON.parse(saved, (key, value) => {
        // Converter strings de data de volta para objetos Date
        if (key === 'createdAt' || key === 'updatedAt' || key === 'dataInicio' || key === 'dataFimPrevista' || key === 'dataFimReal') {
          return value ? new Date(value) : null;
        }
        return value;
      });
      console.log('Projetos carregados do localStorage:', parsed);
      return parsed;
    } catch (error) {
      console.error('Erro ao fazer parse dos dados de projetos do localStorage:', error);
      return [];
    }
  }
  
  console.log('Nenhum dado de projetos encontrado no localStorage, retornando array vazio');
  return [
    {
      id: '1',
      nome: 'Modernização de Linha de Produção',
      descricao: 'Atualização da linha de produção com novas tecnologias',
      dataInicio: new Date('2023-01-15'),
      dataFimPrevista: new Date('2023-12-31'),
      status: 'andamento',
      prioridade: 'alta',
      empresaId: '1',
      clienteId: '1',
      responsavelId: '1',
      orcamento: 150000,
      ativo: true,
      createdAt: new Date('2023-01-10'),
      updatedAt: new Date('2023-01-10')
    },
    {
      id: '2',
      nome: 'Automação Industrial',
      descricao: 'Implementação de sistemas de automação na fábrica',
      dataInicio: new Date('2023-03-01'),
      dataFimPrevista: new Date('2023-11-30'),
      status: 'planejamento',
      prioridade: 'media',
      empresaId: '1',
      clienteId: '1',
      orcamento: 200000,
      ativo: true,
      createdAt: new Date('2023-02-15'),
      updatedAt: new Date('2023-02-15')
    }
  ];
};

// Dados iniciais
let projetos: Projeto[] = loadProjetos();

// Função para salvar projetos no localStorage
const saveProjetos = (data: Projeto[]) => {
  console.log('Salvando projetos no localStorage:', data);
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('Projetos salvos com sucesso no localStorage');
    } catch (error) {
      console.error('Erro ao salvar projetos no localStorage:', error);
    }
  } else {
    console.log('Fora do navegador, não é possível salvar no localStorage');
  }
};

// Simula um atraso de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função auxiliar para buscar detalhes adicionais
async function getProjetoWithDetails(projeto: Projeto): Promise<ProjetoWithDetails> {
  const [empresa, cliente] = await Promise.all([
    empresaService.buscarEmpresaPorId(projeto.empresaId),
    clienteService.buscarClientePorId(projeto.clienteId)
  ]);

  if (!empresa || !cliente) {
    throw new Error('Empresa ou cliente não encontrado');
  }

  const result: ProjetoWithDetails = {
    ...projeto,
    empresa: {
      id: empresa.id,
      nomeFantasia: empresa.nomeFantasia,
      razaoSocial: empresa.razaoSocial
    },
    cliente: {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email
    }
  };

  // Se tiver responsável, buscar detalhes
  if (projeto.responsavelId) {
    // Em um cenário real, buscaríamos o responsável por ID
    // Por enquanto, vamos apenas adicionar um mock
    result.responsavel = {
      id: projeto.responsavelId,
      nome: 'Responsável do Projeto',
      email: 'responsavel@empresa.com'
    };
  }

  return result;
}

export const projetoService = {
  // Listar todos os projetos
  async listarProjetos(): Promise<ProjetoWithDetails[]> {
    await delay(500);
    const projetosAtivos = projetos.filter(p => p.ativo);
    return Promise.all(projetosAtivos.map(getProjetoWithDetails));
  },

  // Buscar projeto por ID
  async buscarProjetoPorId(id: string): Promise<ProjetoWithDetails | undefined> {
    await delay(300);
    const projeto = projetos.find(p => p.id === id && p.ativo);
    return projeto ? getProjetoWithDetails(projeto) : undefined;
  },

  // Criar novo projeto
  async criarProjeto(dados: CreateProjetoDTO): Promise<Projeto> {
    await delay(500);
    
    // Verificar se a empresa e o cliente existem
    const [empresa, cliente] = await Promise.all([
      empresaService.buscarEmpresaPorId(dados.empresaId),
      clienteService.buscarClientePorId(dados.clienteId)
    ]);
    
    if (!empresa || !cliente) {
      throw new Error('Empresa ou cliente não encontrado');
    }
    
    // Verificar se o cliente pertence à empresa
    if (cliente.empresaId !== empresa.id) {
      throw new Error('O cliente não pertence à empresa selecionada');
    }
    
    // Verificar se o responsável existe (se fornecido)
    if (dados.responsavelId) {
      // Em um cenário real, verificaríamos se o responsável existe
      // Por enquanto, apenas validamos se foi fornecido
    }
    
    const novoProjeto: Projeto = {
      ...dados,
      id: Date.now().toString(),
      dataInicio: new Date(dados.dataInicio),
      dataFimPrevista: dados.dataFimPrevista ? new Date(dados.dataFimPrevista) : undefined,
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    projetos.push(novoProjeto);
    saveProjetos(projetos);
    return novoProjeto;
  },

  // Atualizar projeto
  async atualizarProjeto(id: string, dados: UpdateProjetoDTO): Promise<Projeto | undefined> {
    await delay(500);
    const index = projetos.findIndex(p => p.id === id);
    
    if (index === -1) return undefined;
    
    // Verificar se a empresa e o cliente existem (se fornecidos)
    if (dados.empresaId || dados.clienteId) {
      const empresaId = dados.empresaId || projetos[index].empresaId;
      const clienteId = dados.clienteId || projetos[index].clienteId;
      
      const [empresa, cliente] = await Promise.all([
        empresaService.buscarEmpresaPorId(empresaId),
        clienteService.buscarClientePorId(clienteId)
      ]);
      
      if (!empresa || !cliente) {
        throw new Error('Empresa ou cliente não encontrado');
      }
      
      // Verificar se o cliente pertence à empresa
      if (cliente.empresaId !== empresa.id) {
        throw new Error('O cliente não pertence à empresa selecionada');
      }
    }
    
    // Verificar se o responsável existe (se fornecido)
    if (dados.responsavelId) {
      // Em um cenário real, verificaríamos se o responsável existe
      // Por enquanto, apenas validamos se foi fornecido
    }
    
    const projetoAtualizado = {
      ...projetos[index],
      ...dados,
      dataInicio: dados.dataInicio ? new Date(dados.dataInicio) : projetos[index].dataInicio,
      dataFimPrevista: dados.dataFimPrevista ? new Date(dados.dataFimPrevista) : projetos[index].dataFimPrevista,
      dataFimReal: dados.dataFimReal ? new Date(dados.dataFimReal) : projetos[index].dataFimReal,
      updatedAt: new Date(),
    };
    
    projetos[index] = projetoAtualizado;
    saveProjetos(projetos);
    return projetoAtualizado;
  },

  // Excluir projeto (soft delete)
  async excluirProjeto(id: string): Promise<boolean> {
    await delay(500);
    const index = projetos.findIndex(p => p.id === id);
    
    if (index === -1) return false;
    
    // Soft delete
    projetos[index] = {
      ...projetos[index],
      ativo: false,
      updatedAt: new Date(),
    };
    
    saveProjetos(projetos);
    return true;
  },

  // Listar projetos por empresa
  async listarProjetosPorEmpresa(empresaId: string): Promise<ProjetoWithDetails[]> {
    await delay(300);
    const projetosEmpresa = projetos.filter(p => p.empresaId === empresaId && p.ativo);
    return Promise.all(projetosEmpresa.map(getProjetoWithDetails));
  },

  // Listar projetos por cliente
  async listarProjetosPorCliente(clienteId: string): Promise<ProjetoWithDetails[]> {
    await delay(300);
    const projetosCliente = projetos.filter(p => p.clienteId === clienteId && p.ativo);
    return Promise.all(projetosCliente.map(getProjetoWithDetails));
  },

  // Método para limpar dados de teste (usado em testes)
  _reset() {
    projetos = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
};

export default projetoService;
