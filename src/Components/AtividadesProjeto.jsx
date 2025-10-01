import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { 
  FiPlus, 
  FiMessageSquare,
  FiLoader,
  FiAlertCircle,
  FiCalendar,
  FiUser,
  FiFlag,
  FiCheck
} from 'react-icons/fi';
import projetoApiService from '../services/projetoApiService';
import AtividadeModal from './AtividadeModal';
import AtividadeItem from './AtividadeItem';

// Animações
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Estilização
const Container = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.4s ease-out;
  border: 1px solid #f1f5f9;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.625rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 10px rgba(79, 70, 229, 0.2);
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
    background: linear-gradient(135deg, #4338ca, #6d28d9);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(79, 70, 229, 0.3);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  }
`;

const ActivitiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 1rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 2rem;
  text-align: center;
  color: #64748b;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #e2e8f0;
  margin: 1rem 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    border-color: #c7d2fe;
    background: rgba(199, 210, 254, 0.1);
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 3.5rem;
    color: #c7d2fe;
    margin-bottom: 1.25rem;
    background: rgba(99, 102, 241, 0.1);
    padding: 1.25rem;
    border-radius: 50%;
    transition: all 0.3s ease;
  }
  
  h3 {
    font-size: 1.375rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.75rem;
    line-height: 1.3;
  }
  
  p {
    margin: 0 0 1.75rem;
    color: #64748b;
    max-width: 420px;
    line-height: 1.6;
    font-size: 1.025rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  
  .spinner {
    animation: spin 1.2s linear infinite;
    margin-bottom: 1.25rem;
    color: #4f46e5;
    font-size: 2.75rem;
  }
  
  p {
    color: #475569;
    font-size: 1.0625rem;
    margin-top: 1rem;
    font-weight: 500;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  color: #b91c1c;
  padding: 0.9375rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.75rem;
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  border-left: 4px solid #dc2626;
  animation: ${fadeIn} 0.3s ease-out;
  
  svg {
    flex-shrink: 0;
    font-size: 1.25rem;
    margin-top: 0.125rem;
  }
  
  p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
    font-weight: 500;
  }
`;

const ActivityMeta = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: #475569;
  background: #f1f5f9;
  padding: 5px 11px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1;
  
  svg {
    color: #64748b;
    font-size: 0.8125rem;
    flex-shrink: 0;
  }
  
  &:hover {
    background: #e2e8f0;
    transform: translateY(-1px);
  }
`;

const AtividadesProjeto = ({ projeto, onAtividadeAtualizada }) => {
  const { id } = useParams();
  const [atividades, setAtividades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [atividadeAtual, setAtividadeAtual] = useState(null);
  const [atividadePaiId, setAtividadePaiId] = useState(null);

  // Carrega as atividades do projeto
  const carregarAtividades = useCallback(async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Busca o projeto completo com atividades
      const data = await projetoApiService.buscarProjetoCompleto(id);
      console.log('Dados recebidos do backend:', data);
      
      // Processa as atividades para criar a estrutura de árvore
      const processarAtividades = (projeto) => {
        if (!projeto || !projeto.atividades || !Array.isArray(projeto.atividades)) {
          console.log('Nenhuma atividade encontrada no projeto');
          return [];
        }
        
        console.log('Processando', projeto.atividades.length, 'atividades do projeto');
        
        // Mapa para armazenar todas as atividades por ID
        const todasAtividades = [];
        
        // Primeiro, processa todas as atividades principais
        projeto.atividades.forEach(atividade => {
          if (!atividade) return;
          
          console.log('Processando atividade:', atividade.idAtividade, atividade.titulo);
          
          // Cria o objeto da atividade principal
          const atividadeProcessada = {
            idAtividade: atividade.idAtividade,
            idProjeto: atividade.idProjeto,
            idResponsavel: atividade.idResponsavel,
            titulo: atividade.titulo,
            descricao: atividade.descricao,
            dataInicioPrevista: atividade.dataInicioPrevista,
            dataTerminoPrevista: atividade.dataTerminoPrevista,
            dataTerminoReal: atividade.dataTerminoReal,
            status: atividade.status,
            prioridade: atividade.prioridade,
            concluida: atividade.status === 'CONCLUIDA',
            responsavel: atividade.responsavel,
            subatividades: []
          };
          
          // Adiciona a atividade à lista de todas as atividades
          todasAtividades.push(atividadeProcessada);
          
          // Processa as subatividades, se existirem
          if (atividade.subatividades && Array.isArray(atividade.subatividades) && atividade.subatividades.length > 0) {
            console.log('Encontradas', atividade.subatividades.length, 'subatividades para a atividade', atividade.idAtividade);
            
            atividade.subatividades.forEach(subatividade => {
              if (!subatividade) return;
              
              console.log('Processando subatividade:', subatividade.idSubAtividade, subatividade.titulo);
              
              // Cria o objeto da subatividade
              const subatividadeProcessada = {
                idAtividade: subatividade.idSubAtividade,
                idAtividadePai: atividade.idAtividade,
                idProjeto: atividade.idProjeto,
                idResponsavel: subatividade.idResponsavel || atividade.idResponsavel,
                titulo: subatividade.titulo,
                descricao: subatividade.descricao,
                dataInicioPrevista: subatividade.dataInicioPrevista,
                dataTerminoPrevista: subatividade.dataTerminoPrevista,
                dataTerminoReal: subatividade.dataTerminoReal,
                status: subatividade.status,
                prioridade: subatividade.prioridade,
                concluida: subatividade.status === 'CONCLUIDA',
                responsavel: subatividade.responsavel || atividade.responsavel,
                subatividades: [] // Não permitimos sub-subatividades por enquanto
              };
              
              // Adiciona a subatividade à lista de todas as atividades
              todasAtividades.push(subatividadeProcessada);
              
              // Adiciona a subatividade à lista de subatividades da atividade pai
              atividadeProcessada.subatividades.push(subatividadeProcessada);
            });
          }
        });
        
        console.log('Todas as atividades processadas:', todasAtividades);
        
        // Retorna apenas as atividades raiz (que não têm idAtividadePai)
        const atividadesRaiz = todasAtividades.filter(a => !a.idAtividadePai);
        console.log('Atividades raiz encontradas:', atividadesRaiz.length);
        
        return atividadesRaiz;
      };
      
      const atividadesProcessadas = data ? processarAtividades(data) : [];
      console.log('Atividades processadas para renderização:', atividadesProcessadas);
      setAtividades(atividadesProcessadas);
      
      // Notifica o componente pai sobre a atualização
      if (onAtividadeAtualizada) {
        onAtividadeAtualizada(atividadesProcessadas);
      }
    } catch (err) {
      console.error('Erro ao carregar atividades:', err);
      setError('Não foi possível carregar as atividades. Tente novamente mais tarde.');
      setAtividades([]);
    } finally {
      setIsLoading(false);
    }
  }, [id, onAtividadeAtualizada]);

  // Efeito para carregar as atividades quando o componente é montado ou o ID muda
  useEffect(() => {
    carregarAtividades();
  }, [carregarAtividades]);

  // Alterna o status de conclusão de uma atividade
  const toggleConclusaoAtividade = async (idAtividade) => {
    try {
      // Encontra a atividade na árvore
      const encontrarAtividade = (itens, id) => {
        for (const item of itens) {
          if (item.idAtividade === id) return item;
          if (item.subatividades?.length > 0) {
            const encontrada = encontrarAtividade(item.subatividades, id);
            if (encontrada) return encontrada;
          }
        }
        return null;
      };

      // Atualiza o status da atividade no backend
      const atividade = encontrarAtividade(atividades, idAtividade);
      if (!atividade) return;

      const dadosAtualizados = {
        ...atividade,
        concluida: !atividade.concluida,
        dataConclusao: !atividade.concluida ? new Date().toISOString() : null
      };

      await projetoApiService.atualizarAtividade(idAtividade, dadosAtualizados);
      
      // Atualiza o estado local
      const atualizarAtividadeNaLista = (itens) => {
        return itens.map(item => {
          if (item.idAtividade === idAtividade) {
            return { ...item, ...dadosAtualizados };
          }
          if (item.subatividades?.length > 0) {
            return {
              ...item,
              subatividades: atualizarAtividadeNaLista(item.subatividades)
            };
          }
          return item;
        });
      };

      setAtividades(prevAtividades => atualizarAtividadeNaLista(prevAtividades));
      
    } catch (err) {
      console.error('Erro ao atualizar atividade:', err);
      setError('Não foi possível atualizar a atividade. Tente novamente.');
    }
  };

  // Abre o modal para criar/editar uma atividade
  const abrirModalNovaAtividade = (paiId = null) => {
    setAtividadeAtual(null);
    setAtividadePaiId(paiId);
    setModalAberto(true);
  };

  // Abre o modal para editar uma atividade existente
  const abrirModalEditarAtividade = (atividade) => {
    setAtividadeAtual(atividade);
    setAtividadePaiId(null);
    setModalAberto(true);
  };

  // Exclui uma atividade
  const excluirAtividade = async (idAtividade) => {
    if (!window.confirm('Tem certeza que deseja excluir esta atividade? Todas as subatividades também serão removidas.')) return;
    
    try {
      await projetoApiService.excluirAtividade(idAtividade);
      
      // Remove a atividade da lista local
      const removerAtividadeDaLista = (itens) => {
        return itens.reduce((acc, item) => {
          if (item.idAtividade === idAtividade) {
            return acc; // Remove a atividade
          }
          
          // Mantém a atividade mas filtra suas subatividades
          const subatividadesAtualizadas = item.subatividades 
            ? removerAtividadeDaLista(item.subatividades) 
            : [];
            
          return [...acc, { ...item, subatividades: subatividadesAtualizadas }];
        }, []);
      };

      setAtividades(prevAtividades => removerAtividadeDaLista(prevAtividades));
      
    } catch (err) {
      console.error('Erro ao excluir atividade:', err);
      setError('Não foi possível excluir a atividade. Tente novamente.');
    }
  };

  // Salva uma atividade (cria ou atualiza)
  const salvarAtividade = async (dados) => {
    try {
      let atividadeSalva;
      
      if (dados.idAtividade) {
        // Atualizar atividade existente
        atividadeSalva = await projetoApiService.atualizarAtividade(dados.idAtividade, dados);
      } else {
        // Criar nova atividade
        const dadosAtividade = {
          ...dados,
          idProjeto: parseInt(id),
          idAtividadePai: atividadePaiId || null
        };
        
        atividadeSalva = await projetoApiService.criarAtividade(dadosAtividade);
      }
      
      // Recarrega as atividades para garantir que temos os dados mais recentes
      await carregarAtividades();
      
      return true;
    } catch (err) {
      console.error('Erro ao salvar atividade:', err);
      setError(`Não foi possível ${dados.idAtividade ? 'atualizar' : 'criar'} a atividade. Tente novamente.`);
      return false;
    }
  };

  // Renderiza os metadados de uma atividade
  const renderMetaData = (atividade) => (
    <ActivityMeta>
      {atividade.dataTerminoPrevista && (
        <MetaItem>
          <FiCalendar size={12} />
          <span>{new Date(atividade.dataTerminoPrevista).toLocaleDateString('pt-BR')}</span>
        </MetaItem>
      )}
      {atividade.responsavel && (
        <MetaItem>
          <FiUser size={12} />
          <span>{atividade.responsavel.nome || 'Sem responsável'}</span>
        </MetaItem>
      )}
      {atividade.prioridade && (
        <MetaItem>
          <FiFlag size={12} />
          <span>{atividade.prioridade}</span>
        </MetaItem>
      )}
    </ActivityMeta>
  );

  return (
    <Container>
      <Header>
        <Title>Atividades do Projeto</Title>
        <Button onClick={() => abrirModalNovaAtividade()}>
          <FiPlus size={18} />
          Nova Atividade
        </Button>
      </Header>

      {error && (
        <ErrorMessage>
          <FiAlertCircle size={20} />
          <p>{error}</p>
        </ErrorMessage>
      )}

      {isLoading ? (
        <LoadingContainer>
          <FiLoader className="spinner" size={32} />
          <p>Carregando atividades...</p>
        </LoadingContainer>
      ) : atividades.length === 0 ? (
        <EmptyState>
          <FiMessageSquare size={48} />
          <h3>Nenhuma atividade encontrada</h3>
          <p>Comece adicionando uma nova atividade ao projeto para organizar suas tarefas e acompanhar o progresso.</p>
          <Button onClick={() => abrirModalNovaAtividade()}>
            <FiPlus size={18} />
            Adicionar Atividade
          </Button>
        </EmptyState>
      ) : (
        <ActivitiesList>
          {atividades.map(atividade => (
            <AtividadeItem
              key={atividade.idAtividade}
              atividade={atividade}
              onToggleConclusao={toggleConclusaoAtividade}
              onAdicionarSubAtividade={abrirModalNovaAtividade}
              onEditar={abrirModalEditarAtividade}
              onExcluir={excluirAtividade}
              renderMetaData={() => renderMetaData(atividade)}
            />
          ))}
        </ActivitiesList>
      )}

      {/* Modal para adicionar/editar atividades */}
      <AtividadeModal
        isOpen={modalAberto}
        onClose={() => {
          setModalAberto(false);
          setAtividadeAtual(null);
          setAtividadePaiId(null);
        }}
        onSave={async (dados) => {
          const sucesso = await salvarAtividade(dados);
          if (sucesso) {
            setModalAberto(false);
            setAtividadeAtual(null);
            setAtividadePaiId(null);
          }
          return sucesso;
        }}
        atividade={atividadeAtual}
        projetoId={id}
      />
    </Container>
  );
};

export default AtividadesProjeto;
