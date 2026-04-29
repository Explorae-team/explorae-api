import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InterestCard } from '../../utils/InterestCard';
import { saveInterests } from '../../services/api';

// Interface do dado que viria da sua API
interface InterestItem {
  id: string;
  name: string;
  icon: string;
}

export default function InterestsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [interests] = useState<InterestItem[]>([
    { id: '1', name: 'Sabores Locais', icon: 'restaurant' },
    { id: '2', name: 'Ecoturismo', icon: 'eco' },
    { id: '3', name: 'História', icon: 'history_edu' },
    { id: '4', name: 'Vida Noturna', icon: 'nightlife' },
    { id: '5', name: 'Aventura', icon: 'explore' },
    { id: '6', name: 'Arte & Cultura', icon: 'palette' },
    { id: '7', name: 'Fotografia', icon: 'photo_camera' },
    { id: '8', name: 'Relaxamento', icon: 'spa' },
    { id: '9', name: 'Arquitetura', icon: 'architecture' },
  ]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleFinish = async () => {
    if (selectedIds.length === 0) {
      alert("Por favor, selecione ao menos um interesse.");
      return;
    }
    

    setLoading(true);
    try {
      // Mapeia os IDs para os nomes que o backend espera salvar como String
      const interestsToSave = interests
        .filter(item => selectedIds.includes(item.id))
        .map(item => item.name);

      await saveInterests(interestsToSave);
      
      console.log("Preferências sincronizadas com sucesso!");
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Falha ao salvar interesses:", error);
      alert(error.response?.data?.message || "Erro ao salvar preferências.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#00161e] min-h-screen text-[#bde9fe] flex flex-col items-center">
      {/* Header Fixo */}
      <header className="flex items-center justify-between px-6 h-16 w-full fixed top-0 z-50 bg-[#00161e] border-b border-white/5">
        <div className="flex items-center gap-4">
          <span onClick={() => navigate(-1)} className="material-symbols-outlined text-[#fd6c28] cursor-pointer">arrow_back</span>
          <h1 className="font-bold text-xl text-[#fd6c28]">Exploraê</h1>
        </div>
        <div className="flex gap-2">
          <div className="h-1.5 w-12 rounded-full bg-[#fd6c28]"></div>
          <div className="h-1.5 w-12 rounded-full bg-[#fd6c28]"></div> {/* Progresso atualizado */}
          <div className="h-1.5 w-12 rounded-full bg-[#053a4a]"></div>
        </div>
      </header>

      <main className="w-full max-w-md px-6 pt-24 pb-32 flex flex-col">
        <section className="mb-10">
          <h2 className="text-3xl font-black leading-tight mb-4 tracking-tight text-white">O que faz seu coração vibrar?</h2>
          <p className="text-[#91bbcf] text-lg leading-relaxed">
            Selecione seus interesses para curarmos expedições sob medida.
          </p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          {interests.map((item) => (
            <InterestCard 
              key={item.id}
              id={item.id}
              name={item.name}
              icon={item.icon}
              isSelected={selectedIds.includes(item.id)}
              onToggle={toggleInterest}
            />
          ))}
          
          <div className="bg-[#0d3e4e]/20 border border-white/5 p-5 rounded-xl flex items-center justify-center aspect-square relative opacity-40">
            <span className="material-symbols-outlined text-[#91bbcf] text-4xl">add_circle</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-[#91bbcf]/70 font-medium hover:text-[#fd6c28] transition-colors"
          >
            Pular esta etapa
          </button>
        </div>
      </main>

      {/* Navegação Inferior */}
      <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-6 pb-8 pt-4 bg-[#0d3e4e]/80 backdrop-blur-xl rounded-t-[48px] shadow-2xl">
        <button 
          onClick={() => navigate(-1)}
          className="flex flex-col items-center justify-center text-[#bde9fe] px-4 py-2"
        >
          <span className="material-symbols-outlined">chevron_left</span>
          <span className="text-xs font-medium">Voltar</span>
        </button>

        <button 
          onClick={handleFinish}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-[#fd6c28] text-white rounded-2xl px-12 py-4 shadow-xl active:scale-95 transition-transform disabled:opacity-50"
        >
          <span className="font-bold text-lg uppercase tracking-tight">
            {loading ? 'Salvando...' : 'Concluir'}
          </span>
          {!loading && <span className="material-symbols-outlined font-bold">arrow_forward</span>}
        </button>
      </nav>
    </div>
  );
}