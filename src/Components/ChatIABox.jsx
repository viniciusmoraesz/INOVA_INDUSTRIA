import React from 'react';
import { useChatIA } from '../contexts/ChatIAContext';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const BoxIA = styled.div`
  width: 100%;
  background: #f5f7fa;
  border-radius: 16px;
  border: 1.5px solid #90caf9;
  margin-bottom: 2rem;
  padding: 2rem;
  box-sizing: border-box;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.1rem;
  color: #1976d2;
  font-weight: 500;
  gap: 1.5rem;
`;

const MessageIA = styled.div`
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 12px 12px 12px 2px;
  padding: 1rem 1.5rem;
  font-size: 1.05rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 4px rgba(33,150,243,0.07);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
`;

const MessageUser = styled.div`
  background: #1976d2;
  color: #fff;
  border-radius: 12px 12px 2px 12px;
  padding: 1rem 1.5rem;
  font-size: 1.05rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 4px rgba(33,150,243,0.07);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-end;
`;

const FormIA = styled.form`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
`;

const InputIA = styled.input`
  flex: 1;
  padding: 0.7rem 1rem;
  border: 1px solid #90caf9;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  color: #1976d2;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: #1976d2;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #90caf9 60%, #1976d2 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(135deg, #1976d2 60%, #90caf9 100%);
  }
`;

export default function ChatIABox({ projetos }) {
  const [msg, setMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { getAuthHeaders, user } = useAuth();
  const { messages, addMessage } = useChatIA();
  const isAllowed = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  if (!isAllowed) return null;
  // Adiciona mensagem inicial só se o histórico estiver vazio
  React.useEffect(() => {
    if (messages.length === 0) {
      addMessage({ type: 'ia', text: 'Como posso te ajudar?' });
    }
  }, [messages, addMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (msg.trim()) {
      addMessage({ type: 'user', text: msg });
      setMsg('');
      setLoading(true);
      try {
        const res = await fetch('/ia-chat', {
          method: 'POST',
          headers: { ...getAuthHeaders() },
          body: JSON.stringify({ message: msg, projetos })
        });
        const data = await res.text();
        let iaText = data;
        try {
          const json = JSON.parse(data);
          iaText = json.choices?.[0]?.message?.content || data;
        } catch {}
        addMessage({ type: 'ia', text: iaText });
      } catch (err) {
        addMessage({ type: 'ia', text: 'Erro ao consultar IA.' });
      }
      setLoading(false);
    }
  };

  return (
    <BoxIA>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {messages.map((m, idx) =>
          m.type === 'ia' ? (
            <MessageIA key={idx}>
              <span role="img" aria-label="bot">🤖</span> {m.text}
            </MessageIA>
          ) : (
            <MessageUser key={idx}>
              {m.text}
            </MessageUser>
          )
        )}
        {loading && (
          <MessageIA><span role="img" aria-label="bot">🤖</span> Pensando...</MessageIA>
        )}
      </div>
      <FormIA onSubmit={handleSubmit}>
        <InputIA
          type="text"
          placeholder="Digite sua mensagem..."
          value={msg}
          onChange={e => setMsg(e.target.value)}
          disabled={loading}
        />
        <SendButton type="submit" disabled={loading}>Enviar</SendButton>
      </FormIA>
    </BoxIA>
  );
}
