import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { 
  FiArrowLeft, 
  FiBriefcase, 
  FiMail, 
  FiPhone, 
  FiMapPin,
  FiFileText,
  FiSave,
  FiX,
  FiUsers,
  FiGrid,
  FiCalendar,
  FiCheck
} from 'react-icons/fi';
import { empresaService } from '../services/empresaService';
// O tipo CreateEmpresaDTO não é necessário em tempo de execução, então podemos removê-lo
// Se precisar validar o tipo em tempo de execução, considere usar uma biblioteca como Yup

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Estilos reutilizáveis (podem ser movidos para um arquivo separado posteriormente)
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
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #495057;
  font-weight: 500;
  
  &:hover {
    background-color: #e9ecef;
  }
  
  svg {
    font-size: 1.1em;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #2d3436;
  margin: 0;
  flex: 1;
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  color: #2d3436;
  margin: 1.5rem 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #6c5ce7;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    
    > * {
      flex: 1;
    }
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .required {
    color: #e63946;
    margin-left: 0.25rem;
  }
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
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

const estadosBrasileiros = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const setoresAtuacao = [
  'Tecnologia', 'Indústria', 'Comércio', 'Serviços', 'Saúde',
  'Educação', 'Construção Civil', 'Alimentício', 'Varejo', 'Outros'
];

const CadastrarEmpresa = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    quantidadeFuncionarios: 0,
    setorAtuacao: '',
    dataFundacao: undefined,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? parseInt(value, 10) : 0
    }));
  };

  const handleDateInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? new Date(value) : undefined
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Usando o serviço para criar a empresa
      await empresaService.criarEmpresa({
        ...formData,
        quantidadeFuncionarios: formData.quantidadeFuncionarios || 0,
        ativo: true
      });
      
      // Redireciona para a lista de empresas após o cadastro
      navigate('/empresas');
      
    } catch (error) {
      console.error('Erro ao cadastrar empresa:', error);
      alert('Erro ao cadastrar empresa. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para buscar CEP (exemplo de implementação)
  const buscarCep = async (cep) => {
    if (cep.length === 9) {
      try {
        // Aqui você faria uma chamada para a API de CEP
        // const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        // const data = await response.json();
        
        // Simulando resposta da API de CEP
        const data = {
          logradouro: 'Rua Exemplo',
          bairro: 'Bairro Exemplo',
          localidade: 'Cidade Exemplo',
          uf: 'SP'
        };
        
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || ''
        }));
        
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/empresas')}>
          <FiArrowLeft /> Voltar
        </BackButton>
        <Title>Cadastrar Nova Empresa</Title>
      </Header>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <SectionTitle>
            <FiBriefcase size={20} />
            Dados Cadastrais
          </SectionTitle>
          
          <FormRow>
            <FormGroup>
              <Label>
                CNPJ <span className="required">*</span>
              </Label>
              <Input 
                type="text" 
                name="cnpj" 
                value={formData.cnpj} 
                onChange={handleInputChange} 
                placeholder="00.000.000/0000-00"
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>
                Razão Social <span className="required">*</span>
              </Label>
              <Input 
                type="text" 
                name="razaoSocial" 
                value={formData.razaoSocial} 
                onChange={handleInputChange} 
                placeholder="Razão Social da Empresa"
                required 
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label>
                Nome Fantasia <span className="required">*</span>
              </Label>
              <Input 
                type="text" 
                name="nomeFantasia" 
                value={formData.nomeFantasia} 
                onChange={handleInputChange} 
                placeholder="Nome Fantasia da Empresa"
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Inscrição Estadual</Label>
              <Input 
                type="text" 
                name="inscricaoEstadual" 
                value={formData.inscricaoEstadual || ''} 
                onChange={handleInputChange} 
                placeholder="Inscrição Estadual"
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label>Inscrição Municipal</Label>
              <Input 
                type="text" 
                name="inscricaoMunicipal" 
                value={formData.inscricaoMunicipal || ''} 
                onChange={handleInputChange} 
                placeholder="Inscrição Municipal"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Data de Fundação</Label>
              <Input 
                type="date" 
                name="dataFundacao" 
                value={formData.dataFundacao ? formData.dataFundacao.toISOString().split('T')[0] : ''} 
                onChange={handleDateInputChange} 
              />
            </FormGroup>
          </FormRow>
          
          <SectionTitle>
            <FiMail size={20} />
            Contato
          </SectionTitle>
          
          <FormRow>
            <FormGroup>
              <Label>
                E-mail <span className="required">*</span>
              </Label>
              <Input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="empresa@exemplo.com.br"
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>
                Telefone <span className="required">*</span>
              </Label>
              <Input 
                type="tel" 
                name="telefone" 
                value={formData.telefone} 
                onChange={handleInputChange} 
                placeholder="(00) 0000-0000"
                required 
              />
            </FormGroup>
          </FormRow>
          
          <SectionTitle>
            <FiMapPin size={20} />
            Endereço
          </SectionTitle>
          
          <FormRow>
            <FormGroup>
              <Label>CEP</Label>
              <Input 
                type="text" 
                name="cep" 
                value={formData.cep} 
                onChange={(e) => {
                  handleInputChange(e);
                  buscarCep(e.target.value);
                }}
                placeholder="00000-000"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Endereço</Label>
              <Input 
                type="text" 
                name="endereco" 
                value={formData.endereco} 
                onChange={handleInputChange} 
                placeholder="Rua, Avenida, etc."
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label>Número</Label>
              <Input 
                type="text" 
                name="numero" 
                value={formData.numero} 
                onChange={handleInputChange} 
                placeholder="Número"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Complemento</Label>
              <Input 
                type="text" 
                name="complemento" 
                value={formData.complemento || ''} 
                onChange={handleInputChange} 
                placeholder="Complemento"
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label>Bairro</Label>
              <Input 
                type="text" 
                name="bairro" 
                value={formData.bairro} 
                onChange={handleInputChange} 
                placeholder="Bairro"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Cidade</Label>
              <Input 
                type="text" 
                name="cidade" 
                value={formData.cidade} 
                onChange={handleInputChange} 
                placeholder="Cidade"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Estado</Label>
              <Select 
                name="estado" 
                value={formData.estado} 
                onChange={handleInputChange}
              >
                <option value="">Selecione</option>
                {estadosBrasileiros.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </Select>
            </FormGroup>
          </FormRow>
          
          <SectionTitle>
            <FiUsers size={20} />
            Informações Adicionais
          </SectionTitle>
          
          <FormRow>
            <FormGroup>
              <Label>Quantidade de Funcionários</Label>
              <Input 
                type="number" 
                name="quantidadeFuncionarios" 
                value={formData.quantidadeFuncionarios || ''} 
                onChange={handleNumberInputChange} 
                min="0"
                placeholder="Número de funcionários"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Setor de Atuação</Label>
              <Select 
                name="setorAtuacao" 
                value={formData.setorAtuacao} 
                onChange={handleInputChange}
              >
                <option value="">Selecione um setor</option>
                {setoresAtuacao.map(setor => (
                  <option key={setor} value={setor}>{setor}</option>
                ))}
              </Select>
            </FormGroup>
          </FormRow>
          
          <SectionTitle>
            <FiFileText size={20} />
            Observações
          </SectionTitle>
          
          <FormGroup>
            <Label>Observações adicionais</Label>
            <textarea 
              name="observacoes" 
              value={formData.complemento || ''} 
              onChange={handleInputChange} 
              placeholder="Digite observações adicionais sobre a empresa"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '0.75rem 1rem',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                transition: 'all 0.2s ease',
              }}
            />
          </FormGroup>
          
          <ButtonGroup>
            <Button 
              type="button" 
              onClick={() => navigate(-1)}
              style={{ marginRight: 'auto' }}
              disabled={isSubmitting}
            >
              <FiX size={16} />
              Cancelar
            </Button>
            
            <Button 
              type="submit" 
              $primary
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FiCheck size={16} />
                  Salvando...
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  Salvar Empresa
                </>
              )}
            </Button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default CadastrarEmpresa;
