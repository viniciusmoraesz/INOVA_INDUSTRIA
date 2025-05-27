import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  PageContainer, Title, BackButton, Form, FormGroup, Label,
  FullWidthInput, DateRangeInput, StatusSelect, FullWidthTextArea,
  ButtonContainer, SubmitButton, ErrorMessage, DateRangeError,
  SuccessMessage, ErrorMessageContainer, RequiredLabel, GridContainer, DateRangeLabel
} from '../Styles/StyledAdicionarAtividade';

// Schema de validação com Yup
const schema = yup.object({
  nome: yup.string()
    .required('O nome da atividade é obrigatório')
    .max(255, 'O nome não pode ter mais de 255 caracteres'),
  dataInicio: yup.date()
    .required('A data de início é obrigatória')
    .typeError('Por favor, selecione uma data válida no formato dd/mm/aaaa')
    .max(new Date(), 'A data de início não pode ser além do dia atual'),
  dataTermino: yup.date()
    .required('A data de término é obrigatória')
    .typeError('Por favor, selecione uma data válida no formato dd/mm/aaaa')
    .min(yup.ref('dataInicio'), 'A data de término não pode ser menor que a data de início'),
  responsavel: yup.string()
    .required('O responsável é obrigatório')
    .notOneOf(['Selecione'], 'Por favor, selecione um responsável'),
  status: yup.string()
    .required('O status é obrigatório')
    .notOneOf(['Selecione'], 'Por favor, selecione um status')
});

export default function AdicionarAtividade() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formError, setFormError] = useState('');

  const handleBack = () => {
    setSubmitStatus(null);
    setFormError('');
    navigate(`/projeto/${id}`);
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    try {
      // Simulando uma chamada à API
      console.log('Dados da atividade:', data);
      setSubmitStatus('success');
      setFormError('');
      // Aqui você poderia redirecionar para a página de sucesso ou limpar o formulário
    } catch (error) {
      setSubmitStatus(null);
      setFormError('Erro ao criar a atividade. Por favor, tente novamente.');
    }
  };

  // Opções para os selects
  const responsaveisOptions = [
    { value: 'Selecione', label: 'Selecione um responsável' },
    { value: 'João Silva', label: 'João Silva' },
    { value: 'Maria Santos', label: 'Maria Santos' },
    { value: 'Carlos Oliveira', label: 'Carlos Oliveira' },
    { value: 'Ana Costa', label: 'Ana Costa' },
    { value: 'Pedro Mendonça', label: 'Pedro Mendonça' }
  ];

  const statusOptions = [
    { value: 'Selecione', label: 'Selecione um status' },
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Em andamento', label: 'Em andamento' },
    { value: 'Concluído', label: 'Concluído' },
    { value: 'Cancelado', label: 'Cancelado' }
  ];

  return (
    <PageContainer>
      <BackButton onClick={handleBack}>
        <FaArrowLeft />
        Voltar para Projeto
      </BackButton>

      <Title>Adicionar Nova Atividade</Title>
      
      {submitStatus === 'success' ? (
        <SuccessMessage>
          <strong>Parabéns!</strong> Sua atividade foi criada com sucesso!
        </SuccessMessage>
      ) : formError ? (
        <ErrorMessageContainer>{formError}</ErrorMessageContainer>
      ) : null}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label>Nome da Atividade <RequiredLabel>*</RequiredLabel></Label>
          <FullWidthInput
            type="text"
            {...register('nome')}
          />
          {errors.nome && <ErrorMessage>{errors.nome.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Descrição da Atividade</Label>
          <FullWidthTextArea
            {...register('descricao')}
          />
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
            <Label>Responsável <RequiredLabel>*</RequiredLabel></Label>
            <StatusSelect
              {...register('responsavel')}
            >
              {responsaveisOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </StatusSelect>
            {errors.responsavel && <ErrorMessage>{errors.responsavel.message}</ErrorMessage>}
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

        <ButtonContainer>
          <SubmitButton type="submit">
            Criar Atividade
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </PageContainer>
  );  
}