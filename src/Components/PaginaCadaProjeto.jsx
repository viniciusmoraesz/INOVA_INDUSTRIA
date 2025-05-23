import { useParams, Link } from 'react-router-dom';
import exemplo1 from '../assets/exemplo1.jpg'; // só para exemplo

// Exemplo local (ideal é pegar via API)
const projetos = [
  { id: 1, name: 'Plataforma de Automação', owner: 'Nexora Tech', date: '06/07/2025', progress: 53, status: 'Em andamento', image: exemplo1, description: 'Projeto focado em automação de processos.' },
  // ... você pode colocar todos os projetos aqui também
];

export default function PaginaCadaProjeto() {
  const { id } = useParams();
  const projeto = projetos.find(p => p.id === parseInt(id));

  if (!projeto) {
    return <div>Projeto não encontrado. <Link to="/cadastro-projetos">Voltar</Link></div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{projeto.name}</h1>
      <img src={projeto.image} alt={projeto.name} style={{ maxWidth: '400px' }} />
      <p><strong>Dono:</strong> {projeto.owner}</p>
      <p><strong>Data:</strong> {projeto.date}</p>
      <p><strong>Status:</strong> {projeto.status}</p>
      <p><strong>Progresso:</strong> {projeto.progress}%</p>
      <p><strong>Descrição:</strong> {projeto.description}</p>

      <Link to="/cadastro-projetos">Voltar para projetos</Link>
    </div>
  );
}
