import React from 'react';

export default function MomentsLogo({ variant = 'header', className = '', showSubtitle = true }) {
  // Variante 1: Monograma circular con la 'M' caligráfica del brandbook
  if (variant === 'monogram') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <div className="w-10 h-10 rounded-full bg-[#2F3A2A] border-2 border-[#C6A96A] flex items-center justify-center shadow-md">
          <span 
            className="text-[#C6A96A] text-xl select-none leading-none pt-0.5"
            style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 700 }}
          >
            M
          </span>
        </div>
      </div>
    );
  }

  // Variante 2: Compacta (para tarjetas, tablas, badges)
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {/* Monograma circular */}
        <div className="w-8 h-8 rounded-full bg-[#2F3A2A] border border-[#C6A96A] flex items-center justify-center shadow-xs shrink-0">
          <span 
            className="text-[#C6A96A] text-base leading-none select-none pt-0.5"
            style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 700 }}
          >
            M
          </span>
        </div>

        <div className="flex flex-col leading-none">
          <div className="flex items-baseline font-serif">
            <span 
              className="text-xl text-[#2F3A2A] select-none"
              style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 700 }}
            >
              M
            </span>
            <span 
              className="text-sm font-bold tracking-tight text-[#2F3A2A] -ml-0.5 font-['Playfair_Display']"
            >
              OMENT'S
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[7.5px] font-bold uppercase tracking-[0.22em] text-[#5A6B4A] mt-0.5 font-['Montserrat']">
              Salón de Eventos
            </span>
          )}
        </div>
      </div>
    );
  }

  // Variante 3: Sobre fondo oscuro (Header / Modales oscuros)
  if (variant === 'header' || variant === 'dark') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Medallón Monograma Verde Bosque y Oro */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#2F3A2A] border-2 border-[#C6A96A] flex items-center justify-center shadow-md shadow-black/30">
            <span 
              className="text-[#C6A96A] text-2xl select-none leading-none pt-0.5"
              style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 700 }}
            >
              M
            </span>
          </div>
          <span className="absolute -top-1 -right-1 text-[9px]">✨</span>
        </div>

        {/* Tipografía Oficial Moment's + Salón de Eventos */}
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline">
            <span 
              className="text-3xl text-[#C6A96A] select-none leading-none drop-shadow-sm"
              style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 700 }}
            >
              M
            </span>
            <span 
              className="text-base font-extrabold tracking-[0.04em] text-[#F6F3E9] -ml-0.5 font-['Playfair_Display']"
            >
              OMENT'S
            </span>
          </div>
          {showSubtitle && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-[1px] w-3 bg-[#C6A96A]/60" />
              <span className="text-[8px] font-bold uppercase tracking-[0.28em] text-[#C6A96A] font-['Montserrat']">
                Salón de Eventos
              </span>
              <span className="h-[1px] w-3 bg-[#C6A96A]/60" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Variante 4: Default sobre fondo claro (Login, portada, exportación)
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* Monograma destacado con ramita de olivo */}
      <div className="relative mb-2">
        <div className="w-14 h-14 rounded-full bg-[#2F3A2A] border-2 border-[#C6A96A] flex items-center justify-center shadow-lg shadow-[#2F3A2A]/20">
          <span 
            className="text-[#C6A96A] text-3xl select-none leading-none pt-1"
            style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 700 }}
          >
            M
          </span>
        </div>
        <span className="absolute -bottom-1 -right-1 text-sm">🌿</span>
      </div>

      {/* Nombre oficial del Brandbook */}
      <div className="flex items-baseline justify-center">
        <span 
          className="text-4xl text-[#2F3A2A] select-none leading-none"
          style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 700 }}
        >
          M
        </span>
        <span 
          className="text-2xl font-black tracking-tight text-[#2F3A2A] -ml-1 font-['Playfair_Display']"
        >
          OMENT'S
        </span>
      </div>

      {/* Subtítulo oficial con líneas doradas */}
      {showSubtitle && (
        <div className="flex items-center justify-center gap-2 mt-1.5">
          <span className="h-[1px] w-6 bg-[#C6A96A]" />
          <span className="text-[9px] font-black uppercase tracking-[0.32em] text-[#5A6B4A] font-['Montserrat']">
            Salón de Eventos
          </span>
          <span className="h-[1px] w-6 bg-[#C6A96A]" />
        </div>
      )}
    </div>
  );
}
