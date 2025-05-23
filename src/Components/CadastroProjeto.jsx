import { useState } from 'react';
import { Link } from 'react-router-dom';

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
  FilterButton, Sidebar, SearchInput, Content, DeleteButton 
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
];

export default function CadastroProjeto() {
  const [projects, setProjects] = useState(initialProjects);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project => 
    (statusFilter === 'Todos' || project.status === statusFilter) &&
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFilter = (status) => {
    setStatusFilter(status);
  };

  return (
    <Container>
      <Sidebar>
        <h3>Pesquisar</h3>
        <SearchInput 
          type="text" 
          placeholder="Buscar projeto..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />

        <Link to="/adicionar-projetos"><AddButton>+ Adicionar novo projeto</AddButton></Link>
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

        <ProjectGrid>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id}>
              <Link to={`/projeto/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ProjectImage src={project.image} alt={project.name} />
                <ProjectTitle>{project.name}</ProjectTitle>
              </Link>
              <ProjectInfo>Dono: {project.owner}</ProjectInfo>
              <ProjectInfo>Data: {project.date}</ProjectInfo>
              <ProgressBar progress={project.progress}>
                <div />
              </ProgressBar>
              <Status status={project.status}>{project.status}</Status>
              <DeleteButton onClick={() => handleDelete(project.id)}>Deletar</DeleteButton>
            </ProjectCard>
          ))}
        </ProjectGrid>
      </Content>
    </Container>
  );
}
