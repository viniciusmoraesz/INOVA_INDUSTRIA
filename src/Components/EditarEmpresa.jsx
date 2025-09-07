import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
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
  validatePhone, 
  validateNumber, 
  validateRequired,
  formatNumbersOnly
} from '../utils/validators';
import { 
  FiArrowLeft, 
  FiBriefcase, 
  FiMail, 
  FiPhone, 
  FiMapPin,
  FiFileText,
  FiSave,
  FiX,
  FiUsers,
  FiGrid,
  FiCalendar
} from 'react-icons/fi';
import empresaApiService from '../services/empresaApiService';

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
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const BackButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #495057;
  font-weight: 500;
  
  &:hover {
    background-color: #e9ecef;
  }
  
  svg {
    font-size: 1.1em;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #2d3436;
  margin: 0;
  flex: 1;
`;

const FormSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
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
    input, select {
      border-color: #e63946;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: ${props => props.disabled ? '#f8f9fa' : 'white'};
  
  &:focus {
    outline: none;
    border-color: #4a6cf7;
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4a6cf7;
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
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
`;

const SecondaryButton = styled(PrimaryButton)`
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #e9ecef;
  
  &:hover:not(:disabled) {
    background: #e9ecef;
    color: #2d3436;
  }
`;

const ErrorText = styled.span`
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

const TabsContainer = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;
`;

const TabsHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  background: none;
  font-size: 0.95rem;
  font-weight: 500;
  color: #6c757d;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #4a6cf7;
  }
  
  &.active {
    color: #4a6cf7;
    border-bottom-color: #4a6cf7;
  }
  
  svg {
    font-size: 1.1em;
  }
`;

const TabContent = styled.div`
  display: ${props => props.$active ? 'block' : 'none'};
  animation: ${fadeIn} 0.3s ease-out;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.2rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EditarEmpresa = () => {
  const [activeTab, setActiveTab] = useState('dados');
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    quantidadeFuncionarios: '0',
    setorAtuacao: '',
    dataFundacao: '',
  });

  const carregarEmpresa = async (empresaId) => {
    try {
      console.log('Buscando dados da empresa com ID:', empresaId);
      const empresa = await empresaApiService.buscarEmpresaPorId(empresaId);
      console.log('Dados recebidos da API:', empresa);
      
      const dataFormatada = {
        ...empresa,
        dataFundacao: empresa.dataFundacao ? new Date(empresa.dataFundacao).toISOString().split('T')[0] : '',
      };
      
      console.log('Dados formatados para o formulário:', dataFormatada);
      setFormData(dataFormatada);
      
    } catch (error) {
      console.error('Erro detalhado ao carregar empresa:', {
        message: error.message,
        status: error.status,
        data: error.data,
        stack: error.stack
      });
          
      alert(`Erro ao carregar os dados da empresa: ${error.message || 'Tente novamente mais tarde.'}`);
      navigate('/empresas');
    }
  };

  useEffect(() => {
    console.log('=== DEBUG EditarEmpresa ===');
    console.log('ID capturado:', id);
    console.log('Tipo do ID:', typeof id);
    console.log('window.location.pathname:', window.location.pathname);
    
    // Tentar extrair ID da URL manualmente se useParams falhar
    const pathParts = window.location.pathname.split('/');
    const urlId = pathParts[pathParts.length - 1];
    console.log('ID extraído da URL:', urlId);
    
    const finalId = id || urlId;
    console.log('ID final a ser usado:', finalId);
    
    if (finalId && finalId !== 'undefined') {
      carregarEmpresa(finalId);
    } else {
      console.error('ID não fornecido ou inválido');
      setError('ID da empresa não fornecido ou inválido');
    }
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      console.log('Enviando dados do formulário:', formData);
      
      const empresaData = {
        ...formData,
        cnpj: formData.cnpj.replace(/\D/g, ''),
        telefone: formData.telefone.replace(/\D/g, ''),
        cep: formData.cep.replace(/\D/g, ''),
        inscricaoEstadual: formData.inscricaoEstadual ? formData.inscricaoEstadual.replace(/\D/g, '') : null,
        inscricaoMunicipal: formData.inscricaoMunicipal ? formData.inscricaoMunicipal.replace(/\D/g, '') : null,
        quantidadeFuncionarios: parseInt(formData.quantidadeFuncionarios, 10) || 0,
      };
      
      console.log('Dados preparados para envio:', JSON.stringify(empresaData, null, 2));
      
      await empresaApiService.atualizarEmpresa(id, empresaData);
      console.log('Empresa atualizada com sucesso');
      
      setSuccess('Empresa atualizada com sucesso!');
      setTimeout(() => {
        navigate('/empresas');
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      setError(error.message || 'Ocorreu um erro ao atualizar a empresa. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const buscarEnderecoPorCEP = async (cep) => {
    try {
      const cepLimpo = cep.replace(/\D/g, '');
      if (cepLimpo.length !== 8) return;
      
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const renderField = (name, label, type = 'text', options = null, required = true) => {
    const value = formData[name] || '';
    const error = formData[`${name}Error`];
    const inputId = `field-${name}`;
    
    return (
      <FormGroup className={error ? 'error' : ''}>
        <label htmlFor={inputId}>
          {label}
          {required && <span>*</span>}
        </label>
        
        {type === 'select' ? (
          <Select
            id={inputId}
            name={name}
            value={value}
            onChange={handleInputChange}
            disabled={isSubmitting}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={handleInputChange}
            onBlur={(e) => {
              if (name === 'cep' && e.target.value.replace(/\D/g, '').length === 8) {
                buscarEnderecoPorCEP(e.target.value);
              }
            }}
            placeholder={label}
            disabled={isSubmitting || (name === 'cnpj' && id)}
            required={required}
          />
        )}
        {error && <ErrorText>{error}</ErrorText>}
      </FormGroup>
    );
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/empresas')}>
          <FiArrowLeft /> Voltar para a lista
        </BackButton>
        <Title>Editar Empresa</Title>
      </Header>
      
      <form onSubmit={handleSubmit}>
        <FormSection>
          <TabsContainer>
            <TabsHeader>
              <Tab 
                className={activeTab === 'dados' ? 'active' : ''}
                onClick={() => setActiveTab('dados')}
                type="button"
              >
                <FiBriefcase /> Dados Básicos
              </Tab>
              <Tab 
                className={activeTab === 'endereco' ? 'active' : ''}
                onClick={() => setActiveTab('endereco')}
                type="button"
              >
                <FiMapPin /> Endereço
              </Tab>
              <Tab 
                className={activeTab === 'adicionais' ? 'active' : ''}
                onClick={() => setActiveTab('adicionais')}
                type="button"
              >
                <FiFileText /> Informações Adicionais
              </Tab>
            </TabsHeader>

            {success && <SuccessMessage>{success}</SuccessMessage>}
            {error && <ErrorText>{error}</ErrorText>}

            <TabContent $active={activeTab === 'dados'}>
              <Grid>
                {renderField('cnpj', 'CNPJ', 'text', null, true)}
                {renderField('razaoSocial', 'Razão Social', 'text', null, true)}
                {renderField('nomeFantasia', 'Nome Fantasia', 'text', null, true)}
                {renderField('email', 'E-mail', 'email', null, true)}
                {renderField('telefone', 'Telefone', 'text', null, true)}
                {renderField('dataFundacao', 'Data de Fundação', 'date', null, false)}
              </Grid>
            </TabContent>

            <TabContent $active={activeTab === 'endereco'}>
              <Grid>
                {renderField('cep', 'CEP', 'text', null, true)}
                {renderField('endereco', 'Endereço', 'text', null, true)}
                {renderField('numero', 'Número', 'text', null, true)}
                {renderField('complemento', 'Complemento', 'text', null, false)}
                {renderField('bairro', 'Bairro', 'text', null, true)}
                {renderField('cidade', 'Cidade', 'text', null, true)}
                {renderField('estado', 'Estado', 'text', null, true)}
              </Grid>
            </TabContent>

            <TabContent $active={activeTab === 'adicionais'}>
              <Grid>
                {renderField('inscricaoEstadual', 'Inscrição Estadual', 'text', null, false)}
                {renderField('inscricaoMunicipal', 'Inscrição Municipal', 'text', null, false)}
                {renderField('quantidadeFuncionarios', 'Quantidade de Funcionários', 'number', null, false)}
                {renderField('setorAtuacao', 'Setor de Atuação', 'text', null, false)}
              </Grid>
            </TabContent>
          </TabsContainer>

          <ButtonGroup>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              <FiSave /> {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </PrimaryButton>
            <SecondaryButton type="button" onClick={() => navigate('/empresas')} disabled={isSubmitting}>
              <FiX /> Cancelar
            </SecondaryButton>
          </ButtonGroup>
        </FormSection>
      </form>
    </PageContainer>
  );
};

export default EditarEmpresa;
