import styled from "styled-components";

export const ContainerPrincipal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #043f5d;
  color: white;
  padding: 40px;
  border-radius: 20px;
  max-width: 450px;
  margin-top: 20px;
  margin-left: 700px;
  margin-bottom: 20px;
  gap: 30px;

  h1 {
    font-size: 20px;
    color: white;
  }
`;

export const ContainerForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;

export const FormLabel = styled.label`
  margin-bottom: 10px;
  font-weight: bold;
`;

export const FormInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 2px solid ${props => (props.hasError ? 'red' : 'transparent')};
  font-size: 14px;
  width: 100%;
  outline: none;

  &:focus {
    border-color: ${props => (props.hasError ? 'red' : '#59c3c3')};
  }
`;


FormInput.defaultProps = {
  as: "input"
};



export const FormButton = styled.button`
  background-color: #59c3c3;
  color: #fff;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #47b0b0;
  }
`;

export const LinkTextContainer = styled.p`
  color: white;
  font-size: 1rem;
  margin-top: 15px;
  text-align: center;

  a {
    color: #61c3cc;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px; 
`;

export const ErrorMessage = styled.span`
  color: red;
  font-size: 0.875rem;
  margin-top: 4px;
`;
