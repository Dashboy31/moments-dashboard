import React from 'react';
import { 
  Wallet, 
  CalendarDays, 
  CheckSquare, 
  TrendingUp, 
  Lock, 
  Unlock, 
  UserCircle2, 
  Image as ImageIcon,
  ChevronDown
} from 'lucide-react';
import { USUARIOS } from '../utils/mockData';
import MomentsLogo from './MomentsLogo';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  cajaDesbloqueada, 
  onOpenPinModal, 
  onBloquearCaja,
  usuarioActivo,
  setUsuarioActivo,
  fondoActual,
  setFondoActual
}) {
  const tabs = [
    {
      id: 'caja',
      label: 'Ingresos y Gastos',
      shortLabel: 'Caja',
      icon: Wallet,
      protegido: true
    },
    {
      id: 'calendario',
      label: 'Calendario de Eventos',
      shortLabel: 'Calendario',
      icon: CalendarDays,
      protegido: false
    },
    {
      id: 'checklist',
      label: 'Checklist de Logística',
      shortLabel: 'Checklist',
      icon: CheckSquare,
      protegido: false
    },
    {
      id: 'marketing',
      label: 'Tarifario, Menú y Ventas',
      shortLabel: 'Ventas & Menú',
      icon: TrendingUp,
      protegido: false
    }
  ];

  const fondosDisponibles = [
    { id: 'fiesta', nombre: '🎉 Pista y Baile', file: '/images/salon_fiesta_baile.jpg' },
    { id: 'mesas', nombre: '✨ Salón y Candelabros', file: '/images/salon_mesas_elegantes.jpg' },
    { id: 'quince', nombre: '👑 Cumpleaños de 15', file: '/images/salon_15_anos.jpg' },
    { id: 'egresados', nombre: '🎓 Egresados Luminoso', file: '/images/salon_egresados.jpg' },
    { id: 'mesa_vip', nombre: '🥂 Mesa Principal', file: '/images/salon_mesa_principal.jpg' },
    { id: 'sutil', nombre: '📋 Modo Planilla Suave', file: null }
  ];

  const handleTabClick = (tab) => {
    if (tab.protegido && !cajaDesbloqueada) {
      onOpenPinModal();
    } else {
      setActiveTab(tab.id);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-amber-900/10 shadow-sm transition-colors">
      {/* Barra superior con identidad oficial y acciones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
        
        {/* LOGO OFICIAL DE MOMENTS */}
        <div className="py-1 cursor-pointer" onClick={() => setActiveTab('calendario')}>
          <MomentsLogo variant="header" />
        </div>

        {/* Acciones del lado derecho: Selector de fondo, estado de Caja y Selector de usuario */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Selector de Ambiente / Fondo de Salón */}
          <div className="hidden lg:flex items-center gap-1.5 bg-amber-50/80 border border-amber-200/70 rounded-2xl px-2.5 py-1 text-xs">
            <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-[10px] font-bold text-amber-900/70 uppercase">Ambiente:</span>
            <select
              value={fondoActual}
              onChange={(e) => setFondoActual(e.target.value)}
              className="bg-transparent font-bold text-amber-950 focus:outline-none cursor-pointer text-xs"
            >
              {fondosDisponibles.map(f => (
                <option key={f.id} value={f.id}>{f.nombre}</option>
              ))}
            </select>
          </div>

          {/* Estado de Caja y botón de bloqueo */}
          {cajaDesbloqueada && (
            <button
              onClick={onBloquearCaja}
              title="Presione para volver a bloquear el acceso a la caja"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors shadow-sm"
            >
              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Caja Abierta</span>
              <span className="text-[10px] bg-emerald-200/60 px-1.5 py-0.5 rounded font-bold">Bloquear</span>
            </button>
          )}

          {/* Selector de Usuario Activo */}
          <div className="relative flex items-center">
            <div className="flex items-center gap-2 bg-slate-50/90 border border-slate-200 rounded-2xl px-2.5 py-1.5 hover:bg-slate-100 transition-colors">
              <UserCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-slate-400 font-bold leading-none hidden sm:inline uppercase">
                  Operador
                </span>
                <select
                  value={usuarioActivo.id}
                  onChange={(e) => {
                    const u = USUARIOS.find(usr => usr.id === e.target.value);
                    if (u) setUsuarioActivo(u);
                  }}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
                >
                  {USUARIOS.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.nombre} ({u.badge})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Pestañas de navegación principal (Responsive) */}
      <div className="bg-slate-50/80 border-t border-slate-200/60 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-1.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const estaProtegido = tab.protegido && !cajaDesbloqueada;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#7d1728] to-[#911f33] text-white shadow-md shadow-rose-950/20 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-200' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>

                {/* Candado en caja si no está desbloqueada */}
                {estaProtegido && (
                  <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    isActive ? 'bg-black/25 text-amber-200' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Lock className="w-2.5 h-2.5" />
                    <span>PIN</span>
                  </span>
                )}

                {tab.id === 'caja' && cajaDesbloqueada && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Caja accesible" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
