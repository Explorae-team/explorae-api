import React from 'react';

interface InterestCardProps {
  id: string;
  name: string;
  icon: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export const InterestCard: React.FC<InterestCardProps> = ({ id, name, icon, isSelected, onToggle }) => {
  return (
    <div 
      onClick={() => onToggle(id)}
      className={`bg-white p-5 rounded-xl flex flex-col justify-between aspect-square relative active:scale-95 transition-all duration-200 cursor-pointer shadow-sm
        ${isSelected ? 'ring-4 ring-[#fd6c28]' : 'hover:bg-gray-50'}`}
    >
      {/* Checkmark indicator para estado selecionado */}
      {isSelected && (
        <div className="absolute top-4 right-4 bg-[#fd6c28] text-white rounded-full p-1 flex items-center justify-center animate-in zoom-in duration-200">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            check
          </span>
        </div>
      )}

      {/* Ícone */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-auto 
        ${isSelected ? 'bg-[#fd6c28]/10' : 'bg-[#00232f]/10'}`}>
        <span 
          className="material-symbols-outlined text-3xl" 
          style={{ 
            color: isSelected ? '#fd6c28' : '#053a4a',
            fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" 
          }}
        >
          {icon}
        </span>
      </div>

      {/* Nome do Interesse */}
      <p className="text-[#001017] font-bold text-lg leading-tight">
        {name}
      </p>
    </div>
  );
};