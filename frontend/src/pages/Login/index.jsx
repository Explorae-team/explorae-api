import React from 'react';

export default function Login() {
  return (
    <div className="bg-surface font-body text-on-surface min-h-[max(884px,100dvh)]">
      {/* TopAppBar - Simplified for Login */}
      <header className="fixed top-0 w-full z-50 bg-[#003646] dark:bg-slate-950 flex justify-between items-center px-6 h-16 shadow-lg shadow-[#191C1D]/10">
        <div className="flex items-center gap-3">
          <img 
            alt="Exploraê Logo" 
            className="h-8 w-8 object-contain" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNxIOnr6FPglLjewVoPHw0jg_1Rl4V8TNtmqiro6knGcm0sTAY6fiId-MSgUtQJP0IoDdhL0zctJZF8Y48QPwi9ySlsehmAQKZ2gn2qv9UXWTkDWfqBztlSeTEe7bDe2xoUY81aRPXIPWEFoDYR-zvNj8XyOq_dxPiRaoCYxoRIvZ3KwIbz9jH2IyaCfEFQkwgbVvBLMCk3Bs5Sdnj8H6nOX3n7A3Qealx2hHdEpD2OrhK4SbUdA6P6GaDuQOHhP_e6nNH63EvYtI"
          />
          <span className="text-2xl font-black text-white italic tracking-tighter font-headline">
            Exploraê
          </span>
        </div>
      </header>

      <main className="min-h-screen pt-16 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Background Decoration - The Expedition Aesthetic */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="w-full max-w-md space-y-8 py-12">
          {/* Hero Content */}
          <div className="text-center space-y-3">
            <h1 className="text-on-surface font-headline font-bold text-[2rem] tracking-tight leading-tight">
              Bem-vindo à sua próxima expedição
            </h1>
            <p className="text-on-surface-variant font-body text-lg">
              Entre para descobrir rotas exclusivas e conquistar novos territórios.
            </p>
          </div>

          {/* Login Form Container */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_32px_rgba(25,28,29,0.06)] space-y-6">
            
            {/* Email/Password Fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-primary uppercase tracking-wider ml-1" htmlFor="email">
                  E-mail
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                    mail
                  </span>
                  <input 
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary-container text-on-surface placeholder:text-on-surface-variant/50 transition-all font-medium" 
                    id="email" 
                    placeholder="seu@email.com" 
                    type="email"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-semibold text-primary uppercase tracking-wider" htmlFor="password">
                    Senha
                  </label>
                  <button className="text-xs font-bold text-primary hover:text-primary-container transition-colors">
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                    lock
                  </span>
                  <input 
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary-container text-on-surface placeholder:text-on-surface-variant/50 transition-all font-medium" 
                    id="password" 
                    placeholder="••••••••" 
                    type="password"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <button className="w-full bg-secondary hover:bg-secondary-container text-white py-4 rounded-lg font-headline font-bold text-lg shadow-lg shadow-secondary/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2">
              Entrar na Jornada
              <span className="material-symbols-outlined">explore</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Ou continue com
              </span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex justify-center gap-6">
              {/* Google */}
              <button className="w-14 h-14 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center transition-all hover:-translate-y-1 shadow-sm active:scale-90">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M12 5.04c1.9 0 3.61.65 4.95 1.91l3.71-3.71C18.41 1.25 15.42 0 12 0 7.31 0 3.32 2.69 1.39 6.6l4.31 3.35C6.73 7.31 9.17 5.04 12 5.04z" fill="#EA4335"></path>
                  <path d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.02 3.46-4.96 3.46-8.73z" fill="#4285F4"></path>
                  <path d="M5.7 14.75c-.24-.72-.37-1.49-.37-2.31s.13-1.59.37-2.31L1.39 6.6C.5 8.22 0 10.05 0 12s.5 3.78 1.39 5.4l4.31-3.65z" fill="#FBBC05"></path>
                  <path d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.51 1.18-4.2 1.18-3.18 0-5.88-2.15-6.84-5.04l-4.31 3.65C3.32 21.31 7.31 24 12 24z" fill="#34A853"></path>
                </svg>
              </button>
              {/* Apple */}
              <button className="w-14 h-14 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center transition-all hover:-translate-y-1 shadow-sm active:scale-90">
                <svg className="w-6 h-6 fill-on-surface" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.96.95-2.05 1.72-3.32 1.72-1.2 0-1.63-.73-3.12-.73-1.47 0-1.95.71-3.1.73-1.24.02-2.39-.81-3.35-1.77-1.97-1.97-3.48-5.59-1.48-9.06 1-1.72 2.76-2.81 4.7-2.84 1.47-.02 2.86 1 3.75 1 .89 0 2.6-1.25 4.36-1.07 1.83.19 3.23.85 4.14 2.19-3.43 2.04-2.88 6.09.52 7.49-.62 1.57-1.42 2.62-3.1 4.37zM12.03 5.44c-.04-2.03 1.67-3.68 3.59-3.72.06 1.99-1.54 3.77-3.59 3.72z"></path>
                </svg>
              </button>
              {/* Facebook */}
              <button className="w-14 h-14 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center transition-all hover:-translate-y-1 shadow-sm active:scale-90">
                <svg className="w-7 h-7" viewBox="0 0 24 24">
                  <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.03 4.42 11.02 10.12 11.91v-8.43H7.08v-3.48h3.04V9.41c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.68.23 2.68.23v2.95h-1.5c-1.49 0-1.96.93-1.96 1.88v2.26h3.33l-.53 3.48h-2.8v8.43C19.58 23.09 24 18.1 24 12.07z" fill="#1877F2"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Footer Action */}
          <p className="text-center font-body text-on-surface-variant">
            Não tem uma conta? 
            <button className="ml-1 font-bold text-primary border-b-2 border-primary-container/20 hover:border-primary-container transition-all">
              Começar Exploração
            </button>
          </p>
        </div>
      </main>

      {/* Visual Polish: Floating Card for Social Proof */}
      <div className="hidden lg:flex fixed bottom-12 right-12 bg-white/10 backdrop-blur-md p-4 rounded-xl items-center gap-4 border border-white/20 shadow-xl max-w-sm">
        <div className="flex -space-x-3">
          <img alt="User 1" className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnQQFtVAr-Vplk60jTyOF2MbfHnG3UHYacH1iY2dt-A2eTxGF5bDD9OQUzALHGekRXjXdpWUSibCY2LQ2HXWwWwckEc9RVWyQoBs0rP3s1mIcn-j9ZUs9iwlGHw0DHxVNVbE6s0z0aSMKESTg2YBkPVNeJeeOMaGWd1H--Sf7V5NpDICO9JVTSe7bW8OvN3n01tUeemzFPnxnvUsfc0ceAyrG1TQ0d0viE-QOy-yU6ArCp0rjmyp3B1B9WEeXNnDye5lRCT8OI1bo"/>
          <img alt="User 2" className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWLcs00bIWvvhK3ylp86kDTvG6AbD2k8J8rKmaMiSpDuYsumhN2k_wOcvZWacmKMF_j87SIMbV-R7StIwBikohl50cwt0J2tyCfLzKnD9ZWloHDOhumn6AI73l7FtU5YvM1D7RUULfhnOnJv_4rD51Y4ZpyY7YRk5HVtKk8bWj5eKEdJA_47xj0y0_bMr0ynNaWk3I_UvwVlyJdHaHQ7EFkMRV-dloypgAgqOSmJvjC9UjSIhitA0N7RLO3dAImZCjSlL0CkDchtY"/>
          <div className="w-10 h-10 rounded-full border-2 border-primary bg-primary-container flex items-center justify-center text-[10px] font-bold text-white">
            +12k
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-primary">Junte-se a 12.430 exploradores</p>
          <p className="text-[10px] text-on-surface-variant font-medium">Novas rotas adicionadas hoje em São Paulo.</p>
        </div>
      </div>
    </div>
  );
}