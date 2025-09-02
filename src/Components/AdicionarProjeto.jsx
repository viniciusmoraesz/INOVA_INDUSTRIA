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
import { empresaService } from '../services/empresaService';
import { clienteService } from '../services/clienteService';
import { projetoService } from '../services/projetoService';

// Schema de validação com Yup
const schema = yup.object({
  nome: yup.string()
    .required('O nome é obrigatório')
    .max(255, 'O nome não pode ter mais de 255 caracteres'),
  descricao: yup.string(),
  dataInicio: yup.date()
    .required('A data de início é obrigatória')
    .typeError('Por favor, selecione uma data válida')
    .max(new Date(), 'A data de início não pode ser no futuro'),
  dataFimPrevista: yup.date()
    .nullable()
    .typeError('Por favor, selecione uma data válida')
    .min(yup.ref('dataInicio'), 'A data de término prevista não pode ser anterior à data de início'),
  orcamento: yup.number()
    .typeError('O orçamento deve ser um número')
    .positive('O orçamento deve ser um valor positivo')
    .nullable(),
  status: yup.string()
    .required('O status é obrigatório')
    .oneOf(['rascunho', 'planejamento', 'andamento', 'pausado', 'concluido', 'cancelado'], 'Status inválido'),
  prioridade: yup.string()
    .required('A prioridade é obrigatória')
    .oneOf(['baixa', 'media', 'alta', 'critica'], 'Prioridade inválida'),
  empresaId: yup.string()
    .required('A empresa é obrigatória'),
  clienteId: yup.string()
    .required('O cliente é obrigatório'),
  responsavelId: yup.string()
    .nullable()
});

const statusOptions = [
  { value: 'rascunho', label: 'Rascunho' },
  { value: 'planejamento', label: 'Planejamento' },
  { value: 'andamento', label: 'Em Andamento' },
  { value: 'pausado', label: 'Pausado' },
  { value: 'concluido', label: 'Concluído' },
  { value: 'cancelado', label: 'Cancelado' }
];

const prioridadeOptions = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
  { value: 'critica', label: 'Crítica' }
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

  const handleBack = () => {
    setSubmitStatus(null);
    setFormError('');
    navigate('/cadastro-projetos');
  };

  const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'rascunho',
      prioridade: 'media'
    }
  });

  // Watch para empresaId para filtrar clientes
  const empresaSelecionada = watch('empresaId');

  // Carregar empresas iniciais
  useEffect(() => {
    const carregarEmpresas = async () => {
      try {
        setIsLoading(true);
        const empresasData = await empresaService.listarEmpresas();
        setEmpresas(empresasData);
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
        setFormError('Erro ao carregar empresas. Por favor, recarregue a página.');
      } finally {
        setIsLoading(false);
      }
    };

    carregarEmpresas();
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
          const todosClientes = await clienteService.listarClientes();
          console.log('Todos os clientes carregados:', todosClientes);
          
          // Depois, carregar apenas os clientes da empresa selecionada
          const clientesEmpresa = await clienteService.listarClientesPorEmpresa(empresaSelecionada);
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
    try {
      console.log('Dados do formulário submetidos:', data);
      setIsSubmitting(true);
      setSubmitStatus(null);
      setFormError('');

      // Validar dados antes de enviar
      if (!data.empresaId) {
        throw new Error('Selecione uma empresa');
      }
      if (!data.clienteId) {
        throw new Error('Selecione um cliente');
      }

      // Converter dados para o formato esperado
      const dadosProjeto = {
        ...data,
        dataInicio: new Date(data.dataInicio),
        dataFimPrevista: data.dataFimPrevista ? new Date(data.dataFimPrevista) : undefined,
        orcamento: data.orcamento ? parseFloat(data.orcamento) : undefined,
        ativo: true
      };

      console.log('Dados do projeto a serem enviados:', dadosProjeto);

      try {
        // Chamar o serviço para criar o projeto
        const projetoCriado = await projetoService.criarProjeto(dadosProjeto);
        console.log('Projeto criado com sucesso:', projetoCriado);
        
        // Atualizar a lista de projetos
        const projetosAtualizados = await projetoService.listarProjetos();
        console.log('Lista de projetos atualizada:', projetosAtualizados);
        
        setSubmitStatus('success');
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          reset();
          setSubmitStatus(null);
          navigate('/cadastro-projetos');
        }, 2000);
        
      } catch (serviceError) {
        console.error('Erro no serviço ao criar projeto:', serviceError);
        throw serviceError; // Re-lança para ser capturado pelo catch externo
      }
      
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
      setSubmitStatus('error');
      setFormError(error.message || 'Erro ao criar o projeto. Por favor, verifique os dados e tente novamente.');
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
      
      {formError && <ErrorMessageContainer>{formError}</ErrorMessageContainer>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <GridContainer>
          <FormGroup>
            <Label>Nome do Projeto <RequiredLabel>*</RequiredLabel></Label>
            <FullWidthInput
              type="text"
              {...register('nome')}
              disabled={isSubmitting}
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
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} - {cliente.email}
                </option>
              ))}
            </StatusSelect>
            {errors.clienteId && <ErrorMessage>{errors.clienteId.message}</ErrorMessage>}
          </FormGroup>
        </GridContainer>

        <ButtonContainer>
          <SubmitButton type="submit" disabled={isSubmitting}>
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