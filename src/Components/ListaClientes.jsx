import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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
  FiBriefcase
} from 'react-icons/fi';
import { clienteApiService } from '../services/clienteApiService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
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

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
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
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const carregarClientes = async () => {
      try {
        setLoading(true);
        console.log('Iniciando carregamento de clientes...');
        const data = await clienteApiService.listarClientes();
        console.log('Dados dos clientes recebidos:', data);
        
        // Verificar a estrutura dos dados
        if (data && data.length > 0) {
          console.log('Primeiro cliente:', {
            id: data[0].id,
            nome: data[0].nome,
            temId: !!data[0].id,
            tipoId: typeof data[0].id
          });
        }
        
        setClientes(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar clientes:', err);
        setError('Erro ao carregar a lista de clientes. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    carregarClientes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    const cliente = clientes.find(c => c.id === id);
    const clienteNome = cliente ? cliente.nome : 'este cliente';
    
    const confirmMessage = `ATENÇÃO: Esta ação é irreversível!\n\n` +
                         `Tem certeza que deseja excluir permanentemente "${clienteNome}"?\n\n` +
                         `Esta ação não poderá ser desfeita.`;

    if (window.confirm(confirmMessage)) {
      try {
        await clienteApiService.excluirCliente(id);
        setClientes(clientes.filter(cliente => cliente.id !== id));
        alert('Cliente excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        alert('Erro ao excluir cliente. Por favor, tente novamente.');
      }
    }
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

  if (loading) {
    return (
      <PageContainer>
        <LoadingMessage>Carregando clientes...</LoadingMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <div>
          <BackButton onClick={() => navigate(-1)}>
            <FiArrowLeft /> Voltar
          </BackButton>
        </div>
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

      <Table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Contato</th>
            <th>Empresa</th>
            <th>Cargo/Departamento</th>
            <th>Função</th>
            <th style={{ textAlign: 'right' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((cliente) => {
              const idKey = Object.keys(cliente).find(key => key.toLowerCase() === 'idcliente');
              const clienteId = idKey ? cliente[idKey] : null;
              
              // Se não tiver um ID, não renderiza o item
              if (!clienteId) {
                console.error('Cliente sem ID válido:', cliente);
                return null;
              }
              
              return (
                <tr key={clienteId}>
                  <td>
                    <div className="info-cell">
                      <FiUser />
                      <span>{cliente.nome}</span>
                    </div>
                  </td>
                  <td>{cliente.cpf ? formatCPF(cliente.cpf) : '-'}</td>
                  <td>
                    <div className="info-cell">
                      <FiMail />
                      <span>{cliente.email || '-'}</span>
                      {cliente.telefone && (
                        <>
                          <br />
                          <FiPhone />
                          <span>{formatPhone(cliente.telefone)}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td>{cliente.empresa?.nomeFantasia || cliente.empresa?.razaoSocial || '-'}</td>
                  <td>
                    <div className="info-cell">
                      <span>
                        {[cliente.cargo, cliente.departamento]
                          .filter(Boolean)
                          .join(' / ') || '-'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`role-tag ${cliente.role?.toLowerCase()}`}>
                      {getRoleLabel(cliente.role)}
                    </span>
                  </td>
                  <td className="actions">
                    <Button 
                      className="small"
                      onClick={() => {
                        console.log('Editando cliente - ID:', clienteId, 'Cliente:', cliente);
                        if (clienteId) {
                          navigate(`/clientes/editar/${clienteId}`);
                        } else {
                          console.error('ID do cliente não encontrado:', cliente);
                          alert('Erro: ID do cliente não encontrado');
                        }
                      }}
                      title="Editar cliente"
                    >
                      <FiEdit2 />
                    </Button>
                    <Button 
                      className="small danger"
                      onClick={() => {
                        console.log('Removendo cliente - ID:', clienteId, 'Cliente:', cliente);
                        if (clienteId) {
                          navigate(`/clientes/remover/${clienteId}`);
                        } else {
                          console.error('ID do cliente não encontrado:', cliente);
                          alert('Erro: ID do cliente não encontrado');
                        }
                      }}
                      title="Excluir cliente"
                    >
                      <FiTrash2 />
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                {searchTerm ? 'Nenhum cliente encontrado para a busca.' : 'Nenhum cliente cadastrado.'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {filteredClientes.length > 0 && (
        <Pagination>
          <div className="info">
            Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredClientes.length)} de {filteredClientes.length} clientes
          </div>
          <div className="pagination-buttons">
            <Button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              <FiChevronLeft /> Anterior
            </Button>
            <Button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Próximo <FiChevronRight />
            </Button>
          </div>
        </Pagination>
      )}
    </PageContainer>
  );
};

export default ListaClientes;
