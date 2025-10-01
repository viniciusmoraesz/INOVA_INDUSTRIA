import React, { useState, useRef, useEffect } from 'react';
import { 
  FiChevronDown, 
  FiChevronRight, 
  FiCheck, 
  FiPlus, 
  FiMoreVertical, 
  FiEdit2, 
  FiTrash2,
  FiClock,
  FiUser,
  FiList,
  FiCircle,
  FiMessageSquare,
  FiTag,
  FiCalendar,
  FiAlertCircle,
  FiLoader
} from 'react-icons/fi';
import styled, { css, keyframes } from 'styled-components';

// Cores baseadas na imagem
const colors = {
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  white: '#FFFFFF',
};

// Animações
const slideDown = keyframes`
  from { 
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to { 
    opacity: 1;
    max-height: 1000px;
    transform: translateY(0);
  }
`;

// Componentes estilizados
const Titulo = styled.span`
  font-size: 14px;
  color: ${props => props.concluida ? colors.gray500 : colors.gray800};
  text-decoration: ${props => props.concluida ? 'line-through' : 'none'};
  line-height: 1.4;
  font-weight: ${props => props.concluida ? 'normal' : '500'};
  cursor: pointer;
  
  &:hover {
    color: ${colors.primary};
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  min-width: 100px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  ${props => {
    switch(props.status) {
      case 'CONCLUIDA':
        return `
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          color: #065f46;
          
          svg {
            color: #10b981;
          }
        `;
      case 'EM_ANDAMENTO':
        return `
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          color: #1e40af;
          
          svg {
            color: #3b82f6;
            animation: pulse 1.5s infinite;
          }
        `;
      case 'PENDENTE':
        return `
          background: linear-gradient(135deg, #fffbeb, #fef3c7);
          color: #92400e;
          
          svg {
            color: #f59e0b;
          }
        `;
      case 'CANCELADA':
        return `
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          color: #991b1b;
          text-decoration: line-through;
          
          svg {
            color: #ef4444;
          }
        `;
      default:
        return `
          background: #f3f4f6;
          color: #4b5563;
          
          svg {
            color: #9ca3af;
          }
        `;
    }
  }}
  
  svg {
    font-size: 13px;
    flex-shrink: 0;
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;

const PriorityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: ${props => {
    switch(props.prioridade?.toLowerCase()) {
      case 'alta': return '#FEE2E2';
      case 'média': return '#FEF3C7';
      case 'baixa': return '#D1FAE5';
      default: return '#E5E7EB';
    }
  }};
  color: ${props => {
    switch(props.prioridade?.toLowerCase()) {
      case 'alta': return '#991B1B';
      case 'média': return '#92400E';
      case 'baixa': return '#065F46';
      default: return '#4B5563';
    }
  }};
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 20px;
  min-width: 80px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  ${props => {
    switch(props.prioridade) {
      case 'ALTA':
        return `
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          color: #991b1b;
          
          svg {
            color: #ef4444;
          }
        `;
      case 'MEDIA':
        return `
          background: linear-gradient(135deg, #fffbeb, #fef3c7);
          color: #92400e;
          
          svg {
            color: #f59e0b;
          }
        `;
      case 'BAIXA':
        return `
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          color: #065f46;
          
          svg {
            color: #10b981;
          }
        `;
      default:
        return `
          background: #f3f4f6;
          color: #4b5563;
          
          svg {
            color: #9ca3af;
          }
        `;
    }
  }}
  
  svg {
    font-size: 12px;
    flex-shrink: 0;
  }
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  white-space: nowrap;
`;

const Descricao = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  color: ${colors.gray600};
  font-size: 13px;
  line-height: 1.4;
  margin-top: 6px;
  
  svg {
    color: ${colors.gray400};
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  span {
    flex: 1;
  }
`;

const AtividadeItem = ({
  atividade, 
  onToggleConclusao,
  onAdicionarSubAtividade,
  onEditar,
  onExcluir,
  nivel = 0,
  innerRef
}) => {
  const [expandido, setExpandido] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  // Fechar o menu ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAberto(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const temSubatividades = atividade.subatividades && atividade.subatividades.length > 0;
  const margemEsquerda = `${nivel * 24}px`;

  // Função para obter a cor baseada na prioridade
  const getPriorityColor = (prioridade) => {
    switch(prioridade) {
      case 'ALTA': return colors.danger;
      case 'MEDIA': return colors.warning;
      case 'BAIXA': return colors.success;
      default: return colors.gray400;
    }
  };

  // Função para obter o ícone baseado no status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'EM_ANDAMENTO': return <FiLoader size={14} color={colors.warning} />;
      case 'CONCLUIDA': return <FiCheck size={14} color={colors.success} />;
      case 'ATRASADA': return <FiAlertCircle size={14} color={colors.danger} />;
      default: return <FiClock size={14} color={colors.gray400} />;
    }
  };

  const toggleExpandir = (e) => {
    e.stopPropagation();
    setExpandido(!expandido);
  };

  const handleToggleConclusao = (e) => {
    e.stopPropagation();
    onToggleConclusao && onToggleConclusao(atividade.idAtividade);
  };

  const handleAdicionarSubAtividade = (e) => {
    e.stopPropagation();
    onAdicionarSubAtividade && onAdicionarSubAtividade(atividade.idAtividade);
  };

  const handleEditar = (e) => {
    e.stopPropagation();
    onEditar && onEditar(atividade);
  };

  const handleExcluir = (e) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir "${atividade.titulo}"?`)) {
      onExcluir && onExcluir(atividade.idAtividade);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    // Se clicar no item, alterna a expansão se tiver subatividades
    if (temSubatividades) {
      setExpandido(!expandido);
    }
  };

  return (
    <div>
      <ItemContainer
        ref={innerRef}
        className={`${expandido ? 'aberta' : ''} ${atividade.concluida ? 'concluida' : ''}`}
        data-nivel={nivel}
        onClick={handleClick}
        style={{
          paddingLeft: nivel > 0 ? `${nivel * 24}px` : '0',
          cursor: 'pointer',
          position: 'relative',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          boxSizing: 'border-box',
          background: 'white',
          borderRadius: '8px',
          marginBottom: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ 
          display: 'flex', 
          width: '100%',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            flex: 1, 
            minWidth: 0,
            overflow: 'hidden',
            paddingRight: '120px' /* Espaço para os botões de ação */
          }}>
            {temSubatividades ? (
              <ExpandButton 
                onClick={toggleExpandir} 
                aberta={expandido}
                title={expandido ? 'Recolher' : 'Expandir'}
              >
                <FiChevronRight size={14} />
              </ExpandButton>
            ) : <div style={{ width: '28px', flexShrink: 0 }} />}
            
            <Checkbox 
              concluida={atividade.concluida}
              onClick={handleToggleConclusao}
            >
              {atividade.concluida && <FiCheck size={14} />}
            </Checkbox>
            
            <Titulo 
              concluida={atividade.concluida}
              onClick={(e) => {
                e.stopPropagation();
                onEditar && onEditar(atividade);
              }}
              style={{ 
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                padding: '8px 0',
                margin: '0 16px 0 12px',
                flex: 1,
                minWidth: 0
              }}
            >
              {String(atividade.titulo || 'Sem título').replace(/[+':]/g, '')}
            </Titulo>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginLeft: '16px',
            flexShrink: 0
          }}>
          <BotaoAcao 
            onClick={(e) => {
              e.stopPropagation();
              handleAdicionarSubAtividade(e);
            }} 
            title="Adicionar subatividade"
          >
            <FiPlus size={16} />
          </BotaoAcao>
          <div ref={menuRef} style={{ position: 'relative' }}>
            <BotaoMenu 
              onClick={(e) => {
                e.stopPropagation();
                setMenuAberto(!menuAberto);
              }}
              title="Opções"
              className="menu-button"
            >
              <FiMoreVertical size={18} />
            </BotaoMenu>
            {menuAberto && (
              <MenuDropdown style={{ display: 'block' }}>
                <MenuItem onClick={handleEditar}>
                  <FiEdit2 size={14} /> Editar
                </MenuItem>
                <MenuItem onClick={handleExcluir} perigoso>
                  <FiTrash2 size={14} /> Excluir
                </MenuItem>
              </MenuDropdown>
            )}
          </div>
          </div>
        </div>

        {nivel > 0 && (
          <div className="item-details">
            <MetaInfo>
              <div className="meta-row">
                <StatusBadge status={atividade.status}>
                  {getStatusIcon(atividade.status)}
                  <span>{atividade.status?.replace('_', ' ') || 'PENDENTE'}</span>
                </StatusBadge>
                {atividade.prioridade && (
                  <PriorityBadge prioridade={atividade.prioridade}>
                    <FiAlertCircle size={12} />
                    <span>{atividade.prioridade}</span>
                  </PriorityBadge>
                )}
              </div>
              
              {atividade.dataTerminoPrevista && (
                <div className="meta-row">
                  <MetaItem>
                    <FiCalendar size={12} />
                    <span>
                      {new Date(atividade.dataTerminoPrevista).toLocaleDateString('pt-BR')}
                    </span>
                  </MetaItem>
                </div>
              )}
              
              {atividade.responsavel && (
                <div className="meta-row">
                  <MetaItem>
                    <FiUser size={12} />
                    <span>{atividade.responsavel.nome?.split(' ')[0] || 'Sem responsável'}</span>
                  </MetaItem>
                </div>
              )}
            </MetaInfo>
          </div>
        )}
      </ItemContainer>
      
      {expandido && atividade.subatividades && atividade.subatividades.length > 0 && (
        <SubatividadesContainer expandido={expandido}>
          <div className="subatividade-header">
            <FiList size={14} />
            SUBATIVIDADES ({atividade.subatividades.length})
          </div>
          <div className="subatividade-lista">
            {atividade.subatividades.map((subatividade, index) => (
              <div key={subatividade.id || index} className="subatividade-item">
                <div className="subatividade-titulo">
                  {subatividade.titulo || 'Sem título'}
                </div>
                <div className="subatividade-detalhes">
                  <div>
                    <FiCircle size={12} style={{ 
                      color: subatividade.status === 'CONCLUIDA' ? '#10B981' : 
                             subatividade.status === 'EM_ANDAMENTO' ? '#F59E0B' : 
                             subatividade.status === 'ATRASADA' ? '#EF4444' : '#94A3B8' 
                    }} />
                    {subatividade.status?.replace('_', ' ') || 'Pendente'}
                  </div>
                  {subatividade.prioridade && (
                    <div>
                      <FiAlertCircle size={12} style={{ 
                        color: subatividade.prioridade === 'ALTA' ? '#EF4444' : 
                               subatividade.prioridade === 'MEDIA' ? '#F59E0B' : '#10B981' 
                      }} />
                      {subatividade.prioridade}
                    </div>
                  )}
                  {subatividade.dataTerminoPrevista && (
                    <div>
                      <FiCalendar size={12} />
                      {new Date(subatividade.dataTerminoPrevista).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  {subatividade.responsavel?.nome && (
                    <div>
                      <FiUser size={12} />
                      {subatividade.responsavel.nome.split(' ')[0]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SubatividadesContainer>
      )}
    </div>
  );
};

// Exporta o componente com memo e forwardRef para otimização de desempenho
export default React.memo(
  React.forwardRef((props, ref) => (
    <AtividadeItem {...props} innerRef={ref} />
  ))
);

// Estilos atualizados
const ItemContainer = styled.div`
  position: relative;
  min-height: 48px;
  width: 100%;
  box-sizing: border-box;
  
  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
  
  &.concluida {
    opacity: 0.7;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(0,0,0,0.01), transparent);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 12px;
  }
  
  /* Aplica o traço apenas para subníveis (nivel > 0) */
  &[data-nivel="0"] > div::before {
    display: none;
  }
  
  &[data-nivel]:not([data-nivel="0"]) > div {
    margin: 8px 0;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: -18px;
      top: 24px;
      width: 16px;
      height: 2px;
      background-color: #e5e7eb;
    }
  }
  
  ${props => props.expandido && css`
    padding-top: 8px;
    padding-bottom: 8px;
  `}
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
    border-color: #e2e8f0;
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
  
  &.active {
    background: ${colors.primaryLight}08;
    border-left: 4px solid ${colors.primary};
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 2px;
      background: ${colors.primary};
      border-radius: 2px 0 0 2px;
    }
  }
  &:hover {
    background: ${props => props.concluida ? '#f0fdf4' : colors.gray100};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
    
    .menu-button {
      opacity: 1;
    }
  }
  
  .item-content {
    display: flex;
    width: 100%;
    align-items: center;
    min-width: 0;
    position: relative;
  }
  
  .item-main {
    display: flex;
    align-items: center;
    min-width: 0;
    width: 100%;
    justify-content: space-between;
    position: relative;
    gap: 8px;
  }
  
  .item-details {
    width: 100%;
    margin-top: 8px;
    margin-left: 0;
    padding-left: 0px; /* Alinha com o início do título */
  }
`;

const Checkbox = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid ${props => props.concluida ? colors.success : colors.gray300};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.concluida ? colors.success : 'white'};
  color: white;
  flex-shrink: 0;
  margin: 0 4px 0 0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: currentColor;
    opacity: 0;
    transition: opacity 0.2s ease;
    border-radius: 4px;
    pointer-events: none;
  }
  
  &:hover {
    border-color: ${props => props.concluida ? '#059669' : colors.primaryLight};
    background: ${props => props.concluida ? '#059669' : 'white'};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  svg {
    position: relative;
    z-index: 1;
    transition: all 0.2s ease;
    stroke-width: 3px;
  }
`;
  

const ExpandButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${colors.gray400};
  padding: 4px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: currentColor;
    opacity: 0;
    border-radius: 6px;
    transition: opacity 0.2s ease;
  }
  
  svg {
    position: relative;
    z-index: 1;
    transition: transform 0.2s ease;
  }
  
  &:hover {
    color: #4b5563;
    
    &::before {
      opacity: 0.1;
    }
  }
  
  &:active {
    transform: scale(0.95);
    
    &::before {
      opacity: 0.15;
    }
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

const Acoes = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: 16px;
`;

const BotaoAcao = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  transition: all 0.2s ease;
  opacity: 0.7;
  
  &:hover {
    background: #f3f4f6;
    opacity: 1;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: currentColor;
    opacity: 0;
    border-radius: 6px;
    transition: opacity 0.2s ease;
  }
  
  svg {
    position: relative;
    z-index: 1;
    transition: transform 0.2s ease;
  }
  
  &:hover {
    color: ${colors.primary};
    
    &::before {
      opacity: 0.1;
    }
  }
  
  &:active {
    transform: scale(0.95);
    
    &::before {
      opacity: 0.15;
    }
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

const BotaoMenu = styled(BotaoAcao)`
  position: relative;
  padding: 0;
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 10;
  overflow: hidden;
  border: 1px solid #e5e7eb;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 8px 16px;
  text-align: left;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.perigoso ? '#EF4444' : '#4b5563'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f9fafb;
  }
  
  &:active {
    background: #f3f4f6;
  }
`;

// MetaItem - Estilo para itens de metadados
const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: #4b5563;
  background: #f8fafc;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: #f1f5f9;
    transform: translateY(-1px);
  }
  
  svg {
    color: #9ca3af;
    flex-shrink: 0;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  font-size: 12px;
  
  .meta-row {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #f8fafc;
    padding: 4px 10px;
    border-radius: 16px;
    border: 1px solid #f1f5f9;
    transition: all 0.2s ease;
    
    &:hover {
      background: #f1f5f9;
      transform: translateY(-1px);
    }
    
    ${StatusBadge}, ${PriorityBadge}, ${MetaItem} {
      margin: 0;
    }
  }
  
  &.meta-top {
    margin-top: 0;
    margin-bottom: 6px;
  }
`;


const SubatividadesContainer = styled.div`
  width: 100%;
  overflow: hidden;
  margin: 12px 0 0 0;
  border-radius: 8px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: ${props => props.expandido ? '1000px' : '0'};
  opacity: ${props => props.expandido ? '1' : '0'};
  transform: translateY(${props => props.expandido ? '0' : '-10px'});
  border: 1px solid #f1f5f9;
  
  .subatividade-header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: #f8fafc;
    border-bottom: 1px solid #f1f5f9;
    font-weight: 600;
    font-size: 12px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    svg {
      margin-right: 8px;
      color: #94a3b8;
    }
  }
  
  .subatividade-lista {
    padding: 8px 0;
  }

  .subatividade-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    transition: all 0.2s ease;
    border-bottom: 1px solid #f8fafc;
    
    &:hover {
      background: #f8fafc;
    }
    
    &:last-child {
      border-bottom: none;
    }
    
    .subatividade-titulo {
      flex: 1;
      font-weight: 500;
      color: #334155;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .subatividade-detalhes {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-left: 16px;
      
      & > div {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #64748b;
        
        svg {
          margin-right: 6px;
          color: #94a3b8;
        }
      }
    }
  }
`;

