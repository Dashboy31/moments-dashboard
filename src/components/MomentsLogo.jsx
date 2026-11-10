import React from 'react';

/**
 * MomentsLogo - Logotipo Oficial del Salón de Eventos Moment's
 * Diseñado en estricta fidelidad al Brandbook oficial:
 * - Verde Bosque: #2F3A2A
 * - Oro Cálido: #C6A96A
 * - Crema / Marfil: #F6F3E9
 * - Verde Oliva / Acento: #5A6B4A
 * - Tipografías: Great Vibes (M caligráfica), Playfair Display (OMENT'S), Montserrat (SALÓN DE EVENTOS)
 * - Sin emojis ni brillos artificiales.
 */

export default function MomentsLogo({ variant = 'header', className = '', showSubtitle = true }) {
  
  // VARIANTE 1: Monograma circular oficial (Avatar de Instagram / Sello de cera / Icono)
  if (variant === 'monogram') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <div className="w-10 h-10 rounded-full bg-[#2F3A2A] border-2 border-[#C6A96A] flex items-center justify-center shadow-md">
          <span 
            className="text-[#C6A96A] text-2xl select-none leading-none pt-0.5"
            style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 700 }}
          >
            M
          </span>
        </div>
      </div>
    );
  }

  // VARIANTE 2: Wordmark puro (solo tipografía con filete dorado, sin medallón)
  if (variant === 'wordmark') {
    return (
      <div className={`flex flex-col items-center justify-center select-none text-center ${className}`}>
        <div className="flex items-baseline leading-none">
          <span 
            className="text-3xl sm:text-4xl text-[#C6A96A] select-none leading-none"
            style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 700 }}
          >
            M
          </span>
          <span 
            className="text-xl sm:text-2xl font-bold tracking-[0.06em] text-[#F6F3E9] -ml-1 font-['Playfair_Display']"
          >
            OMENT'S
          </span>
        </div>
        {showSubtitle && (
          <>
            <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.32em] text-[#C6A96A] mt-1 font-['Montserrat']">
              Salón de Eventos
            </span>
            <div className="w-12 h-[1px] bg-[#C6A96A] mx-auto mt-1" />
          </>
        )}
      </div>
    );
  }

  // VARIANTE 3: Wall / Dorado sobre oscuro (Para portada, login y modales premium)
  if (variant === 'wall') {
    return (
      <div className={`flex flex-col items-center justify-center select-none text-center ${className}`}>
        <div className="flex items-baseline leading-none drop-shadow-[0_2px_12px_rgba(198,169,106,0.35)]">
          <span 
            className="text-4xl sm:text-5xl text-[#C6A96A] select-none leading-none"
            style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 700 }}
          >
            M
          </span>
          <span 
            className="text-2xl sm:text-3xl font-extrabold tracking-[0.06em] text-[#C6A96A] -ml-1.5 font-['Playfair_Display']"
          >
            OMENT'S
          </span>
        </div>
        {showSubtitle && (
          <div className="flex flex-col items-center mt-1">
            <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.32em] text-[#C6A96A]/90 font-['Montserrat']">
              Salón de Eventos
            </span>
            <div className="w-14 h-[1px] bg-[#C6A96A]/70 mt-1" />
          </div>
        )}
      </div>
    );
  }

  // VARIANTE 4: Header (Sobre fondo oscuro de la barra de navegación)
  if (variant === 'header' || variant === 'dark') {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        {/* Medallón Monograma Verde Bosque y Oro */}
        <div className="w-9 h-9 rounded-full bg-[#2F3A2A] border border-[#C6A96A] flex items-center justify-center shadow-md shadow-black/20 shrink-0">
          <span 
            className="text-[#C6A96A] text-xl select-none leading-none pt-0.5"
            style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 700 }}
          >
            M
          </span>
        </div>

        {/* Tipografía Oficial Moment's + Salón de Eventos */}
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline">
            <span 
              className="text-2xl text-[#C6A96A] select-none leading-none"
              style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 700 }}
            >
              M
            </span>
            <span 
              className="text-sm font-bold tracking-[0.06em] text-[#F6F3E9] -ml-0.5 font-['Playfair_Display']"
            >
              OMENT'S
            </span>
          </div>
          {showSubtitle && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[7.5px] font-semibold uppercase tracking-[0.28em] text-[#C6A96A] font-['Montserrat']">
                Salón de Eventos
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // VARIANTE 5: Compacta (Para tablas, badges y footers)
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        <div className="w-7 h-7 rounded-full bg-[#2F3A2A] border border-[#C6A96A] flex items-center justify-center shrink-0">
          <span 
            className="text-[#C6A96A] text-base leading-none select-none pt-0.5"
            style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 700 }}
          >
            M
          </span>
        </div>
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline">
            <span 
              className="text-lg text-[#2F3A2A] select-none"
              style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 700 }}
            >
              M
            </span>
            <span className="text-xs font-bold tracking-tight text-[#2F3A2A] -ml-0.5 font-['Playfair_Display']">
              OMENT'S
            </span>
          </div>
        </div>
      </div>
    );
  }

  // VARIANTE DEFAULT: Logo Principal del Brandbook sobre fondo claro
  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* Nombre oficial del Brandbook en Verde Bosque #2F3A2A */}
      <div className="flex items-baseline justify-center leading-none">
        <span 
          className="text-4xl sm:text-5xl text-[#2F3A2A] select-none leading-none"
          style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 700 }}
        >
          M
        </span>
        <span 
          className="text-2xl sm:text-3xl font-extrabold tracking-[0.06em] text-[#2F3A2A] -ml-1.5 font-['Playfair_Display']"
        >
          OMENT'S
        </span>
      </div>

      {/* Subtítulo oficial con filete dorado centrado */}
      {showSubtitle && (
        <div className="flex flex-col items-center mt-1">
          <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.32em] text-[#2F3A2A] font-['Montserrat']">
            Salón de Eventos
          </span>
          <div className="w-14 h-[1px] bg-[#C6A96A] mt-1.5" />
        </div>
      )}
    </div>
  );
}
