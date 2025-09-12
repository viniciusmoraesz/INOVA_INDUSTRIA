import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiDollarSign, FiCalendar, FiUser, FiBriefcase, FiAlertCircle, FiInfo } from 'react-icons/fi';
import {
  PageContainer,
  Title,
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  ErrorMessage,
  SubmitButton,
  GridContainer,
  FullWidthInput,
  FullWidthTextArea,
  StatusSelect,
  ButtonContainer,
  SuccessMessage,
  ErrorMessageContainer,
  RequiredLabel,
  DateRangeGroup,
  DateRangeLabel,
  DateRangeInput,
  DateRangeError,
  BackButton,
  LoadingMessage
} from '../Styles/StyledAdicionarProjeto';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import empresaApiService from '../services/empresaApiService';
import { clienteApiService } from '../services/clienteApiService';
import projetoApiService from '../services/projetoApiService';

// Função para validar data entre hoje e 2040
const isValidDateRange = (dateString) => {
  if (!dateString) return true;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const maxDate = new Date('2040-01-01');
  const inputDate = new Date(dateString);
  
  return inputDate >= today && inputDate < maxDate;
};

// Schema de validação com Yup
const schema = yup.object({
  nome: yup.string()
    .required('O nome é obrigatório')
    .max(100, 'O nome não pode ter mais de 100 caracteres'),
  descricao: yup.string(),
  dataInicio: yup.string()
    .required('A data de início é obrigatória')
    .test('data-valida', 'A data deve estar entre hoje e 31/12/2039', isValidDateRange),
  status: yup.string()
    .required('O status é obrigatório')
    .oneOf(['PLANEJAMENTO', 'EM_ANDAMENTO', 'PAUSADO', 'CONCLUIDO', 'CANCELADO'], 'Status inválido'),
  prioridade: yup.string()
    .required('A prioridade é obrigatória')
    .oneOf(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'], 'Prioridade inválida'),
  empresaId: yup.string()
    .required('A empresa é obrigatória'),
  clienteId: yup.string()
    .required('O cliente é obrigatório'),
  responsavelId: yup.string()
    .nullable()
});

// Função para formatar valor monetário
const formatCurrency = (value) => {
  if (!value) return '';
  
  // Remove tudo que não for dígito
  const numericValue = value.replace(/\D/g, '');
  // Converte para número e divide por 100 para obter os centavos
  const number = parseFloat(numericValue) / 100;
  
  // Formata como moeda brasileira
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
};

const statusOptions = [
  { value: 'PLANEJAMENTO', label: 'Planejamento' },
  { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
  { value: 'PAUSADO', label: 'Pausado' },
  { value: 'CONCLUIDO', label: 'Concluído' },
  { value: 'CANCELADO', label: 'Cancelado' }
];

const prioridadeOptions = [
  { value: 'BAIXA', label: 'Baixa' },
  { value: 'MEDIA', label: 'Média' },
  { value: 'ALTA', label: 'Alta' },
  { value: 'URGENTE', label: 'Urgente' }
];

export default function AdicionarProjeto() {
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [empresas, setEmpresas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  const navigate = useNavigate();

  // Função para validar se a data está em formato válido
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const year = date.getFullYear();
    return date instanceof Date && !isNaN(date) && year >= 1900 && year <= 2100;
  };

  const handleBack = () => {
    setSubmitStatus(null);
    setFormError('');
    navigate('/projetos');
  };

  const { register, handleSubmit, watch, formState: { errors }, reset, setValue, getValues, setFocus, trigger } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'PLANEJAMENTO',
      prioridade: 'MEDIA',
      orcamento: '',
      dataInicio: '',
      dataFimPrevista: ''
    }
  });

  // Watch dates for validation
  const dataInicio = watch('dataInicio');
  const dataFimPrevista = watch('dataFimPrevista');

  // Validate end date when start date changes and vice versa
  useEffect(() => {
    if (dataInicio && dataFimPrevista) {
      const start = new Date(dataInicio);
      const end = new Date(dataFimPrevista);
      
      if (start > end) {
        setValue('dataFimPrevista', '');
      }
      trigger('dataFimPrevista');
    }
  }, [dataInicio, dataFimPrevista, setValue, trigger]);

  // Função para manipular mudanças nos campos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Formatação específica para o campo de orçamento
    if (name === 'orcamento') {
      // Remove todos os caracteres não numéricos
      const onlyNums = value.replace(/\D/g, '');
      // Converte para número e formata como moeda
      const formattedValue = formatCurrency(onlyNums);
      setValue('orcamento', formattedValue, { shouldValidate: true });
      return;
    }

    // Para outros campos, apenas atualiza o valor
    setValue(name, value, { shouldValidate: true });
  };

  // Watch para empresaId para filtrar clientes
  const empresaSelecionada = watch('empresaId');

  // Carregar clientes e empresas
  useEffect(() => {
    const carregarClientesEEmpresas = async () => {
      try {
        setIsLoading(true);
        const [clientes, empresas] = await Promise.all([
          clienteApiService.listarClientes(),
          empresaApiService.listarEmpresas()
        ]);
        setClientes(clientes);
        setEmpresas(empresas);
        setFormError(null);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setFormError('Erro ao carregar clientes e empresas. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    carregarClientesEEmpresas();
  }, []);

  // Atualizar lista de clientes quando a empresa selecionada mudar
  useEffect(() => {
    const carregarClientesPorEmpresa = async () => {
      console.log('Empresa selecionada mudou:', empresaSelecionada);
      
      if (empresaSelecionada) {
        try {
          setIsLoading(true);
          console.log('Buscando clientes para a empresa ID:', empresaSelecionada);
          
          // Primeiro, carregar todos os clientes para depuração
          const todosClientes = await clienteApiService.listarClientes();
          console.log('Todos os clientes carregados:', todosClientes);
          
          // Filtrar clientes da empresa selecionada
          const clientesEmpresa = todosClientes.filter(cliente => 
            String(cliente.idEmpresa) === String(empresaSelecionada)
          );
          console.log('Clientes da empresa:', clientesEmpresa);
          
          // Atualizar o estado com os clientes filtrados
          setClientesFiltrados(clientesEmpresa);
          
          // Se não houver clientes para a empresa selecionada, limpar o cliente selecionado
          if (clientesEmpresa.length === 0) {
            console.log('Nenhum cliente encontrado para a empresa selecionada');
            setValue('clienteId', '');
          } else {
            console.log(`${clientesEmpresa.length} clientes encontrados para a empresa`);
          }
        } catch (error) {
          console.error('Erro ao carregar clientes:', error);
          setFormError('Erro ao carregar clientes. Por favor, tente novamente.');
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('Nenhuma empresa selecionada, limpando lista de clientes');
        setClientesFiltrados([]);
        setValue('clienteId', '');
      }
    };

    carregarClientesPorEmpresa();
  }, [empresaSelecionada, setValue]);

  // Função para converter valor formatado (R$ 1.234,56) para número (1234.56)
  const parseCurrency = (value) => {
    if (!value) return null;
    // Remove R$, pontos e espaços, troca vírgula por ponto
    const numericValue = value
      .replace(/[^\d,]/g, '')
      .replace(',', '.');
    return parseFloat(numericValue) || null;
  };

  const onSubmit = async (data) => {
    console.log('📝 Form data:', data);
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setFormError('');
      setSubmitStatus(null);

      // Validação adicional para garantir que o nome não esteja vazio
      if (!data.nome || data.nome.trim() === '') {
        console.error('❌ Campo nome está vazio:', data.nome);
        setFormError('Nome do projeto é obrigatório');
        setIsSubmitting(false);
        return;
      }

      // Validação de datas
      const dataInicio = data.dataInicio ? new Date(data.dataInicio) : null;
      const dataFim = data.dataFimPrevista ? new Date(data.dataFimPrevista) : null;
      
      if (dataInicio && dataFim && dataInicio > dataFim) {
        setFormError('A data de término deve ser posterior à data de início');
        setIsSubmitting(false);
        return;
      }

      // Formatar os dados para o formato esperado pelo serviço
      const projetoData = {
        titulo: data.nome.trim(),
        descricao: data.descricao,
        dataInicio: dataInicio ? dataInicio.toISOString().split('T')[0] : null,
        dataTerminoPrevista: dataFim ? dataFim.toISOString().split('T')[0] : null,
        orcamento: parseCurrency(data.orcamento),
        status: data.status,
        prioridade: data.prioridade,
        idEmpresa: parseInt(data.empresaId),
        idGerente: data.clienteId ? parseInt(data.clienteId) : null
      };

      console.log('📋 Dados formatados para envio:', projetoData);

      // Verificar se o backend está acessível
      try {
        const testResponse = await fetch('http://localhost:8080/auth/login', {
          method: 'OPTIONS'
        });
        console.log('✅ Backend acessível:', testResponse.status);
      } catch (testError) {
        console.error('❌ Backend não acessível:', testError);
        throw new Error('Backend não está respondendo. Verifique se o servidor está rodando.');
      }
      
      // Chamar o serviço para criar o projeto
      await projetoApiService.criarProjeto(projetoData);
      
      setSubmitStatus('success');
      setTimeout(() => {
        reset();
        setSubmitStatus(null);
        navigate('/projetos');
      }, 2000);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      setSubmitStatus('error');
      setFormError(error.message || 'Erro ao criar projeto');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingMessage>
          <FaSpinner className="spin" /> Carregando...
        </LoadingMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackButton onClick={handleBack}>
        <FaArrowLeft />
        Voltar para Cadastro de Projetos
      </BackButton>
      
      <Title>Adicionar Novo Projeto</Title>
      
      <Form onSubmit={(e) => {
        console.log('📝 Form onSubmit event triggered');
        handleSubmit(onSubmit)(e);
      }}>
        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        {submitStatus === 'success' && (
          <SuccessMessage>
            <strong>Sucesso!</strong> Projeto criado com sucesso!
          </SuccessMessage>
        )}
        
        <GridContainer>
          <FormGroup>
            <Label>Nome do Projeto <RequiredLabel>*</RequiredLabel></Label>
            <FullWidthInput
              type="text"
              {...register('nome')}
              disabled={isSubmitting}
              onChange={(e) => {
                console.log('📝 Nome field changed:', e.target.value);
                register('nome').onChange(e);
              }}
            />
            {errors.nome && <ErrorMessage>{errors.nome.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Status <RequiredLabel>*</RequiredLabel></Label>
            <StatusSelect
              {...register('status')}
              disabled={isSubmitting}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </StatusSelect>
            {errors.status && <ErrorMessage>{errors.status.message}</ErrorMessage>}
          </FormGroup>
        </GridContainer>

        <FormGroup>
          <Label>Descrição</Label>
          <FullWidthTextArea
            {...register('descricao')}
            rows={4}
            disabled={isSubmitting}
          />
        </FormGroup>

        <GridContainer>
          <FormGroup style={{ marginTop: '1.5rem' }}>
            <Label>Data de Início <RequiredLabel>*</RequiredLabel></Label>
            <div style={{ position: 'relative' }}>
              <FiCalendar style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                zIndex: 1
              }} />
              <DateRangeInput
                type="date"
                {...register('dataInicio')}
                disabled={isSubmitting}
                min={new Date().toISOString().split('T')[0]}
                max="2039-12-31"
                style={{
                  paddingLeft: '2.5rem',
                  backgroundColor: isSubmitting ? '#f8f9fa' : 'white',
                  opacity: isSubmitting ? 0.8 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              />
            </div>
            {errors.dataInicio && (
              <DateRangeError>
                <FiAlertCircle style={{ marginRight: '4px' }} />
                {errors.dataInicio.message}
              </DateRangeError>
            )}
          </FormGroup>

          <FormGroup style={{ marginTop: '1.5rem' }}>
            <Label>Empresa <RequiredLabel>*</RequiredLabel></Label>
            <StatusSelect
              {...register('empresaId')}
              disabled={isSubmitting || empresas.length === 0}
            >
              <option value="">Selecione uma empresa</option>
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nomeFantasia.length > 20 
                    ? `${empresa.nomeFantasia.substring(0, 20)}...` 
                    : empresa.nomeFantasia}
                </option>
              ))}
            </StatusSelect>
            {errors.empresaId && <ErrorMessage>{errors.empresaId.message}</ErrorMessage>}
          </FormGroup>
        </GridContainer>

        <GridContainer>
          <FormGroup>
            <Label>Prioridade <RequiredLabel>*</RequiredLabel></Label>
            <StatusSelect
              {...register('prioridade')}
              disabled={isSubmitting}
            >
              {prioridadeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </StatusSelect>
            {errors.prioridade && <ErrorMessage>{errors.prioridade.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Cliente <RequiredLabel>*</RequiredLabel></Label>
            <StatusSelect
              {...register('clienteId')}
              disabled={isSubmitting || clientesFiltrados.length === 0}
            >
              <option value="">
                {empresaSelecionada ? 'Selecione um cliente' : 'Selecione uma empresa primeiro'}
              </option>
              {clientesFiltrados.map((cliente) => (
                <option key={cliente.idCliente} value={cliente.idCliente}>
                  {cliente.nome.length > 20 ? `${cliente.nome.substring(0, 20)}...` : cliente.nome}
                </option>
              ))}
            </StatusSelect>
            {errors.clienteId && <ErrorMessage>{errors.clienteId.message}</ErrorMessage>}
          </FormGroup>
        </GridContainer>

        <ButtonContainer>
          <SubmitButton 
            type="submit" 
            disabled={isSubmitting}
            onClick={(e) => {
              console.log('🔘 Submit button clicked');
              console.log('Form data before submit:', watch());
            }}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="spin" /> Salvando...
              </>
            ) : (
              'Criar Projeto'
            )}
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </PageContainer>
  );
}