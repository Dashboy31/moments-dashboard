import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { USUARIOS } from '../utils/mockData';
import MomentsLogo from './MomentsLogo';

export default function LoginModal({ onLogin, error: propError }) {
  const [selectedUserId, setSelectedUserId] = useState(() => {
    return localStorage.getItem('moments_last_user_id') || 'alvaro';
  });
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(propError || '');

  const usuarioSeleccionado = USUARIOS.find(u => u.id === selectedUserId) || USUARIOS[0];

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: selectedUserId, password })
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Contraseña incorrecta');
      }

      if (rememberMe) {
        localStorage.setItem('moments_last_user_id', selectedUserId);
      }
      onLogin(data.usuario);
    } catch (err) {
      // Fallback local en caso de estar offline
      if (password.trim() === (usuarioSeleccionado.password || '123')) {
        if (rememberMe) {
          localStorage.setItem('moments_last_user_id', selectedUserId);
        }
        onLogin(usuarioSeleccionado);
      } else {
        setErrorMessage(err.message || 'Contraseña incorrecta. Probá con 123.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (user) => {
    setSelectedUserId(user.id);
    setPassword('123');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      
      {/* Fondo fotográfico con brillo dorado cálido */}
      <div 
        className="fixed inset-0 pointer-events-none bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/images/salon_fiesta_baile.jpg')" }}
      />
      <div className="fixed inset-0 pointer-events-none bg-radial-gradient from-amber-500/15 via-purple-950/40 to-slate-950/90" />

      {/* Tarjeta de Inicio de Sesión */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-amber-300/40 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300 text-slate-800">
        
        {/* Cabecera con Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 bg-gradient-to-b from-amber-50 to-rose-50 rounded-2xl border border-amber-200/60 shadow-sm mb-3">
            <MomentsLogo variant="default" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#7d1728]/10 text-[#7d1728] border border-[#7d1728]/20">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Panel Operativo del Equipo
          </span>
          <p className="text-xs text-slate-500 mt-2">
            Seleccioná tu nombre e ingresá tu clave para ver las actividades, reuniones y caja.
          </p>
        </div>

        {/* Alerta de Error si falló */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800 font-semibold animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Desplegable de Usuario */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              1. ¿Quién está ingresando?
            </label>
            <div className="relative">
              <div className="flex items-center gap-3 p-2.5 bg-slate-50 border-2 border-slate-200 hover:border-amber-400 focus-within:border-amber-500 rounded-2xl transition-all shadow-inner">
                {/* Avatar con Color del Usuario */}
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm"
                  style={{ backgroundColor: usuarioSeleccionado.avatar_color }}
                >
                  {usuarioSeleccionado.nombre.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full bg-transparent font-black text-sm text-slate-900 focus:outline-none cursor-pointer"
                  >
                    {USUARIOS.map(u => (
                      <option key={u.id} value={u.id} className="text-slate-900">
                        {u.nombre} — {u.rol}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    Rol: <span className="font-bold text-slate-700">{usuarioSeleccionado.rol}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Campo de Contraseña */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                2. Contraseña de acceso
              </label>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Inicial: 123
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresá 123..."
                autoFocus
                required
                className="w-full pl-10 pr-11 py-3 bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white rounded-2xl text-sm font-black tracking-widest text-slate-900 focus:outline-none transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Recordar Sesión */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
              />
              <span className="font-semibold text-slate-700">Recordarme en este dispositivo</span>
            </label>
          </div>

          {/* Botón de Ingreso */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#7d1728] via-[#911f33] to-[#7d1728] hover:from-[#6b1422] hover:to-[#7d1728] text-white font-black text-sm tracking-wide shadow-lg shadow-rose-950/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Ingresando...
              </span>
            ) : (
              <>
                <span>Ingresar al Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Acceso Rápido en 1 Clic (muy útil para que el equipo pruebe en el local o en demo) */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Acceso Rápido del Equipo:
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {USUARIOS.map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickLogin(u)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                  selectedUserId === u.id
                    ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-xs ring-1 ring-amber-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {u.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Pie de seguridad */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Moments Salón de Eventos · San Rafael, Mendoza</span>
        </div>

      </div>
    </div>
  );
}
