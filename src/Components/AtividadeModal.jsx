import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiCalendar, FiUser, FiTag, FiClock, FiPlus, FiTrash2 } from 'react-icons/fi';

// Animações
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Estilização
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.2s ease-out;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #37352f;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #787774;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #37352f;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9375rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: #2eaadc;
    box-shadow: 0 0 0 2px rgba(46, 170, 220, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9375rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: #2eaadc;
    box-shadow: 0 0 0 2px rgba(46, 170, 220, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9375rem;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23787774' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #2eaadc;
    box-shadow: 0 0 0 2px rgba(46, 170, 220, 0.2);
  }
`;

const DateInput = styled.div`
  position: relative;
  width: 100%;
  
  input {
    padding-left: 2.5rem;
    width: 100%;
  }
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #787774;
    pointer-events: none;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
  
  svg {
    color: #787774;
    flex-shrink: 0;
  }
`;

const MetaContent = styled.div`
  flex: 1;
  font-size: 0.875rem;
  color: #37352f;
`;

const MetaTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const MetaDescription = styled.div`
  font-size: 0.8125rem;
  color: #787774;
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  ${props => props.primary ? `
    background-color: #2eaadc;
    color: white;
    border: 1px solid #2eaadc;
    
    &:hover {
      background-color: #1e8ab9;
      border-color: #1e8ab9;
    }
  ` : `
    background-color: white;
    color: #37352f;
    border: 1px solid #e0e0e0;
    
    &:hover {
      background-color: #f8f9fa;
    }
  `}
  
  ${props => props.danger && `
    color: #e53935;
    border-color: #e53935;
    
    &:hover {
      background-color: #ffebee;
    }
  `}
`;

const AtividadeModal = ({ 
  isOpen, 
  onClose, 
  atividade = null, 
  onSubmit,
  isSubmitting = false
}) => {
  // Initialize with default values
  const defaultValues = {
    titulo: '',
    descricao: '',
    status: 'PENDENTE',
    prioridade: 'MEDIA',
    dataInicio: '',
    dataTerminoPrevista: '',
    responsavel: ''
  };

  // Merge atividade with defaults if it exists
  const initialValues = atividade ? { ...defaultValues, ...atividade } : defaultValues;

  const [titulo, setTitulo] = useState(initialValues.titulo);
  const [descricao, setDescricao] = useState(initialValues.descricao);
  const [status, setStatus] = useState(initialValues.status);
  const [prioridade, setPrioridade] = useState(initialValues.prioridade);
  const [dataInicio, setDataInicio] = useState(initialValues.dataInicio);
  const [dataTermino, setDataTermino] = useState(initialValues.dataTerminoPrevista);
  const [responsavel, setResponsavel] = useState(initialValues.responsavel);

  // Reset form when atividade changes
  useEffect(() => {
    const values = atividade ? { ...defaultValues, ...atividade } : defaultValues;
    setTitulo(values.titulo);
    setDescricao(values.descricao);
    setStatus(values.status);
    setPrioridade(values.prioridade);
    setDataInicio(values.dataInicio);
    setDataTermino(values.dataTerminoPrevista);
    setResponsavel(values.responsavel);
  }, [atividade]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dadosAtividade = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      status,
      prioridade,
      dataInicio,
      dataTerminoPrevista: dataTermino,
      responsavel: responsavel?.id ? responsavel : null
    };

    // Only include ID if we're editing an existing atividade
    if (atividade?.id) {
      dadosAtividade.id = atividade.id;
    };

    onSubmit(dadosAtividade);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {atividade.idAtividade ? 'Editar Atividade' : 'Nova Atividade'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Input
                type="text"
                placeholder="Título da atividade"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                autoFocus
              />
            </FormGroup>
            
            <FormGroup>
              <TextArea
                placeholder="Adicione uma descrição detalhada..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </FormGroup>
            
            <MetaItem>
              <FiTag />
              <MetaContent>
                <MetaTitle>Status</MetaTitle>
                <Select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="CONCLUIDA">Concluída</option>
                  <option value="CANCELADA">Cancelada</option>
                </Select>
              </MetaContent>
            </MetaItem>
            
            <MetaItem>
              <FiTag />
              <MetaContent>
                <MetaTitle>Prioridade</MetaTitle>
                <Select 
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value)}
                >
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                  <option value="URGENTE">Urgente</option>
                </Select>
              </MetaContent>
            </MetaItem>
            
            <MetaItem>
              <FiCalendar />
              <MetaContent>
                <MetaTitle>Data de Início</MetaTitle>
                <DateInput>
                  <FiCalendar />
                  <Input 
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </DateInput>
              </MetaContent>
            </MetaItem>
            
            <MetaItem>
              <FiClock />
              <MetaContent>
                <MetaTitle>Data de Término Prevista</MetaTitle>
                <DateInput>
                  <FiCalendar />
                  <Input 
                    type="date"
                    value={dataTermino}
                    onChange={(e) => setDataTermino(e.target.value)}
                    min={dataInicio}
                  />
                </DateInput>
              </MetaContent>
            </MetaItem>
            
            <MetaItem>
              <FiUser />
              <MetaContent>
                <MetaTitle>Responsável</MetaTitle>
                <Select 
                  value={responsavel.id || ''}
                  onChange={(e) => {
                    // Aqui você implementaria a lógica para buscar o responsável
                    // Por enquanto, apenas definimos o ID
                    setResponsavel({ id: e.target.value });
                  }}
                >
                  <option value="">Selecione um responsável</option>
                  {/* Aqui você mapearia a lista de usuários disponíveis */}
                  <option value="1">João Silva</option>
                  <option value="2">Maria Santos</option>
                  <option value="3">Carlos Oliveira</option>
                </Select>
              </MetaContent>
            </MetaItem>
          </form>
        </ModalBody>
        
        <ModalFooter>
          <Button 
            type="button" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          
          {atividade.idAtividade && (
            <Button 
              type="button" 
              danger
              disabled={isSubmitting}
              style={{ marginRight: 'auto' }}
            >
              <FiTrash2 />
              Excluir
            </Button>
          )}
          
          <Button 
            type="button" 
            primary
            onClick={handleSubmit}
            disabled={isSubmitting || !titulo.trim()}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AtividadeModal;
