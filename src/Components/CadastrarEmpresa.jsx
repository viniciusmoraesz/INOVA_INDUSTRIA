import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showToast } from './Toast';
import { 
  formatCNPJ, 
  formatPhone, 
  formatCEP, 
  formatInscricaoEstadual, 
  formatInscricaoMunicipal, 
  removeMask 
} from '../utils/masks';
import { 
  validateEmail, 
  validateCNPJ, 
  validateCEP, 
  validatePhone
} from '../utils/validators';
import { 
  FiArrowLeft, 
  FiSave, 
  FiSearch,
  FiInfo,
  FiBriefcase,
  FiMapPin,
  FiFileText,
  FiMail, 
  FiPhone,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiPlus,
  FiTrash2
} from 'react-icons/fi';
import empresaApiService from '../services/empresaApiService';
import { consultarCNPJ } from '../services/cnpjService';
import styled from 'styled-components';

// Import styled components
import {
  PageContainer,
  Title,
  Form,
  SectionTitle,
  GridContainer,
  FormGroup,
  Label,
  RequiredLabel,
  Input,
  TextArea,
  Select,
  ButtonContainer,
  BackButton,
  SubmitButton,
  ErrorMessage,
  SuccessMessage,
  ErrorAlert,
  LoadingMessage,
  HelperText,
  SearchButton,
  FullWidth
} from '../Styles/StyledCadastrarEmpresa';

// Additional styled components specific to this component

const InputGroup = styled.div`
  display: flex;
  width: 100%;
  
  input {
    border-radius: 8px 0 0 8px !important;
    flex: 1;
  }
`;

const UppercaseInput = styled(Input)`
  text-transform: uppercase;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  
  input[type="checkbox"] {
    width: auto;
    margin: 0;
  }
`;

const FormSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const CadastrarEmpresa = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const setoresAtuacao = [
    'Varejo',
    'Indústria',
    'Serviços',
    'Comércio',
    'Tecnologia da Informação',
    'Saúde',
    'Educação',
    'Construção Civil',
    'Alimentício',
    'Bebidas',
    'Automotivo',
    'Vestuário',
    'Financeiro',
    'Agricultura',
    'Pecuária',
    'Transporte',
    'Logística',
    'Outro'
  ];

  const [formData, setFormData] = useState({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    quantidadeFuncionarios: '0',
    setorAtuacao: '',
    dataFundacao: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      console.log(`[EDIT MODE] Carregando dados da empresa ID: ${id}`);
      const carregarEmpresa = async () => {
        try {
          console.log('Buscando dados da empresa...');
          const empresa = await empresaApiService.buscarEmpresaPorId(id);
          console.log('Dados recebidos da API:', empresa);
          
          setFormData({
            ...empresa,
            dataFundacao: empresa.dataFundacao ? new Date(empresa.dataFundacao).toISOString().split('T')[0] : ''
          });
          
        } catch (error) {
          console.error('Erro ao carregar empresa:', error);
          showToast(`Erro ao carregar os dados da empresa: ${error.message || 'Tente novamente mais tarde.'}`, 'error');
          navigate('/empresas');
        }
      };
      
      carregarEmpresa();
    } else {
      console.log('[NEW MODE] Modo de criação de nova empresa');
    }
  }, [id, navigate]);

  const isRequired = (fieldName) => {
    const requiredFields = [
      'razaoSocial', 'cnpj', 'nomeFantasia', 'email', 
      'telefone', 'cep', 'endereco', 'numero', 
      'bairro', 'cidade', 'estado'
    ];
    return requiredFields.includes(fieldName);
  };

  const RequiredIndicator = () => <RequiredLabel>*</RequiredLabel>;

  const handleCnpjBlur = (e) => {
    const cnpj = e.target.value.replace(/\D/g, '');
    if (cnpj.length === 14) {
      if (!validateCNPJ(cnpj)) {
        setErrors(prev => ({
          ...prev,
          cnpj: 'CNPJ inválido'
        }));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Limpa erros ao digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    // Aplica máscaras conforme o tipo de campo
    let formattedValue = value;
    
    switch (name) {
      case 'cnpj':
        formattedValue = formatCNPJ(value);
        break;
      case 'telefone':
        formattedValue = formatPhone(value);
        break;
      case 'cep':
        formattedValue = formatCEP(value);
        if (formattedValue.replace(/\D/g, '').length === 8) {
          // Se o CEP estiver completo, busca o endereço
          buscarEnderecoPorCep(formattedValue);
        }
        break;
      case 'inscricaoEstadual':
        formattedValue = formatInscricaoEstadual(value);
        break;
      case 'inscricaoMunicipal':
        formattedValue = formatInscricaoMunicipal(value);
        break;
      default:
        break;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };
  
  const handleSearchCnpj = async () => {
    const cnpjLimpo = formData.cnpj.replace(/\D/g, '');
    
    if (!validateCNPJ(cnpjLimpo)) {
      setErrors(prev => ({
        ...prev,
        cnpj: 'CNPJ inválido'
      }));
      return;
    }
    
    setIsSearching(true);
    setError('');
    
    try {
      const dadosEmpresa = await consultarCNPJ(cnpjLimpo);
      
      setFormData(prev => ({
        ...prev,
        razaoSocial: dadosEmpresa.razaoSocial || '',
        nomeFantasia: dadosEmpresa.nomeFantasia || '',
        cep: dadosEmpresa.cep ? formatCEP(dadosEmpresa.cep) : '',
        endereco: dadosEmpresa.endereco || '',
        numero: dadosEmpresa.numero || '',
        complemento: dadosEmpresa.complemento || '',
        bairro: dadosEmpresa.bairro || '',
        cidade: dadosEmpresa.cidade || '',
        estado: dadosEmpresa.estado || '',
        telefone: dadosEmpresa.telefone ? formatPhone(dadosEmpresa.telefone) : '',
        email: dadosEmpresa.email || '',
        inscricaoEstadual: dadosEmpresa.inscricaoEstadual || '',
        inscricaoMunicipal: dadosEmpresa.inscricaoMunicipal || ''
      }));
      
    } catch (error) {
      console.error('Erro ao consultar CNPJ:', error);
      showToast('Não foi possível consultar os dados do CNPJ. Por favor, preencha os dados manualmente.', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log('Envio já em andamento, ignorando clique duplo');
      return;
    }
    
    console.log('Iniciando envio do formulário...');
    
    // Valida os campos
    const isValid = validateAllFields();
    if (!isValid) {
      console.warn('Formulário inválido, não foi possível enviar');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepara os dados para envio
      const empresaData = {
        cnpj: removeMask(formData.cnpj),
        razaoSocial: formData.razaoSocial.trim(),
        nomeFantasia: formData.nomeFantasia.trim(),
        email: formData.email.trim(),
        telefone: removeMask(formData.telefone),
        cep: removeMask(formData.cep),
        endereco: formData.endereco.trim(),
        numero: formData.numero.trim(),
        complemento: formData.complemento ? formData.complemento.trim() : null,
        bairro: formData.bairro.trim(),
        cidade: formData.cidade.trim(),
        estado: formData.estado.trim(),
        inscricaoEstadual: formData.inscricaoEstadual ? removeMask(formData.inscricaoEstadual) : null,
        inscricaoMunicipal: formData.inscricaoMunicipal ? removeMask(formData.inscricaoMunicipal) : null,
        quantidadeFuncionarios: parseInt(formData.quantidadeFuncionarios, 10) || 0,
        setorAtuacao: formData.setorAtuacao || null,
        dataFundacao: formData.dataFundacao || null
      };
      
      console.log('Dados preparados para envio:', JSON.stringify(empresaData, null, 2));
      
      if (id) {
        console.log(`Atualizando empresa ID: ${id}`);
        await empresaApiService.atualizarEmpresa(id, empresaData);
        console.log('Empresa atualizada com sucesso');
        showToast('Empresa atualizada com sucesso!', 'success');
        setTimeout(() => {
          navigate('/empresas');
        }, 1500);
      } else {
        console.log('Criando nova empresa');
        await empresaApiService.criarEmpresa(empresaData);
        console.log('Empresa criada com sucesso');
        showToast('Empresa cadastrada com sucesso!', 'success');
        setTimeout(() => {
          navigate('/empresas');
        }, 1500);
      }
      
      // Redireciona para a lista de empresas
      console.log('Redirecionando para /empresas');
      navigate('/empresas');
      
    } catch (error) {
      console.error('Erro detalhado ao salvar empresa:', {
        message: error.message,
        status: error.status,
        data: error.data,
        stack: error.stack
      });
      
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Ocorreu um erro ao salvar a empresa. Por favor, tente novamente.';
      
      showToast(errorMessage, 'error');
    } finally {
      console.log('Finalizando processo de envio');
      setIsSubmitting(false);
    }
  };

  const validateAllFields = () => {
    console.log('Validando campos do formulário...');
    const errors = {};
    let hasErrors = false;

    // Validação básica de campos obrigatórios
    const requiredFields = [
      'cnpj', 'razaoSocial', 'nomeFantasia', 'email', 'telefone',
      'endereco', 'numero', 'bairro', 'cidade', 'estado'
    ];

    // Primeiro valida campos obrigatórios
    requiredFields.forEach(field => {
      const value = formData[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors[`${field}Error`] = 'Campo obrigatório';
        hasErrors = true;
      }
    });

    // Validações específicas
    if (formData.cnpj) {
      // Remove formatação para validação
      const cnpjLimpo = formData.cnpj.replace(/\D/g, '');
      const cnpjValido = validateCNPJ(cnpjLimpo);
      if (!cnpjValido) {
        errors.cnpjError = 'CNPJ inválido';
        hasErrors = true;
      }
    }

    if (formData.email && !validateEmail(formData.email)) {
      errors.emailError = 'E-mail inválido';
      hasErrors = true;
    }

    if (formData.telefone && !validatePhone(formData.telefone)) {
      errors.telefoneError = 'Telefone inválido';
      hasErrors = true;
    }

    if (formData.cep && !validateCEP(formData.cep)) {
      errors.cepError = 'CEP inválido';
      hasErrors = true;
    }

    // Atualiza os estados de erro
    setErrors(errors);

    // Rola até o primeiro campo com erro
    if (hasErrors) {
      const firstErrorField = Object.keys(errors).find(key => key.endsWith('Error') && errors[key]);
      if (firstErrorField) {
        const fieldName = firstErrorField.replace('Error', '');
        const element = document.querySelector(`[name="${fieldName}"]`);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
            element.classList.add('field-error-highlight');
            setTimeout(() => element.classList.remove('field-error-highlight'), 2000);
          }, 100);
        }
      }
    }

    console.log('Validação concluída', { hasErrors, errors });
    return !hasErrors;
  };

  return (
    <PageContainer>
      <Title>
        <FiBriefcase />
        {id ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}
      </Title>
      
      {error && (
        <ErrorAlert>
          <FiAlertCircle /> {error}
        </ErrorAlert>
      )}
      
      {success && (
        <SuccessMessage>
          <FiCheckCircle /> {success}
        </SuccessMessage>
      )}
      
      {isSubmitting && (
        <LoadingMessage>
          <FiRefreshCw className="spin" />
          {id ? 'Atualizando empresa...' : 'Cadastrando empresa...'}
        </LoadingMessage>
      )}
      
      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>
            <FiBriefcase /> Dados da Empresa
          </SectionTitle>
          
          <GridContainer>
            <FullWidth>
              <FormGroup>
                <Label>CNPJ {isRequired('cnpj') && <RequiredIndicator />}</Label>
                <InputGroup>
                  <Input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    onBlur={(e) => {
                      const cnpj = e.target.value.replace(/\D/g, '');
                      if (cnpj.length === 14) {
                        if (!validateCNPJ(cnpj)) {
                          setErrors(prev => ({
                            ...prev,
                            cnpj: 'CNPJ inválido'
                          }));
                        }
                      }
                    }}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    disabled={isSubmitting || isSearching || !!id}
                    $hasError={!!errors.cnpj}
                  />
                  {!id && (
                    <SearchButton 
                      type="button" 
                      onClick={handleSearchCnpj} 
                      disabled={isSubmitting || isSearching || !formData.cnpj || formData.cnpj.length < 14}
                    >
                      {isSearching ? <FiRefreshCw className="spin" /> : <FiSearch />}
                      Buscar
                    </SearchButton>
                  )}
                </InputGroup>
                {errors.cnpj && <ErrorMessage>{errors.cnpj}</ErrorMessage>}
                {!id && (
                  <HelperText>
                    <FiInfo /> Digite o CNPJ e clique em buscar para preencher os dados automaticamente
                  </HelperText>
                )}
              </FormGroup>
            </FullWidth>
            
            <div>
              <FormGroup>
                <label>Razão Social {isRequired('razaoSocial') && <RequiredIndicator />}</label>
                <Input
                  type="text"
                  name="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={handleInputChange}
                  placeholder="Razão Social"
                  disabled={isSubmitting}
                  $error={!!errors.razaoSocial}
                />
                {errors.razaoSocial && <ErrorText>{errors.razaoSocial}</ErrorText>}
              </FormGroup>
            </div>
            
            <div>
              <FormGroup>
                <label>Nome Fantasia {isRequired('nomeFantasia') && <RequiredIndicator />}</label>
                <Input
                  type="text"
                  name="nomeFantasia"
                  value={formData.nomeFantasia}
                  onChange={handleInputChange}
                  placeholder="Nome Fantasia"
                  disabled={isSubmitting}
                  $error={!!errors.nomeFantasia}
                />
                {errors.nomeFantasia && <ErrorText>{errors.nomeFantasia}</ErrorText>}
              </FormGroup>
            </div>
            
            <div>
              <FormGroup>
                <label>E-mail {isRequired('email') && <RequiredIndicator />}</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@exemplo.com"
                  disabled={isSubmitting}
                  $error={!!errors.email}
                />
                {errors.email && <ErrorText>{errors.email}</ErrorText>}
              </FormGroup>
            </div>
            
            <div>
              <FormGroup>
                <label>Telefone {isRequired('telefone') && <RequiredIndicator />}</label>
                <Input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  disabled={isSubmitting}
                  $error={!!errors.telefone}
                />
                {errors.telefone && <ErrorText>{errors.telefone}</ErrorText>}
              </FormGroup>
            </div>
            
            <div>
              <FormGroup>
                <label>CEP {isRequired('cep') && <RequiredIndicator />}</label>
                <Input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                  placeholder="00000-000"
                  maxLength={9}
                  disabled={isSubmitting}
                  $error={!!errors.cep}
                />
                {errors.cep && <ErrorText>{errors.cep}</ErrorText>}
              </FormGroup>
            </div>
            
            <div>
              <FormGroup>
                <label>Endereço {isRequired('endereco') && <RequiredIndicator />}</label>
                <Input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  placeholder="Rua, Avenida, etc."
                  disabled={isSubmitting}
                />
              </FormGroup>
            </div>
            
            <div>
              <FormGroup>
                <label>Número {isRequired('numero') && <RequiredIndicator />}</label>
                <Input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  placeholder="Número"
                  disabled={isSubmitting}
                />
              </FormGroup>
            </div>
            
            <div>
              <FormGroup>
                <label>Complemento</label>
                <Input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleInputChange}
                  placeholder="Complemento"
                  disabled={isSubmitting}
                />
              </FormGroup>
            </div>
            
            <div>
              <FormGroup>
                <label>Bairro {isRequired('bairro') && <RequiredIndicator />}</label>
                <Input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleInputChange}
                  placeholder="Bairro"
                  disabled={isSubmitting}
                />
              </FormGroup>
            </div>
            
            <div>
              <FormGroup>
                <label>Cidade {isRequired('cidade') && <RequiredIndicator />}</label>
                <Input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  placeholder="Cidade"
                  disabled={isSubmitting}
                />
              </FormGroup>
            </div>
            
            <div>
              <FormGroup>
                <label>Estado {isRequired('estado') && <RequiredIndicator />}</label>
                <UppercaseInput
                  type="text"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  placeholder="UF"
                  maxLength={2}
                  disabled={isSubmitting}
                />
              </FormGroup>
            </div>
            
            <div>
              <FormGroup>
                <label>Inscrição Estadual</label>
                <Input
                  type="text"
                  name="inscricaoEstadual"
                  value={formData.inscricaoEstadual}
                  onChange={handleInputChange}
                  placeholder="Inscrição Estadual"
                  disabled={isSubmitting}
                />
              </FormGroup>
            </div>
            
            <div>
              <FormGroup>
                <label>Inscrição Municipal</label>
                <Input
                  type="text"
                  name="inscricaoMunicipal"
                  value={formData.inscricaoMunicipal}
                  onChange={handleInputChange}
                  placeholder="Inscrição Municipal"
                  disabled={isSubmitting}
                />
              </FormGroup>
            </div>
            
            <div>
              <FormGroup>
                <label>Quantidade de Funcionários</label>
                <Input
                  type="number"
                  name="quantidadeFuncionarios"
                  value={formData.quantidadeFuncionarios}
                  onChange={handleInputChange}
                  min="0"
                  disabled={isSubmitting}
                />
              </FormGroup>
            </div>
            
            <div>
              <FormGroup>
                <label>Setor de Atuação</label>
                <Select 
                  name="setorAtuacao"
                  value={formData.setorAtuacao}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  <option value="">Selecione um setor...</option>
                  {setoresAtuacao.map((setor, index) => (
                    <option key={index} value={setor}>
                      {setor}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </div>
            
            <div>
              <FormGroup>
                <label>Data de Fundação</label>
                <Input
                  type="date"
                  name="dataFundacao"
                  value={formData.dataFundacao}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </FormGroup>
            </div>
          </GridContainer>
          
          <ButtonContainer>
            <BackButton 
              type="button" 
              onClick={() => navigate('/empresas')} 
              disabled={isSubmitting}
            >
              <FiArrowLeft /> Voltar
            </BackButton>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <FiRefreshCw className="spin" /> Salvando...
                </>
              ) : (
                <>
                  <FiSave /> {id ? 'Atualizar Empresa' : 'Cadastrar Empresa'}
                </>
              )}
            </SubmitButton>
          </ButtonContainer>
        </FormSection>
      </Form>
    </PageContainer>
  );
};

export default CadastrarEmpresa;
