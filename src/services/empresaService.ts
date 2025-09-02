import { Empresa, CreateEmpresaDTO, UpdateEmpresaDTO } from '../types/empresa';

// Chave para armazenar no localStorage
const STORAGE_KEY = 'empresas_data';

// Função para carregar empresas do localStorage
const loadEmpresas = (): Empresa[] => {
  console.log('Carregando empresas do localStorage...');
  
  if (typeof window === 'undefined') {
    console.log('Fora do navegador, retornando array vazio');
    return [];
  }
  
  const saved = localStorage.getItem(STORAGE_KEY);
  console.log('Dados salvos no localStorage:', saved);
  
  if (saved) {
    try {
      const parsed = JSON.parse(saved, (key, value) => {
        // Converter strings de data de volta para objetos Date
        if (key === 'createdAt' || key === 'updatedAt' || key === 'dataFundacao') {
          return new Date(value);
        }
        return value;
      });
      console.log('Empresas carregadas do localStorage:', parsed);
      return parsed;
    } catch (error) {
      console.error('Erro ao fazer parse dos dados do localStorage:', error);
      return [];
    }
  }
  
  // Retorna dados iniciais se não houver nada salvo
  const dadosIniciais = [
    {
      id: '1',
      cnpj: '12.345.678/0001-90',
      razaoSocial: 'Inova Indústria LTDA',
      nomeFantasia: 'Inova Indústria',
      email: 'contato@inovaindustria.com.br',
      telefone: '(11) 99999-9999',
      cep: '04538-132',
      endereco: 'Av. Paulista',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      quantidadeFuncionarios: 150,
      setorAtuacao: 'Tecnologia',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  
  console.log('Usando dados iniciais:', dadosIniciais);
  return dadosIniciais;
};

// Dados iniciais
let empresas: Empresa[] = loadEmpresas();

// Função para salvar empresas no localStorage
const saveEmpresas = (data: Empresa[]) => {
  console.log('Salvando empresas no localStorage:', data);
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('Empresas salvas com sucesso no localStorage');
    } catch (error) {
      console.error('Erro ao salvar empresas no localStorage:', error);
    }
  } else {
    console.log('Fora do navegador, não é possível salvar no localStorage');
  }
};

// Simula um atraso de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const empresaService = {
  // Listar todas as empresas
  async listarEmpresas(): Promise<Empresa[]> {
    await delay(500); // Simula tempo de resposta da API
    console.log('Listando todas as empresas:', empresas);
    return [...empresas];
  },

  // Buscar empresa por ID
  async buscarEmpresaPorId(id: string | number | undefined | null): Promise<Empresa | undefined> {
    await delay(300);
    
    if (!id) {
      console.warn('ID não fornecido para buscarEmpresaPorId');
      return undefined;
    }
    
    const idStr = String(id).trim();
    console.log(`Buscando empresa com ID: '${idStr}'`);
    console.log(`Total de empresas disponíveis: ${empresas.length}`);
    
    const empresaEncontrada = empresas.find(empresa => {
      const empresaId = empresa?.id ? String(empresa.id).trim() : '';
      const resultado = empresaId === idStr;
      console.log(`Comparando ID buscado: '${idStr}' com ID da empresa: '${empresaId}' -> ${resultado ? 'MATCH' : 'não'}`);
      return resultado;
    });
    
    console.log(`Empresa ${empresaEncontrada ? 'encontrada' : 'não encontrada'}`);
    return empresaEncontrada;
  },

  // Criar nova empresa
  async criarEmpresa(dados: CreateEmpresaDTO): Promise<Empresa> {
    await delay(500);
    const novaEmpresa: Empresa = {
      ...dados,
      id: Date.now().toString(),
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    empresas.push(novaEmpresa);
    saveEmpresas(empresas);
    return novaEmpresa;
  },

  // Atualizar empresa
  async atualizarEmpresa(id: string, dados: UpdateEmpresaDTO): Promise<Empresa | undefined> {
    await delay(500);
    const index = empresas.findIndex(empresa => empresa.id === id);
    
    if (index === -1) return undefined;
    
    const empresaAtualizada = {
      ...empresas[index],
      ...dados,
      updatedAt: new Date(),
    };
    
    empresas[index] = empresaAtualizada;
    saveEmpresas(empresas);
    return empresaAtualizada;
  },

  // Excluir empresa (soft delete)
  async excluirEmpresa(id: string): Promise<boolean> {
    await delay(500);
    const index = empresas.findIndex(empresa => empresa.id === id);
    
    if (index === -1) return false;
    
    // Soft delete
    empresas[index] = {
      ...empresas[index],
      ativo: false,
      updatedAt: new Date(),
    };
    
    saveEmpresas(empresas);
    return true;
  },

  // Listar empresas ativas
  async listarEmpresasAtivas(): Promise<Empresa[]> {
    await delay(300);
    const empresasAtivas = empresas.filter(empresa => empresa.ativo);
    console.log('Empresas ativas:', empresasAtivas);
    return empresasAtivas;
  },

  // Método para limpar dados de teste (usado em testes)
  _reset() {
    empresas = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
};

export default empresaService;
