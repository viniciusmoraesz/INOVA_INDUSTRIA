import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatContainer, 
  ChatButton, 
  ChatWindow, 
  MessageList, 
  Message, 
  InputArea, 
  Input, 
  SendButton 
} from '../Styles/StyledChatbot';
import { FaPaperPlane, FaRobot, FaTimes } from 'react-icons/fa';
// Configurações da API
const API_CONFIG = {
  model: 'gpt2',
  apiUrl: 'https://api-inference.huggingface.co/models/gpt2',
  // Acessa a chave do window.ENV que é carregado pelo env-config.js
  apiKey: window.ENV?.VITE_HUGGINGFACE_API_KEY || ''
};

// Log para depuração
console.log('Configuração da API:', {
  hasApiKey: !!API_CONFIG.apiKey,
  apiUrl: API_CONFIG.apiUrl,
  env: window.ENV ? 'ENV carregado' : 'ENV não carregado',
  envKeys: window.ENV ? Object.keys(window.ENV) : []
});

// Verifica se a chave da API está disponível
if (!API_CONFIG.apiKey) {
  console.error('ERRO: Chave da API não encontrada. Verifique se o arquivo env-config.js está configurado corretamente.');
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Olá! Sou o assistente virtual do Inova Indústria. Como posso ajudar?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Loga as configurações de ambiente quando o componente for montado
  useEffect(() => {
    console.log('=== DEBUG - Verificando configurações ===');
    console.log('Chave da API presente?', API_CONFIG.apiKey ? 'Sim' : 'Não');
    console.log('URL da API:', API_CONFIG.apiUrl);
    
    // Verifica se o arquivo env-config.js foi carregado corretamente
    if (!window.ENV) {
      console.error('ERRO: window.ENV não está definido. Verifique se o arquivo env-config.js está sendo carregado corretamente.');
    } else {
      console.log('Arquivo env-config.js carregado com sucesso');
    }
  }, []);

  // Verificação de inicialização
  useEffect(() => {
    console.log('Variáveis de ambiente carregadas:', {
      hasApiKey: !!import.meta.env.VITE_HUGGINGFACE_API_KEY,
      nodeEnv: import.meta.env.MODE
    });
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Adiciona mensagem do usuário
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Log para depuração
    console.log('Chave da API:', API_CONFIG.apiKey ? 'Presente' : 'Ausente');

    try {
      // Respostas pré-definidas
      const defaultResponses = {
        'oi': 'Olá! Como posso ajudar você hoje?',
        'qual seu nome': 'Sou o assistente virtual da Inova Indústria!',
        'ajuda': 'Posso ajudar com informações sobre nossos produtos e serviços. O que você gostaria de saber?',
        'contato': 'Você pode entrar em contato pelo email: contato@inovaindustria.com.br'
      };

      // Verifica se há uma resposta pré-definida exata
      const lowerInput = inputValue.toLowerCase();
      const defaultResponse = defaultResponses[lowerInput];
      
      if (defaultResponse) {
        // Usa resposta pré-definida se existir
        setTimeout(() => {
          setMessages(prev => [...prev, { text: defaultResponse, sender: 'bot' }]);
          setIsLoading(false);
        }, 500);
        return;
      }

      // Se não houver correspondência exata, chama a API do Hugging Face
      console.log('Chamando API do Hugging Face...');
      
      // Respostas locais para fallback
      const fallbackResponses = {
        'oi': 'Olá! Estou processando sua mensagem...',
        'default': 'Estou processando sua solicitação. Por favor, aguarde um momento...'
      };
      
      // Resposta temporária enquanto carrega
      let botResponse = fallbackResponses[lowerInput] || fallbackResponses.default;
      
      try {
        console.log('Tentando conectar à API com URL:', API_CONFIG.apiUrl);
        
        if (!API_CONFIG.apiKey) {
          throw new Error('Chave da API não encontrada. Verifique se o arquivo env-config.js está configurado corretamente.');
        }
        
        console.log('Chave da API carregada com sucesso');
        console.log('Tipo da chave:', typeof API_CONFIG.apiKey);
        console.log('Tamanho da chave:', API_CONFIG.apiKey.length);
        console.log('Início da chave:', API_CONFIG.apiKey.substring(0, 5) + '...');
        
        const response = await fetch(API_CONFIG.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_CONFIG.apiKey}`,
            'Accept': 'application/json' // Adicionando header Accept
          },
          body: JSON.stringify({
            inputs: inputValue,
            parameters: {
              max_length: 100,
              temperature: 0.7,
              do_sample: true,
              return_full_text: false // Adicionando parâmetro recomendado
            },
            options: {
              use_cache: true,
              wait_for_model: true
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Detalhes do erro da API:', errorData);
          throw new Error(`Erro na API (${response.status}): ${response.statusText}`);
        }

        const [result] = await response.json();
        botResponse = result?.generated_text || 'Não consegui gerar uma resposta adequada.';
        
      } catch (error) {
        console.error('Erro ao chamar a API:', error);
        botResponse = 'Desculpe, estou com dificuldades técnicas. Tente novamente mais tarde.';
      }
      
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Erro ao processar a mensagem:', error);
      setMessages(prev => [...prev, { 
        text: 'Desculpe, estou com dificuldades no momento. Você pode tentar novamente ou perguntar de outra forma.', 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ChatContainer>
      {isOpen ? (
        <ChatWindow>
          <div className="chat-header">
            <h3>Assistente Virtual</h3>
            <button onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <MessageList>
            {messages.map((msg, index) => (
              <Message key={index} className={msg.sender}>
                {msg.text}
              </Message>
            ))}
            <div ref={messagesEndRef} />
          </MessageList>
          <form onSubmit={handleSendMessage}>
            <InputArea>
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua mensagem..."
                disabled={isLoading}
              />
              <SendButton type="submit" disabled={isLoading}>
                {isLoading ? '...' : <FaPaperPlane />}
              </SendButton>
            </InputArea>
          </form>
        </ChatWindow>
      ) : (
        <ChatButton onClick={() => setIsOpen(true)}>
          <FaRobot size={24} />
        </ChatButton>
      )}
    </ChatContainer>
  );
};

export default Chatbot;