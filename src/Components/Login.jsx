import { Link } from "react-router-dom";
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

export default function Login(){




    return (
        <Container>
            <LeftSection>
                <p>A Inova Indústria tem como objetivo oferecer soluções eficazes e sustentáveis em consultoria para manufatura, logística, controladoria, P&D e gestão comercial, sendo um parceiro estratégico para empresas de todos os portes.</p>
            </LeftSection>
            <RightSection>
                <Form>
                    <Title>Faça Login</Title>
                    <Label>Nome de Usuário</Label>
                    <Input type="text"></Input>
                     <Label>Senha</Label>
                    <Input type="password"></Input>
                    <Button>Enviar</Button>
                    <LinkText> Ainda não é um cliente? <Link to="/contato">Contate-nos</Link>
</LinkText>
                </Form>
            </RightSection>
        </Container>
    )
}