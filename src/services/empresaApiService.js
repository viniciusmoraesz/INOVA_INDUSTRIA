const API_BASE_URL = 'http://localhost:8080';

// Helper function to get authentication headers
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
    
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:5173'
      };
    }
  } catch (error) {
    console.error('Error getting auth headers:', error);
  }
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': 'http://localhost:5173'
  };
};

// Configuração padrão para todas as requisições
const defaultOptions = {
  credentials: 'include',  // Importante para CORS com credenciais
  headers: getAuthHeaders()
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  // Para respostas vazias (como 204 No Content)
  if (response.status === 204) {
    return null;
  }
  if (!response.ok) {
    let errorData = {};
    try {
      errorData = isJson ? await response.json() : { message: await response.text() };
    } catch (e) {
      console.error('Failed to parse error response:', e);
      errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
    }
    
    const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    error.status = response.status;
    error.data = errorData;
    error.url = response.url;
    
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      errorData
    });
    
    throw error;
  }
  
  try {
    return isJson ? await response.json() : await response.text();
  } catch (e) {
    console.error('Failed to parse success response:', e);
    throw new Error('Erro ao processar a resposta do servidor');
  }
};

/**
 * Formata um CNPJ para o formato 99.999.999/9999-99
 * @param {string} cnpj - CNPJ a ser formatado (apenas números)
 * @returns {string} CNPJ formatado
 */
const formatCNPJ = (cnpj) => {
  if (!cnpj) return '';
  
  // Remove caracteres não numéricos
  const numericCNPJ = String(cnpj).replace(/\D/g, '');
  
  // Aplica a formatação se tiver 14 dígitos
  if (numericCNPJ.length === 14) {
    return numericCNPJ.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }
  
  // Retorna o CNPJ sem formatação se não tiver 14 dígitos
  return cnpj;
};

/**
 * Formata os dados da empresa para o formato esperado pela API
 * @param {Object} data - Dados da empresa a serem formatados
 * @returns {Object} Dados formatados e validados
 */
const formatEmpresaData = (data) => {
  console.log('[API] Formatando dados da empresa:', JSON.stringify(data, null, 2));
  
  // Validações iniciais
  if (!data) {
    throw new Error('Dados da empresa não fornecidos');
  }
  
  // Cria um objeto com os dados formatados
  const formattedData = {
    // Campos obrigatórios
    cnpj: data.cnpj ? String(data.cnpj).replace(/\D/g, '') : '',
    razaoSocial: data.razaoSocial ? String(data.razaoSocial).trim() : '',
    
    // Campos opcionais com tratamento
    nomeFantasia: data.nomeFantasia ? String(data.nomeFantasia).trim() : null,
    email: data.email ? String(data.email).trim() : null,
    telefone: data.telefone ? String(data.telefone).replace(/\D/g, '') : null,
    endereco: data.endereco ? String(data.endereco).trim() : null,
    numero: data.numero ? String(data.numero).trim() : null,
    complemento: data.complemento ? String(data.complemento).trim() : null,
    bairro: data.bairro ? String(data.bairro).trim() : null,
    cidade: data.cidade ? String(data.cidade).trim() : null,
    estado: data.estado ? String(data.estado).trim() : null,
    cep: data.cep ? String(data.cep).replace(/\D/g, '') : null,
    inscricaoEstadual: data.inscricaoEstadual ? String(data.inscricaoEstadual).replace(/\D/g, '') : null,
    inscricaoMunicipal: data.inscricaoMunicipal ? String(data.inscricaoMunicipal).replace(/\D/g, '') : null,
    
    // Campos numéricos com valor padrão
    quantidadeFuncionarios: data.quantidadeFuncionarios ? 
      parseInt(data.quantidadeFuncionarios, 10) : 0,
      
    // Outros campos
    setorAtuacao: data.setorAtuacao ? String(data.setorAtuacao).trim() : null,
    dataFundacao: data.dataFundacao || null
  };
  
  // Validações de campos obrigatórios
  const camposObrigatorios = ['cnpj', 'razaoSocial'];
  const camposFaltantes = camposObrigatorios.filter(campo => !formattedData[campo]);
  
  if (camposFaltantes.length > 0) {
    const erro = new Error(`Campos obrigatórios não preenchidos: ${camposFaltantes.join(', ')}`);
    erro.camposFaltantes = camposFaltantes;
    throw erro;
  }
  
  // Validação de CNPJ (se fornecido)
  if (formattedData.cnpj && formattedData.cnpj.length !== 14) {
    console.warn(`[API] CNPJ com formato inválido: ${formattedData.cnpj}`);
    // Não lançamos erro aqui, pois a validação completa será feita no backend
  }
  
  // Remove campos com valores vazios, null ou undefined para não enviar ao backend
  Object.keys(formattedData).forEach(key => {
    if (formattedData[key] === null || 
        formattedData[key] === undefined || 
        formattedData[key] === '') {
      delete formattedData[key];
    }
  });
  
  console.log('[API] Dados formatados para envio:', JSON.stringify(formattedData, null, 2));

  return formattedData;
};

const empresaApiService = {
  // Cria uma nova empresa
  async criarEmpresa(empresaData) {
    try {
      console.log('[API] Iniciando criação de nova empresa');
      console.log('[API] Dados recebidos para criação:', JSON.stringify(empresaData, null, 2));
      
      // Formata os dados da empresa
      const formattedData = formatEmpresaData(empresaData);
      
      console.log('[API] Enviando requisição para API...');
      const response = await fetch(`${API_BASE_URL}/empresas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include', // Importante para CORS com credenciais
        body: JSON.stringify(formattedData),
      });

      console.log(`[API] Resposta da criação (status ${response.status}):`, response);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[API] Erro na resposta da API (${response.status}):`, errorData);
        
        let errorMessage = 'Erro ao criar a empresa';
        
        if (response.status === 400) {
          errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
          if (errorData.errors) {
            errorMessage += '\n' + Object.values(errorData.errors).join('\n');
          } else if (errorData.message) {
            errorMessage += `\n${errorData.message}`;
          }
        } else if (response.status === 409) {
          const cnpj = empresaData.cnpj ? formatCNPJ(empresaData.cnpj) : 'não informado';
          errorMessage = `Já existe uma empresa cadastrada com o CNPJ ${cnpj}.`;
        } else if (response.status === 500) {
          errorMessage = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
        }
        
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }
      
      const novaEmpresa = await response.json();
      console.log('[API] Empresa criada com sucesso:', JSON.stringify(novaEmpresa, null, 2));
      
      // Mapeia a resposta para garantir nomes de campos consistentes
      const resultado = {
        ...novaEmpresa,
        dataFundacao: novaEmpresa.dataFundacao || novaEmpresa.dataCadastro || null,
        inscricaoEstadual: novaEmpresa.inscricaoEstadual || null,
        inscricaoMunicipal: novaEmpresa.inscricaoMunicipal || null,
        numero: novaEmpresa.numero || null,
        complemento: novaEmpresa.complemento || null,
        bairro: novaEmpresa.bairro || null,
        quantidadeFuncionarios: novaEmpresa.quantidadeFuncionarios || 0,
        setorAtuacao: novaEmpresa.setorAtuacao || null,
        // Garante que campos obrigatórios tenham valores padrão
        razaoSocial: novaEmpresa.razaoSocial || '',
        nomeFantasia: novaEmpresa.nomeFantasia || '',
        email: novaEmpresa.email || '',
        telefone: novaEmpresa.telefone || '',
        cep: novaEmpresa.cep || '',
        endereco: novaEmpresa.endereco || '',
        cidade: novaEmpresa.cidade || '',
        estado: novaEmpresa.estado || '',
        cnpj: novaEmpresa.cnpj || ''
      };
      
      console.log('[API] Dados mapeados da empresa criada:', JSON.stringify(resultado, null, 2));
      return resultado;
      
    } catch (error) {
      console.error('[API] Erro detalhado ao criar empresa:', {
        message: error.message,
        status: error.status,
        data: error.data,
        stack: error.stack
      });
      
      const enhancedError = new Error(error.message || 'Erro ao criar a empresa');
      enhancedError.status = error.status;
      enhancedError.data = error.data;
      enhancedError.originalError = error;
      
      throw enhancedError;
    }
  },

  // Lista todas as empresas ativas
  async listarEmpresas() {
    console.log('[API] Iniciando listagem de empresas');
    const startTime = Date.now();
    
    try {
      console.log(`[API] Fazendo requisição para: ${API_BASE_URL}/empresas`);
      
      const response = await fetch(`${API_BASE_URL}/empresas`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
        mode: 'cors',
        cache: 'no-cache' // Evita cache indesejado
      });
      
      const responseTime = Date.now() - startTime;
      console.log(`[API] Resposta recebida em ${responseTime}ms, status:`, response.status);
      
      // Processa o corpo da resposta como texto primeiro
      const responseText = await response.text();
      let responseData;
      
      try {
        // Tenta fazer o parse do JSON apenas se houver conteúdo
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch (e) {
        console.error('[API] Erro ao fazer parse da resposta JSON:', e);
        console.error('[API] Conteúdo da resposta:', responseText);
        
        const error = new Error('Resposta do servidor em formato inválido');
        error.status = response.status;
        error.responseText = responseText;
        throw error;
      }
      
      // Verifica se a requisição foi bem-sucedida
      if (!response.ok) {
        console.error('[API] Erro na resposta da API:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          data: responseData
        });
        
        let errorMessage = 'Erro ao listar as empresas';
        
        // Mensagens de erro específicas por status HTTP
        if (response.status === 401) {
          errorMessage = 'Não autorizado. Por favor, faça login novamente.';
        } else if (response.status === 403) {
          errorMessage = 'Acesso negado. Você não tem permissão para listar empresas.';
        } else if (response.status === 500) {
          errorMessage = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
        }
        
        // Tenta obter uma mensagem de erro mais específica da resposta
        if (responseData) {
          if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.error) {
            errorMessage = responseData.error;
          } else if (responseData.errors) {
            errorMessage = Object.values(responseData.errors).join('\n');
          }
        }
        
        const error = new Error(errorMessage);
        error.status = response.status;
        error.responseData = responseData;
        throw error;
      }
      
      // Processa a lista de empresas
      const empresas = Array.isArray(responseData) ? responseData : [];
      console.log(`[API] ${empresas.length} empresas encontradas`);
      
      // Mapeia a resposta para garantir nomes de campos consistentes e valores padrão
      const empresasMapeadas = empresas.map((empresa, index) => {
        console.log(`[API] Mapeando empresa ${index}:`, empresa);
        console.log(`[API] ID da empresa ${index}:`, empresa.id, typeof empresa.id);
        
        return {
          id: empresa.id || empresa.idEmpresa || empresa.ID,
        cnpj: empresa.cnpj || '',
        razaoSocial: empresa.razaoSocial || '',
        nomeFantasia: empresa.nomeFantasia || null,
        email: empresa.email || null,
        telefone: empresa.telefone || null,
        endereco: empresa.endereco || null,
        numero: empresa.numero || null,
        complemento: empresa.complemento || null,
        bairro: empresa.bairro || null,
        cidade: empresa.cidade || null,
        estado: empresa.estado || null,
        cep: empresa.cep || null,
        inscricaoEstadual: empresa.inscricaoEstadual || null,
        inscricaoMunicipal: empresa.inscricaoMunicipal || null,
        quantidadeFuncionarios: empresa.quantidadeFuncionarios || 0,
        setorAtuacao: empresa.setorAtuacao || null,
        dataFundacao: empresa.dataFundacao || empresa.dataCadastro || null,
        ativo: empresa.ativo !== undefined ? empresa.ativo : true,
        dataCadastro: empresa.dataCadastro || null,
        dataAtualizacao: empresa.dataAtualizacao || null
        };
      });
      
      // Retorna as empresas mapeadas
      return empresasMapeadas;
      
    } catch (error) {
      // Cria um objeto de erro seguro para log que não causa problemas de serialização
      const safeError = {
        message: error.message || 'Erro desconhecido',
        status: error.status || 'N/A',
        name: error.name || 'Error',
        // Converte o responseData para string para evitar problemas de serialização
        responseData: error.responseData ? 
          (typeof error.responseData === 'string' ? error.responseData : JSON.stringify(error.responseData, null, 2)) : 
          'Nenhum dado de resposta',
        // Pega apenas as primeiras linhas do stack trace para evitar logs muito grandes
        stack: error.stack ? error.stack.split('\n').slice(0, 5).join('\n') : 'Sem stack trace'
      };
      
      console.error('Erro detalhado ao listar empresas:', safeError);
      
      // Se for um erro de rede, mostra mensagem mais amigável
      if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
        const networkError = new Error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
        networkError.isNetworkError = true;
        networkError.originalError = safeError;
        throw networkError;
      }
      
      // Se for um erro 500, mostra mensagem mais amigável
      if (error.status === 500 || error.status >= 500) {
        const serverError = new Error('Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.');
        serverError.isServerError = true;
        serverError.originalError = safeError;
        throw serverError;
      }
      
      // Se for um erro 4xx, mantém a mensagem original
      if (error.status >= 400 && error.status < 500) {
        const clientError = new Error(error.message || 'Erro na requisição');
        clientError.status = error.status;
        clientError.originalError = safeError;
        throw clientError;
      }
      
      // Repassa o erro original se não for um dos casos acima
      const genericError = new Error(error.message || 'Ocorreu um erro inesperado');
      genericError.originalError = safeError;
      throw genericError;
    }
  },

  // Busca uma empresa pelo ID
  async buscarEmpresaPorId(id) {
    console.log(`[API] Iniciando busca da empresa ID: ${id}`);
    const startTime = Date.now();
    
    try {
      if (!id) {
        throw new Error('ID da empresa não fornecido');
      }
      
      console.log(`[API] Fazendo requisição para: ${API_BASE_URL}/empresas/${id}`);
      
      const response = await fetch(`${API_BASE_URL}/empresas/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
        cache: 'no-store' // Evita cache para garantir dados atualizados
      });
      
      const responseTime = Date.now() - startTime;
      console.log(`[API] Resposta recebida em ${responseTime}ms, status:`, response.status);
      
      // Processa o corpo da resposta como texto primeiro
      const responseText = await response.text();
      let responseData;
      
      try {
        // Tenta fazer o parse do JSON apenas se houver conteúdo
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch (e) {
        console.error('[API] Erro ao fazer parse da resposta JSON:', e);
        console.error('[API] Conteúdo da resposta:', responseText);
        
        const error = new Error('Resposta do servidor em formato inválido');
        error.status = response.status;
        error.responseText = responseText;
        throw error;
      }
      
      // Verifica se a requisição foi bem-sucedida
      if (!response.ok) {
        console.error('[API] Erro na resposta da API:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          data: responseData
        });
        
        let errorMessage = `Erro ao buscar a empresa ID ${id}`;
        
        // Mensagens de erro específicas por status HTTP
        if (response.status === 400) {
          errorMessage = 'Requisição inválida. Verifique o ID da empresa.';
        } else if (response.status === 401) {
          errorMessage = 'Não autorizado. Por favor, faça login novamente.';
        } else if (response.status === 403) {
          errorMessage = 'Acesso negado. Você não tem permissão para visualizar esta empresa.';
        } else if (response.status === 404) {
          errorMessage = `Empresa com ID ${id} não encontrada.`;
        } else if (response.status === 500) {
          errorMessage = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
        }
        
        // Tenta obter uma mensagem de erro mais específica da resposta
        if (responseData) {
          if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.error) {
            errorMessage = responseData.error;
          } else if (responseData.errors) {
            errorMessage = Object.values(responseData.errors).join('\n');
          }
        }
        
        const error = new Error(errorMessage);
        error.status = response.status;
        error.responseData = responseData;
        throw error;
      }
      
      // Se não houver dados, retorna null
      if (!responseData) {
        console.log(`[API] Nenhum dado retornado para a empresa ID ${id}`);
        return null;
      }
      
      console.log(`[API] Dados brutos da empresa ID ${id}:`, JSON.stringify(responseData, null, 2));
      
      // Função auxiliar para validar e formatar datas
      const parseSafeDate = (dateString) => {
        if (!dateString) return null;
        try {
          // Tenta converter para data
          const date = new Date(dateString);
          // Verifica se a data é válida
          if (isNaN(date.getTime())) {
            console.warn(`[API] Data inválida recebida: ${dateString}`);
            return null;
          }
          return date.toISOString(); // Retorna no formato ISO 8601
        } catch (e) {
          console.warn(`[API] Erro ao processar data ${dateString}:`, e);
          return null;
        }
      };

      // Mapeia a resposta para garantir nomes de campos consistentes e valores padrão
      const empresaMapeada = {
        id: responseData.id,
        cnpj: responseData.cnpj || '',
        razaoSocial: responseData.razaoSocial || '',
        nomeFantasia: responseData.nomeFantasia || null,
        email: responseData.email || null,
        telefone: responseData.telefone || null,
        endereco: responseData.endereco || null,
        numero: responseData.numero || null,
        complemento: responseData.complemento || null,
        bairro: responseData.bairro || null,
        cidade: responseData.cidade || null,
        estado: responseData.estado || null,
        cep: responseData.cep || null,
        inscricaoEstadual: responseData.inscricaoEstadual || null,
        inscricaoMunicipal: responseData.inscricaoMunicipal || null,
        quantidadeFuncionarios: responseData.quantidadeFuncionarios || 0,
        setorAtuacao: responseData.setorAtuacao || null,
        // Usa a função parseSafeDate para processar as datas
        dataFundacao: parseSafeDate(responseData.dataFundacao) || parseSafeDate(responseData.dataCadastro) || null,
        ativo: responseData.ativo !== undefined ? responseData.ativo : true,
        dataCadastro: parseSafeDate(responseData.dataCadastro) || null,
        dataAtualizacao: parseSafeDate(responseData.dataAtualizacao) || null
      };
      
      console.log(`[API] Dados mapeados da empresa ID ${id}:`, JSON.stringify(empresaMapeada, null, 2));
      
      return empresaMapeada;
      
    } catch (error) {
      console.error('[API] Erro detalhado ao buscar empresa:', {
        message: error.message,
        status: error.status,
        url: error.url,
        data: error.data,
        stack: error.stack
      });
      
      // Cria um objeto de erro seguro para log que não causa problemas de serialização
      const safeError = {
        message: error.message || 'Erro desconhecido ao buscar empresa',
        status: error.status || 'N/A',
        name: error.name,
        // Converte o responseData para string para evitar problemas de serialização
        responseData: error.responseData ? 
          (typeof error.responseData === 'string' ? error.responseData : JSON.stringify(error.responseData, null, 2)) : 
          'Nenhum dado de resposta',
        // Pega apenas as primeiras linhas do stack trace para evitar logs muito grandes
        stack: error.stack ? error.stack.split('\n').slice(0, 5).join('\n') : 'Sem stack trace'
      };
      
      console.error('[API] Erro detalhado ao buscar empresa:', safeError);
      
      // Se for um erro de rede, mostra mensagem mais amigável
      if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
        const networkError = new Error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
        networkError.isNetworkError = true;
        networkError.originalError = safeError;
        throw networkError;
      }
      
      // Se for um erro 500, mostra mensagem mais amigável
      if (error.status === 500 || error.status >= 500) {
        const serverError = new Error('Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.');
        serverError.isServerError = true;
        serverError.originalError = safeError;
        throw serverError;
      }
      
      // Se for um erro 4xx, mantém a mensagem original
      if (error.status >= 400 && error.status < 500) {
        const clientError = new Error(error.message || 'Erro na requisição');
        clientError.status = error.status;
        clientError.originalError = safeError;
        throw clientError;
      }
      
      // Repassa o erro original se não for um dos casos acima
      const genericError = new Error(error.message || 'Ocorreu um erro inesperado ao buscar a empresa');
      genericError.originalError = safeError;
      throw genericError;
    }
  },

  // Atualiza uma empresa existente
  atualizarEmpresa: async (id, empresaData) => {
    try {
      console.log(`[API] Iniciando atualização da empresa ID: ${id}`);
      console.log('[API] Dados recebidos para atualização:', JSON.stringify(empresaData, null, 2));
      
      const formattedData = formatEmpresaData(empresaData);
      console.log('[API] Dados formatados para envio:', JSON.stringify(formattedData, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/empresas/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include', // Importante para CORS com credenciais
        body: JSON.stringify(formattedData),
      });

      console.log(`[API] Resposta da atualização (status ${response.status}):`, response);
      
      if (!response.ok) {
        let errorData = {};
        try {
          const responseText = await response.text();
          errorData = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
          console.warn('[API] Erro ao fazer parse da resposta de erro:', e);
          errorData = {};
        }
        console.error(`[API] Erro na resposta da API (${response.status}):`, errorData);
        
        let errorMessage = 'Erro ao atualizar a empresa';
        if (response.status === 400) {
          errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
          if (errorData.errors) {
            errorMessage += '\n' + Object.values(errorData.errors).join('\n');
          } else if (errorData.message) {
            errorMessage += `\n${errorData.message}`;
          }
        } else if (response.status === 404) {
          errorMessage = 'Empresa não encontrada. Verifique se o ID está correto.';
        } else if (response.status === 409) {
          errorMessage = 'Conflito ao atualizar a empresa. Os dados podem ter sido modificados por outro usuário.';
        }
        
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }
      
      // Trata resposta de sucesso que pode estar vazia
      let empresaAtualizada = {};
      try {
        const responseText = await response.text();
        if (responseText) {
          empresaAtualizada = JSON.parse(responseText);
        } else {
          // Se não há resposta, assume que a atualização foi bem-sucedida
          // e usa os dados enviados como base
          empresaAtualizada = { id, ...formattedData };
        }
      } catch (e) {
        console.warn('[API] Erro ao fazer parse da resposta de sucesso, usando dados enviados:', e);
        empresaAtualizada = { id, ...formattedData };
      }
      
      console.log('[API] Empresa atualizada com sucesso:', JSON.stringify(empresaAtualizada, null, 2));
      
      // Mapeia a resposta para garantir nomes de campos consistentes
      const resultado = {
        ...empresaAtualizada,
        dataFundacao: empresaAtualizada.dataFundacao || empresaAtualizada.dataCadastro || null,
        inscricaoEstadual: empresaAtualizada.inscricaoEstadual || null,
        inscricaoMunicipal: empresaAtualizada.inscricaoMunicipal || null,
        numero: empresaAtualizada.numero || null,
        complemento: empresaAtualizada.complemento || null,
        bairro: empresaAtualizada.bairro || null,
        quantidadeFuncionarios: empresaAtualizada.quantidadeFuncionarios || 0,
        setorAtuacao: empresaAtualizada.setorAtuacao || null,
        // Garante que campos obrigatórios tenham valores padrão
        razaoSocial: empresaAtualizada.razaoSocial || '',
        nomeFantasia: empresaAtualizada.nomeFantasia || '',
        email: empresaAtualizada.email || '',
        telefone: empresaAtualizada.telefone || '',
        cep: empresaAtualizada.cep || '',
        endereco: empresaAtualizada.endereco || '',
        cidade: empresaAtualizada.cidade || '',
        estado: empresaAtualizada.estado || '',
        cnpj: empresaAtualizada.cnpj || ''
      };
      
      console.log('[API] Dados mapeados da empresa atualizada:', JSON.stringify(resultado, null, 2));
      return resultado;
      
    } catch (error) {
      console.error('[API] Erro detalhado ao atualizar empresa:', {
        message: error.message,
        status: error.status,
        data: error.data,
        stack: error.stack
      });
      
      const enhancedError = new Error(error.message || 'Erro ao atualizar os dados da empresa');
      enhancedError.status = error.status;
      enhancedError.data = error.data;
      enhancedError.originalError = error;
      
      throw enhancedError;
    }
  },

  // Exclui uma empresa permanentemente (hard delete)
  excluirEmpresa: async (id) => {
    console.log(`[API] Iniciando exclusão da empresa ID: ${id}`);
    const startTime = Date.now();
    
    try {
      if (!id) {
        throw new Error('ID da empresa não fornecido para exclusão');
      }
      
      console.log(`[API] Enviando requisição DELETE para: ${API_BASE_URL}/empresas/${id}`);
      
      const response = await fetch(`${API_BASE_URL}/empresas/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
        cache: 'no-store' // Evita cache para garantir a operação
      });
      
      const responseTime = Date.now() - startTime;
      console.log(`[API] Resposta recebida em ${responseTime}ms, status:`, response.status);
      
      // Processa o corpo da resposta como texto primeiro
      const responseText = await response.text();
      let responseData;
      
      try {
        // Tenta fazer o parse do JSON apenas se houver conteúdo
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch (e) {
        console.error('[API] Erro ao fazer parse da resposta JSON:', e);
        console.error('[API] Conteúdo da resposta:', responseText);
        
        const error = new Error('Resposta do servidor em formato inválido');
        error.status = response.status;
        error.responseText = responseText;
        throw error;
      }
      
      // Verifica se a requisição foi bem-sucedida
      if (!response.ok) {
        console.error('[API] Erro na resposta da API:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          data: responseData
        });
        
        let errorMessage = `Erro ao excluir a empresa ID ${id}`;
        
        // Mensagens de erro específicas por status HTTP
        if (response.status === 400) {
          errorMessage = 'Requisição inválida. Verifique o ID da empresa.';
        } else if (response.status === 401) {
          errorMessage = 'Não autorizado. Por favor, faça login novamente.';
        } else if (response.status === 403) {
          errorMessage = 'Acesso negado. Você não tem permissão para excluir esta empresa.';
        } else if (response.status === 404) {
          errorMessage = `Empresa com ID ${id} não encontrada.`;
        } else if (response.status === 500) {
          errorMessage = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
        }
        
        // Tenta obter uma mensagem de erro mais específica da resposta
        if (responseData) {
          if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.error) {
            errorMessage = responseData.error;
          } else if (responseData.errors) {
            errorMessage = Object.values(responseData.errors).join('\n');
          }
        }
        
        const error = new Error(errorMessage);
        error.status = response.status;
        error.responseData = responseData;
        throw error;
      }
      
      console.log(`[API] Empresa ID ${id} excluída com sucesso`);
      
      // Retorna um objeto de sucesso padronizado
      return { 
        success: true, 
        message: 'Empresa excluída com sucesso',
        id: id,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('[API] Erro detalhado ao excluir empresa:', {
        message: error.message,
        status: error.status,
        id: id,
        stack: error.stack
      });
      
      // Cria um objeto de erro seguro para log que não causa problemas de serialização
      const safeError = {
        message: error.message || 'Erro desconhecido ao excluir empresa',
        status: error.status || 'N/A',
        id: id,
        name: error.name,
        // Converte o responseData para string para evitar problemas de serialização
        responseData: error.responseData ? 
          (typeof error.responseData === 'string' ? error.responseData : JSON.stringify(error.responseData, null, 2)) : 
          'Nenhum dado de resposta',
        // Pega apenas as primeiras linhas do stack trace para evitar logs muito grandes
        stack: error.stack ? error.stack.split('\n').slice(0, 5).join('\n') : 'Sem stack trace'
      };
      
      console.error('[API] Erro detalhado ao excluir empresa:', safeError);
      
      // Se for um erro de rede, mostra mensagem mais amigável
      if (error.message === 'Failed to fetch' || error.message.includes('NetworkError') || !navigator.onLine) {
        const networkError = new Error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
        networkError.isNetworkError = true;
        networkError.originalError = safeError;
        throw networkError;
      }
      
      // Se for um erro 500, mostra mensagem mais amigável
      if (error.status === 500 || error.status >= 500) {
        const serverError = new Error('Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.');
        serverError.isServerError = true;
        serverError.originalError = safeError;
        throw serverError;
      }
      
      // Se for um erro 4xx, mantém a mensagem original
      if (error.status >= 400 && error.status < 500) {
        const clientError = new Error(error.message || 'Erro na requisição de exclusão');
        clientError.status = error.status;
        clientError.originalError = safeError;
        throw clientError;
      }
      
      // Repassa o erro original se não for um dos casos acima
      const genericError = new Error(error.message || 'Ocorreu um erro inesperado ao excluir a empresa');
      genericError.originalError = safeError;
      throw genericError;
    }
  },

  // Buscar empresa por CNPJ usando a API pública como fallback
  buscarEmpresaPorCNPJ: async (cnpj) => {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    // Tenta primeiro a API pública
    try {
      console.log(`Buscando empresa por CNPJ na API pública: ${cnpjLimpo}`);
      const publicApiUrl = `https://publica.cnpj.ws/cnpj/${cnpjLimpo}`;
      
      console.log('Fazendo requisição para:', publicApiUrl);
      const response = await fetch(publicApiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('=== RESPOSTA BRUTA DA API ===');
      console.log(JSON.stringify(data, null, 2));
      
      // Mapeia os dados da API pública para o formato esperado pelo formulário
      const empresa = data.estabelecimento || data[0]?.estabelecimento || data;
      
      console.log('=== DADOS DA EMPRESA EXTRAÍDOS ===');
      console.log('razao_social (raiz):', data.razao_social);
      console.log('razao_social (estabelecimento):', empresa.razao_social);
      console.log('nome_fantasia:', empresa.nome_fantasia);
      console.log('nome_fantasia (raiz):', data.nome_fantasia);
      console.log('Tipo razao_social (raiz):', typeof data.razao_social);
      console.log('Tipo nome_fantasia:', typeof empresa.nome_fantasia);
      console.log('Estrutura completa da resposta:', Object.keys(data));
      
      if (!empresa) {
        throw new Error('Dados da empresa não encontrados na resposta');
      }
      
      // Extrai os campos corretamente baseado na estrutura da API
      // A razão social pode estar em diferentes níveis do objeto
      let razaoSocial = '';
      let nomeFantasia = '';
      
      // Tenta encontrar a razão social em diferentes níveis
      if (data.razao_social) {
        razaoSocial = data.razao_social;
      } else if (empresa.razao_social) {
        razaoSocial = empresa.razao_social;
      } else if (data.nome) {
        razaoSocial = data.nome;
      } else if (empresa.nome) {
        razaoSocial = empresa.nome;
      }
      
      // Tenta encontrar o nome fantasia
      if (empresa.nome_fantasia) {
        nomeFantasia = empresa.nome_fantasia;
      } else if (data.nome_fantasia) {
        nomeFantasia = data.nome_fantasia;
      } else if (razaoSocial && !nomeFantasia) {
        // Se não encontrar nome fantasia, deixa vazio em vez de usar a razão social
        nomeFantasia = '';
      }
      
      console.log('Valores finais extraídos:', { razaoSocial, nomeFantasia });
      
      return {
        razaoSocial: razaoSocial,
        nomeFantasia: nomeFantasia,
        cnpj: cnpjLimpo,
        inscricaoEstadual: empresa.inscricoes_estaduais?.[0]?.inscricao_estadual || '',
        email: empresa.email || '',
        telefone: empresa.ddd1 ? `(${empresa.ddd1}) ${empresa.telefone1}` : '',
        endereco: empresa.logradouro || '',
        numero: empresa.numero || '',
        complemento: empresa.complemento || '',
        bairro: empresa.bairro || '',
        cidade: empresa.cidade?.nome || '',
        estado: empresa.estado?.sigla || '',
        cep: empresa.cep ? empresa.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2') : ''
      };
      
    } catch (publicApiError) {
      console.error('Erro ao buscar na API pública:', publicApiError);
      
      // Se a API pública falhar, tenta a API local como fallback
      try {
        console.log('Tentando API local como fallback...');
        const response = await fetch(`${API_BASE_URL}/empresas/cnpj/${cnpjLimpo}`, {
          ...defaultOptions,
          method: 'GET',
          headers: {
            ...defaultOptions.headers,
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
        
      } catch (localApiError) {
        console.error('Erro ao buscar na API local:', localApiError);
        throw new Error('Não foi possível consultar o CNPJ. Por favor, preencha os dados manualmente.');
      }
    }
  }
};

export default empresaApiService;
