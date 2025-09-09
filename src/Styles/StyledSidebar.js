import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiUsers, FiFolder, FiBriefcase } from 'react-icons/fi';

export const SidebarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: ${({ isOpen }) => (isOpen ? '250px' : '60px')};
  background-color: #2c3e50;
  color: white;
  transition: all 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 15px;
  height: 60px;
  background-color: #1a252f;
`;

export const Logo = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  margin-right: 10px;
`;

export const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
`;

export const MenuItem = styled.li`
  display: flex;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: #34495e;
  }

  &.active {
    background-color: #3498db;
  }
`;

export const MenuIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 15px;
  min-width: 20px;
  display: flex;
  justify-content: center;
`;

export const MenuText = styled.span`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  font-size: 0.9rem;
`;

export const MenuLink = styled(Link)`
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  backdrop-filter: blur(2px);
  transition: opacity 0.3s ease;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  
  @media (min-width: 769px) {
    display: none;
  }
`;
