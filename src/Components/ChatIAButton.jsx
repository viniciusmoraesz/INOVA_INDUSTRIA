import React from 'react';
import styled from 'styled-components';
import { Sparkle } from 'lucide-react';

const ButtonIA = styled.button`
  background: linear-gradient(135deg, #1976d2 60%, #64b5f6 100%);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.18);
  cursor: pointer;
  transition: box-shadow 0.2s;
  position: relative;
  outline: ${props => props.active ? '2px solid #90caf9' : 'none'};
`;

export default function ChatIAButton({ active, onClick }) {
  return (
    <ButtonIA active={active} title={active ? 'Fechar Chat IA' : 'Abrir Chat IA'} onClick={onClick}>
  <Sparkle size={28} color="#fff" style={{ filter: 'drop-shadow(0 1px 2px #90caf9)' }} />
    </ButtonIA>
  );
}
