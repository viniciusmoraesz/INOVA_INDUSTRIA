import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Logout from './pages/Logout';

console.log('Variáveis de ambiente carregadas:', {
  hasHuggingFaceKey: !!import.meta.env.VITE_HUGGINGFACE_API_KEY,
  mode: import.meta.env.MODE
});
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import Contato from './Components/Contato.jsx';
import GlobalStyled from './GlobalStyled.js';
import CadastroProjeto from './Components/CadastroProjeto.jsx';
import AdicionarProjeto from './Components/AdicionarProjeto.jsx';
import AdicionarAtividade from './Components/AdicionarAtividade.jsx';
import AdicionarSubAtividade from './Components/AdicionarSubAtividade.jsx';
import PaginaCadaProjeto from './Components/PaginaCadaProjeto.jsx';
import MainPage from './Components/MainPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Header from './Components/Header.jsx';
import Usuariosrh from './Components/Usuariosrh.jsx';
import EditUserPage from './Components/EditUserPage.jsx';
import CadastrarCliente from './Components/CadastrarCliente.jsx';
import EditarCliente from './Components/EditarCliente.jsx';
import RemoverCliente from './Components/RemoverCliente.jsx';
import CadastrarEmpresa from './Components/CadastrarEmpresa.jsx';
import EditarEmpresa from './Components/EditarEmpresa.jsx';
import EditarProjeto from './Components/EditarProjeto.jsx';
import ListaEmpresas from './Components/ListaEmpresas.jsx';
import ListaClientes from './Components/ListaClientes';
import { Navigate } from 'react-router-dom';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="contato" element={<Contato />} />
      <Route path="/*" element={<PrivateRoute><App /></PrivateRoute>}>
        <Route index element={<MainPage />} />
        <Route path="dashboard" element={
          <RoleProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <Dashboard />
          </RoleProtectedRoute>
        } />
        
        <Route path="projetos" element={<CadastroProjeto />} />
        <Route path="projetos/novo" element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <AdicionarProjeto />
          </RoleProtectedRoute>
        } />
        <Route path="projetos/editar/:id" element={<EditarProjeto />} />
        <Route path="adicionar-projetos" element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <AdicionarProjeto />
          </RoleProtectedRoute>
        } />
        <Route path="projeto/:id/nova-atividade" element={<AdicionarAtividade />} />
        <Route path="adicionar-subAtividades" element={<AdicionarSubAtividade />} />
        <Route path="projeto/:id" element={<PaginaCadaProjeto />} />
        <Route path="main-page" element={<MainPage />} />
        <Route path="header" element={<Header />} />
        <Route path="usuariosrh" element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <Usuariosrh />
          </RoleProtectedRoute>
        } />
        <Route path="usuariosrh/editar/:userId" element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <EditUserPage />
          </RoleProtectedRoute>
        } />
        <Route path="clientes/novo" element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <CadastrarCliente />
          </RoleProtectedRoute>
        } />
        <Route path="clientes/editar/:id" element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <EditarCliente />
          </RoleProtectedRoute>
        } />
        <Route path="clientes/remover/:id" element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <RemoverCliente />
          </RoleProtectedRoute>
        } />
        <Route path="clientes" element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <ListaClientes />
          </RoleProtectedRoute>
        } />
        <Route path="empresas" element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <ListaEmpresas />
          </RoleProtectedRoute>
        } />
        <Route path="empresas/nova" element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <CadastrarEmpresa />
          </RoleProtectedRoute>
        } />
        <Route path="empresas/editar/:id" element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <EditarEmpresa />
          </RoleProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStyled />
    <AuthProvider>
      <Router>
        <AppRouter />
      </Router>
    </AuthProvider>
  </StrictMode>,
);
