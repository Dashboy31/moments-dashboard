import React from 'react';

export default function MomentsLogo({ variant = 'header', className = '' }) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {/* Monograma Ch G */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 p-[1.5px] shadow-md shrink-0">
          <div className="w-full h-full rounded-full bg-[#6a1523] flex items-center justify-center text-amber-200 font-serif font-black text-xs tracking-tighter">
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>Ch G</span>
          </div>
        </div>

        {/* Tipografía Cursiva */}
        <div className="flex flex-col">
          <span 
            className="text-2xl font-bold tracking-wide text-[#7d1728] drop-shadow-sm leading-none"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Moment's
          </span>
          <span 
            className="text-[8px] font-black uppercase tracking-[0.25em] text-[#b3863d] leading-none mt-0.5"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Empresa Gastronómica
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'white') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Monograma Ch G */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[2px] shadow-lg shrink-0">
          <div className="w-full h-full rounded-full bg-[#59101d] flex items-center justify-center text-amber-200 font-serif font-black text-xs tracking-tighter border border-amber-300/40">
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>Ch G</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span 
            className="text-3xl font-bold tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] leading-none"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Moment's
          </span>
          <span 
            className="text-[9px] font-bold uppercase tracking-[0.28em] text-amber-300 leading-none mt-1 drop-shadow-sm"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Empresa Gastronómica
          </span>
        </div>
      </div>
    );
  }

  // Variant default 'header'
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Medallón Monograma Ch G */}
      <div className="relative group shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] via-[#f3e5ab] to-[#aa771c] p-[2px] shadow-md shadow-amber-950/20">
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#6b1424] to-[#4e0c19] flex items-center justify-center border border-amber-200/30">
            <span 
              className="text-amber-200 font-bold text-xs tracking-tighter"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              Ch G
            </span>
          </div>
        </div>
        {/* Pequeña corona o destello */}
        <span className="absolute -top-1 -right-1 text-[10px]">✨</span>
      </div>

      {/* Tipografía Cursiva Oficial */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-1.5">
          <span 
            className="text-3xl font-bold text-[#7d1728] leading-none select-none tracking-tight"
            style={{ 
              fontFamily: "'Great Vibes', cursive",
              textShadow: '0 1px 1px rgba(125,23,40,0.15)'
            }}
          >
            Moment's
          </span>
          <span className="hidden sm:inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs">
            Salón de Eventos
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span 
            className="text-[9px] font-black uppercase tracking-[0.24em] text-[#9a6e29] leading-none"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Empresa Gastronómica
          </span>
          <span className="text-[9px] text-slate-400 leading-none hidden md:inline">
            · San Rafael, Mendoza
          </span>
        </div>
      </div>
    </div>
  );
}
