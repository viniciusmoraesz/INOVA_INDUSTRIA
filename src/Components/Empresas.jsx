import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  PageContainer,
  Header,
  Title,
  SearchBar,
  AddButton,
  CompaniesGrid,
  CompanyCard,
  CompanyHeader,
  CompanyName,
  CompanyInfo,
  CompanyActions,
  ActionButton,
  Pagination,
  PageButton,
  EmptyState
} from '../Styles/StyledEmpresas';
import { FiPlus, FiSearch, FiBriefcase, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import empresaApiService from '../services/empresaApiService';
import { showToast } from './Toast';

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
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    margin: 0;
    color: #2d3436;
    font-size: 1.25rem;
  }
  
  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6c757d;
    padding: 0.25rem;
    border-radius: 4px;
    
    &:hover {
      background-color: #f8f9fa;
    }
  }
`;

const ModalBody = styled.div`
  margin-bottom: 2rem;
  color: #495057;
  line-height: 1.6;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &.cancel {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #495057;
    
    &:hover {
      background: #e9ecef;
    }
  }
  
  &.confirm {
    background: #dc3545;
    border: 1px solid #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
      border-color: #bd2130;
    }
    
    &:disabled {
      background: #e4606d;
      border-color: #e4606d;
      cursor: not-allowed;
    }
  }
`;

const Empresas = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  
  const itemsPerPage = 9;

  useEffect(() => {
    const carregarEmpresas = async () => {
      try {
        setLoading(true);
        const dados = await empresaApiService.listarEmpresas();
        setEmpresas(dados);
      } catch (erro) {
        console.error('Erro ao carregar empresas:', erro);
        setError('Não foi possível carregar a lista de empresas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    carregarEmpresas();
  }, []);

  // Filtrar empresas pelo termo de busca
  const filteredEmpresas = empresas.filter(empresa => 
    empresa.razaoSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.nomeFantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.cnpj?.includes(searchTerm)
  );

  // Paginação
  const totalPages = Math.ceil(filteredEmpresas.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmpresas.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (id) => {
    navigate(`/editar-empresa/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    
    try {
      await empresaApiService.excluirEmpresa(deletingId);
      setEmpresas(empresas.filter(empresa => empresa.id !== deletingId));
      showToast('Empresa excluída com sucesso!', 'success');
    } catch (erro) {
      console.error('Erro ao excluir empresa:', erro);
      showToast('Não foi possível excluir a empresa. Tente novamente.', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeletingId(null);
    }
  };

  const handleClearAllClick = () => {
    setShowClearModal(true);
  };

  const limparEmpresas = async () => {
    setIsClearing(true);
    try {
      // Remove empresas do localStorage
      localStorage.removeItem('empresas_data');
      // Remove clientes associados
      localStorage.removeItem('clientes_data');
      
      showToast('Todas as empresas foram removidas com sucesso!', 'success');
      
      // Atualiza o estado após um pequeno atraso para dar tempo do toast aparecer
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (erro) {
      console.error('Erro ao limpar empresas:', erro);
      showToast('Não foi possível limpar as empresas. Tente novamente mais tarde.', 'error');
      setIsClearing(false);
      setShowClearModal(false);
    }
  };
  
  const closeClearModal = () => {
    setShowClearModal(false);
  };

  const handleAddNew = () => {
    navigate('/empresas/nova');
  };

  if (loading) {
    return (
      <PageContainer>
        <Header>
          <Title>Carregando empresas...</Title>
        </Header>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Header>
          <Title>Erro ao carregar empresas</Title>
        </Header>
        <p style={{ color: '#e74c3c' }}>{error}</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <div>
          <Title>Empresas</Title>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <AddButton onClick={handleAddNew}>
              <FiPlus /> Nova Empresa
            </AddButton>
            <button 
              onClick={handleClearAllClick}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '14px'
              }}
              title="Limpar todas as empresas e clientes"
            >
              <FiTrash2 /> Limpar Tudo
            </button>
          </div>
        </div>
        <SearchBar>
          <FiSearch />
          <input
            type="text"
            placeholder="Buscar empresas..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
            }}
          />
        </SearchBar>
      </Header>

      {filteredEmpresas.length === 0 ? (
        <EmptyState>
          <FiBriefcase />
          <h3>Nenhuma empresa encontrada</h3>
          <p>{searchTerm ? 'Tente ajustar sua busca' : 'Cadastre sua primeira empresa para começar'}</p>
          {!searchTerm && (
            <AddButton onClick={handleAddNew}>
              <FiPlus /> Adicionar Empresa
            </AddButton>
          )}
        </EmptyState>
      ) : (
        <>
          <CompaniesGrid>
            {currentItems.map((empresa) => (
              <CompanyCard key={empresa.id}>
                <CompanyHeader>
                  <FiBriefcase />
                  <div>
                    <CompanyName>{empresa.nomeFantasia || 'Sem nome'}</CompanyName>
                  </div>
                </CompanyHeader>
                
                <CompanyInfo>
                  <strong>Razão Social:</strong> {empresa.razaoSocial || 'Não informado'}
                </CompanyInfo>
                
                <CompanyInfo>
                  <strong>CNPJ:</strong> {empresa.cnpj || 'Não informado'}
                </CompanyInfo>
                
                <CompanyInfo>
                  <strong>Status:</strong> {empresa.ativo ? 'Ativo' : 'Inativo'}
                </CompanyInfo>
                
                <CompanyActions>
                  <ActionButton 
                    variant="edit" 
                    title="Editar empresa"
                    onClick={() => handleEdit(empresa.id)}
                  >
                    <FiEdit2 />
                  </ActionButton>
                  <ActionButton 
                    variant="delete" 
                    title="Excluir empresa"
                    onClick={() => handleDeleteClick(empresa.id)}
                  >
                    <FiTrash2 />
                  </ActionButton>
                </CompanyActions>
              </CompanyCard>
            ))}
          </CompaniesGrid>

          {totalPages > 1 && (
            <Pagination>
              <PageButton 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FiChevronLeft />
              </PageButton>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage > totalPages - 3) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <PageButton
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    active={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PageButton>
                );
              })}
              
              <PageButton 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <FiChevronRight />
              </PageButton>
            </Pagination>
          )}
        </>
      )}
      
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h3>Confirmar Exclusão</h3>
              <button onClick={() => setShowDeleteModal(false)}><FiX /></button>
            </ModalHeader>
            <ModalBody>
              <p>Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.</p>
            </ModalBody>
            <ModalFooter>
              <Button className="cancel" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </Button>
              <Button className="delete" onClick={confirmDelete}>
                Sim, excluir
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h3>Confirmar Limpeza</h3>
              <button onClick={closeClearModal}><FiX /></button>
            </ModalHeader>
            <ModalBody>
              <p><strong>Atenção!</strong> Você está prestes a remover todas as empresas e clientes cadastrados. Esta ação não pode ser desfeita. Tem certeza que deseja continuar?</p>
            </ModalBody>
            <ModalFooter>
              <Button className="cancel" onClick={closeClearModal} disabled={isClearing}>
                Cancelar
              </Button>
              <Button 
                className="confirm" 
                onClick={limparEmpresas}
                disabled={isClearing}
              >
                {isClearing ? 'Limpando...' : 'Sim, limpar tudo'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default Empresas;
