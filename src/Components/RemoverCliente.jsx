import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiArrowLeft, 
  FiTrash2, 
  FiX,
  FiAlertTriangle,
  FiUser,
  FiBriefcase,
  FiPhone,
  FiMail
} from 'react-icons/fi';
import { clienteApiService } from '../services/clienteApiService';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 600px;
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

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const AlertDanger = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  
  svg {
    flex-shrink: 0;
    margin-top: 0.2rem;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.variant === 'danger' ? '#dc3545' : props.variant === 'secondary' ? '#6c757d' : '#4CAF50'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.variant === 'danger' ? '#c82333' : props.variant === 'secondary' ? '#5a6268' : '#45a049'};
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  
  svg {
    color: #6c757d;
    flex-shrink: 0;
  }
  
  .label {
    font-weight: 500;
    min-width: 120px;
    color: #495057;
  }
  
  .value {
    flex: 1;
    color: #212529;
  }
`;

const formatCPF = (cpf) => {
  if (!cpf) return '-';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatPhone = (phone) => {
  if (!phone) return '-';
  return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const getRoleLabel = (role) => {
  switch (role) {
    case 'ADMIN':
      return 'Administrador';
    case 'GESTOR':
      return 'Gestor';
    case 'CLIENTE':
    default:
      return 'Cliente';
  }
};

const RemoverCliente = () => {
  const params = useParams();
  const idCliente = params.id || params.Id || params.ID; // O parâmetro na URL ainda é 'id'
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const carregarCliente = async () => {
      try {
        setLoading(true);
        
        if (!idCliente) {
          console.error('ID do cliente não fornecido');
          setError('ID do cliente não fornecido');
          setLoading(false);
          return;
        }
        
        console.log('Buscando cliente para remoção com ID:', idCliente);
        const data = await clienteApiService.buscarClientePorId(idCliente);
        
        if (!data) {
          throw new Error('Cliente não encontrado');
        }
        
        setCliente(data);
        setError('');
      } catch (err) {
        console.error('Erro ao carregar cliente:', err);
        setError('Não foi possível carregar os dados do cliente. ' + (err.message || ''));
      } finally {
        setLoading(false);
      }
    };

    carregarCliente();
  }, [idCliente]);

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await clienteApiService.excluirCliente(idCliente);
      navigate('/clientes', { 
        state: { 
          success: 'Cliente excluído com sucesso!',
          timestamp: Date.now()
        } 
      });
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      setError('Ocorreu um erro ao tentar excluir o cliente. Por favor, tente novamente.');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <p>Carregando...</p>
      </PageContainer>
    );
  }

  if (!cliente) {
    return (
      <PageContainer>
        <AlertDanger>
          <FiAlertTriangle />
          <div>
            <p>Cliente não encontrado.</p>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/clientes')}
              style={{ marginTop: '1rem' }}
            >
              Voltar para a lista
            </Button>
          </div>
        </AlertDanger>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Voltar
        </Button>
        <Title>Excluir Cliente</Title>
        <div></div> {/* Para alinhar o título ao centro */}
      </Header>

      <Card>
        <AlertDanger>
          <FiAlertTriangle size={24} />
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Atenção!</h3>
            <p style={{ margin: 0 }}>
              Você está prestes a excluir permanentemente este cliente. Esta ação não pode ser desfeita.
              Todos os dados relacionados a este cliente serão removidos do sistema.
            </p>
          </div>
        </AlertDanger>

        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Dados do Cliente</h3>
        
        <InfoItem>
          <FiUser size={20} />
          <div>
            <div className="label">Nome</div>
            <div className="value">{cliente.nome}</div>
          </div>
        </InfoItem>

        <InfoItem>
          <FiUser size={20} />
          <div>
            <div className="label">CPF</div>
            <div className="value">{formatCPF(cliente.cpf)}</div>
          </div>
        </InfoItem>

        {cliente.email && (
          <InfoItem>
            <FiMail size={20} />
            <div>
              <div className="label">E-mail</div>
              <div className="value">{cliente.email}</div>
            </div>
          </InfoItem>
        )}

        {cliente.telefone && (
          <InfoItem>
            <FiPhone size={20} />
            <div>
              <div className="label">Telefone</div>
              <div className="value">{formatPhone(cliente.telefone)}</div>
            </div>
          </InfoItem>
        )}

        {(cliente.cargo || cliente.departamento) && (
          <InfoItem>
            <FiBriefcase size={20} />
            <div>
              <div className="label">Cargo/Departamento</div>
              <div className="value">
                {[cliente.cargo, cliente.departamento].filter(Boolean).join(' / ') || '-'}
              </div>
            </div>
          </InfoItem>
        )}

        <InfoItem>
          <FiUser size={20} />
          <div>
            <div className="label">Função</div>
            <div className="value">{getRoleLabel(cliente.role)}</div>
          </div>
        </InfoItem>

        {error && (
          <AlertDanger style={{ marginTop: '1.5rem' }}>
            <FiAlertTriangle />
            <div>{error}</div>
          </AlertDanger>
        )}

        <ButtonGroup>
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            disabled={isDeleting}
          >
            <FiX /> Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <FiTrash2 /> {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
          </Button>
        </ButtonGroup>
      </Card>
    </PageContainer>
  );
};

export default RemoverCliente;
