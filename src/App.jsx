import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import Header from "./Components/Header";
import Chatbot from "./Components/Chatbot";
import { ToastProvider } from "./Components/Toast";

function App() {
  const location = useLocation();

  // Rolar para o topo da página quando a rota mudar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <ToastProvider>
      <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {location.pathname !== '/' && location.pathname !== '/contato' && <Header />}
        <div style={{ marginTop: location.pathname !== '/' ? '80px' : '0' }}>
          <Outlet />
        </div>
        <Chatbot />
      </div>
    </ToastProvider>
  );
}

export default App;
