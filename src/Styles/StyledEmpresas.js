import styled from 'styled-components';
import { FiPlus, FiSearch, FiBriefcase, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex: 1;
  max-width: 400px;
  
  input {
    border: none;
    outline: none;
    padding: 0.5rem;
    width: 100%;
    font-size: 0.9rem;
    color: #34495e;
    
    &::placeholder {
      color: #95a5a6;
    }
  }
  
  svg {
    color: #7f8c8d;
    margin-right: 0.5rem;
  }
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #2980b9;
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

export const CompaniesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

export const CompanyCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e0e0e0;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

export const CompanyHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  svg {
    margin-right: 0.75rem;
    color: #3498db;
    font-size: 1.5rem;
    background: #ebf5fb;
    padding: 0.5rem;
    border-radius: 8px;
  }
`;

export const CompanyName = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
`;

export const CompanyInfo = styled.div`
  margin: 0.75rem 0;
  color: #7f8c8d;
  font-size: 0.9rem;
  
  strong {
    color: #2c3e50;
    margin-right: 0.5rem;
  }
`;

export const CompanyActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid ${props => props.variant === 'edit' ? '#3498db' : '#e74c3c'};
  color: ${props => props.variant === 'edit' ? '#3498db' : '#e74c3c'};
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.variant === 'edit' ? '#ebf5fb' : '#fdedec'};
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2.5rem;
  gap: 1rem;
`;

export const PageButton = styled.button`
  background: ${props => props.active ? '#3498db' : 'white'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  border: 1px solid ${props => props.active ? '#3498db' : '#ddd'};
  border-radius: 6px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? '#2980b9' : '#f8f9fa'};
    border-color: ${props => props.active ? '#2980b9' : '#3498db'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #7f8c8d;
  
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #bdc3c7;
  }
  
  h3 {
    margin: 0.5rem 0;
    color: #2c3e50;
  }
  
  p {
    margin: 0.5rem 0 1.5rem;
  }
`;
