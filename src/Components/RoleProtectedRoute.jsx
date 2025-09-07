import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isSuperAdmin } = useAuth();

  // SUPER_ADMIN sempre tem acesso
  if (isSuperAdmin) {
    return children;
  }

  // Verificar se o usuário tem uma das roles permitidas
  const hasPermission = allowedRoles.includes(user?.role);

  if (!hasPermission) {
    // Redirecionar para a página de projetos (página principal para CLIENTEs)
    return <Navigate to="/projetos" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
