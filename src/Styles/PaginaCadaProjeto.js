import styled from "styled-components";
import { Link } from 'react-router-dom';

// Cores base
const colors = {
  primary: '#3182ce',
  success: '#38a169',
  warning: '#d69e2e',
  danger: '#e53e3e',
  gray: '#4a5568',
  lightGray: '#e2e8f0',
  white: '#ffffff',
  background: '#f8fafc'
};

export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e1e4e8;
`;

export const Title = styled.h1`
  font-size: 2rem;
  color: #2d3748;
  margin: 0;
`;

export const ProjectInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ProjectImage = styled.div`
  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

export const ProjectDetails = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const DetailItem = styled.div`
  margin-bottom: 1rem;
  
  strong {
    color: #4a5568;
    margin-right: 0.5rem;
  }
`;

export const ProgressBar = styled.div`
  height: 10px;
  background: #e2e8f0;
  border-radius: 5px;
  margin-top: 0.5rem;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: #4299e1;
  width: ${props => props.progress}%;
  border-radius: 5px;
  transition: width 0.3s ease;
`;

export const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  margin-top: 1.5rem;
  
  &:hover {
    color: #2b6cb0;
    text-decoration: underline;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

export const Description = styled.p`
  line-height: 1.6;
  color: ${colors.gray};
  margin: 1.5rem 0;
  padding: 1rem;
  background: ${colors.background};
  border-left: 3px solid ${colors.primary};
  border-radius: 0 4px 4px 0;
`;

export const Section = styled.section`
  background: ${colors.white};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
`;

export const SectionHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${colors.lightGray};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${colors.background};
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: ${colors.gray};
  margin: 0;
  font-weight: 600;
`;

export const SectionContent = styled.div`
  padding: 1.5rem;
`;

export const ActionButton = styled.button`
  background: none;
  border: 1px solid ${colors.primary};
  color: ${colors.primary};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:hover {
    background: ${colors.primary}15;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

export const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

export const TeamMember = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${colors.lightGray};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  color: ${colors.gray};
`;

export const TaskList = styled.div`
  margin-top: 1rem;
`;

export const TaskCard = styled.div`
  background: ${colors.background};
  border-left: 3px solid ${props => 
    props.status === 'Concluído' ? colors.success : 
    props.status === 'Atrasado' ? colors.danger : colors.primary};
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TaskInfo = styled.div`
  flex: 1;
`;

export const TaskMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: ${colors.gray};
  margin-top: 0.25rem;
`;

export const DocumentList = styled.div`
  margin-top: 1rem;
`;

export const DocumentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${colors.lightGray};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const DocumentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const DocumentIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${colors.background};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.primary};
`;

export const HistoryItem = styled.div`
  padding: 0.75rem 0;
  border-bottom: 1px solid ${colors.lightGray};
  font-size: 0.875rem;
  color: ${colors.gray};
  
  &:last-child {
    border-bottom: none;
  }
  
  time {
    color: ${colors.gray};
    opacity: 0.8;
    margin-right: 0.5rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;
