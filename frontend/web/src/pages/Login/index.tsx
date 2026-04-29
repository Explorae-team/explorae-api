import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../assets/screen.png'

export default function Login() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        console.log("Login autorizado!");
        navigate('/interests');
      } else {
        alert(result.message || "Credenciais inválidas.");
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
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
          {/* Logo Container */}
          <img 
              src={Logo} 
              alt="Exploraê Logo" 
              className="w-30 h-20 object-contain"
              onError={(e) => {
                // Fallback caso a imagem não carregue: mostra um ícone padrão
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="material-symbols-outlined text-white text-4xl">login</span>';
              }}
            />
          <h1 className="font-headline font-black text-3xl tracking-widest uppercase text-[#fd6c28]">Exploraê</h1>
          <p className="text-[#91bbcf] font-medium tracking-wide">Bem-vindo de volta!</p>
          </div>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md z-10">
        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col gap-6">
          <div className="text-center mb-2">
            <h2 className="text-[#00161e] font-headline font-extrabold text-2xl tracking-tight leading-none mb-2">
              Acesse sua conta
            </h2>
            <p className="text-[#8b9296] text-sm font-medium mt-2">Retome sua expedição de onde parou.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#00161e] font-bold text-xs uppercase tracking-widest ml-1">E-mail de Acesso</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9296] group-focus-within:text-[#fd6c28] transition-colors">mail</span>
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-12 pr-4 text-[#00161e] placeholder:text-[#8b9296]/60 focus:ring-2 focus:ring-[#fd6c28] transition-all outline-none" 
                  placeholder="email@exemplo.com" 
                />
              </div>
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[#00161e] font-bold text-xs uppercase tracking-widest">Senha</label>
                <button type="button" className="text-[10px] font-black text-[#fd6c28] uppercase hover:underline">Esqueceu?</button>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9296] group-focus-within:text-[#fd6c28] transition-colors">lock</span>
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-12 pr-12 text-[#00161e] placeholder:text-[#8b9296]/60 focus:ring-2 focus:ring-[#fd6c28] transition-all outline-none" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b9296] hover:text-[#fd6c28]"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox"
                  className="peer appearance-none w-5 h-5 border-2 border-[#bde9fe] rounded-lg checked:bg-[#fd6c28] checked:border-[#fd6c28] transition-all cursor-pointer" 
                />
                <span className="material-symbols-outlined absolute text-white text-sm opacity-0 peer-checked:opacity-100 left-0.5 transition-opacity pointer-events-none">check</span>
              </div>
              <span className="text-[#8b9296] text-xs font-medium group-hover:text-[#00161e] transition-colors">
                Manter-me conectado nesta estação
              </span>
            </label>

            {/* Primary Button */}
            <button 
              disabled={loading}
              className="w-full bg-[#F2641F] text-white font-headline font-black text-lg py-5 rounded-2xl shadow-xl shadow-[#F2641F]/30 hover:bg-[#D14D00] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50" 
              type="submit"
            >
              {loading ? 'AUTENTICANDO...' : 'ENTRAR NA JORNADA'}
              <span className="material-symbols-outlined">map</span>
            </button>
          </form>

          <div className="flex flex-col items-center gap-4 mt-2">
            <p className="text-[#8b9296] font-medium text-sm">
              Novo por aqui? <button onClick={() => navigate('/register')} className="text-[#fd6c28] font-black hover:underline ml-1">Criar Diário</button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Element */}
      <footer className="mt-12 text-center z-10 max-w-xs opacity-60">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-1 bg-[#ffba26] rounded-full"></div>
          <span className="material-symbols-outlined text-[#ffba26]">rocket_launch</span>
          <div className="w-12 h-1 bg-[#053a4a] rounded-full"></div>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bde9fe]">Explore novos horizontes com segurança</p>
      </footer>
    </div>
  );
}