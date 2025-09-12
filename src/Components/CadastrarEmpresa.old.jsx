import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
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
  FiX, 
  FiSearch,
  FiInfo,
  FiBriefcase,
  FiMapPin,
  FiFileText,
  FiMail, 
  FiPhone
} from 'react-icons/fi';
import empresaApiService from '../services/empresaApiService';
import { consultarCNPJ } from '../services/cnpjService';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  animation: ${fadeIn} 0.3s ease-out;
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-top: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #4a6cf7;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f0f2f5;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #2d3436;
  margin: 0 0 0 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #495057;
    position: relative;
    
    span {
      display: inline !important;
    }
  }
  
  &.error input,
  &.error select {
    border-color: #fa5252;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.$error ? '#ff4444' : '#e9ecef'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: ${props => props.disabled ? '#f8f9fa' : 'white'};
  color: #333;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
  background-size: 0.65rem auto;
  padding-right: 2.5rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.$error ? '#ff4444' : '#4a6cf7'};
    box-shadow: 0 0 0 2px ${props => props.$error ? 'rgba(255, 68, 68, 0.2)' : 'rgba(74, 108, 247, 0.2)'};
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.8;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.$error ? '#ff4444' : '#e9ecef'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: ${props => props.disabled ? '#f8f9fa' : 'white'};
  color: #333;

  &:focus {
    outline: none;
    border-color: ${props => props.$error ? '#ff4444' : '#4a6cf7'};
    box-shadow: 0 0 0 2px ${props => props.$error ? 'rgba(255, 68, 68, 0.2)' : 'rgba(74, 108, 247, 0.2)'};
  }
  
  &:focus {
    outline: none;
    border-color: #4a6cf7;
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
  }
`;

const Button = styled.button`
  background: #4a6cf7;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #3a5ce4;
  }
  
  &:disabled {
    background: #a8b4e0;
    cursor: not-allowed;
  }
  
  &.secondary {
    background: #f8f9fa;
    color: #495057;
    border: 1px solid #e9ecef;
    
    &:hover:not(:disabled) {
      background: #e9ecef;
    }
  }
`;

const SearchButton = styled(Button)`
  background: #6c757d;
  border-radius: 0 8px 8px 0;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0 1rem;
  
  &:hover:not(:disabled) {
    background: #5a6268;
  }
`;

const InputGroup = styled.div`
  display: flex;
  
  input {
    border-radius: 8px 0 0 8px;
  }
`;

const HelperText = styled.p`
  font-size: 0.875rem;
  color: #6c757d;
  margin: 0.5rem 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

// ErrorText component is already defined above, removing duplicate

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

  const RequiredIndicator = () => <span style={{ color: '#ff4444', marginLeft: '2px' }}>*</span>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Limpa erros ao digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    // Aplica máscaras conforme necessário
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
  
  const handleSearchCNPJ = async () => {
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
      <Header>
        <BackButton onClick={() => navigate('/empresas')}>
          <FiArrowLeft /> Voltar para a lista
        </BackButton>
        <Title>
          {id ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}
        </Title>
      </Header>
      
      <FormContainer>
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorText>{error}</ErrorText>}
        
        <form onSubmit={handleSubmit}>
          <Grid>
            <FullWidth>
              <FormGroup>
                <label>CNPJ {isRequired('cnpj') && <RequiredIndicator />}</label>
                <InputGroup>
                  <Input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    disabled={isSubmitting || !!id}
                    $error={!!errors.cnpj}
                  />
                  {!id && (
                    <SearchButton 
                      type="button" 
                      onClick={handleSearchCNPJ}
                      disabled={isSubmitting || isSearching || !formData.cnpj}
                    >
                      <FiSearch /> {isSearching ? 'Buscando...' : 'Buscar'}
                    </SearchButton>
                  )}
                </InputGroup>
                {errors.cnpj && <ErrorText>{errors.cnpj}</ErrorText>}
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
                <Input
                  type="text"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  placeholder="UF"
                  maxLength={2}
                  style={{ textTransform: 'uppercase' }}
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
          </Grid>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Button type="submit" disabled={isSubmitting}>
              <FiSave /> {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button 
              type="button" 
              className="secondary" 
              onClick={() => navigate('/empresas')} 
              disabled={isSubmitting}
            >
              <FiX /> Cancelar
            </Button>
          </div>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default CadastrarEmpresa;
