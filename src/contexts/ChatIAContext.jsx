import React, { createContext, useContext, useState } from 'react';

const ChatIAContext = createContext();

export function ChatIAProvider({ children }) {
  const [messages, setMessages] = useState([]);

  // Garante que o histórico é limpo ao desmontar o provider (ex: ao sair da página)
  React.useEffect(() => {
    return () => setMessages([]);
  }, []);

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const clearMessages = () => setMessages([]);

  return (
    <ChatIAContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </ChatIAContext.Provider>
  );
}

export function useChatIA() {
  return useContext(ChatIAContext);
}
