import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  FiArrowLeft, 
  FiSave,
  FiX,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiUser,
  FiBriefcase,
  FiList
} from 'react-icons/fi';
import projetoApiService from '../services/projetoApiService';
import empresaApiService from '../services/empresaApiService';
import { clienteApiService } from '../services/clienteApiService';
import AtividadesProjeto from './AtividadesProjeto';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  padding: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
  animation: ${fadeIn} 0.3s ease-out;
  
  @media (min-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  color: #495057;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e9ecef;
    transform: translateX(-2px);
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: #212529;
  margin: 0;
  font-weight: 600;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
  
  h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #495057;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  & > div {
    width: 100%;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #495057;
    
    span {
      color: #e63946;
      margin-left: 2px;
    }
  }
  
  &.error {
    input, select, textarea {
      border-color: #e63946;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  height: 42px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }

  &:disabled {
    background-color: #f8fafc;
    cursor: not-allowed;
    opacity: 0.8;
  }

  &[type='date'] {
    min-height: 42px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    
    &::-webkit-inner-spin-button,
    &::-webkit-calendar-picker-indicator {
      opacity: 1;
      cursor: pointer;
    }
  }

  &[type='number'] {
    -moz-appearance: textfield;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9375rem;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 42px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
  padding-right: 2.5rem;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
  
  &:disabled {
    background-color: #f8fafc;
    cursor: not-allowed;
    opacity: 0.8;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  background-color: #fff;
  min-height: 120px;
  resize: vertical;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:disabled {
    background-color: #f8fafc;
    cursor: not-allowed;
    opacity: 0.8;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SaveButton = styled(Button)`
  background: #28a745;
  color: white;
  
  &:hover:not(:disabled) {
    background: #218838;
    transform: translateY(-1px);
  }
`;

const CancelButton = styled(Button)`
  background: #6c757d;
  color: white;
  
  &:hover:not(:disabled) {
    background: #5a6268;
  }
`;

const ErrorMessage = styled.span`
  color: #e63946;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ErrorDiv = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
`;

const ReadOnlyField = styled.div`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f8f9fa;
  color: #495057;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4a6cf7;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const RequiredLabel = styled.span`
  color: #e63946;
  margin-left: 2px;
`;

// Modal Styles
const SuccessModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  color: #2d3436;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ModalMessage = styled.p`
  color: #495057;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const ModalButton = styled.button`
  background: #4a6cf7;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0.5rem;

  &:hover {
    background: #3a5ce4;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Validation schema
const schema = yup.object().shape({
  titulo: yup.string()
    .required('Título é obrigatório')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  descricao: yup.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  dataInicio: yup.date()
    .required('Data de início é obrigatória'),
  dataTerminoPrevista: yup.date()
    .nullable(),
  orcamento: yup.number()
    .positive('Orçamento deve ser positivo')
    .nullable(),
  status: yup.string()
    .oneOf(['PLANEJAMENTO', 'EM_ANDAMENTO', 'PAUSADO', 'CONCLUIDO', 'CANCELADO'], 'Status inválido')
    .required('Status é obrigatório'),
  prioridade: yup.string()
    .oneOf(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'], 'Prioridade inválida')
    .required('Prioridade é obrigatória'),
});

export default function EditarProjeto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formError, setFormError] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [empresaAtual, setEmpresaAtual] = useState(null);
  const [clienteAtual, setClienteAtual] = useState(null);
  const [projetoOriginal, setProjetoOriginal] = useState(null);

  const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'PLANEJAMENTO',
      prioridade: 'MEDIA'
    }
  });

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setIsLoading(true);
        
        // Carregar projeto, empresas e clientes em paralelo
        const [projetoResponse, empresasResponse, clientesResponse] = await Promise.all([
          projetoApiService.buscarProjetoPorId(id),
          empresaApiService.listarEmpresas(),
          clienteApiService.listarClientes()
        ]);

        console.log('Projeto carregado:', projetoResponse);
        console.log('Empresas carregadas:', empresasResponse);
        console.log('Clientes carregados:', clientesResponse);
        
        // Preencher formulário com dados do projeto
        const projeto = projetoResponse;
        setProjetoOriginal(projeto);
        reset({
          titulo: projeto.titulo || '',
          descricao: projeto.descricao || '',
          dataInicio: projeto.dataInicio || '',
          dataTerminoPrevista: projeto.dataTerminoPrevista || '',
          orcamento: projeto.orcamento || '',
          status: projeto.status || 'PLANEJAMENTO',
          prioridade: projeto.prioridade || 'MEDIA'
        });

        setEmpresas(empresasResponse || []);
        setClientes(clientesResponse || []);
        
        // Encontrar empresa e cliente atuais para exibição
        console.log('Procurando empresa com ID:', projeto.idEmpresa, 'tipo:', typeof projeto.idEmpresa);
        console.log('Lista de empresas completa:', empresasResponse);
        console.log('Estrutura da primeira empresa:', empresasResponse?.[0]);
        if (projeto.idEmpresa && empresasResponse) {
          const empresa = empresasResponse.find(emp => {
            console.log('Comparando empresa:', emp);
            // Verificar diferentes propriedades possíveis para ID da empresa
            const empId = emp.idEmpresa || emp.id || emp.ID;
            console.log('ID da empresa encontrado:', empId, 'vs projeto ID:', projeto.idEmpresa);
            
            if (!empId) return false;
            
            // Tentar comparação com conversão de tipos
            return empId === projeto.idEmpresa || 
                   empId === parseInt(projeto.idEmpresa) ||
                   empId.toString() === projeto.idEmpresa.toString();
          });
          console.log('Empresa encontrada:', empresa);
          setEmpresaAtual(empresa);
        }
        
        console.log('Procurando cliente com ID:', projeto.idGerente, 'tipo:', typeof projeto.idGerente);
        if (projeto.idGerente && clientesResponse) {
          const cliente = clientesResponse.find(cli => {
            console.log('Comparando cliente:', cli);
            // Verificar diferentes propriedades possíveis para ID do cliente
            const cliId = cli.idCliente || cli.id || cli.ID;
            console.log('ID do cliente encontrado:', cliId, 'vs projeto ID:', projeto.idGerente);
            
            if (!cliId) return false;
            
            return cliId === projeto.idGerente || 
                   cliId === parseInt(projeto.idGerente) ||
                   cliId.toString() === projeto.idGerente.toString();
          });
          console.log('Cliente encontrado:', cliente);
          setClienteAtual(cliente);
        }

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setFormError('Erro ao carregar dados do projeto: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      carregarDados();
    }
  }, [id, reset]);

  const formatDateToLocalDate = (dateString) => {
    if (!dateString) return null;
    // If it's already in YYYY-MM-DD format, return as is
    if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    // Otherwise, convert from ISO string to YYYY-MM-DD
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setFormError('');
      setSubmitStatus(null);

      console.log('Dados do formulário:', data);

      // Formatar dados para envio (mantendo empresa e cliente originais)
      const projetoData = {
        titulo: data.titulo.trim(),
        descricao: data.descricao?.trim() || '',
        dataInicio: formatDateToLocalDate(data.dataInicio),
        dataTerminoPrevista: formatDateToLocalDate(data.dataTerminoPrevista),
        orcamento: data.orcamento ? parseFloat(data.orcamento) : null,
        status: data.status,
        prioridade: data.prioridade,
        idEmpresa: projetoOriginal.idEmpresa,
        idGerente: projetoOriginal.idGerente
      };

      console.log('Dados formatados para envio:', projetoData);

      await projetoApiService.atualizarProjeto(id, projetoData);
      
      setSubmitStatus('success');
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Erro ao atualizar projeto';
      setFormError(errorMsg);
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/projetos'); // Always go back to the projetos list
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/projetos'); // Redirect to projetos list after successful edit
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={handleBack}>
          <FiArrowLeft size={18} />
          Voltar para Projetos
        </BackButton>
        <Title>Editar Projeto</Title>
      </Header>

      {/* Modais */}
      {showSuccessModal && (
        <SuccessModal>
          <ModalContent>
            <ModalTitle>
              <FiSave size={24} />
              Sucesso!
            </ModalTitle>
            <ModalMessage>Projeto atualizado com sucesso!</ModalMessage>
            <ModalButton onClick={handleCloseSuccessModal}>
              <FiArrowLeft size={18} />
              Voltar para o Projeto
            </ModalButton>
          </ModalContent>
        </SuccessModal>
      )}

      {showErrorModal && (
        <SuccessModal>
          <ModalContent>
            <ModalTitle>
              <FiX size={24} color="#e63946" />
              Erro
            </ModalTitle>
            <ModalMessage>{errorMessage}</ModalMessage>
            <ModalButton onClick={handleCloseErrorModal} style={{ background: '#e63946' }}>
              <FiX size={18} />
              Fechar
            </ModalButton>
          </ModalContent>
        </SuccessModal>
      )}

      <Card>
        <CardHeader>
          <h2>
            <FiFileText size={20} />
            Informações do Projeto
          </h2>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <GridContainer>
              <FormGroup className={errors.titulo ? 'error' : ''}>
                <label>Título <RequiredLabel>*</RequiredLabel></label>
                <Input
                  {...register('titulo')}
                  placeholder="Digite o título do projeto"
                  disabled={isSubmitting}
                />
                {errors.titulo && <ErrorMessage>{errors.titulo.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <label>Empresa</label>
                <ReadOnlyField>
                  {empresaAtual ? `${empresaAtual.nomeFantasia} - ${empresaAtual.razaoSocial}` : 'Carregando...'}
                </ReadOnlyField>
              </FormGroup>
            </GridContainer>

            <GridContainer>
              <FormGroup>
                <label>Cliente</label>
                <ReadOnlyField>
                  {clienteAtual ? `${clienteAtual.nome} - ${clienteAtual.email}` : 'Carregando...'}
                </ReadOnlyField>
              </FormGroup>

              <FormGroup className={errors.orcamento ? 'error' : ''}>
                <label>Orçamento</label>
                <Input
                  {...register('orcamento')}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
                {errors.orcamento && <ErrorMessage>{errors.orcamento.message}</ErrorMessage>}
              </FormGroup>
            </GridContainer>

            <FormGroup className={errors.descricao ? 'error' : ''}>
              <label>Descrição</label>
              <Textarea
                {...register('descricao')}
                placeholder="Descreva o projeto..."
                disabled={isSubmitting}
              />
              {errors.descricao && <ErrorMessage>{errors.descricao.message}</ErrorMessage>}
            </FormGroup>

            <GridContainer>
              <FormGroup className={errors.dataInicio ? 'error' : ''}>
                <label>Data de Início <RequiredLabel>*</RequiredLabel></label>
                <Input
                  {...register('dataInicio')}
                  type="date"
                  disabled={isSubmitting}
                />
                {errors.dataInicio && <ErrorMessage>{errors.dataInicio.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup className={errors.dataTerminoPrevista ? 'error' : ''}>
                <label>Data de Término Prevista</label>
                <Input
                  {...register('dataTerminoPrevista')}
                  type="date"
                  disabled={isSubmitting}
                />
                {errors.dataTerminoPrevista && <ErrorMessage>{errors.dataTerminoPrevista.message}</ErrorMessage>}
              </FormGroup>
            </GridContainer>

            <GridContainer>
              <FormGroup className={errors.status ? 'error' : ''}>
                <label>Status <RequiredLabel>*</RequiredLabel></label>
                <Select {...register('status')} disabled={isSubmitting}>
                  <option value="PLANEJAMENTO">Em Planejamento</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="PAUSADO">Pausado</option>
                  <option value="CONCLUIDO">Concluído</option>
                  <option value="CANCELADO">Cancelado</option>
                </Select>
                {errors.status && <ErrorMessage>{errors.status.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup className={errors.prioridade ? 'error' : ''}>
                <label>Prioridade <RequiredLabel>*</RequiredLabel></label>
                <Select {...register('prioridade')} disabled={isSubmitting}>
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                  <option value="URGENTE">Urgente</option>
                </Select>
                {errors.prioridade && <ErrorMessage>{errors.prioridade.message}</ErrorMessage>}
              </FormGroup>
            </GridContainer>

            <ButtonGroup>
              <CancelButton type="button" onClick={handleBack} disabled={isSubmitting}>
                <FiX size={18} />
                Cancelar
              </CancelButton>
              <SaveButton type="submit" disabled={isSubmitting}>
                <FiSave size={18} />
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </SaveButton>
            </ButtonGroup>
          </Form>
        </CardBody>
      </Card>

      {/* Seção de Atividades */}
      <Card style={{ marginTop: '2rem' }}>
        <CardHeader>
          <h2><FiList size={20} /> Atividades do Projeto</h2>
        </CardHeader>
        <CardBody>
          <AtividadesProjeto />
        </CardBody>
      </Card>
    </PageContainer>
  );
}
