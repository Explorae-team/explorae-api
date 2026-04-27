import React, { type ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'
import Login from '../pages/Login'
import Register from '../pages/Register';
import InterestsPage from '../pages/InterestsPage';
import Dashboard from '../pages/Dashboard';


// 1. Criamos uma interface para definir as propriedades do componente
interface ProtectedRouteProps {
  children: ReactNode;
}

// 2. Aplicamos a tipagem no parâmetro das props
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Enquanto o useEffect do Contexto estiver lendo o localStorage, 
  // nós não podemos decidir se o usuário está logado ou não.
  if (isLoading) {
    return (
      <div className="bg-[#00161e] min-h-screen flex items-center justify-center">
        <div className="text-[#fd6c28] font-bold animate-pulse">CARREGANDO EXPEDIÇÃO...</div>
      </div>
    );
  }

  // 2. Agora que o carregamento acabou, se não tiver usuário, aí sim manda pro login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se passou pelos dois acima, o usuário está logado.
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      
       <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route
  path="/interests" // Remova qualquer '/' extra aqui
  element={
    <ProtectedRoute>
      <InterestsPage />
    </ProtectedRoute>
  }
/>
      
    </Routes>
  );
};

export default AppRoutes;