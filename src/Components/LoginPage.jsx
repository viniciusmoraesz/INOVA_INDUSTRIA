import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    captcha: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // Carrega o reCAPTCHA quando o componente monta
  useEffect(() => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha.render('recaptcha-container', {
          sitekey: 'FUTURA_IMPLEMENTACAO', // Será implementado futuramente
          callback: (token) => {
            setCaptchaVerified(true);
            setErrors({...errors, captcha: ''});
          },
          'expired-callback': () => {
            setCaptchaVerified(false);
          },
          'error-callback': () => {
            setCaptchaVerified(false);
          }
        });
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = { username: '', password: '', captcha: '' };

    if (!formData.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      valid = false;
    }

    if (!captchaVerified) {
      newErrors.captcha = 'Por favor, verifique que você não é um robô';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // No futuro será validado o token do API de Captcha
      const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=SUA_CHAVE_SECRETA_RECAPTCHA&response=${window.grecaptcha.getResponse()}`, // Será substituido pela chave secreta
      });

      const recaptchaData = await recaptchaResponse.json();

      if (!recaptchaData.success) {
        throw new Error('Falha na verificação do reCAPTCHA');
      }

      // No futuro, os dados do formulário serão enviados para o API de login.
      const loginResponse = await fetch('SUA_API_DE_LOGIN', { // Será substituido pelo endpoint real
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          recaptchaToken: window.grecaptcha.getResponse()
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || 'Erro ao fazer login');
      }

      // Login bem-sucedido
      console.log('Login bem-sucedido:', loginData);
      // Redirecionar para dashboard

    } catch (error) {
      console.error('Erro no login:', error);
      setErrors({
        ...errors,
        captcha: error.message || 'Erro ao processar o login'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <LogoText>Inova Indústria</LogoText>
        <Description>
          A Inova Indústria tem como objetivo oferecer soluções eficazes e sustentáveis em consultoria para manufatura, 
          logística, controladoria, P&D e gestão comercial, sendo um parceiro estratégico para empresas de todos os partes.
        </Description>
        
        <LoginForm onSubmit={handleSubmit}>
          <FormTitle>Faça Login</FormTitle>
          
          <FormGroup>
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input 
              type="text" 
              id="username" 
              name="username" 
              value={formData.username}
              onChange={handleChange}
              hasError={!!errors.username}
            />
            {errors.username && <ErrorText>{errors.username}</ErrorText>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <Input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              hasError={!!errors.password}
            />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </FormGroup>

          <CaptchaContainer id="recaptcha-container" />
          {errors.captcha && <ErrorText>{errors.captcha}</ErrorText>}
          
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </SubmitButton>
        </LoginForm>
        
        <FooterText>
          Ainda não é um cliente? <ContactLink href="/registrar">Contate-nos</ContactLink>
        </FooterText>
      </LoginBox>
    </LoginContainer>
  );
};

// Styles
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0F3F63;
  padding: 20px;
`;

const LoginBox = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  padding: 30px;
  width: 100%;
  max-width: 500px;
`;

const LogoText = styled.h1`
  color: #0F3F63;
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
`;

const Description = styled.p`
  color: #555;
  text-align: center;
  margin-bottom: 30px;
  font-size: 14px;
  line-height: 1.5;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 95%
`;

const FormTitle = styled.h2`
  color: #0F3F63;
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #0F3F63;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid ${props => props.hasError ? '#e74c3c' : '#ddd'};
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: ${props => props.hasError ? '#e74c3c' : '#0F3F63'};
    outline: none;
  }
`;

const CaptchaContainer = styled.div`
  margin: 15px 0;
  display: flex;
  justify-content: center;
`;

const ErrorText = styled.span`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
  display: block;
`;

const SubmitButton = styled.button`
  background-color: #0F3F63;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
  font-weight: 500;
  
  &:hover {
    background-color: #0C3557;
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const FooterText = styled.p`
  text-align: center;
  color: #666;
  margin-top: 20px;
  font-size: 14px;
`;

const ContactLink = styled.a`
  color: #0F3F63;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default LoginPage;