import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
        // Even if there's an error, still redirect to login
        navigate('/login');
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f7fa'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <h2>Saindo do sistema...</h2>
        <p>Você está sendo desconectado.</p>
      </div>
    </div>
  );
};

export default Logout;
