// Arquivo temporário para teste de configuração
export const envConfig = {
  VITE_HUGGINGFACE_API_KEY: import.meta.env.VITE_HUGGINGFACE_API_KEY,
  MODE: import.meta.env.MODE
};

export function logEnv() {
  console.log('=== Configuração de Ambiente ===');
  console.log('Modo:', envConfig.MODE);
  console.log('Chave da API presente?', !!envConfig.VITE_HUGGINGFACE_API_KEY ? 'Sim' : 'Não');
  console.log('Tipo da chave:', typeof envConfig.VITE_HUGGINGFACE_API_KEY);
  console.log('==============================');
}

// Executa o log quando o arquivo for carregado
logEnv();
