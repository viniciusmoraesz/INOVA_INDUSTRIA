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
  FiChevronRight
} from 'react-icons/fi';
import { empresaApiService } from '../services/empresaApiService';

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
  max-width: 400px;
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
    padding: 0.5rem 1rem;
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
  
  .status {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    
    &.active {
      background-color: #d4edda;
      color: #155724;
    }
    
    &.inactive {
      background-color: #f8d7da;
      color: #721c24;
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

const ListaEmpresas = () => {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const carregarEmpresas = async () => {
      try {
        setLoading(true);
        const data = await empresaApiService.listarEmpresas();
        setEmpresas(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar empresas:', err);
        setError('Erro ao carregar a lista de empresas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    carregarEmpresas();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    const empresaNome = empresas.find(e => e.id === id)?.razaoSocial || 'esta empresa';
    const confirmMessage = `ATENÇÃO: Esta ação é irreversível!\n\n` +
                         `Tem certeza que deseja excluir permanentemente "${empresaNome}"?\n\n` +
                         `Esta ação não poderá ser desfeita.`;

    if (window.confirm(confirmMessage)) {
      try {
        const result = await empresaApiService.excluirEmpresa(id);
        // Refresh the list after successful deletion
        setEmpresas(empresas.filter(empresa => empresa.id !== id));
        alert(result.message || 'Empresa excluída permanentemente com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir empresa:', error);
        alert('Erro ao excluir empresa. Por favor, tente novamente.');
      }
    }
  };

  // Filter companies based on search term
  const filteredEmpresas = empresas.filter(empresa => 
    empresa.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.cnpj.includes(searchTerm) ||
    (empresa.nomeFantasia && empresa.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmpresas.slice(indexOfFirstItem, indexOfLastItem);
  const totalFilteredPages = Math.ceil(filteredEmpresas.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <PageContainer>
      <Header>
        <div>
          <BackButton onClick={() => navigate(-1)}>
            <FiArrowLeft /> Voltar
          </BackButton>
        </div>
        <Title>Lista de Empresas</Title>
        <Button onClick={() => navigate('/empresas/nova')}>
          <FiPlus /> Nova Empresa
        </Button>
      </Header>

      <form onSubmit={handleSearch}>
        <SearchContainer>
          <input
            type="text"
            placeholder="Buscar por nome, CNPJ ou nome fantasia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FiSearch />
          </button>
        </SearchContainer>
      </form>

      <Table>
        <thead>
          <tr>
            <th>Razão Social</th>
            <th>Nome Fantasia</th>
            <th>CNPJ</th>
            <th>Cidade/UF</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((empresa) => (
              <tr key={empresa.id}>
                <td>{empresa.razaoSocial}</td>
                <td>{empresa.nomeFantasia || '-'}</td>
                <td>{empresa.cnpj}</td>
                <td>{empresa.cidade ? `${empresa.cidade}/${empresa.estado}` : '-'}</td>
                <td>
                  <span className={`status ${empresa.ativo ? 'active' : 'inactive'}`}>
                    {empresa.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="actions">
                  <Button 
                    small 
                    onClick={() => navigate(`/empresas/editar/${empresa.id}`)}
                  >
                    <FiEdit2 />
                  </Button>
                  <Button 
                    small 
                    danger
                    onClick={() => handleDelete(empresa.id)}
                  >
                    <FiTrash2 />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                Nenhuma empresa encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {filteredEmpresas.length > 0 && (
        <Pagination>
          <div className="info">
            Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredEmpresas.length)} de {filteredEmpresas.length} empresas
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
              disabled={currentPage === totalFilteredPages}
            >
              Próximo <FiChevronRight />
            </Button>
          </div>
        </Pagination>
      )}
    </PageContainer>
  );
};

export default ListaEmpresas;
