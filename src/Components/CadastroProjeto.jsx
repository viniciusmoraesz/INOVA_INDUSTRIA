import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaTrash, FaPlus, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

// Serviços
import { projetoService } from '../services/projetoService';
import empresaApiService from '../services/empresaApiService';
import { clienteService } from '../services/clienteService';

import { 
  Container, Header, AddButton, ProjectGrid, ProjectCard, ProjectTitle, 
  ProjectInfo, ProgressBar, Status, ProjectImage, FilterContainer, 
  FilterButton, Sidebar, SearchInput, Content, DeleteButton, CardContent, Spinner,
  ModalOverlay, ModalContent, ModalTitle, ModalMessage, ModalActions, CancelButton, ConfirmButton
} from '../Styles/StyledCadastroProjeto';

// Mapeamento de status para exibição amigável
const statusMap = {
  'rascunho': 'Rascunho',
  'planejamento': 'Em Planejamento',
  'andamento': 'Em Andamento',
  'pausado': 'Pausado',
  'concluido': 'Concluído',
  'cancelado': 'Cancelado'
};

// Mapeamento de prioridades para cores
const statusColors = {
  'rascunho': '#6b7280',
  'planejamento': '#3b82f6',
  'andamento': '#10b981',
  'pausado': '#f59e0b',
  'concluido': '#10b981',
  'cancelado': '#ef4444'
};

export default function CadastroProjeto() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Carregar projetos do serviço
  useEffect(() => {
    const carregarProjetos = async () => {
      try {
        setIsLoading(true);
        const projetos = await projetoService.listarProjetos();
        setProjects(projetos);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar projetos:', err);
        setError('Erro ao carregar projetos. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    carregarProjetos();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesStatus = statusFilter === 'Todos' || 
                         (statusFilter === 'Em andamento' && project.status === 'andamento') ||
                         (statusFilter === 'Em planejamento' && project.status === 'planejamento') ||
                         (statusFilter === 'Concluído' && project.status === 'concluido');
    
    const matchesSearch = project.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleFilter = (status) => {
    setStatusFilter(status);
  };

  const handleDeleteClick = (projectId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const project = projects.find(p => p.id === projectId);
    setProjectToDelete(project);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      await projetoService.excluirProjeto(projectToDelete.id);
      setProjects(projects.filter(project => project.id !== projectToDelete.id));
      setProjectToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      setError('Erro ao excluir o projeto. Tente novamente.');
    }
  };

  const handleCancelDelete = () => {
    setProjectToDelete(null);
  };

  return (
    <Container>
      <Sidebar>
        <h3>Pesquisar</h3>
        <div style={{ marginBottom: '1rem' }}>
          <SearchInput 
            type="text" 
            placeholder="Buscar projeto..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar projeto"
          />
        </div>

        <Link to="/adicionar-projetos" style={{ textDecoration: 'none', width: '100%' }}>
          <AddButton>
            <FaPlus style={{ marginRight: '4px' }} />
            Adicionar novo projeto
          </AddButton>
        </Link>
      </Sidebar>

      <Content>
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <Link to="/main-page" style={{ textDecoration: 'none', color: '#64748b' }}>
              <FaArrowLeft style={{ marginRight: '0.3rem', fontSize: '0.85rem' }} />
              <span>Voltar para a página inicial</span>
            </Link>
          </div>
          Painel de Projetos
        </Header>

        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            color: '#991b1b', 
            padding: '1rem', 
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        <FilterContainer>
          {['Todos', 'Em andamento', 'Em planejamento', 'Concluído'].map(status => (
            <FilterButton 
              key={status} 
              active={statusFilter === status}
              onClick={() => handleFilter(status)}
            >
              {status}
            </FilterButton>
          ))}
        </FilterContainer>

        {isLoading ? (
          <div style={{
            gridColumn: '1 / -1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem 0',
            minHeight: '300px'
          }}>
            <Spinner />
            <div style={{
              fontSize: '1.2rem',
              color: '#a0aec0',
              marginTop: '1rem'
            }}>
              Carregando projetos...
            </div>
          </div>
        ) : (
          <ProjectGrid>
            {filteredProjects.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '2rem',
                color: '#a0aec0',
                fontSize: '1.1rem'
              }}>
                Nenhum projeto encontrado com os filtros atuais.
                {searchTerm && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('Todos');
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid #4CAF50',
                        color: '#4CAF50',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginTop: '0.5rem',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'rgba(76, 175, 80, 0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent';
                      }}
                    >
                      Limpar filtros
                    </button>
                  </div>
                )}
              </div>
            ) : (
              filteredProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id}
                  delay={`${index * 100}ms`}
                >
                  <Link to={`/projetos/${project.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                    <ProjectImage src={project.image} alt={project.name} />
                    <CardContent>
                      <ProjectTitle>{project.nome}</ProjectTitle>
                      <ProjectInfo>
                        <FaUser size={12} />
                        <span>{project.cliente.nome}</span>
                      </ProjectInfo>
                      <ProjectInfo>
                        <FaCalendarAlt size={12} />
                        <span>
                          {format(new Date(project.dataInicio), "dd/MM/yyyy", { locale: ptBR })}
                          {project.dataFimPrevista && ` - ${format(new Date(project.dataFimPrevista), "dd/MM/yyyy", { locale: ptBR })}`}
                        </span>
                      </ProjectInfo>
                      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <Status style={{ 
                          backgroundColor: `${statusColors[project.status]}15`,
                          color: statusColors[project.status],
                          border: `1px solid ${statusColors[project.status]}`, 
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          marginTop: '0.5rem'
                        }}>
                          {statusMap[project.status] || project.status}
                        </Status>
                      </div>
                    </CardContent>
                  </Link>
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '0.75rem', 
                    right: '0.75rem',
                    zIndex: 2,
                    opacity: 0.7,
                    transition: 'opacity 0.2s ease'
                  }}>
                    <DeleteButton 
                      onClick={(e) => handleDeleteClick(project.id, e)}
                      aria-label="Excluir projeto"
                    >
                      <FaTrash />
                    </DeleteButton>
                  </div>
                </ProjectCard>
              ))
            )}
          </ProjectGrid>
        )}
      </Content>
      
      {/* Modal de Confirmação de Exclusão */}
      {projectToDelete && (
        <ModalOverlay onClick={handleCancelDelete}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Confirmar Exclusão</ModalTitle>
            <ModalMessage>
              Tem certeza que deseja excluir o projeto <strong>"{projectToDelete.name}"</strong>?
              Esta ação não pode ser desfeita.
            </ModalMessage>
            <ModalActions>
              <CancelButton onClick={handleCancelDelete}>
                Cancelar
              </CancelButton>
              <ConfirmButton onClick={handleConfirmDelete}>
                Sim, Excluir
              </ConfirmButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
