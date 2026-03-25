import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard (Rota Protegida Placeholder)</h1>
      <p>Bem-vindo! Você só pode ver esta página porque está logado.</p>
      
      <button 
        onClick={handleLogout} 
        style={{ marginTop: '1rem', padding: '0.5rem', cursor: 'pointer' }}
      >
        Sair
      </button>
    </div>
  );
};

export default Dashboard;
