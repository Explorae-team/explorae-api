import React, { type ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'
import Login from '../pages/Login'
import Register from '../pages/Register';
import InterestsPage from '../pages/InterestsPage';
import Dashboard from '../pages/Dashboard';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-[#00161e] min-h-screen flex items-center justify-center">
        <div className="text-[#fd6c28] font-bold animate-pulse">CARREGANDO EXPEDIÇÃO...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redireciona a raiz (/) para o login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

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
        path="/interests"
        element={
          <ProtectedRoute>
            <InterestsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all: Redireciona qualquer rota inexistente para o login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;