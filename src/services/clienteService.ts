import { Cliente, CreateClienteDTO, UpdateClienteDTO } from '../types/cliente';
import { empresaService } from './empresaService';

// Chave para armazenar no localStorage
const STORAGE_KEY = 'clientes_data';

// Função para carregar clientes do localStorage
const loadClientes = (): Cliente[] => {
  console.log('Carregando clientes do localStorage...');
  
  if (typeof window === 'undefined') {
    console.log('Fora do navegador, retornando array vazio');
    return [];
  }
  
  const saved = localStorage.getItem(STORAGE_KEY);
  console.log('Dados de clientes salvos no localStorage:', saved);
  
  if (saved) {
    try {
      const parsed = JSON.parse(saved, (key, value) => {
        // Converter strings de data de volta para objetos Date
        if (key === 'createdAt' || key === 'updatedAt' || key === 'dataNascimento') {
          return new Date(value);
        }
        return value;
      });
      console.log('Clientes carregados do localStorage:', parsed);
      return parsed;
    } catch (error) {
      console.error('Erro ao fazer parse dos dados de clientes do localStorage:', error);
      return [];
    }
  }
  
  // Retorna dados iniciais se não houver nada salvo
  const dadosIniciais = [
    {
      id: '1',
      nome: 'João da Silva',
      email: 'joao.silva@inovaindustria.com',
      telefone: '(11) 98765-4321',
      cpf: '123.456.789-00',
      empresaId: '1',
      cargo: 'Gerente de Projetos',
      departamento: 'TI',
      dataNascimento: new Date('1985-05-15'),
      observacoes: 'Cliente desde 2020',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  
  console.log('Usando dados iniciais de clientes:', dadosIniciais);
  return dadosIniciais;
};

// Dados iniciais
let clientes: Cliente[] = loadClientes();

// Função para salvar clientes no localStorage
const saveClientes = (data: Cliente[]) => {
  console.log('Salvando clientes no localStorage:', data);
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('Clientes salvos com sucesso no localStorage');
    } catch (error) {
      console.error('Erro ao salvar clientes no localStorage:', error);
    }
  } else {
    console.log('Fora do navegador, não é possível salvar no localStorage');
  }
};

// Simula um atraso de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const clienteService = {
  // Listar todos os clientes
  async listarClientes(): Promise<Cliente[]> {
    await delay(500);
    return [...clientes];
  },

  // Buscar cliente por ID
  async buscarClientePorId(id: string): Promise<Cliente | undefined> {
    await delay(300);
    return clientes.find(cliente => cliente.id === id);
  },

  // Criar novo cliente
  async criarCliente(dados: any): Promise<Cliente> {
    await delay(500);
    
    console.log('=== Iniciando criação de cliente ===');
    console.log('Dados recebidos para criar cliente:', dados);
    
    // Se já tiver um ID, é porque veio do formulário de cadastro
    if (dados.id) {
      const novoCliente: Cliente = {
        ...dados,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        observacoes: '',
        departamento: ''
      };
      
      console.log('Novo cliente criado:', novoCliente);
      
      // Carrega clientes existentes
      const clientesExistentes = loadClientes();
      console.log('Clientes existentes:', clientesExistentes);
      
      // Adiciona o novo cliente
      clientesExistentes.push(novoCliente);
      
      // Atualiza a lista de clientes global
      clientes = clientesExistentes;
      
      // Salva no localStorage
      saveClientes(clientesExistentes);
      console.log('Cliente salvo no localStorage');
      
      // Verifica se foi salvo corretamente
      const clientesSalvos = JSON.parse(localStorage.getItem('clientes_data') || '[]');
      console.log('Clientes após salvar:', clientesSalvos);
      
      return novoCliente;
    }
    
    // Validar dados de entrada
    if (!dados.empresaId) {
      const errorMsg = 'ID da empresa não fornecido';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    // Verificar se a empresa existe
    console.log(`Buscando empresa com ID: '${dados.empresaId}'`);
    const empresa = await empresaService.buscarEmpresaPorId(dados.empresaId);
    console.log('Empresa encontrada:', empresa ? `ID: ${empresa.id}, Nome: ${empresa.nomeFantasia}` : 'Não encontrada');
    
    if (!empresa) {
      const errorMsg = `Empresa com ID '${dados.empresaId}' não encontrada`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    // Criar novo cliente
    const novoCliente: Cliente = {
      ...dados,
      id: Date.now().toString(),
      empresaId: String(dados.empresaId), // Garantir que o ID da empresa é uma string
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    console.log('Novo cliente a ser salvo:', JSON.stringify(novoCliente, null, 2));
    
    // Adicionar à lista de clientes
    clientes.push(novoCliente);
    
    try {
      // Salvar no localStorage
      saveClientes(clientes);
      console.log(`Cliente salvo com sucesso. Total de clientes: ${clientes.length}`);
      
      // Verificar se o cliente foi salvo corretamente
      const clienteSalvo = clientes.find(c => c.id === novoCliente.id);
      console.log('Cliente salvo verificado:', clienteSalvo ? 'OK' : 'NÃO ENCONTRADO');
      
      return novoCliente;
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      throw error;
    }
  },

  // Atualizar cliente
  async atualizarCliente(id: string, dados: UpdateClienteDTO): Promise<Cliente | undefined> {
    await delay(500);
    const index = clientes.findIndex(cliente => cliente.id === id);
    
    if (index === -1) return undefined;
    
    // Se estiver atualizando a empresa, verifica se ela existe
    if (dados.empresaId) {
      const empresa = await empresaService.buscarEmpresaPorId(dados.empresaId);
      if (!empresa) {
        throw new Error('Empresa não encontrada');
      }
    }
    
    const clienteAtualizado = {
      ...clientes[index],
      ...dados,
      updatedAt: new Date(),
    };
    
    clientes[index] = clienteAtualizado;
    saveClientes(clientes);
    return clienteAtualizado;
  },

  // Excluir cliente (soft delete)
  async excluirCliente(id: string): Promise<boolean> {
    await delay(500);
    const index = clientes.findIndex(cliente => cliente.id === id);
    
    if (index === -1) return false;
    
    // Soft delete
    clientes[index] = {
      ...clientes[index],
      ativo: false,
      updatedAt: new Date(),
    };
    
    saveClientes(clientes);
    return true;
  },

  // Listar clientes ativos
  async listarClientesAtivos(): Promise<Cliente[]> {
    await delay(300);
    return clientes.filter(cliente => cliente.ativo);
  },

  // Listar clientes por empresa
  async listarClientesPorEmpresa(empresaId: string | number | undefined | null): Promise<Cliente[]> {
    await delay(300);
    
    if (!empresaId) {
      console.warn('ID da empresa não fornecido para listarClientesPorEmpresa');
      return [];
    }
    
    // Garantir que empresaId é uma string para comparação
    const empresaIdStr = String(empresaId).trim();
    
    if (!empresaIdStr) {
      console.warn('ID da empresa inválido após conversão para string');
      return [];
    }
    
    console.log(`Buscando clientes para empresa ID: '${empresaIdStr}'`);
    console.log(`Total de clientes disponíveis: ${clientes.length}`);
    
    const clientesFiltrados = clientes.filter(cliente => {
      if (!cliente) return false;
      
      const clienteEmpresaId = cliente.empresaId ? String(cliente.empresaId).trim() : '';
      const ativo = Boolean(cliente.ativo);
      const resultado = clienteEmpresaId === empresaIdStr && ativo;
      
      console.log(`Cliente ID: ${cliente.id || 'sem-id'}, ` +
                 `Empresa ID: '${clienteEmpresaId || 'vazio'}', ` +
                 `Ativo: ${ativo}, ` +
                 `Incluir: ${resultado}`);
      
      return resultado;
    });
    
    console.log(`Encontrados ${clientesFiltrados.length} clientes para a empresa ID '${empresaIdStr}'`);
    return clientesFiltrados;
  },

  // Método para limpar dados de teste (usado em testes)
  _reset() {
    clientes = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
};

export default clienteService;
