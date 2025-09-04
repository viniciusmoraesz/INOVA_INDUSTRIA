import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

console.log('Variáveis de ambiente carregadas:', {
  hasHuggingFaceKey: !!import.meta.env.VITE_HUGGINGFACE_API_KEY,
  mode: import.meta.env.MODE
});
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Login from './Components/Login.jsx';
import Contato from './Components/Contato.jsx';
import GlobalStyled from './GlobalStyled.js';
import CadastroProjeto from './Components/CadastroProjeto.jsx';
import AdicionarProjeto from './Components/AdicionarProjeto.jsx';
import AdicionarAtividade from './Components/AdicionarAtividade.jsx';
import AdicionarSubAtividade from './Components/AdicionarSubAtividade.jsx';
import PaginaCadaProjeto from './Components/PaginaCadaProjeto.jsx';
import MainPage from './Components/MainPage.jsx';
import Header from './Components/Header.jsx';
import Usuariosrh from './Components/Usuariosrh.jsx';
import EditUserPage from './Components/EditUserPage.jsx';
import CadastrarCliente from './Components/CadastrarCliente.jsx';
import EditarCliente from './Components/EditarCliente.jsx';
import RemoverCliente from './Components/RemoverCliente.jsx';
import CadastrarEmpresa from './Components/CadastrarEmpresa.jsx';
import EditarEmpresa from './Components/EditarEmpresa.jsx';
import ListaEmpresas from './Components/ListaEmpresas.jsx';
import ListaClientes from './Components/ListaClientes';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Login />} />
        <Route path="contato" element={<Contato />} />
        <Route path="cadastro-projetos" element={<CadastroProjeto />} />
        <Route path="adicionar-projetos" element={<AdicionarProjeto />} />
        <Route path="projeto/:id/nova-atividade" element={<AdicionarAtividade />} />
        <Route path="adicionar-subAtividades" element={<AdicionarSubAtividade />} />
        <Route path="projeto/:id" element={<PaginaCadaProjeto />} />
        <Route path="main-page" element={<MainPage />} />
        <Route path="header" element={<Header />} />
        <Route path="usuariosrh" element={<Usuariosrh />} />
        <Route path="usuariosrh/editar/:userId" element={<EditUserPage />} />
        <Route path="clientes/novo" element={<CadastrarCliente />} />
        <Route path="clientes/editar/:id" element={<EditarCliente />} />
        <Route path="clientes/remover/:id" element={<RemoverCliente />} />
        <Route path="clientes" element={<ListaClientes />} />
        <Route path="empresas" element={<ListaEmpresas />} />
        <Route path="empresas/nova" element={<CadastrarEmpresa />} />
        <Route path="empresas/editar/:id" element={<EditarEmpresa />} />
      </Route>
    </Routes>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStyled />
    <Router>
      <AppRouter />
    </Router>
  </StrictMode>
);
