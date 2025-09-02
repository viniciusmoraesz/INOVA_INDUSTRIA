import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { FiPlus, FiSearch, FiBriefcase, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { empresaService } from '../services/empresaService';

const Empresas = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const itemsPerPage = 9;

  useEffect(() => {
    const carregarEmpresas = async () => {
      try {
        setLoading(true);
        const dados = await empresaService.listarEmpresas();
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

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.')) {
      try {
        await empresaService.excluirEmpresa(id);
        setEmpresas(empresas.filter(empresa => empresa.id !== id));
      } catch (erro) {
        console.error('Erro ao excluir empresa:', erro);
        alert('Não foi possível excluir a empresa. Tente novamente.');
      }
    }
  };

  const limparEmpresas = async () => {
    if (window.confirm('Tem certeza que deseja remover todas as empresas? Esta ação não pode ser desfeita e removerá também os clientes associados.')) {
      try {
        // Remove empresas do localStorage
        localStorage.removeItem('empresas_data');
        // Remove clientes associados
        localStorage.removeItem('clientes_data');
        // Recarrega a página
        window.location.reload();
      } catch (erro) {
        console.error('Erro ao limpar empresas:', erro);
        setError('Não foi possível limpar as empresas. Tente novamente mais tarde.');
      }
    }
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
              onClick={limparEmpresas}
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
                    onClick={() => handleDelete(empresa.id)}
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
    </PageContainer>
  );
};

export default Empresas;
