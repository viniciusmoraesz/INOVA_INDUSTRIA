import React, { useState } from 'react';
import styled from 'styled-components';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    phone: '',
    employees: '',
    state: '',
    city: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const industries = [
    'Tecnologia',
    'Saúde',
    'Educação',
    'Finanças',
    'Varejo',
    'Manufatura',
    'Outro'
  ];

  const states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const employeeRanges = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.company.trim()) newErrors.company = 'Empresa é obrigatória';
    if (!formData.industry) newErrors.industry = 'Selecione o ramo da empresa';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.employees) newErrors.employees = 'Selecione o número de funcionários';
    if (!formData.state) newErrors.state = 'Selecione o estado';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.message.trim()) newErrors.message = 'Por favor, nos conte o que está buscando';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const simulateApiCall = async (data) => {
    // Simulando uma chamada API com timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Dados enviados:', data);
        resolve({ success: true });
      }, 1500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await simulateApiCall(formData);
      if (response.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
          industry: '',
          phone: '',
          employees: '',
          state: '',
          city: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      setSubmitStatus('error');
      console.error('Erro ao enviar formulário:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <Title>Entre em contato com nossa equipe</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Nome</Label>
          <Input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            $hasError={!!errors.name}
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            $hasError={!!errors.email}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="company">Empresa</Label>
          <Input 
            type="text" 
            id="company" 
            name="company" 
            value={formData.company}
            onChange={handleChange}
            $hasError={!!errors.company}
          />
          {errors.company && <ErrorMessage>{errors.company}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="industry">Selecione o ramo da empresa</Label>
          <Select 
            id="industry" 
            name="industry" 
            value={formData.industry}
            onChange={handleChange}
            $hasError={!!errors.industry}
          >
            <option value="">Selecione...</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </Select>
          {errors.industry && <ErrorMessage>{errors.industry}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="phone">Telefone</Label>
          <PhoneInputContainer>
            <CountryCode>+55</CountryCode>
            <PhoneInput 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone}
              onChange={handleChange}
              $hasError={!!errors.phone}
            />
          </PhoneInputContainer>
          {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="employees">Número de funcionários em sua empresa</Label>
          <Select 
            id="employees" 
            name="employees" 
            value={formData.employees}
            onChange={handleChange}
            $hasError={!!errors.employees}
          >
            <option value="">Selecione...</option>
            {employeeRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </Select>
          {errors.employees && <ErrorMessage>{errors.employees}</ErrorMessage>}
        </FormGroup>
        
        <LocationGroup>
          <FormGroup $flex="1">
            <Label htmlFor="state">Estado</Label>
            <Select 
              id="state" 
              name="state" 
              value={formData.state}
              onChange={handleChange}
              $hasError={!!errors.state}
            >
              <option value="">Selecione...</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </Select>
            {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup $flex="2">
            <Label htmlFor="city">Cidade</Label>
            <Input 
              type="text" 
              id="city" 
              name="city" 
              value={formData.city}
              onChange={handleChange}
              $hasError={!!errors.city}
            />
            {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
          </FormGroup>
        </LocationGroup>
        
        <FormGroup>
          <Label htmlFor="message">Conte-nos o que está buscando</Label>
          <TextArea 
            id="message" 
            name="message" 
            rows="4"
            value={formData.message}
            onChange={handleChange}
            $hasError={!!errors.message}
          />
          {errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
        </FormGroup>
        
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </SubmitButton>
        
        {submitStatus === 'success' && (
          <SuccessMessage>Formulário enviado com sucesso! Entraremos em contato em breve.</SuccessMessage>
        )}
        {submitStatus === 'error' && (
          <ErrorMessage>Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.</ErrorMessage>
        )}
      </Form>
    </FormContainer>
  );
};

// Styles com styled-components
const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: ${props => props.$flex || 'initial'};
`;

const LocationGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: #444;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid ${props => props.$hasError ? '#e74c3c' : '#ddd'};
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid ${props => props.$hasError ? '#e74c3c' : '#ddd'};
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid ${props => props.$hasError ? '#e74c3c' : '#ddd'};
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const PhoneInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CountryCode = styled.span`
  padding: 0.8rem;
  background-color: #eee;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
`;

const PhoneInput = styled(Input)`
  flex: 1;
  border-radius: 0 4px 4px 0;
`;

const SubmitButton = styled.button`
  padding: 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.span`
  color: #27ae60;
  font-size: 1rem;
  text-align: center;
  padding: 0.5rem;
`;

export default ContactForm;