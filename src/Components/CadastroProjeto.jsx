import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FiCalendar,
  FiBriefcase,
  FiDollarSign,
  FiClock
} from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import projetoApiService from '../services/projetoApiService';
import { showToast } from './Toast';

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

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ProjectCard = styled.div`
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

const ProjectTitle = styled.h3`
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

const ProjectInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #666;
  font-size: 0.9rem;
  
  svg {
    color: #4CAF50;
    flex-shrink: 0;
  }
`;

const Status = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#4CAF50' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  
  &:hover {
    background: ${props => props.active ? '#45a049' : '#f5f5f5'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h3 {
    color: #666;
    margin-bottom: 1rem;
  }
  
  p {
    color: #999;
    margin-bottom: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
`;

const statusColors = {
  'PLANEJAMENTO': '#ffc107',
  'EM_ANDAMENTO': '#007bff', 
  'CONCLUIDO': '#28a745',
  'CANCELADO': '#dc3545',
  'PAUSADO': '#6c757d'
};

const statusMap = {
  'PLANEJAMENTO': 'Em Planejamento',
  'EM_ANDAMENTO': 'Em Andamento',
  'CONCLUIDO': 'Concluído',
  'CANCELADO': 'Cancelado',
  'PAUSADO': 'Pausado'
};

// Modal styles
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
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: 20px 20px 0;
  
  h3 {
    margin: 0;
    color: #333;
    font-size: 1.2rem;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  
  p {
    margin: 0 0 10px;
    color: #666;
    line-height: 1.5;
  }
  
  strong {
    color: #333;
  }
`;

const ModalActions = styled.div`
  padding: 0 20px 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const DeleteButton = styled.button`
  padding: 8px 16px;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: #c82333;
  }
`;

export default function CadastroProjeto() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const navigate = useNavigate();
  const { user, logout, isSuperAdmin } = useAuth();
  const empresaId = user?.empresa?.id || user?.idEmpresa;
  
  console.log('Usuário logado:', user);
  console.log('EmpresaId obtido:', empresaId);
  console.log('user.idEmpresa:', user?.idEmpresa);
  console.log('user.empresa?.id:', user?.empresa?.id);

  const carregarProjetos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Carregando projetos...');
      
      const data = await projetoApiService.listarProjetos(empresaId);
      console.log('Projetos carregados:', data);
      setProjects(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      setError('Erro ao carregar projetos. Tente novamente.');
      showToast('Erro ao carregar projetos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarProjetos();
  }, [empresaId, isSuperAdmin]);

  const filteredProjects = projects.filter(project => {
    const matchesStatus = statusFilter === 'Todos' || 
                         (statusFilter === 'Em andamento' && project.status === 'EM_ANDAMENTO') ||
                         (statusFilter === 'Em planejamento' && project.status === 'PLANEJAMENTO') ||
                         (statusFilter === 'Concluído' && project.status === 'CONCLUIDO');
    
    const matchesSearch = project.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.clienteNome?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleDeleteClick = (project, e) => {
    e.preventDefault();
    e.stopPropagation();
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      console.log('🗑️ Deletando projeto:', projectToDelete.idProjeto);
      await projetoApiService.excluirProjeto(projectToDelete.idProjeto);
      
      // Remover o projeto da lista local
      setProjects(prevProjects => 
        prevProjects.filter(p => p.idProjeto !== projectToDelete.idProjeto)
      );
      
      console.log('✅ Projeto deletado com sucesso');
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('❌ Erro ao deletar projeto:', error);
      setError('Erro ao deletar projeto: ' + error.message);
      setShowDeleteModal(false);
      setProjectToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  if (isLoading) {
    return (
      <Container>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem 0',
          minHeight: '300px'
        }}>
          <FiClock style={{ fontSize: '2rem', color: '#4CAF50' }} />
          <div style={{
            fontSize: '1.2rem',
            color: '#666',
            marginTop: '1rem'
          }}>
            Carregando projetos...
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Lista de Projetos</Title>
        {(isSuperAdmin || user?.role === 'ADMIN') && (
          <Button onClick={() => navigate('/projetos/novo')}>
            <FiPlus /> Novo Projeto
          </Button>
        )}
      </Header>

      <form onSubmit={(e) => e.preventDefault()}>
        <SearchContainer>
          <input
            type="text"
            placeholder="Buscar por título ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FiSearch />
          </button>
        </SearchContainer>
      </form>

      <FilterContainer>
        {['Todos', 'Em planejamento', 'Em andamento', 'Concluído'].map(status => (
          <FilterButton 
            key={status}
            $active={statusFilter === status}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </FilterButton>
        ))}
      </FilterContainer>

      {filteredProjects.length === 0 ? (
        <EmptyState>
          <h3>Nenhum projeto encontrado</h3>
          <p>Não foram encontrados projetos com os filtros aplicados.</p>
          {(isSuperAdmin || user?.role === 'ADMIN') && (
            <Button onClick={() => navigate('/projetos/novo')}>
              <FiPlus /> Criar Primeiro Projeto
            </Button>
          )}
        </EmptyState>
      ) : (
        <ProjectsGrid>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.idProjeto}>
              <CardHeader>
                <ProjectTitle>{project.titulo}</ProjectTitle>
                <CardActions>
                  <ActionButton 
                    className="edit"
                    onClick={() => navigate(`/projetos/editar/${project.idProjeto}`)}
                    title="Editar"
                  >
                    <FiEdit2 />
                  </ActionButton>
                  <ActionButton 
                    className="delete"
                    onClick={(e) => handleDeleteClick(project, e)}
                    title="Excluir"
                  >
                    <FiTrash2 />
                  </ActionButton>
                </CardActions>
              </CardHeader>
              
              <ProjectInfo>
                <FiUser size={16} />
                <span>{project.clienteNome || 'Cliente não informado'}</span>
              </ProjectInfo>
              
              <ProjectInfo>
                <FiCalendar size={16} />
                <span>
                  {project.dataInicio && format(new Date(project.dataInicio), "dd/MM/yyyy", { locale: ptBR })}
                  {project.dataTerminoPrevista && ` - ${format(new Date(project.dataTerminoPrevista), "dd/MM/yyyy", { locale: ptBR })}`}
                </span>
              </ProjectInfo>
              
              {project.orcamento && (
                <ProjectInfo>
                  <FiDollarSign size={16} />
                  <span>R$ {project.orcamento.toLocaleString('pt-BR')}</span>
                </ProjectInfo>
              )}
              
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
                <Status style={{ 
                  backgroundColor: `${statusColors[project.status]}15`,
                  color: statusColors[project.status],
                  border: `1px solid ${statusColors[project.status]}`
                }}>
                  {statusMap[project.status] || project.status}
                </Status>
              </div>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      )}

      {/* Modal de confirmação para deletar */}
      {showDeleteModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h3>Confirmar Exclusão</h3>
            </ModalHeader>
            <ModalBody>
              <p>Tem certeza que deseja excluir o projeto <strong>"{projectToDelete?.titulo}"</strong>?</p>
              <p>Esta ação não pode ser desfeita.</p>
            </ModalBody>
            <ModalActions>
              <CancelButton onClick={handleCancelDelete}>
                Cancelar
              </CancelButton>
              <DeleteButton onClick={handleConfirmDelete}>
                Excluir
              </DeleteButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
