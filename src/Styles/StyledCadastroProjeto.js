import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #1f2b33;
  min-height: 100vh;
  color: #fff;
  
  @media (min-width: 992px) {
    flex-direction: row;
  }
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  background: #2f3e46;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  z-index: 10;
  
  h3 {
    color: #e2e8f0;
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
  }
  
  /* Estilização da barra de rolagem */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #4a5568;
    border-radius: 3px;
    
    &:hover {
      background-color: #718096;
    }
  }
  
  @media (min-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 280px;
    box-shadow: 2px 0 5px rgba(0,0,0,0.3);
    overflow-y: auto;
    padding-right: 0.5rem;
    
    /* Adiciona um espaçamento no final do conteúdo */
    &:after {
      content: '';
      display: block;
      height: 1.5rem;
    }
  }
  
  @media (max-width: 767px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid rgba(255,255,255,0.1);
    padding: 1rem;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem 2.5rem 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #4a5568;
  background-color: #2d3748;
  color: #e2e8f0;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  
  &::placeholder {
    color: #a0aec0;
  }
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.5rem 1rem 1.5rem 0.5rem;
  margin-left: 0;
  
  @media (min-width: 768px) {
    margin-left: 280px;
    padding: 1.5rem 1rem 1.5rem 1rem;
  }
  gap: 1.5rem;
  flex: 1;
  padding: 1.5rem;
  margin-bottom: 80px; /* Espaço para a sidebar móvel */
  
  @media (min-width: 768px) {
    padding: 1.5rem 2rem;
    margin-bottom: 0;
    margin-left: 280px;
    max-width: calc(100% - 280px);
  }
  
  @media (min-width: 1400px) {
    padding: 2rem 3rem;
    max-width: calc(100% - 300px);
  }
  
  @media (min-width: 1600px) {
    padding: 2.5rem 4rem;
  }
`;

export const Header = styled.h1`
  font-size: 1.8rem;
  color: #fff;
  margin-bottom: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
`;

export const AddButton = styled.button`
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  margin: 0.5rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: linear-gradient(135deg, #45a049, #3d8b40);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  width: 100%;
  line-height: 1.4;
  white-space: nowrap;
  
  &:hover, &:focus {
    background: #3e8e41;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    outline: none;
  }
  
  @media (max-width: 767px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    z-index: 100;
    margin: 0;
    max-width: calc(100% - 2rem);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin: 0 0 1.5rem 0;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  padding: 0 0.5rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 1.25rem;
    justify-content: space-between;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-bottom: 1rem;
    
    & > button {
      flex: 0 0 calc(50% - 0.25rem);
      max-width: calc(50% - 0.25rem);
      padding: 0.4rem 0.5rem;
      font-size: 0.75rem;
    }
  }
`;

export const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  background: ${props => props.active ? 'rgba(76, 175, 80, 0.2)' : 'rgba(45, 55, 72, 0.7)'};
  color: ${props => props.active ? '#68d391' : '#a0aec0'};
  border: 1px solid ${props => props.active ? 'rgba(104, 211, 145, 0.3)' : 'rgba(160, 174, 192, 0.1)'};
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  white-space: nowrap;
  flex: 1;
  text-align: center;
  min-width: max-content;
  
  &:hover {
    background: ${props => props.active ? 'rgba(76, 175, 80, 0.3)' : 'rgba(58, 70, 89, 0.7)'};
    color: #fff;
    transform: translateY(-1px);
  }
  
  @media (min-width: 481px) {
    flex: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.4rem 0.7rem;
    font-size: 0.75rem;
    border-radius: 15px;
  }
`;

export const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.25rem;
  width: 100%;
  max-width: 1400px;
  margin: 0;
  padding: 0 0 0 0.5rem;
  
  @media (min-width: 1400px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  }
  
  @media (max-width: 767px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const ProjectCard = styled.div`
  background: #2d3748;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
  cursor: pointer;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
  animation: ${fadeIn} 0.3s ease-out forwards;
  opacity: 0;
  animation-delay: ${props => props.delay || '0ms'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 639px) {
    border-radius: 6px;
  }
`;

export const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(76, 175, 80, 0.2);
  border-top: 5px solid #4CAF50;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;

export const ProjectImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  transition: transform 0.2s ease;
  
  ${ProjectCard}:hover & {
    transform: scale(1.02);
  }
  
  @media (max-width: 639px) {
    height: 100px;
  }
`;

export const CardContent = styled.div`
  padding: 0.75rem 1rem 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  
  @media (max-width: 639px) {
    padding: 1rem;
  }
`;

export const ProjectTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #fff;
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
  padding: 0 0.25rem;
  min-height: 2.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.5em;
  
  @media (max-width: 639px) {
    font-size: 1rem;
    min-height: 2.8em;
  }
`;

export const ProjectInfo = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #a0aec0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  
  svg {
    font-size: 0.9em;
  }
  
  @media (max-width: 639px) {
    font-size: 0.8rem;
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin: 0.5rem 0;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  
  & > div {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #66BB6A);
    width: ${props => props.progress}%;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      animation: shimmer 2s infinite linear;
    }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

// Estilos para o Modal de Confirmação
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: #2d3748;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

export const ModalTitle = styled.h3`
  color: #e2e8f0;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
`;

export const ModalMessage = styled.p`
  color: #cbd5e0;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

export const CancelButton = styled.button`
  background: #4a5568;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background: #4a5568cc;
  }
`;

export const ConfirmButton = styled.button`
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background: #c53030;
  }
`;

export const Status = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  background: ${props => 
    props.status === 'Em andamento' ? 'rgba(59, 130, 246, 0.2)' : 
    props.status === 'Concluído' ? 'rgba(56, 161, 105, 0.2)' : 'rgba(234, 179, 8, 0.2)'};
  color: ${props => 
    props.status === 'Em andamento' ? '#3b82f6' : 
    props.status === 'Concluído' ? '#68d391' : '#eab308'};
  margin-top: 0.25rem;
  border: 1px solid ${props => 
    props.status === 'Em andamento' ? 'rgba(59, 130, 246, 0.3)' : 
    props.status === 'Concluído' ? 'rgba(104, 211, 145, 0.3)' : 'rgba(234, 179, 8, 0.3)'};
  transition: all 0.2s ease;
  
  ${ProjectCard}:hover & {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 639px) {
    font-size: 0.7rem;
    padding: 0.25rem 0.6rem;
  }
`;

export const DeleteButton = styled.button`
  background: rgba(255, 77, 79, 0.2);
  color: #ff6b6b;
  border: 1px solid #ff4d4f;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  opacity: 0.8;
  
  &:hover {
    background: #ff4d4f;
    color: white;
    transform: scale(1.1);
    opacity: 1;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;
