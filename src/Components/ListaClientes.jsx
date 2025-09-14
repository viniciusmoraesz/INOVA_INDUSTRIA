import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { showToast } from './Toast';
import { 
  FiArrowLeft, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiHome,
  FiX
} from 'react-icons/fi';
import { clienteApiService } from '../services/clienteApiService';
import empresaApiService from '../services/empresaApiService';

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
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

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ClientCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ClientName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.edit {
    background-color: #e3f2fd;
    color: #1976d2;
    
    &:hover {
      background-color: #bbdefb;
    }
  }
  
  &.delete {
    background-color: #ffebee;
    color: #d32f2f;
    
    &:hover {
      background-color: #ffcdd2;
    }
  }
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #666;
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #4CAF50;
`;

const InfoText = styled.span`
  flex: 1;
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${props => {
    switch(props.role) {
      case 'ADMIN': return '#4f46e5';
      case 'GESTOR': return '#10b981';
      case 'COLABORADOR': return '#3b82f6';
      case 'CLIENTE': return '#8b5cf6';
      default: return '#6b7280';
    }
  }};
  color: white;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #111827;
  font-size: 1.25rem;
  font-weight: 500;
  text-align: left;
`;

const ModalMessage = styled.div`
  color: #4b5563;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  text-align: left;
  font-size: 1rem;
  
  .client-name {
    font-weight: 600;
    color: #111827;
    margin: 0.5rem 0 1rem;
    padding: 0.5rem;
    background: #f8fafc;
    border-left: 3px solid #ef4444;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  min-width: 100px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &.cancel {
    background-color: #f3f4f6;
    color: #4b5563;
    border: 1px solid #e5e7eb;
    
    &:hover {
      background-color: #e5e7eb;
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  &.confirm {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
    }
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  &.small {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
  
  &.danger {
    background-color: #dc3545;
    
    &:hover {
      background-color: #c82333;
    }
  }
`;

const BackButton = styled(Button)`
  background-color: #6c757d;
  
  &:hover {
    background-color: #5a6268;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 500px;
  margin-bottom: 1.5rem;
  
  input {
    flex: 1;
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px 0 0 4px;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: #4CAF50;
    }
  }
  
  button {
    padding: 0 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background-color: #45a049;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #495057;
  }
  
  tr:hover {
    background-color: #f8f9fa;
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }
  
  .info-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .role-tag {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    background-color: #e2e3e5;
    color: #383d41;
    
    &.admin {
      background-color: #d4edda;
      color: #155724;
    }
    
    &.gestor {
      background-color: #cce5ff;
      color: #004085;
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  
  .info {
    color: #6c757d;
    font-size: 0.9rem;
  }
  
  .pagination-buttons {
    display: flex;
    gap: 0.5rem;
  }
`;

const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6c757d;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const formatCPF = (cpf) => {
  if (!cpf) return '';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatPhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
};

const ListaClientes = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        console.log('Carregando clientes e empresas...');
        
        const [clientesData, empresasData] = await Promise.all([
          clienteApiService.listarClientes(),
          empresaApiService.listarEmpresas()
        ]);
        
        console.log('Dados recebidos - Estrutura completa:', { 
          clientes: clientesData, 
          empresas: empresasData,
          'primeiroCliente': clientesData[0],
          'camposDoPrimeiroCliente': clientesData[0] ? Object.keys(clientesData[0]) : 'Nenhum cliente encontrado'
        });
        
        setClientes(clientesData || []);
        setEmpresas(empresasData || []);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar os dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleDeleteClick = (id) => {
    console.log('Procurando cliente com ID:', id);
    console.log('Lista de clientes disponível:', clientes);
    const cliente = clientes.find(c => c.id === id || c.ID === id || c.idCliente === id);
    console.log('Cliente encontrado:', cliente);
    if (!cliente) {
      console.error('Cliente não encontrado para o ID:', id);
      return;
    }
    setClienteToDelete({ 
      id, 
      nome: cliente.nome || cliente.NOME || 'Cliente sem nome' 
    });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!clienteToDelete) return;
    
    try {
      await clienteApiService.excluirCliente(clienteToDelete.id);
      setClientes(clientes.filter(cliente => 
        cliente.id !== clienteToDelete.id && 
        cliente.ID !== clienteToDelete.id &&
        cliente.idCliente !== clienteToDelete.id
      ));
      showToast('Cliente excluído com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      showToast('Erro ao excluir cliente. Por favor, tente novamente.', 'error');
    } finally {
      setShowDeleteModal(false);
      setClienteToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setClienteToDelete(null);
  };

  // Filter clients based on search term
  const filteredClientes = clientes.filter(cliente => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(searchLower) ||
      (cliente.cpf && cliente.cpf.includes(searchTerm)) ||
      (cliente.email && cliente.email.toLowerCase().includes(searchLower)) ||
      (cliente.telefone && cliente.telefone.includes(searchTerm)) ||
      (cliente.empresa && cliente.empresa.nomeFantasia && 
        cliente.empresa.nomeFantasia.toLowerCase().includes(searchLower))
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClientes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getRoleLabel = (cliente) => {
    // Tenta diferentes campos possíveis para o role
    const role = cliente.tipoRole || cliente.role || cliente.TIPO_ROLE || cliente.tipo_role || cliente.roleType;
    
    console.log('🏷️ Mapeando role do cliente:', { 
      cliente: cliente.nome || cliente.NOME,
      tipoRole: cliente.tipoRole,
      role: cliente.role,
      TIPO_ROLE: cliente.TIPO_ROLE,
      tipo_role: cliente.tipo_role,
      roleType: cliente.roleType,
      roleEscolhido: role
    });
    
    if (!role) return 'Cliente';
    
    const roleMap = {
      'SUPER_ADMIN': 'Super Admin',
      'ADMIN': 'Admin', 
      'CLIENTE': 'Cliente',
      // Fallbacks para possíveis variações
      'GESTOR': 'Admin',
      'ADMINISTRADOR': 'Admin'
    };
    
    const mappedRole = roleMap[role.toString().toUpperCase()] || 'Cliente';
    console.log('✅ Role mapeado:', { original: role, mapped: mappedRole });
    
    return mappedRole;
  };

  if (loading) return <LoadingMessage>Carregando clientes...</LoadingMessage>;

  return (
    <Container>
      <Header>
        <Title>Lista de Clientes</Title>
        <Button onClick={() => navigate('/clientes/novo')}>
          <FiPlus /> Novo Cliente
        </Button>
      </Header>

      <form onSubmit={handleSearch}>
        <SearchContainer>
          <input
            type="text"
            placeholder="Buscar por nome, CPF, e-mail ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FiSearch />
          </button>
        </SearchContainer>
      </form>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <CardsGrid>
        {currentItems.length > 0 ? (
          currentItems.map((cliente) => {
            const idKey = Object.keys(cliente).find(key => key.toLowerCase() === 'idcliente');
            const clienteId = idKey ? cliente[idKey] : null;
            
            // Se não tiver um ID, não renderiza o item
            if (!clienteId) {
              console.error('Cliente sem ID válido:', cliente);
              return null;
            }

            // Debug completo do cliente para identificar campo do role
            console.log('🔍 Debug completo do cliente:', cliente);
            console.log('🔍 Campos disponíveis:', Object.keys(cliente));
            console.log('🔍 tipoRole:', cliente.tipoRole);
            console.log('🔍 role:', cliente.role);
            console.log('🔍 TIPO_ROLE:', cliente.TIPO_ROLE);
            
            // Buscar empresa do cliente
            console.log('🔍 Buscando empresa para cliente:', { 
              clienteId, 
              idEmpresa: cliente.idEmpresa, 
              empresasDisponiveis: empresas.map(e => ({ id: e.id, nome: e.nomeFantasia || e.razaoSocial }))
            });
            
            const empresa = empresas.find(emp => {
              // Tenta diferentes campos de ID da empresa
              const empresaId = emp.id || emp.idEmpresa || emp.ID;
              const clienteEmpresaId = cliente.idEmpresa;
              
              console.log('🔍 Comparando:', { empresaId, clienteEmpresaId, match: empresaId === clienteEmpresaId });
              
              return empresaId === clienteEmpresaId;
            });
            
            console.log('✅ Empresa encontrada:', empresa);
            
            return (
              <ClientCard key={clienteId}>
                <CardHeader>
                  <ClientName>{cliente.nome}</ClientName>
                  <CardActions>
                    <ActionButton 
                      className="edit"
                      onClick={() => navigate(`/clientes/editar/${clienteId}`)}
                      title="Editar cliente"
                    >
                      <FiEdit2 size={14} />
                    </ActionButton>
                    <ActionButton 
                      className="delete"
                      onClick={() => handleDeleteClick(clienteId)}
                      title="Excluir cliente"
                    >
                      <FiTrash2 size={14} />
                    </ActionButton>
                  </CardActions>
                </CardHeader>

                <CardInfo>
                  <InfoItem>
                    <InfoIcon>
                      <FiBriefcase />
                    </InfoIcon>
                    <InfoText>
                      <RoleBadge role={cliente.tipoRole || 'CLIENTE'}>
                        {getRoleLabel(cliente) || 'Cliente'}
                      </RoleBadge>
                    </InfoText>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      <FiMail />
                    </InfoIcon>
                    <InfoText>{cliente.email || 'Email não informado'}</InfoText>
                  </InfoItem>

                  {cliente.telefone && (
                    <InfoItem>
                      <InfoIcon>
                        <FiPhone />
                      </InfoIcon>
                      <InfoText>{formatPhone(cliente.telefone)}</InfoText>
                    </InfoItem>
                  )}

                  <InfoItem>
                    <InfoIcon>
                      <FiHome />
                    </InfoIcon>
                    <InfoText>
                      {empresa ? (empresa.nomeFantasia || empresa.razaoSocial || 'Empresa sem nome') : 'Nenhuma empresa'}
                    </InfoText>
                  </InfoItem>
                </CardInfo>
              </ClientCard>
            );
          })
        ) : (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '3rem',
            color: '#666' 
          }}>
            {loading ? 'Carregando clientes...' : 'Nenhum cliente encontrado'}
          </div>
        )}
      </CardsGrid>

      <Pagination>
        <div>
          Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredClientes.length)} de {filteredClientes.length} clientes
        </div>
        <div>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight />
          </button>
        </div>
      </Pagination>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && clienteToDelete && (
        <ModalOverlay onClick={cancelDelete}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Confirmar exclusão</ModalTitle>
            <ModalMessage>
              <p>Tem certeza que deseja excluir este cliente?</p>
              <div className="client-name">
                {clienteToDelete.nome || 'Cliente sem nome'}
              </div>
              <p style={{ color: '#dc2626', fontSize: '0.9rem' }}>
                Esta ação não poderá ser desfeita.
              </p>
            </ModalMessage>
            <ModalActions>
              <ModalButton 
                className="cancel"
                onClick={cancelDelete}
              >
                <FiX size={18} />
                Cancelar
              </ModalButton>
              <ModalButton 
                className="confirm"
                onClick={confirmDelete}
              >
                <FiTrash2 size={16} />
                Excluir
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default ListaClientes;
