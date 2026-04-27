import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Registro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas de expedição não coincidem!");
      return;
    }
    if (!formData.termsAccepted) {
      alert("Você precisa aceitar os termos de expedição.");
      return;
    }

    setLoading(true);
    try {
      // 1. Registro
      await axios.post('http://localhost:8080/api/v1/auth/register', {
        name: formData.fullName, // O Java espera 'name', não 'fullName'
        email: formData.email,
        password: formData.password
      })

      console.log("Deu certo")

      // 2. Login Automático
      const loginRes = await axios.post('http://localhost:8080/api/v1/auth/login', {
        email: formData.email,
        password: formData.password
      });

      console.log("Login efetuado")

      if (loginRes.data.data.token) {
        localStorage.setItem('@ExploraE:token', loginRes.data.data.token);
        localStorage.setItem('@ExploraE:user', JSON.stringify(loginRes.data.data.user));
        navigate('/interests'); // Ou sua rota principal
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro na central de comando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#003646] font-body text-[#bde9fe] min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Atmospheric Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#fd6c28] opacity-10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ffba26] opacity-10 blur-[100px] rounded-full"></div>

      {/* Header */}
      <header className="mb-10 text-center z-10">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-[#fd6c28] rounded-xl flex items-center justify-center shadow-lg transform rotate-3 mb-4">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
          </div>
          <h1 className="font-headline font-black text-3xl tracking-widest uppercase text-[#fd6c28]">Exploraê</h1>
          <p className="text-[#91bbcf] font-medium tracking-wide">Digital Wayfinder</p>
        </div>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-md z-10">
        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col gap-6">
          <div className="text-center mb-2">
            <h2 className="text-[#00161e] font-headline font-extrabold text-2xl tracking-tight leading-none mb-2">
              Crie sua conta para começar a aventura!
            </h2>
            <p className="text-[#8b9296] text-sm font-medium mt-2">Preencha os dados abaixo para o seu diário de expedição.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Nome Completo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#00161e] font-bold text-xs uppercase tracking-widest ml-1">Nome Completo</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9296] group-focus-within:text-[#fd6c28] transition-colors">person</span>
                <input 
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-12 pr-4 text-[#00161e] placeholder:text-[#8b9296]/60 focus:ring-2 focus:ring-[#fd6c28] transition-all outline-none" 
                  placeholder="Seu nome de explorador" 
                  type="text"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#00161e] font-bold text-xs uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9296] group-focus-within:text-[#fd6c28] transition-colors">mail</span>
                <input 
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-12 pr-4 text-[#00161e] placeholder:text-[#8b9296]/60 focus:ring-2 focus:ring-[#fd6c28] transition-all outline-none" 
                  placeholder="email@exemplo.com" 
                  type="email"
                />
              </div>
            </div>

            {/* Grid for Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[#00161e] font-bold text-xs uppercase tracking-widest ml-1">Senha</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9296] group-focus-within:text-[#fd6c28] transition-colors">lock</span>
                  <input 
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-12 pr-4 text-[#00161e] placeholder:text-[#8b9296]/60 focus:ring-2 focus:ring-[#fd6c28] transition-all outline-none" 
                    placeholder="••••••••" 
                    type="password"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[#00161e] font-bold text-xs uppercase tracking-widest ml-1">Confirmar</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9296] group-focus-within:text-[#fd6c28] transition-colors">verified_user</span>
                  <input 
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-12 pr-4 text-[#00161e] placeholder:text-[#8b9296]/60 focus:ring-2 focus:ring-[#fd6c28] transition-all outline-none" 
                    placeholder="••••••••" 
                    type="password"
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-center gap-3 cursor-pointer group mt-2">
              <div className="relative flex items-center">
                <input 
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="peer appearance-none w-6 h-6 border-2 border-[#bde9fe] rounded-lg checked:bg-[#fd6c28] checked:border-[#fd6c28] transition-all cursor-pointer" 
                  type="checkbox"
                />
                <span className="material-symbols-outlined absolute text-white text-lg opacity-0 peer-checked:opacity-100 left-0.5 transition-opacity pointer-events-none">check</span>
              </div>
              <span className="text-[#8b9296] text-sm font-medium leading-tight group-hover:text-[#00161e] transition-colors">
                Aceito os <span className="text-[#fd6c28] font-bold">Termos e Condições</span> de expedição.
              </span>
            </label>

            {/* Primary Button */}
            <button 
              disabled={loading}
              className="w-full bg-[#F2641F] text-white font-headline font-black text-lg py-5 rounded-2xl shadow-xl shadow-[#F2641F]/30 hover:bg-[#D14D00] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50" 
              type="submit"
            >
              {loading ? 'CRIANDO...' : 'CRIAR CONTA'}
              <span className="material-symbols-outlined">trending_flat</span>
            </button>
          </form>

          <div className="flex flex-col items-center gap-4 mt-2">
            <p className="text-[#8b9296] font-medium text-sm">
              Já tem uma conta? <button onClick={() => navigate('/login')} className="text-[#fd6c28] font-black hover:underline ml-1">Entrar</button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Element */}
      <footer className="mt-12 text-center z-10 max-w-xs opacity-60">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-1 bg-[#ffba26] rounded-full"></div>
          <span className="material-symbols-outlined text-[#ffba26]">military_tech</span>
          <div className="w-12 h-1 bg-[#053a4a] rounded-full"></div>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bde9fe]">Junte-se a +50.000 exploradores em todo o mundo</p>
      </footer>
    </div>
  );
}