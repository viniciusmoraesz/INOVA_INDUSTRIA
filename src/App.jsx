import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from 'react';

function App() {
  const location = useLocation();

  // Rolar para o topo da página quando a rota mudar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Outlet />
    </div>
  );
}

export default App;
