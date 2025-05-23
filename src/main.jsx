import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Login from './Components/Login.jsx';
import Contato from './Components/Contato.jsx';
import GlobalStyled from './GlobalStyled.js';
import CadastroProjeto from './Components/Cadastroprojeto.jsx';
import AdicionarProjeto from './Components/AdicionarProjeto.jsx';
import AdicionarAtividade from './Components/AdicionarAtividade.jsx';
import AdicionarSubAtividade from './Components/AdicionarSubAtividade.jsx';
import PaginaCadaProjeto from './Components/PaginaCadaProjeto.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Login />
      },
      {
        path: '/contato',
        element: <Contato />
      },
      {
        path: '/cadastro-projetos',
        element: <CadastroProjeto />
      },
      {
        path : '/adicionar-projetos',
        element: <AdicionarProjeto/>
      },
       {
        path : '/adicionar-atividades',
        element: <AdicionarAtividade/>
      },
       {
        path : '/adicionar-subAtividades',
        element: <AdicionarSubAtividade/>
      },
      {
        path : '/projeto/:id',
        element : <PaginaCadaProjeto/>
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <GlobalStyled />
  </StrictMode>
);
