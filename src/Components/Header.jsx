import React, { useState } from 'react';
import {
  HeaderContainer,
  Navbar,
  Logo,
  HamburgerButton,
  NavMenu,
  NavItem,
  NavLink,
  DropdownIndicator,
  DropdownMenu,
  DropdownItem,
  DropdownLink
} from '../Styles/StyledHeader';

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      name: 'Clientes',
      submenu: [
        'Manufatura',
        'Controladoria',
        'Gestão Comercial',
        'Logística',
        'P&D'
      ]
    },
    {
      name: 'Projetos',
      submenu: [
        'Cadastrar Projeto',
        'Apontar Projeto'
      ]
    },
    {
      name: 'Despesas',
      submenu: [
        'Relatórios',
        'Cadastro de Fornecedor'
      ]
    },
    {
      name: 'Contábil',
      submenu: [
        'Lançamentos',
        'Extrato Bancário',
        'Notas Fiscais',
        'Demonstrações'
      ]
    },
    {
      name: 'Área do Cliente',
      submenu: [
        { text: 'Login', link: '/login' },
        { text: 'Registrar', link: '/registrar' }
      ]
    }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setActiveMenu(null);
  };

  const handleMenuToggle = (menuName) => {
    if (window.innerWidth <= 768) {
      setActiveMenu(activeMenu === menuName ? null : menuName);
    } else {
      setActiveMenu(menuName);
    }
  };

  return (
    <HeaderContainer>
      <Navbar>
        <div>
          <a href=".">
            <Logo src="../../src/assets/firefox_8rEIgyiZ1r.png" alt="logo" />
          </a>
        </div>
        
        <HamburgerButton 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </HamburgerButton>

        <NavMenu className={mobileMenuOpen ? 'active' : ''}>
          {menuItems.map((item, index) => (
            <NavItem 
              key={index}
              onMouseEnter={() => window.innerWidth > 768 && handleMenuToggle(item.name)}
              onMouseLeave={() => window.innerWidth > 768 && setActiveMenu(null)}
            >
              <NavLink
                onClick={() => window.innerWidth <= 768 && handleMenuToggle(item.name)}
              >
                {item.name}
                {item.submenu.length > 0 && (
                  <DropdownIndicator className={activeMenu === item.name ? 'active' : ''}>
                    ▼
                  </DropdownIndicator>
                )}
              </NavLink>
              
              {item.submenu.length > 0 && (
                <DropdownMenu className={activeMenu === item.name ? 'active' : ''}>
                  {item.submenu.map((subItem, subIndex) => (
                    <DropdownItem key={subIndex}>
                      {typeof subItem === 'object' ? (
                        <DropdownLink href={subItem.link}>{subItem.text}</DropdownLink>
                      ) : (
                        <DropdownLink href="#">{subItem}</DropdownLink>
                      )}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              )}
            </NavItem>
          ))}
        </NavMenu>
      </Navbar>
    </HeaderContainer>
  );
};

export default Header;