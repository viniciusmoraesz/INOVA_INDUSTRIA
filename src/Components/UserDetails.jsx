import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiUser, FiBriefcase, FiMail, FiPhone, FiFileText, FiKey, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { 
    transform: translateY(-20px);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transform-origin: center;
  animation: ${slideIn} 0.3s ease-out;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const ModalHeader = styled.div`
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid #f1f3f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9ff;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #6c5ce7, #a29bfe);
  }
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.4rem;
  color: #2d3436;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: #6c5ce7;
  }
`;

const CloseButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6c757d;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f1f3f5;
    color: #495057;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ModalBody = styled.div`
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const UserInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UserDetailItem = styled.div`
  background: #f8f9ff;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #f1f3f9;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #e0e3ff;
    background: #f3f4ff;
  }
  
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.7rem;
    color: #6c757d;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
    
    svg {
      font-size: 0.9em;
      color: #6c5ce7;
    }
  }
  
  p {
    margin: 0;
    font-size: 1rem;
    color: #2d3436;
    font-weight: 500;
    line-height: 1.5;
  }
  
  .role-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.8rem;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 500;
    margin-top: 0.25rem;
    
    &.manager {
      background-color: #e3f2fd;
      color: #1976d2;
      border: 1px solid #bbdefb;
    }
    
    &.client {
      background-color: #e8f5e9;
      color: #388e3c;
      border: 1px solid #c8e6c9;
    }
    
    &.attendant {
      background-color: #fff3e0;
      color: #f57c00;
      border: 1px solid #ffe0b2;
    }
    
    svg {
      font-size: 0.9em;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px dashed #e9ecef;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  ${props => props.danger 
    ? `
      background-color: #fff5f5;
      color: #e53e3e;
      border-color: #fed7d7;
      
      &:hover {
        background-color: #fff1f1;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(229, 62, 62, 0.1);
      }
    ` 
    : props.primary 
      ? `
        background-color: #6c5ce7;
        color: white;
        box-shadow: 0 2px 10px rgba(108, 92, 231, 0.3);
        
        &:hover {
          background-color: #5d4acf;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(108, 92, 231, 0.4);
        }
      `
      : `
        background-color: #f8f9fa;
        color: #2d3436;
        border-color: #e9ecef;
        
        &:hover {
          background-color: #f1f3f5;
          transform: translateY(-1px);
        }
      `
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
  
  svg {
    font-size: 1.1em;
  }
`;

const UserDetails = ({ user, onClose, onEdit, onDelete, onResetPassword }) => {
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const handleEditClick = () => {
    onClose();
    onEdit(user); // Chama a função de edição passada como prop
  };

  // Função para obter a classe do papel do usuário
  const getUserRoleClass = (role) => {
    if (!role) return '';
    return role.toLowerCase();
  };

  // Formatar CPF se existir
  const formatCPF = (cpf) => {
    if (!cpf) return 'Não informado';
    // Remove qualquer caractere que não seja número
    const cleaned = cpf.replace(/\D/g, '');
    // Aplica a formatação do CPF: 000.000.000-00
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Formatar telefone se existir
  const formatPhone = (phone) => {
    if (!phone) return 'Não informado';
    // Remove qualquer caractere que não seja número
    const cleaned = phone.replace(/\D/g, '');
    // Aplica a formatação do telefone: (00) 00000-0000
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FiUser size={24} />
            Detalhes do Usuário
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <UserInfo>
            <UserDetailItem>
              <label><FiUser size={14} /> Nome</label>
              <p>{user.name || 'Não informado'}</p>
            </UserDetailItem>
            
            <UserDetailItem>
              <label><FiBriefcase size={14} /> Cliente</label>
              <p>{user.company || 'Não informado'}</p>
            </UserDetailItem>
            
            <UserDetailItem>
              <label><FiUser size={14} /> Perfil de Acesso</label>
              <div className={`role-badge ${getUserRoleClass(user.role)}`}>
                {user.role === 'GERENTE' && <FiBriefcase size={14} />}
                {user.role === 'CLIENTE' && <FiUser size={14} />}
                {user.role === 'ACOMPANHANTE' && <FiUser size={14} />}
                {user.role || 'Não definido'}
              </div>
            </UserDetailItem>
            
            <UserDetailItem>
              <label><FiFileText size={14} /> CPF</label>
              <p>{formatCPF(user.cpf)}</p>
            </UserDetailItem>
            
            <UserDetailItem>
              <label><FiMail size={14} /> E-mail</label>
              <p>{user.email || 'Não informado'}</p>
            </UserDetailItem>
            
            <UserDetailItem>
              <label><FiPhone size={14} /> Telefone</label>
              <p>{formatPhone(user.phone)}</p>
            </UserDetailItem>
          </UserInfo>
          
          <ActionButtons>
            <ActionButton onClick={onResetPassword}>
              <FiKey size={16} />
              Redefinir senha
            </ActionButton>
            <ActionButton primary onClick={handleEditClick}>
              <FiEdit2 size={16} />
              Editar usuário
            </ActionButton>
            <ActionButton danger onClick={onDelete}>
              <FiTrash2 size={16} />
              Excluir usuário
            </ActionButton>
          </ActionButtons>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default UserDetails;
