import React, { type ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'
import Login from '../pages/Login'
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';

// 1. Criamos uma interface para definir as propriedades do componente
interface ProtectedRouteProps {
  children: ReactNode;
}

// 2. Aplicamos a tipagem no parâmetro das props
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Envolver em um Fragment (<></>) evita possíveis conflitos de tipo 
  // de retorno em configurações muito estritas do TypeScript
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
      
    </Routes>
  );
};

export default AppRoutes;