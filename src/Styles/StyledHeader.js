import styled from 'styled-components';

export const HeaderContainer = styled.header`
  background-color: white;
  color: #0F3F63;
  padding: 1rem 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
`;

export const Navbar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

export const Logo = styled.img`
  width: 3rem;
  height: 3rem;
`;

export const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #0F3F63;
  font-size: 1.8rem;
  cursor: pointer;
  z-index: 1001;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const NavMenu = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: white;
    flex-direction: column;
    max-height: 0;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    &.active {
      max-height: 100vh;
      padding: 1rem 0;
      border-top: 1px solid #e1e1e1;
    }
  }
`;

export const NavItem = styled.li`
  position: relative;
  margin: 0 1rem;
  padding: 0.5rem 0;

  @media (max-width: 768px) {
    margin: 0;
    padding: 0;
  }
`;

export const NavLink = styled.span`
  color: #0F3F63;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    color: white;
    background-color: #0F3F63;
  }

  @media (max-width: 768px) {
    padding: 1rem 2rem;
  }
`;

export const DropdownIndicator = styled.span`
  font-size: 0.6rem;
  transition: transform 0.3s;

  @media (max-width: 768px) {
    transform: rotate(-90deg);
    
    &.active {
      transform: rotate(0deg);
    }
  }
`;

export const DropdownMenu = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 200px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  border-radius: 4px;

  &.active {
    max-height: 500px;
    border: 1px solid #e1e1e1;
  }

  @media (max-width: 768px) {
    position: static;
    box-shadow: none;
    background-color: #f8f9fa;
    border: none;

    &.active {
      max-height: 500px;
    }
  }
`;

export const DropdownItem = styled.li`
  padding: 0;
`;

export const DropdownLink = styled.a`
  color: #0F3F63;
  text-decoration: none;
  display: block;
  padding: 0.75rem 1rem;
  transition: all 0.3s;

  &:hover {
    color: white;
    background-color: #0F3F63;
  }

  @media (max-width: 768px) {
    padding-left: 3rem;
  }
`;
