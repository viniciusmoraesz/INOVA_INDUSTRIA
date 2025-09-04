const API_BASE_URL = 'http://localhost:8080/api';

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

// Helper function to format client data
const formatClienteData = (data) => {
  // Não incluir idCliente nos dados formatados, pois ele já está na URL
  const formattedData = {
    idEmpresa: data.idEmpresa,
    nome: data.nome,
    email: data.email,
    telefone: data.telefone ? data.telefone.replace(/\D/g, '') : null,
    cpf: data.cpf ? data.cpf.replace(/\D/g, '') : null,
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
    try {
      const formattedData = formatClienteData(clienteData);
      console.log('Enviando dados formatados para a API:', JSON.stringify(formattedData, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      console.log('Requisição enviada, aguardando resposta...');
      return await handleResponse(response);
    } catch (error) {
      console.error('Erro ao criar cliente:', {
        error: error,
        message: error.message,
        response: error.response,
        status: error.status,
        data: error.data
      });
      
      let errorMessage = 'Erro ao processar a requisição';
      if (error.status === 400) {
        errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
        if (error.data) {
          errorMessage += `\nDetalhes: ${JSON.stringify(error.data)}`;
        }
      } else if (error.status === 409) {
        errorMessage = 'Já existe um cliente cadastrado com este CPF.';
      } else if (error.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      }
      
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  },

  // List all clients
  async listarClientes() {
    try {
      console.log('Buscando lista de clientes...');
      const response = await fetch(`${API_BASE_URL}/clientes`);
      console.log('Resposta da lista de clientes recebida, status:', response.status);
      return await handleResponse(response);
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw error;
    }
  },

  // Get client by ID
  async buscarClientePorId(idCliente) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${idCliente}`);
      const data = await handleResponse(response);
      // Garante que o idCliente está presente nos dados retornados
      if (data && !data.idCliente) {
        data.idCliente = idCliente;
      }
      return data;
    } catch (error) {
      console.error(`Erro ao buscar cliente com ID ${idCliente}:`, error);
      throw error;
    }
  },

  // Update client
  async atualizarCliente(idCliente, clienteData) {
    try {
      // Remove o idCliente dos dados, pois ele já está na URL
      const { idCliente: _, ...dataWithoutId } = clienteData;
      const formattedData = formatClienteData(dataWithoutId);
      
      console.log('Atualizando cliente com dados:', formattedData);
      console.log('ID do cliente na URL:', idCliente);
      
      const response = await fetch(`${API_BASE_URL}/clientes/${idCliente}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error(`Erro ao atualizar cliente com ID ${id}:`, error);
      
      let errorMessage = 'Erro ao atualizar o cliente';
      if (error.status === 400) {
        errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
        if (error.data) {
          errorMessage += `\nDetalhes: ${JSON.stringify(error.data)}`;
        }
      }
      
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  },

  // Delete client
  async excluirCliente(idCliente) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${idCliente}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw await handleResponse(response);
      }
      // No content on successful delete
      return {}; 
    } catch (error) {
      console.error(`Erro ao excluir cliente com ID ${idCliente}:`, error);
      throw error;
    }
  },
};
