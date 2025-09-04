// Serviço para consulta de CNPJ usando a API pública CNPJ WS
// Documentação: https://www.cnpj.ws/

export const consultarCNPJ = async (cnpj) => {
  try {
    // Remove formatação do CNPJ
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    // Faz a requisição para a API CNPJ WS
    const response = await fetch(`https://publica.cnpj.ws/cnpj/${cnpjLimpo}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao consultar CNPJ');
    }

    const data = await response.json();
    
    // Retorna os dados formatados para o nosso formulário
    return {
      razaoSocial: data.razao_social || '',
      nomeFantasia: data.estabelecimento.nome_fantasia || '',
      cnpj: data.estabelecimento.cnpj || cnpj,
      email: data.estabelecimento.email || '',
      telefone: data.estabelecimento.ddd1 + data.estabelecimento.telefone1 || '',
      cep: data.estabelecimento.cep || '',
      endereco: data.estabelecimento.logradouro || '',
      numero: data.estabelecimento.numero || '',
      complemento: data.estabelecimento.complemento || '',
      bairro: data.estabelecimento.bairro || '',
      cidade: data.estabelecimento.cidade?.nome || '',
      estado: data.estabelecimento.estado?.sigla || '',
      inscricaoEstadual: data.estabelecimento.inscricoes_estaduais?.[0]?.inscricao_estadual || '',
      inscricaoMunicipal: data.estabelecimento.inscricao_municipal || '',
      dataAbertura: data.estabelecimento.data_inicio_atividade || '',
      situacaoCadastral: data.estabelecimento.situacao_cadastral || '',
      naturezaJuridica: data.natureza_juridica?.descricao || '',
      atividadePrincipal: data.estabelecimento.atividade_principal?.descricao || '',
    };
  } catch (error) {
    console.error('Erro ao consultar CNPJ:', error);
    throw new Error('Não foi possível consultar o CNPJ. Verifique o número e tente novamente.');
  }
};

export default {
  consultarCNPJ,
};
