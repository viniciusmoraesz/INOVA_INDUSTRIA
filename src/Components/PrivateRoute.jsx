import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('PrivateRoute: isAuthenticated =', isAuthenticated, 'isLoading =', isLoading);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    console.log('PrivateRoute: Redirecionando para login - usuário não autenticado');
    return <Navigate to="/login" />;
  }

  console.log('PrivateRoute: Usuário autenticado, renderizando children');
  return children;
}

export default PrivateRoute;
