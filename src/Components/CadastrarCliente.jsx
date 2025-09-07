import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { 
  FiArrowLeft, 
  FiUser, 
  FiBriefcase, 
  FiMail, 
  FiPhone, 
  FiFileText, 
  FiCheck, 
  FiX,
  FiSave,
  FiAlertCircle,
  FiChevronDown,
  FiPlus,
  FiTrash2,
  FiMapPin,
  FiHome,
  FiRefreshCw,
  FiCalendar,
  FiUsers
} from 'react-icons/fi';
import empresaApiService from '../services/empresaApiService';
import { clienteApiService } from '../services/clienteApiService';

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

const FormContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  color: #2d3436;
  margin: 1.5rem 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #6c5ce7;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    
    > * {
      flex: 1;
    }
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .required {
    color: #e63946;
    margin-left: 0.25rem;
  }
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f3f5;
  
  @media (max-width: 480px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

const Button = styled.button.attrs({
  // Usando transient props com $ para evitar que sejam passadas para o DOM
  $primary: props => props.$primary || false,
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  background-color: ${props => props.$primary ? '#6c5ce7' : '#f8f9fa'};
  color: ${props => props.$primary ? 'white' : '#2d3436'};
  
  ${props => props.$primary ? `
    box-shadow: 0 2px 10px rgba(108, 92, 231, 0.3);
    
    &:hover {
      background-color: #5d4acf;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(108, 92, 231, 0.4);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(108, 92, 231, 0.3);
    }
  ` : `
    border-color: #e9ecef;
    
    &:hover {
      background-color: #f1f3f5;
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
  }
  
  svg {
    font-size: 1.1em;
  }
`;

const DangerButton = styled(Button)`
  background-color: #fff5f5;
  color: #e63946;
  border: 1px solid #fed7d7;
  
  &:hover {
    background-color: #fff1f1;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(229, 62, 62, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CadastrarCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [empresas, setEmpresas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    cargo: '',
    departamento: '',
    dataNascimento: '',
    idEmpresa: '',
    senha: '',
    role: 'CLIENTE' // Valor padrão para role
  });

  // Load client data if in edit mode
  useEffect(() => {
    const carregarCliente = async () => {
      if (id) {
        try {
          const cliente = await clienteApiService.buscarClientePorId(id);
          setFormData({
            ...cliente,
            // Format the date for the date input
            dataNascimento: cliente.dataNascimento ? new Date(cliente.dataNascimento).toISOString().split('T')[0] : ''
          });
          setIsEditing(true);
        } catch (error) {
          console.error('Erro ao carregar cliente:', error);
          alert('Erro ao carregar dados do cliente');
          navigate('/clientes');
        }
      }
    };

    carregarCliente();
  }, [id, navigate]);

  // Load companies
  useEffect(() => {
    const carregarEmpresas = async () => {
      try {
        setIsLoading(true);
        const empresasData = await empresaApiService.listarEmpresas();
        console.log('Empresas carregadas:', empresasData);
        console.log('Estrutura da primeira empresa:', empresasData?.[0]);
        setEmpresas(empresasData || []);
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
        setEmpresas([]);
      } finally {
        setIsLoading(false);
      }
    };

    carregarEmpresas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Convert idEmpresa to number when selected, keep empty string for default option
    let processedValue = value;
    if (name === 'idEmpresa' && value && value !== '') {
      processedValue = parseInt(value, 10);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitCount(prev => prev + 1);
    setError(null); // Reset error state
    
    try {
      console.log('Iniciando envio do formulário...');
      
      // Format CPF (remove formatting)
      const cpfLimpo = formData.cpf ? formData.cpf.replace(/\D/g, '') : '';
      
      // Basic validation
      if (!cpfLimpo || !formData.nome || !formData.idEmpresa) {
        throw new Error('CPF, Nome e Empresa são campos obrigatórios');
      }

      // Validate idEmpresa is a valid number
      const empresaId = parseInt(formData.idEmpresa, 10);
      if (isNaN(empresaId) || empresaId <= 0) {
        throw new Error('Selecione uma empresa válida');
      }
      
      // Validate CPF length (11 digits)
      if (cpfLimpo.length !== 11) {
        throw new Error('CPF deve conter 11 dígitos');
      }
      
      // Prepare data for API
      const clienteData = {
        ...formData,
        cpf: cpfLimpo,
        telefone: formData.telefone ? formData.telefone.replace(/\D/g, '') : null,
        role: formData.role || 'CLIENTE',
        idEmpresa: empresaId, // Use validated number
        // Only include password if it's a new user or if it was changed
        ...(formData.senha ? { senha: formData.senha } : {})
      };

      console.log('=== DEBUG CADASTRO CLIENTE ===');
      console.log('FormData completo:', JSON.stringify(formData, null, 2));
      console.log('idEmpresa original:', formData.idEmpresa, 'tipo:', typeof formData.idEmpresa);
      console.log('idEmpresa convertido:', empresaId, 'tipo:', typeof empresaId);
      console.log('Dados do cliente preparados para envio:', JSON.stringify(clienteData, null, 2));
      console.log('================================');

      let response;
      if (isEditing && id) {
        console.log('Atualizando cliente existente...');
        response = await clienteApiService.atualizarCliente(id, clienteData);
      } else {
        console.log('Verificando se o cliente já existe...');
        const clientes = await clienteApiService.listarClientes();
        const clienteExistente = clientes.find(c => c.cpf === cpfLimpo);
        
        if (clienteExistente) {
          const confirmarAtualizacao = window.confirm(
            `Já existe um cliente cadastrado com este CPF (${cpfLimpo}). Deseja atualizar os dados?`
          );
          
          if (confirmarAtualizacao) {
            console.log('Atualizando cliente existente...');
            response = await clienteApiService.atualizarCliente(clienteExistente.id, clienteData);
          } else {
            console.log('Atualização cancelada pelo usuário');
            return; // User chose not to update
          }
        } else {
          console.log('Criando novo cliente...');
          // For new users, password is required
          if (!clienteData.senha) {
            throw new Error('A senha é obrigatória para novos clientes');
          }
          response = await clienteApiService.criarCliente(clienteData);
        }
      }
      
      console.log('Cliente processado com sucesso:', response);
      
      // Show success message and redirect
      alert(`Cliente ${response.nome} ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`);
      navigate('/clientes');
      
    } catch (error) {
      console.error('Erro ao processar cliente:', error);
      
      // Create a more descriptive error message
      let errorMessage = 'Ocorreu um erro ao processar o cliente. Por favor, tente novamente.';
      
      // Check for network errors
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
      } 
      // Check for validation errors from the server
      else if (error.status === 400) {
        errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
        if (error.data) {
          errorMessage += '\n' + JSON.stringify(error.data, null, 2);
        }
      }
      // Use the error message from the server if available
      else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      console.log('Finalizando envio do formulário');
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/clientes')}>
          <FiArrowLeft /> Voltar
        </BackButton>
        <Title>{isEditing ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}</Title>
      </Header>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <SectionTitle>
            <FiUser size={20} />
            Dados Pessoais
          </SectionTitle>
          
          <FormRow>
            <FormGroup>
              <Label>
                Nome Completo <span className="required">*</span>
              </Label>
              <Input 
                type="text" 
                name="nome" 
                value={formData.nome} 
                onChange={handleInputChange} 
                placeholder="Nome completo do cliente"
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>
                CPF <span className="required">*</span>
              </Label>
              <Input 
                type="text" 
                name="cpf" 
                value={formData.cpf} 
                onChange={handleInputChange} 
                placeholder="000.000.000-00"
                required 
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label>Data de Nascimento</Label>
              <Input 
                type="date" 
                name="dataNascimento" 
                value={formData.dataNascimento || ''} 
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Telefone</Label>
              <Input 
                type="tel" 
                name="telefone" 
                value={formData.telefone} 
                onChange={handleInputChange} 
                placeholder="(00) 00000-0000"
              />
            </FormGroup>
          </FormRow>
          
          <SectionTitle>
            <FiMail size={20} />
            Contato
          </SectionTitle>
          
          <FormRow>
            <FormGroup>
              <Label>
                E-mail <span className="required">*</span>
              </Label>
              <Input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="email@exemplo.com.br"
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Senha {!isEditing && <span className="required">*</span>}</Label>
              <Input 
                type="password" 
                name="senha" 
                value={formData.senha || ''} 
                onChange={handleInputChange} 
                placeholder={isEditing ? "Deixe em branco para não alterar" : "Senha de acesso"}
                required={!isEditing}
              />
            </FormGroup>
          </FormRow>
          
          <SectionTitle>
            <FiBriefcase size={20} />
            Dados Profissionais
          </SectionTitle>
          
          <FormRow>
            <FormGroup>
              <Label>
                Empresa <span className="required">*</span>
              </Label>
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6c757d' }}>
                  <FiRefreshCw className="spin" />
                  Carregando empresas...
                </div>
              ) : (
                <Select 
                  name="idEmpresa" 
                  value={formData.idEmpresa || ''} 
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Selecione uma empresa</option>
                  {empresas.map((empresa, index) => {
                    console.log(`Empresa ${index}:`, empresa);
                    return (
                      <option 
                        key={empresa.id ? `empresa-${empresa.id}` : `empresa-index-${index}`} 
                        value={empresa.id || ''}
                      >
                        {empresa.nomeFantasia || empresa.razaoSocial || empresa.nome || `Empresa ${index + 1}`}
                      </option>
                    );
                  })}
                </Select>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label>Cargo</Label>
              <Input 
                type="text" 
                name="cargo" 
                value={formData.cargo || ''} 
                onChange={handleInputChange} 
                placeholder="Cargo na empresa"
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label>Departamento</Label>
              <Input 
                type="text" 
                name="departamento" 
                value={formData.departamento || ''} 
                onChange={handleInputChange} 
                placeholder="Departamento"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Função</Label>
              <Select 
                name="role" 
                value={formData.role || 'CLIENTE'} 
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                <option value="CLIENTE">Cliente</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </Select>
            </FormGroup>
          </FormRow>
          
          <SectionTitle>
            <FiFileText size={20} />
            Observações
          </SectionTitle>
          
          <FormGroup>
            <Label>Observações adicionais</Label>
            <textarea 
              name="observacoes" 
              value={formData.observacoes || ''} 
              onChange={handleInputChange} 
              placeholder="Digite observações adicionais sobre o cliente"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '0.75rem 1rem',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                transition: 'all 0.2s ease',
              }}
            />
          </FormGroup>
          
          {error && (
            <div style={{ 
              backgroundColor: '#fff5f5', 
              borderLeft: '4px solid #e53e3e', 
              padding: '1rem', 
              marginBottom: '1.5rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#e53e3e'
            }}>
              <FiAlertCircle size={20} />
              {error}
            </div>
          )}
          
          <ButtonGroup>
            <Button 
              type="button" 
              onClick={() => navigate(-1)}
              style={{ marginRight: 'auto' }}
              disabled={isLoading}
            >
              <FiX size={16} />
              Cancelar
            </Button>
            
            <Button 
              type="submit" 
              $primary
              disabled={isSubmitting}
            >
              <FiSave /> {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
            </Button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default CadastrarCliente;
