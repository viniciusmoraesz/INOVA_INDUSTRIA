import { Link } from "react-router-dom"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup'
import {
  FormContainer,
  Title,
  Form,
  FormGroup,
  LocationGroup,
  Label,
  Input,
  Select,
  TextArea,
  PhoneInputContainer,
  CountryCode,
  PhoneInput,
  SubmitButton,
  ErrorMessage as ErrorMessageStyled,
  SuccessMessage,
  LinkText
} from "../Styles/StyledContato"



const schema = yup.object({
  nome: yup.string().required('O campo de nome é obrigatório!'),
  email: yup.string().email("Este formato de e-mail não é válido!").required('O campo de email é obrigatório!'),
  empresa: yup.string().required('O campo de Empresa é obrigatório e deve ser preenchido!'),
  ramo: yup.string().required('O campo de Ramo da Empresa é obrigatório e deve ser preenchido!'),
  telefone: yup.string()
  .matches(/^\+55\d{10,11}$/, "Formato inválido! Use: +55 seguido de DDD e número.")
  .required("O campo de telefone é obrigatório!"),
  funcionario: yup.number().typeError("Insira um número válido").integer().min(1, "O número de funcionários deve ser no mínimo 1!").required('O campo de Número de Funcionários é obrigátorio!'),
  estado: yup.string().required('O campo de estado é obrigatório e deve ser preenchido!'),
  cidade: yup.string().required('O campo de cidade é obrigatório e deve ser preenchido!'),
  cep: yup.string().required('O campo de CEP é obrigatório e deve ser preenchido!'),
  buscando: yup.string().notRequired()
})

export default function Contato() {
  const [listaCliente, setListaCliente] = useState([])
  const [submitStatus, setSubmitStatus] = useState(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  // function cadCliente(e){
  //   setCliente({...cliente, [e.target.name]: e.target.value})
  // }

  function adicionarCliente(cliente) {
    setListaCliente([...listaCliente, cliente])
    setSubmitStatus('success')
    reset()
    
    // Limpa a mensagem de sucesso após 5 segundos
    setTimeout(() => {
      setSubmitStatus(null)
    }, 5000)
  }

  async function buscarCep(e) {
    const cep = e.target.value.replace(/\D/g, '')
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json`)
        const data = await response.json()
        if (!data.erro) {
          setValue('cidade', data.localidade)
          setValue('estado', data.uf)
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    }
  }



  return (
    <FormContainer>
      <Title>Entre em contato com nossa equipe</Title>
      
      <Form onSubmit={handleSubmit(adicionarCliente)}>
        <FormGroup>
          <Label htmlFor="nome">Nome*</Label>
          <Input 
            type="text" 
            id="nome" 
            {...register('nome')} 
            $hasError={!!errors.nome}
          />
          {errors.nome && <ErrorMessageStyled>{errors.nome.message}</ErrorMessageStyled>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email*</Label>
          <Input 
            type="email" 
            id="email" 
            {...register('email')} 
            $hasError={!!errors.email}
          />
          {errors.email && <ErrorMessageStyled>{errors.email.message}</ErrorMessageStyled>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="empresa">Empresa*</Label>
          <Input 
            type="text" 
            id="empresa" 
            {...register('empresa')} 
            $hasError={!!errors.empresa}
          />
          {errors.empresa && <ErrorMessageStyled>{errors.empresa.message}</ErrorMessageStyled>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="ramo">Selecione o ramo da empresa*</Label>
          <Select 
            id="ramo" 
            {...register('ramo')} 
            $hasError={!!errors.ramo}
          >
            <option value="">Selecione...</option>
            <option value="Comércio">Comércio</option>
            <option value="Serviços">Serviços</option>
            <option value="Indústria">Indústria</option>  
            <option value="TI">Tecnologia da Informação</option>
            <option value="Contabilidade">Contabilidade</option>
            <option value="Marketing">Marketing</option>
            <option value="Jurídico">Jurídico</option>
            <option value="Consultoria">Consultoria</option>
          </Select>
          {errors.ramo && <ErrorMessageStyled>{errors.ramo.message}</ErrorMessageStyled>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="telefone">Telefone*</Label>
          <PhoneInputContainer>
            <CountryCode>+55</CountryCode>
            <PhoneInput 
              type="tel" 
              id="telefone" 
              placeholder="+55 (00) 00000-0000"
              {...register('telefone')} 
              $hasError={!!errors.telefone}
            />
          </PhoneInputContainer>
          {errors.telefone && <ErrorMessageStyled>{errors.telefone.message}</ErrorMessageStyled>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="funcionario">Número de funcionários*</Label>
          <Input 
            type="number" 
            id="funcionario" 
            {...register('funcionario')} 
            $hasError={!!errors.funcionario}
            min="1"
          />
          {errors.funcionario && <ErrorMessageStyled>{errors.funcionario.message}</ErrorMessageStyled>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="cep">CEP*</Label>
          <Input 
            type="text" 
            id="cep" 
            {...register('cep')} 
            onBlur={buscarCep}
            placeholder="00000-000"
            $hasError={!!errors.cep}
          />
          {errors.cep && <ErrorMessageStyled>{errors.cep.message}</ErrorMessageStyled>}
        </FormGroup>

        <LocationGroup>
          <FormGroup $flex="1">
            <Label htmlFor="estado">Estado*</Label>
            <Input 
              type="text" 
              id="estado" 
              {...register('estado')} 
              $hasError={!!errors.estado}
              readOnly
            />
            {errors.estado && <ErrorMessageStyled>{errors.estado.message}</ErrorMessageStyled>}
          </FormGroup>
          
          <FormGroup $flex="2">
            <Label htmlFor="cidade">Cidade*</Label>
            <Input 
              type="text" 
              id="cidade" 
              {...register('cidade')} 
              $hasError={!!errors.cidade}
              readOnly
            />
            {errors.cidade && <ErrorMessageStyled>{errors.cidade.message}</ErrorMessageStyled>}
          </FormGroup>
        </LocationGroup>

        <FormGroup>
          <Label htmlFor="buscando">Conte-nos o que está buscando</Label>
          <TextArea 
            id="buscando" 
            rows="4"
            {...register('buscando')}
          />
        </FormGroup>

        <SubmitButton type="submit">Enviar</SubmitButton>
        
        {submitStatus === 'success' && (
          <SuccessMessage>
            Mensagem enviada com sucesso! Entraremos em contato em breve.
          </SuccessMessage>
        )}
        
        <LinkText>
          Já possui uma conta? <Link to="/">Faça login</Link>
        </LinkText>
      </Form>

      {/* Seção de depuração - pode ser removida em produção */}
      {process.env.NODE_ENV === 'development' && listaCliente.length > 0 && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
          <h3>Dados enviados (debug):</h3>
          <pre>{JSON.stringify(listaCliente, null, 2)}</pre>
        </div>
      )}
    </FormContainer>
  )
}
