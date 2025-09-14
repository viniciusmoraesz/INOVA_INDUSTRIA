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
  FiX
} from 'react-icons/fi';
import { showToast } from './Toast';
import empresaApiService from '../services/empresaApiService';
import { formatCNPJ } from '../utils/masks';

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
  background-color: ${props => props.danger ? '#dc3545' : props.secondary ? '#6c757d' : '#4CAF50'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.danger ? '#c82333' : props.secondary ? '#5a6268' : '#45a049'};
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
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #e9ecef;
    vertical-align: middle;
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
    text-align: right;
    padding: 0.75rem 1rem !important;
    vertical-align: middle;
    white-space: nowrap;
    width: 1%;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  box-sizing: border-box;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 2rem 1.75rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  position: relative;
  transform: translateY(0);
  animation: modalAppear 0.3s ease-out;
  border: 1px solid rgba(0, 0, 0, 0.1);
  
  @keyframes modalAppear {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
  
  h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.5rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    &::before {
      content: '⚠️';
      font-size: 1.8rem;
    }
  }
  
  button {
    background: #f8f9fa;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6c757d;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    
    &:hover {
      background-color: #f1f3f5;
      color: #495057;
      transform: rotate(90deg);
    }
  }
`;

const ModalBody = styled.div`
  margin-bottom: 2rem;
  line-height: 1.7;
  color: #495057;
  font-size: 1.05rem;
  
  p {
    margin: 0.75rem 0;
    padding: 0.5rem 0;
  }
  
  p:first-child {
    font-weight: 600;
    color: #dc3545;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &::before {
      content: '❗';
    }
  }
  
  p:nth-child(2) {
    font-weight: 500;
    color: #343a40;
    font-size: 1.15rem;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
  align-items: center;
  
  button {
    min-width: 120px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    letter-spacing: 0.3px;
    height: 40px;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
    font-size: 0.95rem;
    
    &:first-child {
      background-color: #f8f9fa;
      color: #495057;
      border: 1px solid #dee2e6;
      
      &:hover {
        background-color: #e9ecef;
        border-color: #ced4da;
      }
    }
    
    &.danger {
      background-color: #dc3545;
      color: white;
      
      &:hover {
        background-color: #c82333;
      }
    }
  }
`;

// Using the existing Button component defined earlier
const ActionButton = styled(Button)`
  background-color: ${props => props.danger ? '#dc3545' : '#4CAF50'};
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  
  &.delete-btn {
    background-color: #dc3545;
    
    &:hover {
      background-color: #c82333;
    }
  }
  
  & + & {
    margin-left: 8px;
  }
  
  &:hover {
    background-color: ${props => props.danger ? '#c82333' : '#45a049'};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ListaEmpresas = () => {
  console.log('ListaEmpresas: Componente carregado!');
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingName, setDeletingName] = useState('');
  const itemsPerPage = 10;

  const carregarEmpresas = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('ListaEmpresas: Iniciando carregamento de empresas...');
      const data = await empresaApiService.listarEmpresas();
      console.log('ListaEmpresas: Dados recebidos:', data);
      setEmpresas(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (err) {
      console.error('ListaEmpresas: Erro ao carregar empresas:', err);
      
      // Extrai detalhes do erro de forma segura
      const errorMessage = err.message || 'Erro desconhecido ao carregar empresas';
      const errorDetails = err.originalError?.message || 
                         err.details || 
                         (err.originalError?.responseData ? 
                           (typeof err.originalError.responseData === 'string' ? 
                             err.originalError.responseData : 
                             JSON.stringify(err.originalError.responseData, null, 2)
                           ) : 
                           'Sem detalhes adicionais disponíveis');
      
      setError({
        message: errorMessage,
        details: errorDetails,
        status: err.status || err.originalError?.status,
        showRetry: true,
        isServerError: err.isServerError || (err.status >= 500),
        isNetworkError: err.isNetworkError || errorMessage.includes('Failed to fetch') || errorMessage.includes('Network Error')
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('ListaEmpresas - Componente montado, carregando empresas...');
    carregarEmpresas();
  }, []);

  // Debug: verificar estrutura dos dados após carregamento
  useEffect(() => {
    console.log('=== DEBUG ListaEmpresas ===');
    console.log('Total de empresas carregadas:', empresas.length);
    console.log('Primeiras 3 empresas:', empresas.slice(0, 3));
    empresas.forEach((empresa, index) => {
      console.log(`Empresa ${index}:`, {
        id: empresa.id,
        razaoSocial: empresa.razaoSocial,
        nomeFantasia: empresa.nomeFantasia,
        hasId: empresa.hasOwnProperty('id'),
        idType: typeof empresa.id
      });
    });
  }, [empresas]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

// ...
  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setCurrentPage(1);
  };

  const handleDeleteClick = (id) => {
    const empresa = empresas.find(e => e.id === id);
    if (empresa) {
      setDeletingId(id);
      setDeletingName(empresa.razaoSocial || 'esta empresa');
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    
    try {
      await empresaApiService.excluirEmpresa(deletingId);
      setEmpresas(empresas.filter(empresa => empresa.id !== deletingId));
      showToast('Empresa excluída com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      showToast('Não foi possível excluir a empresa. Tente novamente.', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeletingId(null);
      setDeletingName('');
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
    // Configurações baseadas no tipo de erro
    const isServerError = error.isServerError || (error.status && error.status >= 500);
    const isNetworkError = error.isNetworkError || 
                         error.message?.includes('Failed to fetch') || 
                         error.message?.includes('Network Error');
    
    // Estilos dinâmicos baseados no tipo de erro
    const errorStyles = {
      backgroundColor: isNetworkError ? '#e7f5ff' : 
                      isServerError ? '#fff3cd' : '#f8d7da',
      borderLeft: `4px solid ${
        isNetworkError ? '#1971c2' : 
        isServerError ? '#ffd43b' : '#dc3545'
      }`,
      color: isNetworkError ? '#0c4b8e' : 
            isServerError ? '#664d03' : '#721c24',
      padding: '1.5rem',
      borderRadius: '4px',
      maxWidth: '800px',
      margin: '2rem auto',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    // Títulos e mensagens padrão
    const title = isNetworkError ? 'Erro de Conexão' :
                 isServerError ? 'Erro no Servidor' : 'Erro ao Carregar';
    
    const defaultMessage = isNetworkError ? 
      'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.' :
      isServerError ?
      'Ocorreu um erro no servidor. Nossa equipe já foi notificada. Por favor, tente novamente mais tarde.' :
      'Ocorreu um erro ao carregar a lista de empresas.';

    return (
      <PageContainer>
        <div style={errorStyles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            {isNetworkError ? '🌐' : isServerError ? '⚠️' : '❌'}
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{title}</h2>
          </div>
          
          <p style={{ margin: '0.5rem 0 1rem', lineHeight: '1.5' }}>
            {error.message || defaultMessage}
          </p>
          
          {(error.details || error.status) && (
            <details style={{ margin: '1rem 0' }}>
              <summary style={{ 
                cursor: 'pointer', 
                color: '#495057',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
                userSelect: 'none'
              }}>
                Ver detalhes {error.status ? `(Status: ${error.status})` : ''}
              </summary>
              <div style={{
                backgroundColor: 'rgba(0,0,0,0.03)',
                padding: '0.75rem',
                borderRadius: '4px',
                marginTop: '0.5rem',
                fontFamily: 'monospace',
                fontSize: '0.85em',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '200px',
                overflowY: 'auto',
                border: '1px solid rgba(0,0,0,0.1)'
              }}>
                {error.details}
              </div>
            </details>
          )}
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginTop: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <Button
              onClick={handleRetry}
              style={{
                backgroundColor: isNetworkError ? '#1971c2' : 
                                isServerError ? '#ffd43b' : '#dc3545',
                color: isServerError ? '#000' : '#fff'
              }}
            >
              Tentar novamente
            </Button>
            
            <Button 
              secondary 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#f8f9fa',
                color: '#212529',
                border: '1px solid #dee2e6'
              }}
            >
              Atualizar página
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  console.log('ListaEmpresas: Renderizando componente...');
  
  return (
    <PageContainer>
      {showDeleteModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h3>Confirmar Exclusão</h3>
              <button onClick={() => setShowDeleteModal(false)} aria-label="Fechar">
                <FiX />
              </button>
            </ModalHeader>
            <ModalBody>
              <p>ATENÇÃO: Esta ação é irreversível!</p>
              <p>Tem certeza que deseja excluir permanentemente <strong style={{color: '#dc3545', fontWeight: '600'}}>"{deletingName}"</strong>?</p>
              <p>Esta ação não poderá ser desfeita e todos os dados serão perdidos.</p>
            </ModalBody>
            <ModalFooter>
              <button 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="danger"
                onClick={confirmDelete}
              >
                <FiTrash2 style={{ marginRight: '8px' }} />
                Sim, excluir
              </button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
      <Header>
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
                <td>{formatCNPJ(empresa.cnpj)}</td>
                <td>{empresa.cidade ? `${empresa.cidade}/${empresa.estado}` : '-'}</td>
                <td>
                  <span className={`status ${empresa.ativo ? 'active' : 'inactive'}`}>
                    {empresa.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="actions">
                  <div style={{ 
                    display: 'inline-flex', 
                    gap: '0.5rem'
                  }}>
                    <ActionButton 
                      onClick={() => {
                        console.log('Clicando em editar empresa:', empresa);
                        console.log('ID da empresa:', empresa.id);
                        console.log('Navegando para:', `/empresas/editar/${empresa.id}`);
                        navigate(`/empresas/editar/${empresa.id}`);
                      }}
                      title="Editar"
                      style={{ margin: 0 }}
                    >
                      <FiEdit2 />
                    </ActionButton>
                    <ActionButton 
                      onClick={() => handleDeleteClick(empresa.id)}
                      title="Excluir"
                      className="delete-btn"
                      danger
                      style={{ margin: 0 }}
                    >
                      <FiTrash2 />
                    </ActionButton>
                  </div>
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
