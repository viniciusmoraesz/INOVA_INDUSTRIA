import { useState } from 'react';
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
  BackButton
} from '../Styles/StyledAdicionarProjeto';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

// Schema de validação com Yup
const schema = yup.object({
  titulo: yup.string()
    .required('O título é obrigatório')
    .max(255, 'O título não pode ter mais de 255 caracteres'),
  dataInicio: yup.date()
    .required('A data de início é obrigatória')
    .typeError('Por favor, selecione uma data válida no formato dd/mm/aaaa')
    .max(new Date(), 'A data de início não pode ser além do dia atual'),
  dataTermino: yup.date()
    .required('A data de término é obrigatória')
    .typeError('Por favor, selecione uma data válida no formato dd/mm/aaaa')
    .min(yup.ref('dataInicio'), 'A data de término não pode ser anterior à data de início'),
  descricao: yup.string(),
  status: yup.string()
    .required('O status é obrigatório')
    .notOneOf(['selecionar'], 'Por favor, selecione um status'),
  empresa: yup.string()
    .required('A empresa é obrigatória')
    .notOneOf(['selecionar'], 'Por favor, selecione uma empresa')
});

const statusOptions = [
  { value: 'selecionar', label: 'Selecione uma opção' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'concluido', label: 'Concluído' },
  { value: 'cancelado', label: 'Cancelado' }
];

const empresaOptions = [
  { value: 'selecionar', label: 'Selecione uma opção' },
  { value: 'nexora_tech', label: 'Nexora Tech' },
  { value: 'digital_innovation', label: 'Digital Innovation' },
  { value: 'innotech', label: 'InnoTech Solutions' },
  { value: 'tech_evolve', label: 'Tech Evolve' },
  { value: 'future_tech', label: 'Future Tech' }
];

export default function AdicionarProjeto() {
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();

  const handleBack = () => {
    setSubmitStatus(null);
    setFormError('');
    navigate('/cadastro-projetos');
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    // Aqui você implementaria a lógica para salvar o projeto
    try {
      // Simulando uma chamada à API
      console.log('Dados do projeto:', data);
      setSubmitStatus('success');
      setFormError('');
      // Aqui você poderia redirecionar para a página de sucesso ou limpar o formulário
    } catch (error) {
      setSubmitStatus(null);
      setFormError('Erro ao criar o projeto. Por favor, tente novamente.');
    }
  };

  return (
    <PageContainer>
        <BackButton onClick={handleBack}>
            <FaArrowLeft />
            Voltar para Cadastro de Projetos
        </BackButton>
      <Title>Adicionar Novo Projeto</Title>
      
      {submitStatus === 'success' ? (
        <>
          
          <SuccessMessage>
            <strong>Parabéns!</strong> Seu projeto foi criado com sucesso!
          </SuccessMessage>
        </>
      ) : formError ? (
        <ErrorMessageContainer>{formError}</ErrorMessageContainer>
      ) : null}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label>Título <RequiredLabel>*</RequiredLabel></Label>
          <FullWidthInput
            type="text"
            {...register('titulo')}
          />
          {errors.titulo && <ErrorMessage>{errors.titulo.message}</ErrorMessage>}
        </FormGroup>

        <GridContainer>
          <FormGroup>
            <DateRangeLabel>Data de Início <RequiredLabel>*</RequiredLabel></DateRangeLabel>
            <DateRangeInput
              type="date"
              {...register('dataInicio')}
            />
            {errors.dataInicio && <DateRangeError>{errors.dataInicio.message}</DateRangeError>}
          </FormGroup>

          <FormGroup>
            <DateRangeLabel>Data de Término <RequiredLabel>*</RequiredLabel></DateRangeLabel>
            <DateRangeInput
              type="date"
              {...register('dataTermino')}
            />
            {errors.dataTermino && <DateRangeError>{errors.dataTermino.message}</DateRangeError>}
          </FormGroup>
        </GridContainer>

        <GridContainer>
          <FormGroup>
            <Label>Empresa <RequiredLabel>*</RequiredLabel></Label>
            <StatusSelect
              {...register('empresa')}
            >
              {empresaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </StatusSelect>
            {errors.empresa && <ErrorMessage>{errors.empresa.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Status <RequiredLabel>*</RequiredLabel></Label>
            <StatusSelect
              {...register('status')}
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
          />
        </FormGroup>

        <ButtonContainer>
          <SubmitButton type="submit">
            Criar Projeto
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </PageContainer>
  );
}