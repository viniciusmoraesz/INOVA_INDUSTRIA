import styled from 'styled-components';

export const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: ${props => props.$flex || 'initial'};
`;

export const LocationGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

export const Label = styled.label`
  font-weight: 600;
  color: #444;
`;

export const Input = styled.input`
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

export const Select = styled.select`
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

export const TextArea = styled.textarea`
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

export const PhoneInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CountryCode = styled.span`
  padding: 0.8rem;
  background-color: #eee;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
`;

export const PhoneInput = styled(Input)`
  flex: 1;
  border-radius: 0 4px 4px 0;
`;

export const SubmitButton = styled.button`
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

export const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const SuccessMessage = styled.div`
  padding: 1rem;
  background-color: #2ecc71;
  color: white;
  border-radius: 4px;
  text-align: center;
  margin-top: 1rem;
`;

export const LinkText = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  
  a {
    color: #3498db;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;
