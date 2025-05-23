import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  background: #1f2b33;
  min-height: 100vh;
  color: #fff;
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 300px;
  background: #2f3e46;
  padding: 1.5rem;
  box-shadow: 2px 0 5px rgba(0,0,0,0.3);
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  border: none;
  margin-top: 1rem;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  padding: 2rem;
`;

export const Header = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

export const AddButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
`;

export const FilterContainer = styled.div`
  margin-bottom: 1rem;
`;

export const FilterButton = styled.button`
  background: ${({ active }) => active ? '#4CAF50' : '#ccc'};
  color: #000;
  border: none;
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
`;

export const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

export const ProjectCard = styled.div`
  background: #2f3e46;
  padding: 1rem;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* suave */
  cursor: pointer;

  &:hover {
    transform: translateY(-5px); /* sobe 5px */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* sombra mais intensa */
  }
`;


export const ProjectImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

export const ProjectTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0.5rem 0;
`;

export const ProjectInfo = styled.p`
  margin: 0.2rem 0;
`;

export const ProgressBar = styled.div`
  background: #555;
  border-radius: 8px;
  overflow: hidden;
  margin: 0.5rem 0;

  div {
    width: ${({ progress }) => progress}%;
    background: #4CAF50;
    height: 8px;
  }
`;

export const Status = styled.span`
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  background: ${({ status }) => {
    if (status === 'Concluído') return '#4CAF50';
    if (status === 'Em andamento') return '#FFC107';
    return '#2196F3';
  }};
  color: #000;
  font-size: 0.8rem;
`;

export const DeleteButton = styled.button`
  background: #e63946;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 0.8rem;  
  align-self: flex-end;

  &:hover {
    background: #d62828;
  }
`;


