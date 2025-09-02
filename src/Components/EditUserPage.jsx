import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { 
  FiArrowLeft, 
  FiUser, 
  FiBriefcase, 
  FiMail, 
  FiPhone, 
  FiFileText, 
  FiCheck, 
  FiX,
  FiSave,
  FiAlertCircle,
  FiChevronDown,
  FiPlus,
  FiTrash2
} from 'react-icons/fi';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  padding: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
  animation: ${fadeIn} 0.3s ease-out;
  
  @media (min-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const BackButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #495057;
  display: inline-flex;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.6rem 1rem 0.6rem 0.8rem;
  transition: all 0.2s ease;
  
  svg {
    margin-right: 0.5rem;
    font-size: 1.1em;
  }
  
  &:hover {
    background-color: #f1f3f5;
    color: #2d3436;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: #2d3436;
  margin: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: #6c5ce7;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f3f9;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  color: #2d3436;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f3f5;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: #6c5ce7;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3436;
  font-size: 0.9rem;
  
  svg {
    margin-right: 0.5rem;
    color: #6c5ce7;
    font-size: 1.1em;
  }
  
  .required {
    color: #e63946;
    margin-left: 0.25rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e3ff;
  border-radius: 8px;
  font-size: 1rem;
  color: #2d3436;
  background-color: #f8f9ff;
  transition: all 0.2s ease;
  
  &::placeholder {
    color: #95a5a6;
    opacity: 0.7;
  }
  
  &:focus {
    border-color: #6c5ce7;
    outline: 0;
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.15);
    background-color: white;
  }
  
  &:disabled {
    background-color: #f8f9fa;
    border-color: #e9ecef;
    cursor: not-allowed;
    opacity: 0.8;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e3ff;
  border-radius: 8px;
  font-size: 1rem;
  color: #2d3436;
  background-color: #f8f9ff;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%236c757d' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 16px 12px;
  padding-right: 2.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #6c5ce7;
    outline: 0;
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.15);
    background-color: white;
  }
  
  &:disabled {
    background-color: #f8f9fa;
    border-color: #e9ecef;
    cursor: not-allowed;
    opacity: 0.8;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 0.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const RadioButton = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding-left: 2rem;
  min-height: 1.5rem;
  user-select: none;
  
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    
    &:checked ~ .checkmark {
      background-color: #6c5ce7;
      border-color: #6c5ce7;
      
      &::after {
        opacity: 1;
      }
    }
  }
  
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 1.25rem;
    width: 1.25rem;
    background-color: #f8f9ff;
    border: 1px solid #e0e3ff;
    border-radius: 50%;
    transition: all 0.2s ease;
    
    &::after {
      content: '';
      position: absolute;
      opacity: 0;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      background: white;
      transition: opacity 0.2s ease;
    }
  }
  
  &:hover input ~ .checkmark {
    border-color: #6c5ce7;
  }
  
  .radio-label {
    font-weight: 500;
    color: #2d3436;
    font-size: 0.95rem;
  }
`;

const SelectedProjects = styled.div`
  margin-top: 1.5rem;
  
  .project-list {
    display: grid;
    gap: 0.75rem;
    margin-top: 0.75rem;
  }
  
  .empty-state {
    background: #f8f9ff;
    border: 1px dashed #e0e3ff;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    color: #6c757d;
    font-size: 0.95rem;
    
    svg {
      display: block;
      margin: 0 auto 0.75rem;
      font-size: 1.5rem;
      color: #a8b0ff;
    }
  }
`;

const ProjectCard = styled.div`
  background: #f8f9ff;
  border: 1px solid #e0e3ff;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #c8d0ff;
    background: #f3f4ff;
  }
  
  .project-info {
    flex: 1;
    margin-right: 1rem;
    
    .project-name {
      font-weight: 500;
      color: #2d3436;
      margin-bottom: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      svg {
        color: #6c5ce7;
      }
    }
    
    .project-company {
      font-size: 0.85rem;
      color: #6c757d;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
  
  .remove-btn {
    background: none;
    border: none;
    color: #e63946;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: #fff5f5;
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f3f5;
  
  @media (max-width: 480px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

const Button = styled.button.attrs({
  // Usando transient props com $ para evitar que sejam passadas para o DOM
  $primary: props => props.$primary || false,
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  background-color: ${props => props.$primary ? '#6c5ce7' : '#f8f9fa'};
  color: ${props => props.$primary ? 'white' : '#2d3436'};
  
  ${props => props.$primary ? `
    box-shadow: 0 2px 10px rgba(108, 92, 231, 0.3);
    
    &:hover {
      background-color: #5d4acf;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(108, 92, 231, 0.4);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(108, 92, 231, 0.3);
    }
  ` : `
    border-color: #e9ecef;
    
    &:hover {
      background-color: #f1f3f5;
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
  }
  
  svg {
    font-size: 1.1em;
  }
`;

const DangerButton = styled(Button)`
  background-color: #fff5f5;
  color: #e63946;
  border: 1px solid #fed7d7;
  
  &:hover {
    background-color: #fff1f1;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(229, 62, 62, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;



const EditUserPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  
  // Dados do usuário - em uma aplicação real, isso viria de uma API
  const [userData, setUserData] = useState({
    name: 'Vinicius Moraes Vianna',
    cpf: '123.456.789-09',
    email: 'vinicius.vianna@inovaindustria.com.br',
    profileType: 'GERENTE',
    company: 'INOVA INDÚSTRIA',
    project: 'Modernização de Linha de Produção',
    selectedProjects: 3
  });

  // Dados de projetos vinculados
  const [projects, setProjects] = useState([
    { id: 1, name: 'Modernização de Linha de Produção', company: 'INOVA INDÚSTRIA' },
    { id: 2, name: 'Automação Industrial', company: 'INOVA INDÚSTRIA' },
    { id: 3, name: 'Manutenção Preditiva', company: 'INOVA INDÚSTRIA' }
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados atualizados:', userData);
    // Aqui você faria a chamada para a API para atualizar os dados
    // Após o sucesso, poderia redirecionar de volta para a lista
    navigate('/usuariosrh');
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FiArrowLeft /> Voltar
        </BackButton>
        <Title>
          <FiUser size={28} />
          Editar Usuário
        </Title>
      </Header>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <SectionTitle>
            <FiUser size={22} />
            Informações Pessoais
          </SectionTitle>
          
          <FormRow>
            <FormGroup>
              <Label>
                <FiUser size={16} />
                Nome Completo <span className="required">*</span>
              </Label>
              <Input 
                type="text" 
                name="name" 
                value={userData.name} 
                onChange={handleInputChange} 
                placeholder="Digite o nome completo"
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>
                <FiFileText size={16} />
                CPF <span className="required">*</span>
              </Label>
              <Input 
                type="text" 
                name="cpf" 
                value={userData.cpf} 
                onChange={handleInputChange} 
                placeholder="000.000.000-00"
                required 
                disabled
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label>
                <FiMail size={16} />
                E-mail <span className="required">*</span>
              </Label>
              <Input 
                type="email" 
                name="email" 
                value={userData.email} 
                onChange={handleInputChange} 
                placeholder="exemplo@empresa.com"
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>
                <FiPhone size={16} />
                Telefone
              </Label>
              <Input 
                type="tel" 
                name="phone" 
                value={userData.phone || ''} 
                onChange={handleInputChange} 
                placeholder="(00) 00000-0000"
              />
            </FormGroup>
          </FormRow>
          
          <SectionTitle>
            <FiBriefcase size={22} />
            Informações de Acesso
          </SectionTitle>
          
          <FormRow>
            <FormGroup>
              <Label>
                <FiUser size={16} />
                Perfil de Acesso <span className="required">*</span>
              </Label>
              <Select 
                name="profileType" 
                value={userData.profileType} 
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione um perfil</option>
                <option value="GERENTE">Gerente</option>
                <option value="CLIENTE">Cliente</option>
                <option value="ACOMPANHANTE">Acompanhante</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>
                <FiBriefcase size={16} />
                Cliente <span className="required">*</span>
              </Label>
              <Input 
                type="text" 
                name="company" 
                value={userData.company} 
                onChange={handleInputChange} 
                placeholder="Nome da empresa"
                required 
              />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label>
              <FiBriefcase size={16} />
              Projetos Vinculados
            </Label>
            
            <SelectedProjects>
              {projects.length > 0 ? (
                <div className="project-list">
                  {projects.map(project => (
                    <ProjectCard key={project.id}>
                      <div className="project-info">
                        <div className="project-name">
                          <FiBriefcase size={16} />
                          {project.name}
                        </div>
                        <div className="project-company">
                          {project.company}
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="remove-btn" 
                        onClick={() => console.log('Remover projeto', project.id)}
                        title="Remover projeto"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </ProjectCard>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <FiAlertCircle size={32} />
                  <p>Nenhum projeto vinculado a este usuário</p>
                </div>
              )}
              
              <Button 
                type="button" 
                style={{ marginTop: '1rem' }}
                onClick={() => console.log('Adicionar projeto')}
              >
                <FiPlus size={16} />
                Adicionar Projeto
              </Button>
            </SelectedProjects>
          </FormGroup>
          
          <ButtonGroup>
            <DangerButton 
              type="button" 
              onClick={() => {
                if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
                  console.log('Excluir usuário:', userId);
                  navigate('/usuariosrh');
                }
              }}
            >
              <FiTrash2 size={16} />
              Excluir Usuário
            </DangerButton>
            
            <Button 
              type="button" 
              onClick={() => navigate(-1)}
              style={{ marginLeft: 'auto' }}
            >
              <FiX size={16} />
              Cancelar
            </Button>
            
            <Button 
              type="submit" 
              $primary
            >
              <FiSave size={16} />
              Salvar Alterações
            </Button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default EditUserPage;
