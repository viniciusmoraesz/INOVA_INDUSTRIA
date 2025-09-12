const API_BASE_URL = 'http://localhost:8080';

// Função para obter headers de autorização
const getAuthHeaders = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:5173'
      };
    }
    
    const user = JSON.parse(userStr);
    const token = user.token || (user.data && user.data.token);
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'http://localhost:5173'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  } catch (error) {
    console.error('Error getting auth headers:', error);
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'http://localhost:5173'
    };
  }
};

// Configuração padrão para todas as requisições
const defaultOptions = {
  credentials: 'include',  // Importante para CORS com credenciais
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': 'http://localhost:5173'
  }
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  // Para respostas vazias (como 204 No Content)
  if (response.status === 204) {
    return null;
  }
  
  let data = null;
  
  try {
    const responseText = await response.text();
    
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
    console.error('Erro na resposta da API:', {
      status: response.status,
      statusText: response.statusText,
      data: data,
      url: response.url
    });
    
    // Extract error message from response
    let errorMessage = 'Erro na requisição';
    if (data && typeof data === 'object') {
      if (data.error) {
        errorMessage = data.error;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.details) {
        errorMessage = data.details;
      }
    } else if (typeof data === 'string') {
      errorMessage = data;
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    error.response = response;
    
    throw error;
  }

  return data;
};

// Helper function to format client data
const formatClienteData = (data) => {
  const formattedData = {
    idEmpresa: data.idEmpresa,
    nome: data.nome,
    email: data.email,
    telefone: data.telefone, // Já formatado no componente
    cpf: data.cpf, // Já formatado no componente
    dataNascimento: data.dataNascimento,
    cargo: data.cargo,
    departamento: data.departamento,
    role: data.role,
    senha: data.senha
  };

  // Remove null or undefined values to avoid sending them to the backend
  Object.keys(formattedData).forEach(key => {
    if (formattedData[key] === null || formattedData[key] === undefined) {
      delete formattedData[key];
    }
  });

  return formattedData;
};

export const clienteApiService = {
  // Create a new client
  async criarCliente(clienteData) {
    const formattedData = formatClienteData(clienteData);
    
    console.log(`[API] Criando cliente - dados originais:`, clienteData);
    console.log(`[API] Criando cliente - dados formatados:`, formattedData);
    console.log(`[API] URL: ${API_BASE_URL}/clientes`);
    
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      ...defaultOptions,
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(formattedData)
    });
    
    return handleResponse(response);
  },

  // List all clients
  async listarClientes() {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      ...defaultOptions,
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  // Get client by ID
  async buscarClientePorId(idCliente) {
    const response = await fetch(`${API_BASE_URL}/clientes/${idCliente}`, {
      ...defaultOptions,
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  // Update client
  async atualizarCliente(idCliente, clienteData) {
    console.log('🔄 Atualizando cliente:', { idCliente, clienteData });
    
    const { idCliente: _, ...dataWithoutId } = clienteData;
    const formattedData = formatClienteData(dataWithoutId);
    
    console.log('📤 Dados formatados para envio:', formattedData);
    
    const response = await fetch(`${API_BASE_URL}/clientes/${idCliente}`, {
      ...defaultOptions,
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(formattedData)
    });
    
    console.log('📥 Resposta da API:', { 
      status: response.status, 
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    // Handle empty or successful responses gracefully
    if (response.ok) {
      try {
        const responseText = await response.text();
        console.log('📄 Texto da resposta:', responseText);
        
        if (!responseText || responseText.trim() === '') {
          console.log('✅ Resposta vazia - usando dados enviados como fallback');
          return { ...formattedData, idCliente };
        }
        
        const data = JSON.parse(responseText);
        console.log(' Dados parseados com sucesso:', data);
        return data;
      } catch (parseError) {
        console.log('⚠️ Erro ao fazer parse da resposta de sucesso:', parseError.message);
        return { ...formattedData, idCliente };
      }
    }
    
    // Handle error responses
    let errorData;
    try {
      const responseText = await response.text();
      console.log('📄 Texto completo da resposta de erro:', responseText);
      
      // Tenta fazer parse como JSON se possível
      if (responseText.trim()) {
        try {
          errorData = JSON.parse(responseText);
          console.log('📋 Dados de erro parseados como JSON:', errorData);
        } catch (parseError) {
          console.log('⚠️ Não foi possível fazer parse JSON, mantendo como texto:', responseText);
          errorData = responseText;
        }
      } else {
        console.log('⚠️ Resposta vazia do servidor');
        errorData = 'Resposta vazia do servidor';
      }
    } catch (textError) {
      console.log('⚠️ Erro ao ler resposta de erro:', textError.message);
      errorData = 'Erro ao ler resposta do servidor';
    }
    
    let errorMessage = `Erro ao atualizar cliente`;
    if (errorData && typeof errorData === 'object') {
      if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.details) {
        errorMessage = errorData.details;
      }
    } else if (typeof errorData === 'string') {
      errorMessage = errorData;
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = errorData;
    error.response = response;
    
    throw error;
  },

  // Delete client
  async removerCliente(idCliente) {
    const response = await fetch(`${API_BASE_URL}/clientes/${idCliente}`, {
      ...defaultOptions,
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  // Alias para compatibilidade
  async excluirCliente(idCliente) {
    return this.removerCliente(idCliente);
  }
};
