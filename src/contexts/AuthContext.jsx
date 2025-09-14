import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    console.log('AuthContext: useEffect iniciado, savedUser:', savedUser);
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('AuthContext: Loaded user from localStorage:', userData);
        
        // Check if token exists and is not expired
        if (userData.token) {
          // Simple token expiration check (JWT tokens have exp claim)
          try {
            const tokenPayload = JSON.parse(atob(userData.token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            if (tokenPayload.exp && tokenPayload.exp < currentTime) {
              console.log('AuthContext: Token expired, removing user');
              localStorage.removeItem('user');
              setUser(null);
            } else {
              console.log('AuthContext: Token is valid, setting user');
              setUser(userData);
            }
          } catch (tokenError) {
            console.log('AuthContext: Error parsing token, removing user:', tokenError);
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          console.log('AuthContext: No token found, removing user');
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (error) {
        console.log('AuthContext: Error parsing saved user, removing:', error);
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      console.log('AuthContext: No saved user found');
      setUser(null);
    }
    
    console.log('AuthContext: Setting isLoading to false');
    setIsLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      console.log('Frontend: Making login request...');
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      console.log('Frontend: Response status:', response.status);
      console.log('Frontend: Response ok:', response.ok);
      console.log('Frontend: Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Frontend: Error response body:', errorText);
        throw new Error('Credenciais inválidas');
      }

      const userData = await response.json();
      console.log('Frontend: Received user data:', userData);
      
      // Ensure the token is stored in the expected format
      const userToStore = {
        ...userData,
        token: userData.token || userData.accessToken // Handle different token field names
      };
      
      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));
      
      return userData;
    } catch (error) {
      console.log('Frontend: Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Helper function to get authorization headers
  const getAuthHeaders = () => {
    if (user?.token) {
      return {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      };
    }
    return {
      'Content-Type': 'application/json'
    };
  };

  console.log('AuthContext: Current user state:', user);
  console.log('AuthContext: isAuthenticated:', !!user);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    empresaId: user?.idEmpresa,
    getAuthHeaders,
    isSuperAdmin: user?.role === 'SUPER_ADMIN'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
