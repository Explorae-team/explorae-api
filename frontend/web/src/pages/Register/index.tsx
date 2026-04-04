import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cadastro() {
  const navigate = useNavigate();

  // Função para evitar que o formulário recarregue a página ao ser enviado
  const handleSubmit = (e : any) => {
    e.preventDefault();
    console.log("Formulário de cadastro enviado!");
    // Aqui você adicionaria a lógica para salvar o usuário no futuro
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen relative overflow-hidden font-body">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#003646] to-[#004E64] shadow-lg shadow-[#191C1D]/10 flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="text-white hover:opacity-80 transition-opacity scale-95 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline font-bold tracking-tight text-2xl text-white italic">
            Exploraê
          </h1>
        </div>
        <div className="flex items-center">
          <button className="text-white hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6 flex flex-col items-center justify-center min-h-screen relative z-10">
        
        {/* Hero Decorative Section */}
        <div className="w-full max-w-md mb-8 relative">
          <div className="absolute -top-12 -left-4 w-24 h-24 bg-secondary-container/10 rounded-full blur-3xl"></div>
          <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight leading-tight mb-2">
            Comece sua <br />
            <span className="text-secondary">Expedição.</span>
          </h2>
          <p className="text-on-surface-variant text-lg">
            Crie sua conta para descobrir rotas exclusivas e ganhar recompensas reais.
          </p>
        </div>

        {/* Registration Form Card */}
        <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-2xl shadow-[0_12px_32px_rgba(25,28,29,0.06)] border border-outline-variant/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-primary-container font-headline" htmlFor="name">
                Nome Completo
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">
                  person
                </span>
                <input 
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary-container text-on-surface placeholder:text-on-surface-variant/50 transition-all" 
                  id="name" 
                  name="name" 
                  placeholder="Como devemos te chamar?" 
                  type="text" 
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-primary-container font-headline" htmlFor="email">
                E-mail
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">
                  mail
                </span>
                <input 
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary-container text-on-surface placeholder:text-on-surface-variant/50 transition-all" 
                  id="email" 
                  name="email" 
                  placeholder="seu@email.com" 
                  type="email" 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-primary-container font-headline" htmlFor="password">
                Senha
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">
                  lock
                </span>
                <input 
                  className="w-full pl-12 pr-12 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary-container text-on-surface placeholder:text-on-surface-variant/50 transition-all" 
                  id="password" 
                  name="password" 
                  placeholder="Mínimo 8 caracteres" 
                  type="password" 
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors" type="button">
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 py-2">
              <input 
                className="mt-1 rounded border-outline-variant text-secondary focus:ring-secondary" 
                id="terms" 
                type="checkbox" 
              />
              <label className="text-xs text-on-surface-variant leading-relaxed" htmlFor="terms">
                Eu concordo com os <a className="text-primary-container font-bold underline" href="#termos">Termos de Uso</a> e a <a className="text-primary-container font-bold underline" href="#privacidade">Política de Privacidade</a> da Exploraê.
              </label>
            </div>

            {/* Primary CTA */}
            <button 
              type="submit"
              className="w-full bg-secondary hover:bg-secondary-container text-white font-bold py-4 rounded-xl shadow-lg shadow-secondary/20 transition-all active:scale-95 font-headline flex justify-center items-center gap-2" 
            >
              Criar minha conta
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </form>

          {/* Social Registration Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-surface-container-lowest px-4 text-outline">Ou registre-se com</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border border-outline-variant/30 rounded-xl hover:bg-surface-container-low transition-colors active:scale-95">
              <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCpYhqRNHSWOs2j4VKg1e-STpHfoH_k3g2N0L97Z5qfTorHlTG9Yvtiem5qN7cly8bw2AVI0NUq_B0voClNVRQ6fC8SLAjjV-iJY5Tjd44rSClPVf-IKZHeB-98glWxLJ96MMfxU9rElJdt2iR3IbV1o6lUnUX6-klv1bWg3GDP168AN_u12zS1MR8xHBovSznFos6AWN_rchoyebEE4nTAee2k16MkSNQ5OhL3Zja5nAVmGGYT4YAQ7CFu31dZN1HeNwTIdg89Lk"/>
              <span className="text-sm font-semibold">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-outline-variant/30 rounded-xl hover:bg-surface-container-low transition-colors active:scale-95">
              <span className="material-symbols-outlined text-blue-600">social_leaderboard</span>
              <span className="text-sm font-semibold">Facebook</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="mt-8 text-on-surface-variant text-center">
          Já possui uma conta? 
          <button 
            onClick={() => navigate('/')} 
            className="ml-1 text-secondary font-bold hover:underline"
          >
            Fazer Login
          </button>
        </p>

      </main>

      {/* Background Decor (Asymmetric) */}
      <div className="fixed bottom-0 right-0 z-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
        <span className="material-symbols-outlined text-[400px] text-primary">explore</span>
      </div>
    </div>
  );
}