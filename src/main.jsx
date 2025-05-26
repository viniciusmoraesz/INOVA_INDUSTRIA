import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Login />} />
        <Route path="contato" element={<Contato />} />
        <Route path="cadastro-projetos" element={<CadastroProjeto />} />
        <Route path="adicionar-projetos" element={<AdicionarProjeto />} />
        <Route path="adicionar-atividades" element={<AdicionarAtividade />} />
        <Route path="adicionar-subAtividades" element={<AdicionarSubAtividade />} />
        <Route path="projeto/:id" element={<PaginaCadaProjeto />} />
        <Route path="main-page" element={<MainPage />} />
        <Route path="header" element={<Header />} />
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
