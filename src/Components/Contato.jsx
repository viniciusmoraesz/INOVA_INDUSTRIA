import { Link } from "react-router-dom"

import {
  ContainerPrincipal,
  ContainerForm,
  FormInput,
  FormLabel,
  FormButton,
  LinkTextContainer,
  FormField,
  ErrorMessage
} from "../Styles/StyledContato"
import { useState } from "react"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup'



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

//   const [cliente, setCliente] = useState({
//     'nome' : '', 'email' : '', 'empresa' : '', 'ramo' : '', 'telefone' : '', 
//     'funcionario' : '', 'estado' : '', 'cidade' : '', 'buscando' : ''}
// )

  const[listaCliente, setlistaCliente] = useState([])

  const{register, handleSubmit, reset, setValue, setFocus, formState:{errors}} = useForm({
    resolver: yupResolver(schema)
  })

  // function cadCliente(e){
  //   setCliente({...cliente, [e.target.name]: e.target.value})
  // }

  function adicionarCliente(cliente){
    // e.preventDefault()
    setlistaCliente([...listaCliente, cliente])
    reset();
  //   setCliente({
  //   nome: '', email: '', empresa: '', ramo: '', telefone: '', 
  //   funcionario: '', estado: '', cidade: '', buscando: ''
  // })
  }

  function buscarCep(e){
    const cep = e.target.value.replace(/\D/g, "")
    fetch(`https://viacep.com.br/ws/${cep}/json`)
    .then(res => res.json())
    .then(data => {
      setValue('cidade', data.localidade)
      setValue('estado', data.uf)
    })
  }



  return (
    <>
    <ContainerPrincipal>
      <h1>Entre em contato com nossa equipe</h1>
      <ContainerForm onSubmit={handleSubmit(adicionarCliente)}>
        <FormField>
          <FormLabel>Nome*</FormLabel>
          <FormInput type="text" {...register('nome')}  hasError={!!errors.nome}/>
          <ErrorMessage>{errors.nome?.message}</ErrorMessage>
        </FormField>
        <FormField>
          <FormLabel>Email*</FormLabel>
          <FormInput type="email" {...register('email')}  hasError={!!errors.email}/>
          <ErrorMessage>{errors.email?.message}</ErrorMessage>
        </FormField>
        <FormField>
          <FormLabel>Empresa*</FormLabel>
          <FormInput type="text" {...register('empresa')}  hasError={!!errors.empresa}/>
          <ErrorMessage>{errors.empresa?.message}</ErrorMessage>
        </FormField>
        <FormField>
          <FormLabel>Selecione o ramo da empresa *</FormLabel>
          <FormInput as="select" {...register('ramo')}  hasError={!!errors.ramo}>
            <option value="">Selecionar</option>
            <option value="Comércio">Comércio</option>
            <option value="Serviços">Serviços</option>
            <option value="Indústria">Indústria</option>  
            <option value="TI">Tecnologia da Informação</option>
            <option value="Contabilidade">Contabilidade</option>
            <option value="Marketing">Marketing</option>
            <option value="Jurídico">Jurídico</option>
            <option value="Consultoria">Consultoria</option>
          </FormInput>
           <ErrorMessage>{errors.ramo?.message}</ErrorMessage>
        </FormField>
        <FormField>
          <FormLabel>Telefone*</FormLabel>
          <FormInput type="tel" placeholder="+55" {...register('telefone')}  hasError={!!errors.telefone} />
           <ErrorMessage>{errors.telefone?.message}</ErrorMessage>
        </FormField>
        <FormField>
          <FormLabel>Número de funcionários*</FormLabel>
          <FormInput type="number"  {...register('funcionario')} hasError={!!errors.funcionario} />
           <ErrorMessage>{errors.funcionario?.message}</ErrorMessage>
        </FormField>
         <FormField>
          <FormLabel>CEP *</FormLabel>
          <FormInput type="text" {...register('cep')} hasError={!!errors.cep} onBlur={buscarCep}/>
           <ErrorMessage>{errors.cep?.message}</ErrorMessage>
        </FormField>
        <FormField>
          <FormLabel>Estado*</FormLabel>
          <FormInput type="text" {...register('estado')}  hasError={!!errors.estado}>
          </FormInput>
          <ErrorMessage>{errors.estado?.message}</ErrorMessage>
        </FormField>
        <FormField>
          <FormLabel>Cidade*</FormLabel>
          <FormInput type="text" {...register('cidade')}  hasError={!!errors.cidade}>
          </FormInput>
          <ErrorMessage>{errors.cidade?.message}</ErrorMessage>
        </FormField>
        <FormField>
          <FormLabel>Conte-nos o que está buscando</FormLabel>
          <FormInput as="textarea" rows="3" {...register('buscando')} />
        </FormField>
        <FormButton type="submit">Enviar</FormButton>
      </ContainerForm>
      <LinkTextContainer>
       Já possui uma conta? <Link to="/">Login</Link>
      </LinkTextContainer>
    </ContainerPrincipal>

    <div>
        {
            listaCliente.map((cli, index) => <div key={index}>
            <p>Nome: {cli.nome}</p>
            <p>Email: {cli.email}</p>
            <p>Empresa: {cli.empresa}</p>
            <p>Ramo da Empresa: {cli.ramo}</p>
            <p>Telefone: {cli.telefone}</p>
            <p>Número de Funcionários: {cli.funcionario}</p>
            <p>CEP: {cli.cep}</p>
            <p>Estado: {cli.estado}</p>
            <p>Cidade: {cli.cidade}</p>
            <p>Buscando: {cli.buscando}</p>
        </div>)
        }
    </div>

    </>
  )
}
