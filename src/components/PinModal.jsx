import React, { useState, useEffect, useCallback } from 'react';
import { Lock, KeyRound, X, AlertCircle } from 'lucide-react';

export default function PinModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [verificando, setVerificando] = useState(false);

  const verificarPin = useCallback(async (nuevoPin) => {
    setVerificando(true);
    try {
      const res = await fetch('/api/caja/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: nuevoPin })
      });
      if (res.ok) {
        onSuccess(nuevoPin);
        setPin('');
        setError(false);
      } else {
        setError(true);
        setPin('');
      }
    } catch (e) {
      setError(true);
      setPin('');
    } finally {
      setVerificando(false);
    }
  }, [onSuccess]);

  const handleDigit = useCallback((digit) => {
    if (verificando) return;
    setPin(prev => {
      if (prev.length < 4) {
        const nuevoPin = prev + digit;
        setError(false);
        if (nuevoPin.length === 4) {
          verificarPin(nuevoPin);
        }
        return nuevoPin;
      }
      return prev;
    });
  }, [verificando, verificarPin]);

  const handleBackspace = useCallback(() => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  }, []);

  const handleClear = useCallback(() => {
    setPin('');
    setError(false);
  }, []);

  // Soporte para teclado físico (0-9, NumPad, Backspace, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleDigit, handleBackspace, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fadeIn font-['Montserrat']">
      <div className={`bg-[#F6F3E9] rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center border border-[#C6A96A]/60 transition-transform ${error ? 'animate-shake' : ''}`}>
        
        {/* Encabezado */}
        <div className="flex justify-end mb-1">
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-16 h-16 bg-[#2F3A2A] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#C6A96A]/60 text-[#C6A96A] shadow-md">
          <Lock className="w-8 h-8 text-[#C6A96A]" />
        </div>

        <h3 className="text-xl font-bold text-[#2F3A2A] font-serif">Acceso a Caja</h3>
        <p className="text-xs text-slate-600 mt-1 mb-4">
          Espacio restringido a Gerencia (Jesica y Leandro).
        </p>

        {/* Indicador de 4 dígitos */}
        <div className="flex justify-center gap-3 my-5">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                i < pin.length 
                  ? 'bg-[#2F3A2A] border-[#C6A96A] scale-110 shadow-sm' 
                  : 'bg-white border-slate-300'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-600 mb-3 bg-rose-50 py-1.5 px-3 rounded-lg border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>PIN incorrecto. Probá de nuevo.</span>
          </div>
        )}

        {/* Teclado numérico */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto mt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleDigit(num.toString())}
              className="h-14 rounded-2xl bg-white hover:bg-[#2F3A2A] active:bg-[#1E251B] text-xl font-bold text-slate-800 hover:text-[#F6F3E9] border border-[#E3DCCE] hover:border-[#C6A96A] transition-all shadow-sm active:scale-95 flex items-center justify-center cursor-pointer font-serif"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-14 rounded-2xl bg-slate-200/60 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-[#E3DCCE] transition-all flex items-center justify-center cursor-pointer"
          >
            Borrar
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-white hover:bg-[#2F3A2A] active:bg-[#1E251B] text-xl font-bold text-slate-800 hover:text-[#F6F3E9] border border-[#E3DCCE] hover:border-[#C6A96A] transition-all shadow-sm active:scale-95 flex items-center justify-center cursor-pointer font-serif"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-slate-200/60 hover:bg-slate-200 text-sm font-bold text-slate-700 border border-[#E3DCCE] transition-all flex items-center justify-center cursor-pointer"
          >
            ⌫
          </button>
        </div>

        <div className="mt-4 text-[11px] text-slate-400 font-medium">
          💡 Podés tipear directamente con tu teclado físico o hacer clic en los números.
        </div>

      </div>
    </div>
  );
}

