import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FiRefreshCw
} from 'react-icons/fi';
import empresaApiService from '../services/empresaApiService';
import { clienteService } from '../services/clienteService';

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
  const navigate = useNavigate();
  
  // Estado para os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    cargo: '',
    dataNascimento: '',
    empresaId: ''
  });
  
  // Estado para armazenar a lista de empresas
  const [empresas, setEmpresas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para projetos vinculados
  const [projetos, setProjetos] = useState([
    { id: 1, nome: 'Modernização de Linha de Produção', selecionado: false },
    { id: 2, nome: 'Automação Industrial', selecionado: false },
    { id: 3, nome: 'Manutenção Preditiva', selecionado: false }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProjetoChange = (id) => {
    setProjetos(projetos.map(projeto => 
      projeto.id === id ? { ...projeto, selecionado: !projeto.selecionado } : projeto
    ));
  };

  // Carregar empresas ao montar o componente
  useEffect(() => {
    const carregarEmpresas = async () => {
      try {
        setIsLoading(true);
        const empresasAtivas = await empresaApiService.listarEmpresas();
        setEmpresas(empresasAtivas);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar empresas:', err);
        setError('Não foi possível carregar a lista de empresas. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarEmpresas();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.empresaId) {
      setError('Por favor, selecione uma empresa');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Buscar o nome da empresa selecionada
      const empresaSelecionada = empresas.find(emp => emp.id === formData.empresaId);
      
      // Criar objeto do cliente no formato esperado
      const novoCliente = {
        id: 'cliente-' + Date.now().toString(), // Prefixo para evitar conflitos
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cpf: formData.cpf,
        empresaId: formData.empresaId,
        empresaNome: empresaSelecionada?.nomeFantasia || 'Empresa não especificada',
        cargo: formData.cargo,
        dataNascimento: formData.dataNascimento,
        role: 'CLIENTE',
        ativo: true,
        createdAt: new Date().toISOString(),
        projects: 0
      };
      
      console.log('Salvando novo cliente:', novoCliente);
      
      // Usando o serviço para salvar o cliente
      const clienteSalvo = await clienteService.criarCliente(novoCliente);
      console.log('Cliente salvo com sucesso:', clienteSalvo);
      
      // Forçar atualização da lista de usuários
      window.dispatchEvent(new Event('storage'));
      
      // Pequeno atraso para garantir que o localStorage foi atualizado
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Redireciona para a página de usuários RH após o cadastro
      navigate('/usuariosrh');
    } catch (err) {
      console.error('Erro ao cadastrar cliente:', err);
      setError('Ocorreu um erro ao cadastrar o cliente. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/usuariosrh')}>
          <FiArrowLeft /> Voltar
        </BackButton>
        <Title>Cadastrar Novo Cliente</Title>
      </Header>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label>Empresa <span className="required">*</span></Label>
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6c757d' }}>
                  <FiRefreshCw className="spin" />
                  Carregando empresas...
                </div>
              ) : (
                <Select 
                  name="empresaId" 
                  value={formData.empresaId} 
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">Selecione uma empresa</option>
                  {empresas.map(empresa => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nomeFantasia}
                    </option>
                  ))}
                </Select>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label>Nome Completo <span className="required">*</span></Label>
              <Input 
                type="text" 
                name="nome" 
                value={formData.nome} 
                onChange={handleInputChange} 
                placeholder="Nome completo"
                required
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label>CPF <span className="required">*</span></Label>
              <Input 
                type="text" 
                name="cpf" 
                value={formData.cpf} 
                onChange={handleInputChange} 
                placeholder="000.000.000-00"
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>E-mail <span className="required">*</span></Label>
              <Input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="email@exemplo.com.br"
                required 
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label>Telefone <span className="required">*</span></Label>
              <Input 
                type="tel" 
                name="telefone" 
                value={formData.telefone} 
                onChange={handleInputChange} 
                placeholder="(00) 00000-0000"
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Data de Nascimento</Label>
              <Input 
                type="date" 
                name="dataNascimento" 
                value={formData.dataNascimento || ''} 
                onChange={handleInputChange}
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
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
            <FormGroup></FormGroup>
          </FormRow>
          
          
          <SectionTitle>
            <FiFileText size={20} />
            Observações
          </SectionTitle>
          
          <FormGroup>
            <Label>Observações adicionais</Label>
            <textarea 
              name="observacoes" 
              value={formData.observacoes} 
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FiRefreshCw className="spin" size={16} />
                  Salvando...
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  Salvar Cliente
                </>
              )}
            </Button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default CadastrarCliente;
