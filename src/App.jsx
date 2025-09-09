import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import Sidebar from "./Components/Sidebar";
import Chatbot from "./Components/Chatbot";
import { ToastProvider } from "./Components/Toast";
import styled, { createGlobalStyle } from 'styled-components';

// Global styles to handle body overflow when sidebar is open
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
`;

const MainContent = styled.div`
  margin-left: 60px; /* Same as sidebar width when closed */
  padding: 20px;
  transition: all 0.3s ease;
  min-height: 100vh;
  width: calc(100% - 60px);
  background-color: #f5f7fa;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    padding: 15px;
    padding-top: 70px; /* Add space for mobile header if needed */
  }
`;

function App() {
  const location = useLocation();

  // Rolar para o topo da página quando a rota mudar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  console.log('App.jsx: Renderizando, pathname:', location.pathname);

  return (
    <ToastProvider>
      <GlobalStyle />
      <div className="app" style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
        <Sidebar />
        <MainContent>
          <Outlet />
        </MainContent>
        <Chatbot />
      </div>
    </ToastProvider>
  );
}

export default App;
