const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  let data = null;
  
  try {
    data = isJson ? await response.json() : await response.text();
  } catch (error) {
    console.error('Erro ao processar resposta do servidor:', error);
    throw new Error('Não foi possível processar a resposta do servidor');
  }

  if (!response.ok) {
    // Create a more detailed error object
    const error = new Error(data.message || response.statusText || 'Erro na requisição');
    error.status = response.status;
    error.data = data;
    error.response = response;
    
    // Add validation errors if they exist
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

// Helper function to format request data
const formatEmpresaData = (data) => {
  // Only include fields that exist in the backend DTO
  const formattedData = {
    cnpj: data.cnpj.replace(/\D/g, ''),
    razaoSocial: data.razaoSocial,
    nomeFantasia: data.nomeFantasia || null,
    email: data.email || null,
    telefone: data.telefone ? data.telefone.replace(/\D/g, '') : null,
    endereco: data.endereco || null,
    cidade: data.cidade || null,
    estado: data.estado || null,
    cep: data.cep ? data.cep.replace(/\D/g, '') : null
    // Removed 'numero', 'complemento', 'bairro', 'quantidadeFuncionarios', 'setorAtuacao', and 'dataCadastro' fields
  };

  // Remove null or undefined values to avoid sending them to the backend
  Object.keys(formattedData).forEach(key => {
    if (formattedData[key] === null || formattedData[key] === undefined) {
      delete formattedData[key];
    }
  });

  return formattedData;
};

export const empresaApiService = {
  // Create a new company
  async criarEmpresa(empresaData) {
    try {
      const formattedData = formatEmpresaData(empresaData);
      console.log('Enviando dados formatados para a API:', formattedData);
      
      const response = await fetch(`${API_BASE_URL}/empresas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const novaEmpresa = await handleResponse(response);
      
      // Map the response to ensure consistent field names
      return {
        ...novaEmpresa,
        dataFundacao: novaEmpresa.dataCadastro
      };
    } catch (error) {
      console.error('Erro ao criar empresa:', {
        error: error,
        message: error.message,
        response: error.response,
        status: error.status,
        data: error.data
      });
      
      // Create a more descriptive error message
      let errorMessage = 'Erro ao processar a requisição';
      
      if (error.status === 400) {
        errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
        if (error.data) {
          errorMessage += `\nDetalhes: ${JSON.stringify(error.data)}`;
        }
      } else if (error.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      }
      
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  },

  // List all companies (only active ones by default)
  async listarEmpresas() {
    try {
      const response = await fetch(`${API_BASE_URL}/empresas`);
      const empresas = await handleResponse(response);
      
      // Map the response to ensure consistent field names
      return empresas.map(empresa => ({
        ...empresa,
        // Map dataCadastro to dataFundacao for the frontend if needed
        dataFundacao: empresa.dataCadastro
      }));
    } catch (error) {
      console.error('Erro ao listar empresas:', error);
      throw error;
    }
  },

  // Get company by ID
  async buscarEmpresaPorId(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/empresas/${id}`);
      const empresa = await handleResponse(response);
      
      // Map the response to ensure consistent field names
      return {
        ...empresa,
        // Map dataCadastro to dataFundacao for the frontend if needed
        dataFundacao: empresa.dataCadastro
      };
    } catch (error) {
      console.error(`Erro ao buscar empresa com ID ${id}:`, error);
      throw error;
    }
  },

  // Update company
  async atualizarEmpresa(id, empresaData) {
    try {
      const formattedData = formatEmpresaData(empresaData);
      console.log('Atualizando empresa com dados:', formattedData);
      
      const response = await fetch(`${API_BASE_URL}/empresas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const updatedEmpresa = await handleResponse(response);
      
      // Map the response to ensure consistent field names
      return {
        ...updatedEmpresa,
        dataFundacao: updatedEmpresa.dataCadastro
      };
    } catch (error) {
      console.error(`Erro ao atualizar empresa com ID ${id}:`, error);
      
      // Create a more descriptive error message
      let errorMessage = 'Erro ao atualizar a empresa';
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

  // Delete company (hard delete)
  async excluirEmpresa(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/empresas/${id}/hard`, {
        method: 'DELETE',
      });

      // For hard delete, we typically don't expect any data back
      // Just check if the operation was successful
      if (!response.ok) {
        throw new Error('Falha ao excluir a empresa permanentemente');
      }
      
      return { success: true, message: 'Empresa excluída permanentemente com sucesso' };
    } catch (error) {
      console.error(`Erro ao excluir empresa com ID ${id}:`, error);
      
      // Create a more descriptive error message
      let errorMessage = 'Erro ao excluir a empresa';
      if (error.status === 404) {
        errorMessage = 'Empresa não encontrada';
      } else if (error.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      }
      
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  },
};

export default empresaApiService;
