import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Container,
    LeftSection,
    RightSection,
    Form,
    Title,
    Input,
    Button,
    ErrorMessage,
    LinkText
} from '../Styles/StyledLogin';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, senha);
      navigate('/projetos');
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao tentar fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LeftSection aria-label="Sobre a Inova Indústria">
        <p>A Inova Indústria tem como objetivo oferecer soluções eficazes e sustentáveis em consultoria para manufatura, logística, controladoria, P&D e gestão comercial, sendo um parceiro estratégico para empresas de todos os portes.</p>
      </LeftSection>
      <RightSection>
        <Form onSubmit={handleSubmit}>
          <Title>Bem-vindo</Title>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            aria-label="Email"
          />
          <Input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            required
            aria-label="Senha"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Carregando...' : 'Entrar'}
          </Button>
          <LinkText>
            Não tem uma conta? <a href="/contato">Entre em contato</a>
          </LinkText>
        </Form>
      </RightSection>
    </Container>
  );
}

export default Login;
