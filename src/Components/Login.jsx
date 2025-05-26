import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import {
    Container,
    LeftSection,
    RightSection,
    Form,
    Title,
    Label,
    Input,
    Button,
    LinkText
} from "../Styles/StyledLogin"

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica de autenticação aqui
        console.log('Login attempt with:', { username, password });
        // Após autenticação bem-sucedida:
        // navigate('/dashboard');
    };

    return (
        <Container>
            <LeftSection aria-label="Sobre a Inova Indústria">
                <p>A Inova Indústria tem como objetivo oferecer soluções eficazes e sustentáveis em consultoria para manufatura, logística, controladoria, P&D e gestão comercial, sendo um parceiro estratégico para empresas de todos os portes.</p>
            </LeftSection>
            <RightSection>
                <Form onSubmit={handleSubmit}>
                    <Title>Faça Login</Title>
                    <div>
                        <Label htmlFor="username">Nome de Usuário</Label>
                        <Input 
                            type="text" 
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Digite seu usuário"
                            aria-required="true"
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Senha</Label>
                        <Input 
                            type="password" 
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite sua senha"
                            aria-required="true"
                            autoComplete="current-password"
                        />
                    </div>
                    <Button type="submit">Entrar</Button>
                    <LinkText>
                        Ainda não é um cliente?{' '}
                        <Link to="/contato" aria-label="Entre em contato conosco">
                            Contate-nos
                        </Link>
                    </LinkText>
                </Form>
            </RightSection>
        </Container>
    )
}