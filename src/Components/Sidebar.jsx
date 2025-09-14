import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  SidebarContainer, 
  SidebarHeader, 
  Logo, 
  MenuButton, 
  SidebarMenu, 
  MenuItem, 
  MenuIcon, 
  MenuText,
  MenuLink,
  Overlay
} from '../Styles/StyledSidebar';
import { FiMenu, FiX, FiUsers, FiFolder, FiBriefcase, FiLogOut, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Menu items configuration
  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <FiBarChart2 />,
      roles: ['ADMIN', 'SUPER_ADMIN']
    },
    {
      title: 'Clientes',
      path: '/clientes',
      icon: <FiUsers />,
      roles: ['ADMIN', 'SUPER_ADMIN']
    },
    {
      title: 'Projetos',
      path: '/projetos',
      icon: <FiFolder />,
      roles: ['ADMIN', 'SUPER_ADMIN', 'CLIENTE']
    },
    {
      title: 'Empresas',
      path: '/empresas',
      icon: <FiBriefcase />,
      roles: ['ADMIN', 'SUPER_ADMIN']
    },
    {
      title: 'Sair',
      path: '/logout',
      icon: <FiLogOut />,
      roles: ['ADMIN', 'SUPER_ADMIN', 'CLIENTE']
    }
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    // If no user is logged in, show only public routes (none in this case)
    if (!user) return false;
    
    // If user has no role, show nothing
    if (!user.role) return false;
    
    // Check if user's role is included in the item's allowed roles
    return item.roles.includes(user.role);
  });
  
  // Don't show sidebar if no user is logged in or no menu items are available
  if (!user || filteredMenuItems.length === 0) {
    return null;
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && isOpen && !e.target.closest('.sidebar-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Overlay isOpen={isOpen && isMobile} onClick={toggleSidebar} />
      <SidebarContainer isOpen={isOpen} className="sidebar-container">
        <SidebarHeader>
          <MenuButton onClick={toggleSidebar}>
            {isOpen ? <FiX /> : <FiMenu />}
          </MenuButton>
          {isOpen && (
            <Logo 
              src="/src/assets/LOGO.png" 
              alt="Logo" 
              isOpen={isOpen}
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
          )}
        </SidebarHeader>
        
        <SidebarMenu>
          {filteredMenuItems.map((item, index) => (
            <MenuItem 
              key={index} 
              className={location.pathname === item.path ? 'active' : ''}
            >
              <MenuLink to={item.path}>
                <MenuIcon>{item.icon}</MenuIcon>
                <MenuText isOpen={isOpen}>{item.title}</MenuText>
              </MenuLink>
            </MenuItem>
          ))}
        </SidebarMenu>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
