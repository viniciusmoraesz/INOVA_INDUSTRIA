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
import { empresaApiService } from '../services/empresaApiService';
import { clienteApiService } from '../services/clienteApiService';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
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
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 0.2rem rgba(76, 175, 80, 0.25);
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
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.variant === 'secondary' ? '#6c757d' : '#4CAF50'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#5a6268' : '#45a049'};
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
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
        
        // Garantir que dataNascimento seja uma string antes de tentar usar split
        const dataNascimento = cliente.dataNascimento || '';
        const dataFormatada = typeof dataNascimento === 'string' && dataNascimento.includes('T') 
          ? dataNascimento.split('T')[0] 
          : dataNascimento;
          
        setFormData({
          ...cliente,
          dataNascimento: dataFormatada || ''
        });
        
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Formatar dados - remover idCliente dos dados enviados
      const { idCliente: _, ...dadosSemId } = formData;
      const dadosParaEnviar = {
        ...dadosSemId,
        cpf: formData.cpf.replace(/\D/g, ''),
        telefone: formData.telefone ? formData.telefone.replace(/\D/g, '') : null
      };
      
      console.log('Dados para atualização (sem idCliente):', dadosParaEnviar);
      
      // Atualizar cliente
      await clienteApiService.atualizarCliente(idCliente, dadosParaEnviar);
      
      // Redirecionar para a lista de clientes
      navigate('/clientes', { state: { success: 'Cliente atualizado com sucesso!' } });
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err);
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
        <Title>Editar Cliente</Title>
        <div></div> {/* Para alinhar o título ao centro */}
      </Header>

      <FormContainer>
        {error && (
          <ErrorMessage>
            <FiAlertTriangle /> {error}
          </ErrorMessage>
        )}

        <form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <label>Nome <span className="required">*</span></label>
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
              <label>CPF <span className="required">*</span></label>
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
                  type="text"
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
            <FormGroup>
              <label>Data de Nascimento</label>
              <input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento || ''}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Empresa</label>
              <select
                name="idEmpresa"
                value={formData.idEmpresa || ''}
                onChange={handleChange}
              >
                <option value="">Selecione uma empresa</option>
                {empresas.map(empresa => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.nomeFantasia || empresa.razaoSocial}
                  </option>
                ))}
              </select>
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

          <FormGroup>
            <label>Função</label>
            <select
              name="role"
              value={formData.role || 'CLIENTE'}
              onChange={handleChange}
            >
              <option value="CLIENTE">Cliente</option>
              <option value="GESTOR">Gestor</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </FormGroup>

          <ButtonGroup>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <FiSave /> {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default EditarCliente;
