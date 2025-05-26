import { useParams, Link } from 'react-router-dom';
import { 
  FaArrowLeft, FaCalendarAlt, FaUserTie, FaTasks, FaInfoCircle,
  FaEdit, FaTrash, FaPlus, FaUserPlus, FaFileUpload, FaDownload,
  FaFilePdf, FaFileExcel, FaFileWord, FaFileAlt, FaFileImage
} from 'react-icons/fa';
import exemplo1 from '../assets/exemplo1.jpg';
import {
  PageContainer, Header, Title, ProjectInfo, ProjectImage, DetailItem,
  ProgressBar, ProgressFill, BackButton, Description, Section,
  SectionHeader, SectionTitle, SectionContent, ActionButton, TeamGrid,
  TeamMember, Avatar, TaskList, TaskCard, TaskInfo, TaskMeta, DocumentList,
  DocumentItem, DocumentInfo, DocumentIcon, HistoryItem, ButtonGroup
} from '../Styles/PaginaCadaProjeto';

// Dados de exemplo (seriam substituídos por chamadas à API)
const projetos = [
  { 
    id: 1, 
    name: 'Plataforma de Automação Industrial',
    owner: 'Nexora Tech',
    date: '26/05/2025',
    deadline: '06/07/2025',
    progress: 53,
    status: 'Em andamento',
    image: exemplo1,
    description: 'Desenvolvimento de uma plataforma completa para automação de processos industriais, incluindo monitoramento em tempo real, análise de dados preditiva e integração com máquinas IoT.',
    team: [
      { id: 1, name: 'João Silva', role: 'Gerente de Projeto' },
      { id: 2, name: 'Maria Santos', role: 'Desenvolvedora Sênior' },
      { id: 3, name: 'Carlos Oliveira', role: 'Arquiteto de Soluções' },
    ],
    tasks: [
      { id: 1, title: 'Revisão do Escopo', status: 'Concluído', responsible: 'João Silva', dueDate: '20/05/2025' },
      { id: 2, title: 'Desenvolvimento do Módulo Principal', status: 'Em andamento', responsible: 'Maria Santos', dueDate: '30/05/2025' },
      { id: 3, title: 'Testes de Integração', status: 'Pendente', responsible: 'Carlos Oliveira', dueDate: '05/07/2025' },
    ],
    documents: [
      { id: 1, name: 'Proposta Inicial.pdf', type: 'pdf', date: '15/05/2025' },
      { id: 2, name: 'Planilha de Custos.xlsx', type: 'excel', date: '18/05/2025' },
      { id: 3, name: 'Especificações Técnicas.docx', type: 'word', date: '20/05/2025' },
    ],
    history: [
      { id: 1, date: '26/05/2025 14:30', action: 'atualizou o status para', value: 'Em andamento', user: 'João Silva' },
      { id: 2, date: '25/05/2025 10:15', action: 'adicionou a tarefa', value: 'Revisão do Escopo', user: 'Maria Santos' },
      { id: 3, date: '24/05/2025 16:45', action: 'enviou o documento', value: 'Proposta Inicial.pdf', user: 'Carlos Oliveira' },
    ]
  }
];

const getStatusColor = (status) => {
  if (!status) return '#4a5568';
  switch(status.toLowerCase()) {
    case 'em andamento': return '#3182ce';
    case 'concluído': 
    case 'concluido': return '#38a169';
    case 'pendente': return '#d69e2e';
    case 'cancelado': return '#e53e3e';
    default: return '#4a5568';
  }
};

const getFileIcon = (type) => {
  if (!type) return <FaFileAlt style={{ color: '#4A5568' }} />;
  switch(type.toLowerCase()) {
    case 'pdf': return <FaFilePdf style={{ color: '#E53E3E' }} />;
    case 'xlsx':
    case 'xls':
    case 'excel': return <FaFileExcel style={{ color: '#2F855A' }} />;
    case 'docx':
    case 'doc':
    case 'word': return <FaFileWord style={{ color: '#2B6CB0' }} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'image': return <FaFileImage style={{ color: '#805AD5' }} />;
    default: return <FaFileAlt style={{ color: '#4A5568' }} />;
  }
};

export default function PaginaCadaProjeto() {
  const { id } = useParams();
  console.log('ID do projeto da URL:', id);
  console.log('Projetos disponíveis:', projetos);
  const projeto = projetos.find(p => p.id === parseInt(id));
  console.log('Projeto encontrado:', projeto);

  if (!projeto) {
    return <div>Projeto não encontrado</div>;
  }

  return (
    <PageContainer>
      <Header>
        <BackButton to="/cadastro-projetos">
          <FaArrowLeft /> Voltar para Projetos
        </BackButton>
        <ButtonGroup>
          <ActionButton><FaEdit /> Editar</ActionButton>
          <ActionButton danger><FaTrash /> Excluir</ActionButton>
        </ButtonGroup>
      </Header>
      
      {/* Cabeçalho do Projeto */}
      <ProjectInfo>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <ProjectImage>
            <img 
              src={projeto.image} 
              alt={projeto.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </ProjectImage>
          <div>
            <Title style={{ margin: 0 }}>{projeto.name}</Title>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              marginTop: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ 
                backgroundColor: `${getStatusColor(projeto.status)}15`,
                color: getStatusColor(projeto.status),
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FaInfoCircle />
                {projeto.status}
              </div>
              <div style={{ color: '#718096', fontSize: '0.875rem' }}>
                Criado em: {projeto.date}
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          <DetailItem>
            <div style={{ color: '#718096', fontSize: '0.875rem' }}>Proprietário</div>
            <div style={{ fontWeight: '500', marginTop: '0.25rem' }}>{projeto.owner}</div>
          </DetailItem>
          <DetailItem>
            <div style={{ color: '#718096', fontSize: '0.875rem' }}>Data de Início</div>
            <div style={{ fontWeight: '500', marginTop: '0.25rem' }}>{projeto.date}</div>
          </DetailItem>
          <DetailItem>
            <div style={{ color: '#718096', fontSize: '0.875rem' }}>Prazo Final</div>
            <div style={{ fontWeight: '500', marginTop: '0.25rem' }}>{projeto.deadline}</div>
          </DetailItem>
          <DetailItem>
            <div style={{ color: '#718096', fontSize: '0.875rem' }}>Progresso</div>
            <div style={{ marginTop: '0.5rem' }}>
              <ProgressBar>
                <ProgressFill progress={projeto.progress} />
              </ProgressBar>
              <div style={{ 
                textAlign: 'right', 
                fontSize: '0.75rem', 
                color: '#4a5568',
                marginTop: '0.25rem'
              }}>
                {projeto.progress}% concluído
              </div>
            </div>
          </DetailItem>
        </div>

        <Description>
          <h3 style={{ margin: '0 0 1rem', color: '#2d3748' }}>Descrição do Projeto</h3>
          <p style={{ margin: 0, color: '#4a5568', lineHeight: '1.6' }}>{projeto.description}</p>
        </Description>
      </ProjectInfo>

      {/* Seção da Equipe */}
      <Section>
        <SectionHeader>
          <SectionTitle style={{ color: '#2d3748' }}>
            <FaUserTie style={{ marginRight: '0.5rem' }} />
            Equipe do Projeto
          </SectionTitle>
          <ActionButton small>
            <FaUserPlus style={{ marginRight: '0.5rem' }} /> Adicionar Membro
          </ActionButton>
        </SectionHeader>
        <SectionContent>
          <TeamGrid>
            {projeto.team.map(member => (
              <TeamMember key={member.id}>
                <Avatar>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <div>
                  <h4 style={{ margin: 0, color: '#2d3748', fontSize: '1rem' }}>{member.name}</h4>
                  <p style={{ margin: '0.25rem 0 0', color: '#718096', fontSize: '0.875rem' }}>
                    {member.role}
                  </p>
                </div>
              </TeamMember>
            ))}
          </TeamGrid>
        </SectionContent>
      </Section>

      {/* Tarefas */}
      <Section>
        <SectionHeader>
          <SectionTitle style={{ color: '#2d3748' }}>
            <FaTasks style={{ marginRight: '0.5rem' }} />
            Atividades
          </SectionTitle>
          <ActionButton small>
            <FaPlus style={{ marginRight: '0.5rem' }} /> Nova Atividade
          </ActionButton>
        </SectionHeader>
        <SectionContent>
          <TaskList>
            {projeto.tasks.map(task => {
              const statusColor = getStatusColor(task.status);
              return (
                <TaskCard key={task.id}>
                  <div style={{
                    width: '4px',
                    height: '100%',
                    backgroundColor: statusColor,
                    borderRadius: '4px 0 0 4px',
                    position: 'absolute',
                    left: 0,
                    top: 0
                  }} />
                  <TaskInfo>
                    <div style={{
                      fontWeight: '500',
                      color: '#2d3748',
                      marginBottom: '0.5rem'
                    }}>
                      {task.title}
                    </div>
                    <TaskMeta>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: '0.875rem',
                        color: '#718096'
                      }}>
                        <FaUserTie style={{ marginRight: '0.25rem', color: '#a0aec0' }} />
                        {task.responsible}
                      </span>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: '0.875rem',
                        color: '#718096'
                      }}>
                        <FaCalendarAlt style={{ marginRight: '0.25rem', color: '#a0aec0' }} />
                        {task.dueDate}
                      </span>
                    </TaskMeta>
                  </TaskInfo>
                  <div style={{
                    backgroundColor: `${statusColor}15`,
                    color: statusColor,
                    padding: '0.375rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    marginLeft: '1rem'
                  }}>
                    {task.status}
                  </div>
                </TaskCard>
              );
            })}
          </TaskList>
        </SectionContent>
      </Section>

      {/* Documentos */}
      <Section>
        <SectionHeader>
          <SectionTitle style={{ color: '#2d3748' }}>
            <FaFileAlt style={{ marginRight: '0.5rem' }} />
            Documentos e Anexos
          </SectionTitle>
          <ActionButton small>
            <FaFileUpload style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Fazer Upload
          </ActionButton>
        </SectionHeader>
        <SectionContent>
          <DocumentList>
            {projeto.documents.map(doc => {
              const fileExtension = doc.name.split('.').pop().toLowerCase();
              return (
                <DocumentItem key={doc.id}>
                  <DocumentIcon>
                    {getFileIcon(fileExtension)}
                  </DocumentIcon>
                  <DocumentInfo>
                    <div style={{
                      fontWeight: '500',
                      color: '#2d3748',
                      marginBottom: '0.25rem'
                    }}>
                      {doc.name}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#a0aec0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span>Adicionado em {doc.date}</span>
                      <span>•</span>
                      <span>{doc.size || '1.2 MB'}</span>
                    </div>
                  </DocumentInfo>
                  <ActionButton small style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    backgroundColor: '#f7fafc',
                    border: '1px solid #e2e8f0',
                    color: '#4a5568',
                    transition: 'all 0.2s',
                    ':hover': {
                      backgroundColor: '#edf2f7',
                      borderColor: '#cbd5e0'
                    }
                  }}>
                    <FaDownload />
                  </ActionButton>
                </DocumentItem>
              );
            })}
          </DocumentList>
        </SectionContent>
      </Section>

      {/* Histórico de Atividades */}
      <Section>
        <SectionHeader>
          <SectionTitle style={{ color: '#2d3748' }}>Histórico de Atividades</SectionTitle>
        </SectionHeader>
        <SectionContent>
          {projeto.history.map((item) => (
            <HistoryItem key={item.id}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#4299e1',
                marginRight: '1rem',
                position: 'relative',
                flexShrink: 0
              }}>
                <div style={{
                  content: '""',
                  position: 'absolute',
                  width: '2px',
                  backgroundColor: '#e2e8f0',
                  top: '12px',
                  bottom: '-1rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1
                }} />
              </div>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                  marginBottom: 'var(--spacing-1)'
                }}>
                  <span style={{
                    color: '#4a5568',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 500
                  }}>
                    {item.date}
                  </span>
                </div>
                <div style={{ 
                  color: '#4a5568', 
                  lineHeight: '1.6',
                  fontSize: 'var(--font-size-sm)'
                }}>
                  <strong style={{ 
                    color: '#2d3748',
                    fontSize: 'var(--font-size-sm)'
                  }}>
                    {item.user}{' '}
                  </strong>
                  <span style={{ 
                    margin: '0 var(--spacing-1)',
                    fontSize: 'var(--font-size-sm)'
                  }}>
                    {item.action}
                  </span>
                  <span style={{
                    color: '#2d3748',
                    fontWeight: 500,
                    marginLeft: 'var(--spacing-1)',
                    display: 'inline-block',
                    fontSize: 'var(--font-size-sm)'
                  }}>
                    {item.value}
                  </span>
                </div>
              </div>
            </HistoryItem>
          ))}
        </SectionContent>
      </Section>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <BackButton to="/cadastro-projetos">
          <FaArrowLeft style={{ marginRight: '0.5rem' }} /> Voltar para projetos
        </BackButton>
      </div>
    </PageContainer>
  );
}
