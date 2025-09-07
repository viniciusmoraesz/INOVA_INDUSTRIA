import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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

// Schema de validação com Yup
const schema = yup.object({
  nome: yup.string()
    .required('O nome é obrigatório')
    .max(100, 'O nome não pode ter mais de 100 caracteres'),
  descricao: yup.string(),
  dataInicio: yup.string()
    .required('A data de início é obrigatória'),
  dataFimPrevista: yup.string()
    .nullable(),
  orcamento: yup.number()
    .typeError('O orçamento deve ser um número')
    .positive('O orçamento deve ser um valor positivo')
    .nullable(),
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
    navigate('/cadastro-projetos');
  };

  const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'PLANEJAMENTO',
      prioridade: 'MEDIA'
    }
  });

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
          
          // Depois, carregar apenas os clientes da empresa selecionada
          // Nota: Se listarClientesPorEmpresa não existir, podemos filtrar localmente
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

  const onSubmit = async (data) => {
    console.log('🚀 onSubmit chamado com dados:', data);
    try {
      console.log('Dados do formulário submetidos:', data);
      setIsSubmitting(true);
      setSubmitStatus(null);
      setFormError('');

      // Validação adicional
      if (!data.nome || data.nome.trim() === '') {
        console.error('❌ Campo nome está vazio:', data.nome);
        setFormError('Nome do projeto é obrigatório');
        setIsSubmitting(false);
        return;
      }

      // Formatar os dados para o formato esperado pelo serviço
      const projetoData = {
        titulo: data.nome.trim(), // Frontend usa 'nome', backend espera 'titulo'
        descricao: data.descricao,
        dataInicio: data.dataInicio && isValidDate(data.dataInicio) ? data.dataInicio : null,
        dataTerminoPrevista: data.dataFimPrevista && data.dataFimPrevista.trim() !== '' && isValidDate(data.dataFimPrevista) ? data.dataFimPrevista : null,
        orcamento: data.orcamento ? parseFloat(data.orcamento) : null,
        status: data.status, // Já está no formato correto do enum
        prioridade: data.prioridade, // Já está no formato correto do enum
        idEmpresa: parseInt(data.empresaId),
        idGerente: data.clienteId ? parseInt(data.clienteId) : null // Mapear cliente como gerente por enquanto
      };

      console.log('📋 Dados do formulário original:', data);
      console.log('📋 Dados formatados para envio:', projetoData);
      console.log('🔍 Cliente ID enviado:', data.clienteId, 'Tipo:', typeof data.clienteId);
      console.log('🔍 ID Gerente final:', projetoData.idGerente, 'Tipo:', typeof projetoData.idGerente);
      console.log('🔍 Testando conectividade com o backend...');
      
      // Primeiro, testar se o backend está acessível
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
      
      {submitStatus === 'success' && (
        <SuccessMessage>
          <strong>Sucesso!</strong> Projeto criado com sucesso!
        </SuccessMessage>
      )}

      <Form onSubmit={(e) => {
        console.log('📝 Form onSubmit event triggered');
        handleSubmit(onSubmit)(e);
      }}>
        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        {submitStatus && <SuccessMessage>{submitStatus}</SuccessMessage>}
        
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
          <FormGroup>
            <DateRangeLabel>Data de Início <RequiredLabel>*</RequiredLabel></DateRangeLabel>
            <DateRangeInput
              type="date"
              {...register('dataInicio')}
              disabled={isSubmitting}
            />
            {errors.dataInicio && <DateRangeError>{errors.dataInicio.message}</DateRangeError>}
          </FormGroup>

          <FormGroup>
            <DateRangeLabel>Data de Término Prevista</DateRangeLabel>
            <DateRangeInput
              type="date"
              {...register('dataFimPrevista')}
              disabled={isSubmitting}
            />
            {errors.dataFimPrevista && <DateRangeError>{errors.dataFimPrevista.message}</DateRangeError>}
          </FormGroup>
        </GridContainer>

        <GridContainer>
          <FormGroup>
            <Label>Orçamento (R$)</Label>
            <FullWidthInput
              type="number"
              step="0.01"
              min="0"
              {...register('orcamento')}
              disabled={isSubmitting}
            />
            {errors.orcamento && <ErrorMessage>{errors.orcamento.message}</ErrorMessage>}
          </FormGroup>

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
        </GridContainer>

        <GridContainer>
          <FormGroup>
            <Label>Empresa <RequiredLabel>*</RequiredLabel></Label>
            <StatusSelect
              {...register('empresaId')}
              disabled={isSubmitting || empresas.length === 0}
            >
              <option value="">Selecione uma empresa</option>
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nomeFantasia} - {empresa.razaoSocial}
                </option>
              ))}
            </StatusSelect>
            {errors.empresaId && <ErrorMessage>{errors.empresaId.message}</ErrorMessage>}
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
                  {cliente.nome} - {cliente.email}
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