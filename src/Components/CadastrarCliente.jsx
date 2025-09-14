import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiFileText, 
  FiCalendar,
  FiSave,
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw,
  FiBriefcase,
  FiUsers,
  FiHome
} from 'react-icons/fi';
import { clienteApiService } from '../services/clienteApiService';
import empresaApiService from '../services/empresaApiService';
import { formatCPF, formatPhone, removeMask } from '../utils/masks';
import { 
  validateCPF, 
  validateEmail, 
  validatePhone, 
  validateBirthDate,
  validateRequired 
} from '../utils/validators';

// Import styled components
import {
  PageContainer,
  Header,
  BackButton,
  Title,
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  ErrorMessage,
  ButtonContainer,
  SubmitButton,
  GridContainer,
  FullWidthInput,
  FullWidthTextArea,
  StatusSelect,
  RequiredLabel,
  LoadingMessage,
  SuccessMessage,
  ErrorAlert
} from '../Styles/StyledCadastrarCliente';

const CadastrarCliente = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    senha: '',
    idEmpresa: '',
    cargo: '',
    departamento: '',
    role: 'CLIENTE',
    observacoes: ''
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Load empresas on component mount
  useEffect(() => {
    const loadEmpresas = async () => {
      try {
        const response = await empresaApiService.listarEmpresas();
        setEmpresas(response || []);
      } catch (err) {
        console.error('Erro ao carregar empresas:', err);
        setError('Erro ao carregar a lista de empresas. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    loadEmpresas();
  }, []);

  // Load client data if editing
  useEffect(() => {
    if (isEditing) {
      const loadCliente = async () => {
        try {
          const response = await clienteApiService.buscarClientePorId(id);
          const clienteData = response.data;
          
          setFormData({
            nome: clienteData.nome || '',
            cpf: clienteData.cpf || '',
            dataNascimento: clienteData.dataNascimento?.split('T')[0] || '',
            telefone: clienteData.telefone || '',
            email: clienteData.email || '',
            senha: '', // Don't load password
            idEmpresa: clienteData.empresa?.id || '',
            cargo: clienteData.cargo || '',
            departamento: clienteData.departamento || '',
            role: clienteData.role || 'CLIENTE',
            observacoes: clienteData.observacoes || ''
          });
        } catch (err) {
          console.error('Erro ao carregar cliente:', err);
          setError('Erro ao carregar os dados do cliente. Tente novamente.');
        }
      };
      
      loadCliente();
    }
  }, [id, isEditing]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Apply masks
    if (name === 'cpf') {
      setFormData({
        ...formData,
        [name]: formatCPF(value)
      });
    } else if (name === 'telefone') {
      setFormData({
        ...formData,
        [name]: formatPhone(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    // Required fields validation
    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
      isValid = false;
    }
    
    if (!formData.cpf) {
      errors.cpf = 'CPF é obrigatório';
      isValid = false;
    } else if (!validateCPF(removeMask(formData.cpf))) {
      errors.cpf = 'CPF inválido';
      isValid = false;
    }
    
    if (!formData.dataNascimento) {
      errors.dataNascimento = 'Data de nascimento é obrigatória';
      isValid = false;
    } else if (!validateBirthDate(formData.dataNascimento)) {
      errors.dataNascimento = 'Data de nascimento inválida';
      isValid = false;
    }
    
    if (!formData.telefone) {
      errors.telefone = 'Telefone é obrigatório';
      isValid = false;
    } else if (!validatePhone(removeMask(formData.telefone))) {
      errors.telefone = 'Telefone inválido';
      isValid = false;
    }
    
    if (!formData.email) {
      errors.email = 'E-mail é obrigatório';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = 'E-mail inválido';
      isValid = false;
    }
    
    if (!isEditing && !formData.senha) {
      errors.senha = 'Senha é obrigatória';
      isValid = false;
    }
    
    if (!formData.idEmpresa) {
      errors.idEmpresa = 'Empresa é obrigatória';
      isValid = false;
    }
    
    setFieldErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const clienteData = {
        ...formData,
        cpf: removeMask(formData.cpf),
        telefone: removeMask(formData.telefone),
        // Only include password if it's being set/changed
        ...(formData.senha ? { senha: formData.senha } : {})
      };
      
      if (isEditing) {
        await clienteApiService.atualizarCliente(id, clienteData);
      } else {
        await clienteApiService.criarCliente(clienteData);
      }
      
      setSubmitStatus('success');
      
      // Redirect after successful submission
      setTimeout(() => {
        navigate('/clientes');
      }, 2000);
      
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      setError(err.response?.data?.message || 'Erro ao salvar o cliente. Tente novamente.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/clientes');
  };

  if (isLoading && isEditing) {
    return (
      <PageContainer>
        <LoadingMessage>
          <FiRefreshCw className="spin" />
          Carregando dados do cliente...
        </LoadingMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Title>{isEditing ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}</Title>
      
      <Form onSubmit={handleSubmit}>
        {error && (
          <ErrorAlert>
            <FiAlertCircle />
            <span>{error}</span>
          </ErrorAlert>
        )}
        
        {submitStatus === 'success' && (
          <SuccessMessage>
            <FiCheckCircle />
            <span>Cliente {isEditing ? 'atualizado' : 'cadastrado'} com sucesso!</span>
          </SuccessMessage>
        )}
        
        <GridContainer>
          <FormGroup>
            <Label>Nome Completo <RequiredLabel>*</RequiredLabel></Label>
            <Input 
              type="text" 
              name="nome" 
              value={formData.nome} 
              onChange={handleInputChange}
              placeholder="Digite o nome completo"
              disabled={isSubmitting}
            />
            {fieldErrors.nome && <ErrorMessage>{fieldErrors.nome}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label>CPF <RequiredLabel>*</RequiredLabel></Label>
            <Input 
              type="text" 
              name="cpf" 
              value={formData.cpf} 
              onChange={handleInputChange}
              placeholder="000.000.000-00"
              maxLength="14"
              disabled={isSubmitting || isEditing}
            />
            {fieldErrors.cpf && <ErrorMessage>{fieldErrors.cpf}</ErrorMessage>}
          </FormGroup>
        </GridContainer>
        
        <GridContainer>
          <FormGroup>
            <Label>Data de Nascimento <RequiredLabel>*</RequiredLabel></Label>
            <Input 
              type="date" 
              name="dataNascimento" 
              value={formData.dataNascimento} 
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
              disabled={isSubmitting}
            />
            {fieldErrors.dataNascimento && <ErrorMessage>{fieldErrors.dataNascimento}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label>Telefone <RequiredLabel>*</RequiredLabel></Label>
            <Input 
              type="tel" 
              name="telefone" 
              value={formData.telefone} 
              onChange={handleInputChange}
              placeholder="(00) 00000-0000"
              maxLength="15"
              disabled={isSubmitting}
            />
            {fieldErrors.telefone && <ErrorMessage>{fieldErrors.telefone}</ErrorMessage>}
          </FormGroup>
        </GridContainer>
        
        <GridContainer>
          <FormGroup>
            <Label>E-mail <RequiredLabel>*</RequiredLabel></Label>
            <Input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange}
              placeholder="exemplo@email.com"
              disabled={isSubmitting}
            />
            {fieldErrors.email && <ErrorMessage>{fieldErrors.email}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label>Senha {!isEditing && <RequiredLabel>*</RequiredLabel>}</Label>
            <Input 
              type="password" 
              name="senha" 
              value={formData.senha} 
              onChange={handleInputChange}
              placeholder={isEditing ? "Deixe em branco para não alterar" : "Digite uma senha"}
              disabled={isSubmitting}
            />
            {fieldErrors.senha && <ErrorMessage>{fieldErrors.senha}</ErrorMessage>}
          </FormGroup>
        </GridContainer>
        
        <GridContainer>
          <FormGroup>
            <Label>Empresa <RequiredLabel>*</RequiredLabel></Label>
            <Select 
              name="idEmpresa" 
              value={formData.idEmpresa} 
              onChange={handleInputChange}
              disabled={isSubmitting || isLoading}
            >
              <option value="">Selecione uma empresa</option>
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id.toString()}>
                  {empresa.nomeFantasia || empresa.razaoSocial}
                </option>
              ))}
            </Select>
            {fieldErrors.idEmpresa && <ErrorMessage>{fieldErrors.idEmpresa}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label>Cargo</Label>
            <Input 
              type="text" 
              name="cargo" 
              value={formData.cargo} 
              onChange={handleInputChange}
              placeholder="Cargo do cliente"
              disabled={isSubmitting}
            />
          </FormGroup>
        </GridContainer>
        
        <GridContainer>
          <FormGroup>
            <Label>Departamento</Label>
            <Input 
              type="text" 
              name="departamento" 
              value={formData.departamento} 
              onChange={handleInputChange}
              placeholder="Departamento do cliente"
              disabled={isSubmitting}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Função <RequiredLabel>*</RequiredLabel></Label>
            <Select 
              name="role" 
              value={formData.role} 
              onChange={handleInputChange}
              disabled={isSubmitting}
            >
              <option value="CLIENTE">Cliente</option>
              <option value="ADMIN">Administrador</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </Select>
          </FormGroup>
        </GridContainer>
        
        <FormGroup>
          <Label>Observações</Label>
          <TextArea 
            name="observacoes" 
            value={formData.observacoes} 
            onChange={handleInputChange}
            placeholder="Observações adicionais sobre o cliente"
            rows="4"
            disabled={isSubmitting}
          />
        </FormGroup>
        
        <ButtonContainer>
          <BackButton onClick={handleBack}>
            <FiArrowLeft />
            Voltar para Lista de Clientes
          </BackButton>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <FiRefreshCw className="spin" />
                {isEditing ? 'Atualizando...' : 'Cadastrando...'}
              </>
            ) : (
              <>
                <FiSave />
                {isEditing ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
              </>
            )}
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </PageContainer>
  );
};

export default CadastrarCliente;
