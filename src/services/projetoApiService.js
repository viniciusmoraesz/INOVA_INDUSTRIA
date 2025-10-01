const API_BASE_URL = 'http://localhost:8080';

// Helper function to handle API responses
const handleResponse = async (response) => {
  console.log('Resposta recebida:', {
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    headers: Object.fromEntries(response.headers.entries())
  });
  
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  let data = null;
  
  try {
    const responseText = await response.text();
    console.log('Conteúdo da resposta:', responseText);
    
    if (responseText && isJson) {
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Erro ao fazer parse do JSON:', e);
        throw new Error(`Resposta inválida do servidor: ${responseText.substring(0, 200)}`);
      }
    } else {
      data = responseText;
    }
  } catch (error) {
    console.error('Erro ao processar resposta do servidor:', error);
    throw new Error(`Erro ao processar resposta: ${error.message}`);
  }

  if (!response.ok) {
    const error = new Error(data.message || response.statusText || 'Erro na requisição');
    error.status = response.status;
    error.data = data;
    error.response = response;
    
    if (data.errors) {
      error.errors = data.errors;
      error.message = 'Erro de validação: ' + Object.values(data.errors).join(', ');
    }
    
    console.error('Erro na resposta da API:', {
      status: response.status,
      statusText: response.statusText,
      data: data,
      url: response.url
    });
    
    throw error;
  }

  return data;
};

// Helper function to format project data
const formatProjetoData = (data) => {
  const formattedData = {
    titulo: data.titulo, // Backend expects 'titulo'
    descricao: data.descricao || '',
    dataInicio: data.dataInicio,
    dataTerminoPrevista: data.dataTerminoPrevista || null,
    orcamento: data.orcamento || null,
    status: data.status || 'PLANEJAMENTO',
    prioridade: data.prioridade || 'MEDIA',
    idGerente: data.idGerente || null,
    idEmpresa: data.idEmpresa
  };

  // Remove null or undefined values to avoid sending them to the backend
  Object.keys(formattedData).forEach(key => {
    if (formattedData[key] === null || formattedData[key] === undefined) {
      delete formattedData[key];
    }
  });

  return formattedData;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return { 'Content-Type': 'application/json' };
    
    const user = JSON.parse(userStr);
    const token = user.token || (user.data && user.data.token);
    
    if (token) {
      console.log('Using token from storage');
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    }
  } catch (error) {
    console.error('Error getting auth headers:', error);
  }
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

const projetoApiService = {
  // Create a new project
  async criarProjeto(projetoData) {
    try {
      const formattedData = formatProjetoData(projetoData);
      console.log('🚀 Criando projeto...');
      console.log('📋 Dados originais recebidos:', JSON.stringify(projetoData, null, 2));
      console.log('📋 Dados formatados:', JSON.stringify(formattedData, null, 2));
      console.log('🔍 Verificando campo titulo:', formattedData.titulo);
      console.log('🔑 Headers de autenticação:', getAuthHeaders());
      console.log('🌐 URL da API:', `${API_BASE_URL}/projetos`);
      
      const response = await fetch(`${API_BASE_URL}/projetos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(formattedData),
      });

      console.log('📥 Resposta recebida:', response.status, response.statusText);
      return await handleResponse(response);
    } catch (error) {
      console.error('❌ Erro ao criar projeto:', error);
      console.error('❌ Tipo do erro:', error.constructor.name);
      console.error('❌ Mensagem:', error.message);
      throw error;
    }
  },

  // List all projects by company
  async listarProjetos(idEmpresa) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      let url = `${API_BASE_URL}/projetos`;
      
      console.log('projetoApiService - user:', user);
      console.log('projetoApiService - idEmpresa recebido:', idEmpresa);
      console.log('projetoApiService - user.role:', user?.role);
      
      // Only add empresa parameter for non-SUPER_ADMIN users
      if (user?.role !== 'SUPER_ADMIN') {
        // Use idEmpresa passed as parameter or fallback to user.idEmpresa
        const empresaParam = idEmpresa || user?.idEmpresa;
        if (empresaParam) {
          url += `?empresa=${empresaParam}`;
        }
      }
      
      console.log('Fazendo requisição para:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erro ao listar projetos:', error);
      throw error;
    }
  },

  // Get project by ID
  async buscarProjetoPorId(idProjeto) {
    try {
      const response = await fetch(`${API_BASE_URL}/projetos/${idProjeto}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error(`Erro ao buscar projeto com ID ${idProjeto}:`, error);
      throw error;
    }
  },

  // Update project
  async atualizarProjeto(idProjeto, projetoData) {
    try {
      const formattedData = formatProjetoData(projetoData);
      console.log('📤 Enviando dados para o backend:', formattedData);
      console.log('🔍 Verificando campo titulo:', formattedData.titulo);
      console.log('🔍 JSON que será enviado:', JSON.stringify(formattedData, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/projetos/${idProjeto}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formattedData),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error(`Erro ao atualizar projeto com ID ${idProjeto}:`, error);
      throw error;
    }
  },

  // Delete project
  async excluirProjeto(idProjeto) {
    try {
      const response = await fetch(`${API_BASE_URL}/projetos/${idProjeto}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error(`Erro ao excluir projeto com ID ${idProjeto}:`, error);
      throw error;
    }
  },

  // List projects by client ID
  async listarProjetosPorCliente(idCliente) {
    try {
      const response = await fetch(`${API_BASE_URL}/projetos/cliente/${idCliente}`, {
        method: 'GET',
        headers: await getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erro ao buscar projetos do cliente:', error);
      throw error;
    }
  },
  
  // Busca um projeto completo com todas as suas atividades e subatividades
  async buscarProjetoCompleto(idProjeto) {
    try {
      console.log(`Buscando projeto completo com ID: ${idProjeto}`);
      const response = await fetch(`${API_BASE_URL}/projetos/${idProjeto}/completo`, {
        method: 'GET',
        headers: await getAuthHeaders()
      });
      
      const data = await handleResponse(response);
      console.log('Projeto completo recebido:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar projeto completo:', error);
      throw error;
    }
  },
};

export default projetoApiService;
