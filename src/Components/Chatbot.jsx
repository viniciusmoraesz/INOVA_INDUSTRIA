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

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Olá! Sou o assistente virtual do Inova Indústria. Como posso ajudar?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();
    
    // Saudações
    if (input === 'oi' || input === 'olá' || input === 'ola' || input === 'eai' || input === 'e aí') {
      return 'Olá! Bem-vindo à Inova Indústria! Como posso te ajudar hoje?';
    }
    
    // Sobre o assistente
    if (input.includes('quem é você') || input.includes('qual seu nome') || input.includes('vc é')) {
      return 'Sou o assistente virtual da Inova Indústria, especializado em ajudar com informações sobre nossos projetos de inovação industrial, automação e soluções tecnológicas para o setor!';
    }
    
    // Sobre a Inova Indústria
    if (input.includes('inova indústria') || input.includes('sobre a empresa') || input.includes('quem somos') || input.includes('o que é inova indústria')) {
      return 'A Inova Indústria é uma empresa líder em soluções tecnológicas para o setor industrial, comprometida em transformar a indústria através da inovação e tecnologia.\n\n🔹 **Nossa Missão**\nImpulsionar a transformação digital das indústrias, oferecendo soluções inovadoras que aumentam a produtividade, eficiência e competitividade.\n\n🔹 **Áreas de Atuação**\n- Automação Industrial\n- Indústria 4.0\n- IoT Industrial\n- Manutenção Preditiva\n- Controle de Qualidade Avançado\n\n🔹 **Diferenciais**\n- Equipe altamente qualificada\n- Soluções personalizadas\n- Tecnologia de ponta\n- Suporte 24/7\n\nFundada em São Paulo, já atendemos mais de 100 indústrias em todo o Brasil, ajudando-as a alcançar novos patamares de excelência operacional.\n\nComo posso te ajudar hoje?';
    }
    
    // Projetos
    if (input.includes('projeto') || input.includes('solução') || input.includes('sistema')) {
      return 'Nossos principais projetos incluem:\n\n🔹 Automação Industrial - Soluções completas para automação de linhas de produção\n🔹 Monitoramento IoT - Acompanhamento em tempo real de máquinas e processos\n🔹 Manutenção Preditiva - Redução de paradas não programadas\n🔹 Controle de Qualidade - Sistemas avançados de inspeção\n\nGostaria de saber mais sobre algum projeto específico?';
    }
    
    // Ajuda
    if (input === 'ajuda' || input === 'help' || input === 'comandos') {
      return 'Posso te ajudar com: \n- Informações sobre nossos projetos\n- Soluções industriais\n- Automação e tecnologia\n- Contato com nossa equipe\n- Suporte técnico\n\nNo que posso ajudar hoje?';
    }
    
    // Contato
    if (input.includes('contato') || input.includes('email') || input.includes('telefone') || input.includes('falar com')) {
      return 'Entre em contato com nossa equipe de especialistas:\n\n📧 Email: contato@inovaindustria.com.br\n📞 Telefone: (11) 4002-8922\n💬 WhatsApp: (11) 98765-4321\n📍 Av. Paulista, 1000 - São Paulo/SP\n\nHorário de atendimento: Seg-Sex, 8h às 18h';
    }
    
    // Localização
    if (input.includes('onde fica') || input.includes('endereço') || input.includes('localização')) {
      return 'Nossa sede fica em São Paulo:\n\n🏢 Av. Paulista, 1000 - Bela Vista\nSão Paulo - SP, 01310-100\n\nPróximo ao metrô Trianon-MASP\nEstacionamento próprio disponível';
    }
    
    // Horário de atendimento
    if (input.includes('horário') || input.includes('horario') || input.includes('aberto') || input.includes('funciona')) {
      return 'Horário de funcionamento:\n\n🕗 Segunda a Sexta: 8h às 18h\n🕘 Sábado: 9h às 13h (atendimento agendado)\n❌ Domingo: Fechado\n\nPara emergências, entre em contato pelo WhatsApp (11) 98765-4321';
    }
    
    // Produtos e Serviços
    if (input.includes('produto') || input.includes('serviço') || input.includes('servico') || input.includes('solução')) {
      return 'Nossas principais soluções incluem:\n\n🤖 Automação Industrial\n- Robótica colaborativa\n- Sistemas de controle\n- CLPs e IHM\n\n📊 IoT Industrial\n- Sensores inteligentes\n- Monitoramento remoto\n- Análise de dados\n\n🛠️ Manutenção\n- Preditiva\n- Preventiva\n- Corretiva\n\nDeseja mais informações sobre alguma solução específica?';
    }
    
    // Carreira/Vagas
    if (input.includes('trabalhar') || input.includes('vaga') || input.includes('carreira') || input.includes('emprego')) {
      return 'Trabalhe conosco!\n\nEstamos sempre em busca de talentos para fazer parte do nosso time. As vagas abertas são divulgadas em:\n\n🔗 www.inovaindustria.com.br/trabalhe-conosco\n\nVocê também pode enviar seu currículo para: rh@inovaindustria.com.br';
    }
    
    // Parceiros
    if (input.includes('parceiro') || input.includes('parceria') || input.includes('fornecedor')) {
      return 'Trabalhamos com os melhores parceiros do mercado para oferecer soluções completas. Principais áreas de parceria:\n\n🤝 Fornecedores de equipamentos\n💼 Integradores de sistemas\n🏭 Indústrias\n\nPara se tornar um parceiro, envie um email para: parcerias@inovaindustria.com.br';
    }
    
    // Agradecimento
    if (input.includes('obrigad') || input === 'valeu' || input === 'obg' || input === 'obrigado' || input === 'obrigada') {
      return 'Por nada! Fico feliz em ajudar. Se precisar de mais alguma informação, estou à disposição! 😊';
    }
    
    // Despedidas
    if (input === 'tchau' || input === 'adeus' || input === 'até mais' || input === 'ate mais' || input === 'flw') {
      return 'Até mais! Foi um prazer ajudar. Lembre-se que estou à disposição para qualquer dúvida. Tenha um excelente dia! 👋';
    }
    
    // Resposta padrão caso não encontre correspondência
    return 'Desculpe, não entendi completamente. Poderia reformular sua pergunta? Estou aqui para ajudar com informações sobre a Inova Indústria, produtos, serviços e muito mais!';
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Adiciona mensagem do usuário
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Processa a resposta do bot
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 500);
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
                {msg.text.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
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
              />
              <SendButton type="submit">
                <FaPaperPlane />
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