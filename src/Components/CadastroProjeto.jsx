import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaTrash, FaPlus } from 'react-icons/fa'; // Removido FaSearch

import exemplo2 from '../assets/exemplo2.jpg';
import exemplo3 from '../assets/exemplo3.jpg';
import exemplo4 from '../assets/exemplo4.png';
import exemplo5 from '../assets/exemplo5.png';
import exemplo6 from '../assets/exemplo6.jpg';
import exemplo7 from '../assets/exemplo7.jpg';
import exemplo8 from '../assets/exemplo8.jpg';
import exemplo9 from '../assets/exemplo9.jpg';
import exemplo1 from '../assets/exemplo1.jpg';

import { 
  Container, Header, AddButton, ProjectGrid, ProjectCard, ProjectTitle, 
  ProjectInfo, ProgressBar, Status, ProjectImage, FilterContainer, 
  FilterButton, Sidebar, SearchInput, Content, DeleteButton, CardContent, Spinner,
  ModalOverlay, ModalContent, ModalTitle, ModalMessage, ModalActions, CancelButton, ConfirmButton
} from '../Styles/StyledCadastroProjeto';

const initialProjects = [
  { id: 1, name: 'Plataforma de Automação', owner: 'Nexora Tech', date: '06/07/2025', progress: 53, status: 'Em andamento', image: exemplo1 },
  { id: 2, name: 'Sistema de Monitoramento', owner: 'GreenLeaf Solutions', date: '15/08/2025', progress: 20, status: 'Em planejamento', image: exemplo2 },
  { id: 3, name: 'Plataforma de Telemedicina', owner: 'UrbanWave', date: '30/09/2025', progress: 78, status: 'Em andamento', image: exemplo3 },
  { id: 4, name: 'Rebranding Marca Software', owner: 'BrandX', date: '01/10/2025', progress: 100, status: 'Concluído', image: exemplo4 },
  { id: 5, name: 'Software de Modelagem', owner: 'AstraMed', date: '07/06/2025', progress: 100, status: 'Concluído', image: exemplo5 },
  { id: 6, name: 'Ferramenta de Desenvolvimento', owner: 'Skyline Architects', date: '12/10/2025', progress: 18, status: 'Em planejamento', image: exemplo6 },
  { id: 7, name: 'Plataforma de Sustentabilidade', owner: 'ByteForge', date: '15/05/2025', progress: 80, status: 'Em andamento', image: exemplo7 },
  { id: 8, name: 'Sistema de Gerenciamento', owner: 'EcoNest', date: '01/01/2025', progress: 95, status: 'Em andamento', image: exemplo8 },
  { id: 9, name: 'Aplicativo de Gestão Tecnologico', owner: 'VortexDynamics', date: '02/03/2025', progress: 70, status: 'Em andamento', image: exemplo9 },
  { id: 10, name: 'Solução em IoT Industrial', owner: 'TechNova Industries', date: '20/11/2025', progress: 35, status: 'Em andamento', image: exemplo2 },
];

export default function CadastroProjeto() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    // Simulando uma chamada assíncrona para carregar os projetos
    const timer = setTimeout(() => {
      setProjects(initialProjects);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredProjects = projects.filter(project => 
    (statusFilter === 'Todos' || project.status === statusFilter) &&
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFilter = (status) => {
    setStatusFilter(status);
  };

  const handleDeleteClick = (projectId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const project = projects.find(p => p.id === projectId);
    setProjectToDelete(project);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      setProjects(projects.filter(project => project.id !== projectToDelete.id));
      setProjectToDelete(null);
      // Aqui você pode adicionar uma chamada para sua API para deletar o projeto
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
        <Header>Painel de Projetos</Header>

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
                  <Link to={`/projeto/${project.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                    <ProjectImage src={project.image} alt={project.name} />
                    <CardContent>
                      <ProjectTitle>{project.name}</ProjectTitle>
                      <ProjectInfo>
                        <FaUser size={12} />
                        <span>{project.owner}</span>
                      </ProjectInfo>
                      <ProjectInfo>
                        <FaCalendarAlt size={12} />
                        <span>{project.date}</span>
                      </ProjectInfo>
                      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <ProgressBar progress={project.progress}>
                          <div />
                        </ProgressBar>
                        <Status status={project.status}>
                          {project.status}
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
