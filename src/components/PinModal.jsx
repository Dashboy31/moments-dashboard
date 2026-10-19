import React, { useState } from 'react';
import { Lock, KeyRound, X, AlertCircle } from 'lucide-react';

export default function PinModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [verificando, setVerificando] = useState(false);

  if (!isOpen) return null;

  const verificarPin = async (nuevoPin) => {
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
  };

  const handleDigit = (digit) => {
    if (verificando) return;
    if (pin.length < 4) {
      const nuevoPin = pin + digit;
      setPin(nuevoPin);
      setError(false);
      if (nuevoPin.length === 4) {
        verificarPin(nuevoPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className={`bg-white rounded-3xl shadow-modal max-w-sm w-full p-6 text-center border border-amber-100 transition-transform ${error ? 'animate-shake' : ''}`}>
        
        {/* Encabezado */}
        <div className="flex justify-end mb-1">
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-200 text-amber-700 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-slate-800">Acceso a Caja</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Espacio restringido a Gerencia (Jesica y Leandro).
        </p>

        {/* Indicador de 4 dígitos */}
        <div className="flex justify-center gap-3 my-5">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                i < pin.length 
                  ? 'bg-amber-600 border-amber-600 scale-110 shadow-sm' 
                  : 'bg-slate-100 border-slate-300'
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
              className="h-14 rounded-2xl bg-slate-50 hover:bg-amber-50 active:bg-amber-100 text-xl font-bold text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 transition-all shadow-sm active:scale-95 flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600 border border-slate-200 transition-all flex items-center justify-center"
          >
            Borrar
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-amber-50 active:bg-amber-100 text-xl font-bold text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 transition-all shadow-sm active:scale-95 flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-sm font-semibold text-slate-600 border border-slate-200 transition-all flex items-center justify-center"
          >
            ⌫
          </button>
        </div>

      </div>
    </div>
  );
}

