import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiArrowLeft, 
  FiSave, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiBriefcase,
  FiAlertTriangle
} from 'react-icons/fi';

// Função para formatar CPF
const formatCPF = (value) => {
  if (!value) return '';
  
  // Remove tudo que não for dígito
  const numericValue = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const limitedValue = numericValue.slice(0, 11);
  
  // Aplica a máscara
  return limitedValue
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(\-\d{2})\d+?$/, '$1');
};

// Função para formatar telefone
const formatPhone = (value) => {
  if (!value) return '';
  
  // Remove tudo que não for dígito
  const numericValue = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const limitedValue = numericValue.slice(0, 11);
  
  // Aplica a máscara
  if (limitedValue.length > 10) {
    return limitedValue
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(\-\d{4})\d+?$/, '$1');
  } else {
    return limitedValue
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\-\d{4})\d+?$/, '$1');
  }
};

// Função para remover a formatação do CPF
const unformatCPF = (value) => {
  return value ? value.replace(/\D/g, '') : '';
};

// Função para remover a formatação do telefone
const unformatPhone = (value) => {
  return value ? value.replace(/\D/g, '') : '';
};
import empresaApiService from '../services/empresaApiService';
import { clienteApiService } from '../services/clienteApiService';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: #4CAF50;
  }
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  padding: 2rem;
  margin-top: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #444;
    
    .required {
      color: #dc3545;
      margin-left: 0.25rem;
    }
  }

  input, select {
    width: 100%;
    padding: 0.75rem 1rem;
    padding-left: ${props => props.hasIcon ? '2.5rem' : '1rem'};
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    background-color: ${props => props.disabled ? '#f8f9fa' : 'white'};
    color: ${props => props.disabled ? '#6c757d' : '#212529'};
    height: calc(1.5em + 1.5rem + 2px);
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: ${props => !props.hasIcon ? 'none' : 'none'};
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px 12px;

    &:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 0.2rem rgba(76, 175, 80, 0.15);
    }
    
    &:disabled {
      cursor: not-allowed;
      background-color: #f8f9fa;
      opacity: 1;
    }
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  font-weight: 500;
  background-color: ${props => props.variant === 'secondary' ? '#6c757d' : '#4CAF50'};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  font-size: 1rem;
  
  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#5a6268' : '#43a047'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: #cccccc;
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EditarCliente = () => {
  const params = useParams();
  const idCliente = params.id || params.Id || params.ID; // O parâmetro na URL ainda é 'id'
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    cargo: '',
    departamento: '',
    role: 'CLIENTE',
    idEmpresa: ''
  });
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Carregar empresas
        const empresasData = await empresaApiService.listarEmpresas();
        setEmpresas(empresasData);
        
        // Se estiver editando, carregar dados do cliente
        if (!idCliente) {
          console.error('ID do cliente não fornecido');
          setError('ID do cliente não fornecido');
          setLoading(false);
          return;
        }
        
        console.log('ID do cliente a ser editado:', idCliente);
        console.log('Buscando cliente com ID:', idCliente);
        const cliente = await clienteApiService.buscarClientePorId(idCliente);
        console.log('Dados do cliente recebidos:', cliente);
        
        if (!cliente) {
          throw new Error('Cliente não encontrado');
        }
        
        // Formatar dataNascimento que pode vir como array [ano, mês, dia]
        let dataFormatada = '';
        if (Array.isArray(cliente.dataNascimento) && cliente.dataNascimento.length === 3) {
          // Converter array [ano, mês, dia] para string 'YYYY-MM-DD'
          const [year, month, day] = cliente.dataNascimento;
          dataFormatada = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        } else if (typeof cliente.dataNascimento === 'string') {
          // Se for string, verificar se tem o formato ISO
          dataFormatada = cliente.dataNascimento.includes('T')
            ? cliente.dataNascimento.split('T')[0]
            : cliente.dataNascimento;
        }
        
        // Garante que o CPF está formatado corretamente ao carregar os dados
        const clienteFormatado = {
          ...cliente,
          dataNascimento: dataFormatada,
          cpf: cliente.cpf ? formatCPF(cliente.cpf) : ''
        };
        
        console.log('Dados formatados do cliente:', clienteFormatado);
        setFormData(clienteFormatado);
        
        setError('');
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar os dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [idCliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Aplica formatação baseada no campo
    if (name === 'cpf') {
      console.log('CPF antes da formatação:', value);
      const formattedValue = formatCPF(value);
      console.log('CPF após formatação:', formattedValue);
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'telefone') {
      console.log('Telefone antes da formatação:', value);
      const formattedValue = formatPhone(value);
      console.log('Telefone após formatação:', formattedValue);
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Remover idCliente e formatar campos antes de enviar
      console.log('Dados do formulário antes de enviar:', formData);
      
      const { idCliente: _, ...dadosParaEnviar } = formData;
      
      // Garante que o CPF está no formato correto (apenas números)
      if (dadosParaEnviar.cpf) {
        console.log('CPF antes de remover formatação:', dadosParaEnviar.cpf);
        dadosParaEnviar.cpf = unformatCPF(dadosParaEnviar.cpf);
        console.log('CPF após remover formatação:', dadosParaEnviar.cpf);
      }
      
      // Garante que o telefone está no formato correto (apenas números)
      if (dadosParaEnviar.telefone) {
        console.log('Telefone antes de remover formatação:', dadosParaEnviar.telefone);
        dadosParaEnviar.telefone = unformatPhone(dadosParaEnviar.telefone);
        console.log('Telefone após remover formatação:', dadosParaEnviar.telefone);
      }
      
      console.log('🔄 Iniciando atualização do cliente...');
      console.log('📋 ID do cliente:', idCliente);
      console.log('📋 Dados para atualização (sem idCliente):', dadosParaEnviar);
      console.log('📋 Tipo do idCliente:', typeof idCliente);
      console.log('📋 Valor do idCliente:', idCliente);
      
      // Atualizar cliente
      const resultado = await clienteApiService.atualizarCliente(idCliente, dadosParaEnviar);
      console.log('✅ Resultado da atualização:', resultado);
      
      // Redirecionar para a lista de clientes
      navigate('/clientes', { state: { success: 'Cliente atualizado com sucesso!' } });
    } catch (err) {
      console.error('❌ Erro completo ao atualizar cliente:', {
        message: err.message,
        status: err.status,
        data: err.data,
        stack: err.stack
      });
      setError(err.message || 'Erro ao atualizar o cliente. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <p>Carregando...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Voltar
        </Button>
        <Title>
  <FiUser size={24} />
  Editar Cliente
</Title>
        <div></div> {/* Para alinhar o título ao centro */}
      </Header>

      <FormContainer>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '1rem', borderBottom: '1px solid #e9ecef', paddingBottom: '0.75rem' }}>
            Informações do Cliente
          </h3>
          {error && (
            <ErrorMessage>
              <FiAlertTriangle /> {error}
            </ErrorMessage>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <label>Nome <span className="required"></span></label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c757d'
                }} />
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '35px' }}
                />
              </div>
            </FormGroup>

            <FormGroup>
              <label>CPF <span className="required"></span></label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <label>E-mail</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c757d'
                }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  style={{ paddingLeft: '35px' }}
                />
              </div>
            </FormGroup>

            <FormGroup>
              <label>Telefone</label>
              <div style={{ position: 'relative' }}>
                <FiPhone style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c757d'
                }} />
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone || ''}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  style={{ paddingLeft: '35px' }}
                />
              </div>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup hasIcon>
              <label>Empresa</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <FiBriefcase style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c757d',
                  zIndex: 1
                }} />
                <select
                  name="idEmpresa"
                  value={formData.idEmpresa || ''}
                  onChange={handleChange}
                  disabled
                >
                  <option value="">Selecione uma empresa</option>
                  {empresas.map(empresa => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nomeFantasia || empresa.razaoSocial}
                    </option>
                  ))}
                </select>
              </div>
              <small className="text-muted" style={{ display: 'block', marginTop: '0.5rem', color: '#6c757d' }}>
                A empresa não pode ser alterada após o cadastro
              </small>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <label>Cargo</label>
              <div style={{ position: 'relative' }}>
                <FiBriefcase style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c757d'
                }} />
                <input
                  type="text"
                  name="cargo"
                  value={formData.cargo || ''}
                  onChange={handleChange}
                  style={{ paddingLeft: '35px' }}
                />
              </div>
            </FormGroup>

            <FormGroup>
              <label>Departamento</label>
              <input
                type="text"
                name="departamento"
                value={formData.departamento || ''}
                onChange={handleChange}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <label>Data de Nascimento</label>
              <input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento || ''}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
            </FormGroup>

            <FormGroup>
              <label>Função</label>
              <select
                name="role"
                value={formData.role || 'CLIENTE'}
                onChange={handleChange}
              >
                <option value="CLIENTE">Cliente</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </FormGroup>
          </FormRow>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e9ecef' }}>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              <FiArrowLeft /> Voltar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              <FiSave /> {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default EditarCliente;
