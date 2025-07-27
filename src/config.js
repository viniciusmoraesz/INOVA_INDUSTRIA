// Configuração do modelo de IA
// Usando a API do Hugging Face com um modelo pequeno e rápido

// Usa a variável de ambiente do arquivo carregado globalmente
const ENV = window.ENV || {};

export const AI_CONFIG = {
  // Modelo pequeno e rápido para testes
  model: 'gpt2',
  apiUrl: 'https://api-inference.huggingface.co/models/gpt2',
  // Acessa a chave do window.ENV que é carregado pelo env-config.js
  apiKey: window.ENV?.VITE_HUGGINGFACE_API_KEY || '',
  
  // Respostas locais para fallback
  fallbackResponses: {
    'oi': 'Olá! Estou processando sua mensagem...',
    'default': 'Estou processando sua solicitação. Por favor, aguarde um momento...'
  }
};

// Log para depuração
console.log('Configuração carregada:', {
  hasApiKey: !!AI_CONFIG.apiKey,
  apiUrl: AI_CONFIG.apiUrl
});
