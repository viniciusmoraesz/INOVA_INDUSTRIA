import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageContainer,
  Header,
  Title,
  SearchBar,
  AddButton,
  UsersGrid,
  UserCard,
  UserName,
  UserCompany,
  UserRole,
  ActionButton
} from '../Styles/StyledUsuariorh';
import { FiPlus, FiSearch, FiUser, FiBriefcase, FiFilter, FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import UserDetails from './UserDetails';

const ITEMS_PER_PAGE = 12;

const Usuariosrh = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [roleFilter, setRoleFilter] = useState('TODOS');
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  
  // Carrega os clientes do localStorage quando o componente monta
  useEffect(() => {
    const loadClientes = () => {
      try {
        console.log('Carregando clientes do localStorage...');
        const clientesSalvos = JSON.parse(localStorage.getItem('clientes_data') || '[]');
        console.log('Clientes carregados do localStorage:', clientesSalvos);
        
        // Filtra apenas clientes ativos e formata os dados para o formato esperado
        const clientesAtivos = clientesSalvos
          .filter(cliente => cliente.ativo !== false)
          .map(cliente => ({
            id: cliente.id,
            name: cliente.nome || cliente.name,
            email: cliente.email,
            phone: cliente.telefone || cliente.phone,
            company: cliente.empresaNome || cliente.company || 'Empresa não informada',
            role: cliente.role || 'CLIENTE',
            projects: cliente.projects || 0,
            ...cliente
          }));
        
        console.log('Clientes formatados:', clientesAtivos);
        
        // Usa apenas os clientes salvos, sem usuários mockados
        setUsers([...clientesAtivos]);
        setFilteredUsers([...clientesAtivos]);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        setUsers([]);
        setFilteredUsers([]);
      }
    };
    
    // Carrega os clientes iniciais
    loadClientes();
    
    // Adiciona listener para mudanças no localStorage
    const handleStorageChange = () => {
      console.log('Mudança detectada no localStorage, recarregando clientes...');
      loadClientes();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  

  // Filtra os usuários com base no termo de busca e filtros
  useEffect(() => {
    let filtered = [...users];

    // Aplica filtro de busca
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user => {
        const userName = user.nome || user.name || '';
        const userEmail = user.email || '';
        const userPhone = user.telefone || user.phone || '';
        const userCompany = user.empresaNome || user.company || '';
        
        return (
          userName.toLowerCase().includes(searchLower) ||
          userEmail.toLowerCase().includes(searchLower) ||
          userPhone.includes(searchTerm) ||
          userCompany.toLowerCase().includes(searchLower)
        );
      });
    }

    // Aplica filtro de função (role)
    if (roleFilter !== 'TODOS') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page on new search/filter
  }, [searchTerm, users, roleFilter]);

  const handleAddUser = () => {
    navigate('/clientes/novo');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
    document.body.style.overflow = 'hidden'; // Impede o scroll da página
  };

  const handleCloseDetails = () => {
    setShowUserDetails(false);
    document.body.style.overflow = 'auto'; // Restaura o scroll da página
  };

  const navigate = useNavigate();

  const handleEditUser = (user) => {
    console.log('Editar usuário:', user);
    navigate(`/usuariosrh/editar/${user.id}`);
    setShowUserDetails(false); // Fechar o modal de detalhes
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      console.log('Excluir usuário:', userId);
      // Implementar lógica de exclusão
      setShowUserDetails(false);
    }
  };

  const handleResetPassword = (userId) => {
    console.log('Redefinir senha do usuário:', userId);
    // Implementar lógica de redefinição de senha
  };

  // Get current users for the current page
  const indexOfLastUser = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Função para obter a classe do papel do usuário
  const getUserRoleClass = (role) => {
    switch(role) {
      case 'GERENTE': return 'manager';
      case 'CLIENTE': return 'client';
      case 'ACOMPANHANTE': return 'attendant';
      default: return '';
    }
  };

  // Função para limpar os clientes salvos
  const limparClientes = () => {
    if (window.confirm('Tem certeza que deseja remover todos os clientes? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('clientes_data');
      window.dispatchEvent(new Event('storage'));
      window.location.reload();
    }
  };

  return (
    <PageContainer>
      <Header>
        <div>
          <Title>Usuários RH</Title>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <AddButton onClick={handleAddUser}>
              <FiPlus /> Cadastrar Cliente
            </AddButton>
            {users.length > 0 && (
              <button 
                onClick={limparClientes}
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
                title="Limpar todos os clientes"
              >
                <FiTrash2 /> Limpar Clientes
              </button>
            )}
          </div>
        </div>
      </Header>

      <SearchBar>
        <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
          <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem', flex: 1 }}
          />
        </div>
        <button 
          onClick={() => setShowFilter(!showFilter)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: showFilter ? '#6c5ce7' : '#f8f9fa',
            color: showFilter ? 'white' : '#495057',
            border: '1px solid #ced4da',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginLeft: '0.5rem',
            transition: 'all 0.2s',
            ':hover': {
              backgroundColor: showFilter ? '#5f4bdb' : '#e9ecef'
            }
          }}
        >
          <FiFilter />
          Filtrar
        </button>
      </SearchBar>

      {showFilter && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid #e9ecef',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ fontWeight: '500' }}>Filtrar por:</div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Função</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #ced4da',
                  backgroundColor: 'white',
                  minWidth: '150px'
                }}
              >
                <option value="TODOS">Todas as funções</option>
                <option value="GERENTE">Gerente</option>
                <option value="CLIENTE">Cliente</option>
                <option value="ACOMPANHANTE">Acompanhante</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <UsersGrid>
        {filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(user => {
          const userName = user.nome || user.name || 'Nome não informado';
          const userCompany = user.empresaNome || user.company || 'Empresa não informada';
          const userRole = user.role || 'CLIENTE';
          const userProjects = user.projects || 0;
          
          return (
            <UserCard key={user.id} onClick={() => handleUserClick(user)}>
              <div className="user-avatar">
                <FiUser size={24} />
              </div>
              <UserName>{userName}</UserName>
              <UserCompany>{userCompany}</UserCompany>
              <UserRole className={userRole.toLowerCase()}>{userRole}</UserRole>
              <div className="user-projects">
                <FiBriefcase size={14} /> {userProjects} projeto{userProjects !== 1 ? 's' : ''}
              </div>
            </UserCard>
          );
        })}
      </UsersGrid>

      {showUserDetails && selectedUser && (
        <UserDetails
          user={selectedUser}
          onClose={handleCloseDetails}
          onEdit={() => handleEditUser(selectedUser)}
          onDelete={() => handleDeleteUser(selectedUser.id)}
          onResetPassword={() => handleResetPassword(selectedUser.id)}
        />
      )}

      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '1.5rem',
          padding: '1rem 0',
          borderTop: '1px solid #f1f3f5'
        }}>
          <ActionButton 
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
          </ActionButton>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Mostrar apenas 5 páginas por vez
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <ActionButton
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                primary={currentPage === pageNum}
                style={{
                  minWidth: '36px',
                  padding: '0.5rem',
                  justifyContent: 'center'
                }}
              >
                {pageNum}
              </ActionButton>
            );
          })}
          
          {totalPages > 5 && (
            <span style={{ padding: '0 0.5rem', color: '#6c757d' }}>...</span>
          )}
          
          <ActionButton 
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight />
          </ActionButton>
          
          <div style={{ marginLeft: '1rem', color: '#6c757d', fontSize: '0.9rem' }}>
            Página {currentPage} de {totalPages}
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Usuariosrh;