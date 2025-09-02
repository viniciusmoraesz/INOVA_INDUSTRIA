import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: #6c5ce7;
  }
`;

export const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 600px;
  position: relative;
  
  input {
    padding: 0.65rem 1rem 0.65rem 2.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    width: 100%;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    
    &:focus {
      outline: none;
      border-color: #6c5ce7;
      box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
    }
  }
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #95a5a6;
  }
`;

export const ActionButton = styled.button`
  padding: 0.65rem 1.25rem;
  background-color: ${props => props.primary ? '#6c5ce7' : '#f8f9fa'};
  color: ${props => props.primary ? 'white' : '#2d3436'};
  border: 1px solid ${props => props.primary ? 'transparent' : '#dfe6e9'};
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-shadow: ${props => props.primary ? '0 2px 10px rgba(108, 92, 231, 0.3)' : 'none'};
  
  &:hover {
    background-color: ${props => props.primary ? '#5d4acf' : '#f1f2f6'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

export const AddButton = styled(ActionButton)`
  background-color: #6c5ce7;
  color: white;
  
  &:hover {
    background-color: #5d4acf;
  }
`;

export const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
`;

export const UserCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: #6c5ce7;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border-color: #e0e0e0;
    
    &::before {
      opacity: 1;
    }
  }
`;

export const UserName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2d3436;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #6c5ce7;
    font-size: 1.1em;
  }
`;

export const UserCompany = styled.p`
  margin: 0 0 0.5rem 0;
  color: #636e72;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #95a5a6;
    font-size: 1em;
  }
`;

export const UserRole = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #f8f9fa;
  color: #2d3436;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: auto;
  align-self: flex-start;
  border: 1px solid #e9ecef;
  
  svg {
    color: #6c5ce7;
    font-size: 0.9em;
  }
  
  &.manager {
    background-color: #e3f2fd;
    color: #1976d2;
    border-color: #bbdefb;
  }
  
  &.client {
    background-color: #e8f5e9;
    color: #388e3c;
    border-color: #c8e6c9;
  }
  
  &.attendant {
    background-color: #fff3e0;
    color: #f57c00;
    border-color: #ffe0b2;
  }
`;
