import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8">
      <div className="bg-surface-container-lowest p-10 rounded-xl shadow-lg max-w-lg w-full text-center space-y-6 border border-outline-variant/20">
        
        {/* Ícone de Sucesso/Expedição */}
        <div className="w-20 h-20 bg-primary-container/20 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-primary text-4xl">
            explore
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold text-primary">
            Área do Explorador
          </h1>
          <p className="text-on-surface-variant font-body">
            Bem-vindo, <span className="font-bold text-secondary">{user?.name || 'Explorador'}</span>! 
            Você acessou uma rota protegida com sucesso.
          </p>
        </div>

        <div className="pt-4">
          <button 
            onClick={handleLogout} 
            className="group flex items-center justify-center gap-2 w-full py-3 px-6 bg-error-container text-on-error-container font-bold rounded-lg hover:bg-error hover:text-on-error transition-all active:scale-95 shadow-md"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Encerrar Expedição
          </button>
        </div>
      </div>
      
      {/* Footerzinho decorativo */}
      <p className="mt-8 text-xs text-outline font-medium uppercase tracking-[0.2em]">
        Exploraê • Sistema de Gestão de Rotas
      </p>
    </div>
  );
};

export default Dashboard;