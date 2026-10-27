import React, { useState } from 'react';
import { 
  Calendar,
  Wallet, 
  CalendarDays, 
  CheckSquare, 
  TrendingUp, 
  Lock, 
  Unlock, 
  UserCircle2, 
  Image as ImageIcon,
  ChevronDown,
  LogOut,
  Sparkles,
  Users,
  ShieldCheck
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
  onLogout,
  fondoActual,
  setFondoActual,
  conexion = 'ok'
}) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const tabs = [
    {
      id: 'semana',
      number: '1',
      label: 'Semana & Acciones',
      shortLabel: 'Semana',
      icon: Calendar,
      protegido: false
    },
    {
      id: 'caja',
      number: '2',
      label: 'Caja (Ingresos y Gastos)',
      shortLabel: 'Caja',
      icon: Wallet,
      protegido: true
    },
    {
      id: 'calendario',
      number: '3',
      label: 'Calendario de Eventos',
      shortLabel: 'Calendario',
      icon: CalendarDays,
      protegido: false
    },
    {
      id: 'checklist',
      number: '4',
      label: 'Checklist de Logística',
      shortLabel: 'Checklist',
      icon: CheckSquare,
      protegido: false
    },
    {
      id: 'marketing',
      number: '5',
      label: 'Tarifario & Ventas',
      shortLabel: 'Ventas',
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
    <header className="sticky top-0 z-40 bg-[#160c18] text-white border-b border-amber-900/30 shadow-xl transition-colors">
      
      {/* -------------------------------------------------------------------
          BARRA SUPERIOR PRINCIPAL (ESTILO MIFA DASHBOARD CON IDENTIDAD MOMENTS)
         ------------------------------------------------------------------- */}
      <div className="max-w-[1920px] mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        
        {/* LOGO OFICIAL E IDENTIDAD MOMENTS */}
        <div 
          className="flex items-center gap-3 cursor-pointer py-0.5 select-none" 
          onClick={() => setActiveTab('semana')}
          title="Ir al inicio (Semana & Acciones)"
        >
          <div className="bg-white/10 hover:bg-white/15 p-1 rounded-2xl border border-amber-400/30 shadow-sm transition">
            <MomentsLogo variant="header" />
          </div>
          <div className="hidden xl:block">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
              Salón de Eventos Familiar
            </span>
            <span className="text-[11px] text-slate-300 font-medium">
              San Rafael, Mendoza
            </span>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            PESTAÑAS NUMERADAS CENTRALES (ESTILO MIFA 1-5)
           ----------------------------------------------------------------- */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const estaProtegido = tab.protegido && !cajaDesbloqueada;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#7d1728] via-[#911f33] to-[#7d1728] text-white shadow-md shadow-rose-950/40 border border-amber-400/40 ring-1 ring-amber-300/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
                title={tab.label}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-200' : 'text-slate-400'}`} />
                <span>{tab.number}. {tab.shortLabel}</span>

                {/* Candado en caja si no está desbloqueada */}
                {estaProtegido && (
                  <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-md font-black bg-amber-400/20 text-amber-200 border border-amber-400/30">
                    <Lock className="w-2.5 h-2.5" />
                    <span>PIN</span>
                  </span>
                )}

                {tab.id === 'caja' && cajaDesbloqueada && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Caja desbloqueada" />
                )}
              </button>
            );
          })}
        </nav>

        {/* -----------------------------------------------------------------
            LADO DERECHO: AMBIENTE, CAJA Y PERFIL CON AVATAR
           ----------------------------------------------------------------- */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Selector de Ambiente / Fondo de Salón */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#251528] border border-amber-900/40 rounded-xl px-2.5 py-1 text-xs">
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-200/80 uppercase">Fondo:</span>
            <select
              value={fondoActual}
              onChange={(e) => setFondoActual(e.target.value)}
              className="bg-transparent font-bold text-white focus:outline-none cursor-pointer text-xs"
            >
              {fondosDisponibles.map(f => (
                <option key={f.id} value={f.id} className="text-slate-900 bg-white">
                  {f.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Estado de Caja y botón de bloqueo */}
          {cajaDesbloqueada && (
            <button
              onClick={onBloquearCaja}
              title="Presione para volver a bloquear el acceso a la caja"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900 transition-colors shadow-sm cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Caja Abierta</span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded font-bold">Bloquear</span>
            </button>
          )}

          {/* PERFIL DE USUARIO ACTIVO CON AVATAR Y DROPDOWN (ESTILO MIFA) */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 bg-[#251528] hover:bg-[#341d38] px-2.5 py-1.5 rounded-2xl border border-amber-400/30 text-xs font-medium transition cursor-pointer shadow-sm"
            >
              {/* Avatar circular con inicial y color oficial */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black shadow-sm"
                style={{ backgroundColor: usuarioActivo?.avatar_color || '#7c3aed' }}
              >
                {usuarioActivo?.nombre ? usuarioActivo.nombre.charAt(0) : 'U'}
              </div>

              {/* Nombre y Cargo */}
              <div className="text-left hidden sm:block">
                <div className="text-white font-bold text-xs leading-none">
                  {usuarioActivo?.nombre || 'Usuario'}
                </div>
                <div className="text-[10px] text-amber-200/80 leading-none mt-1 truncate max-w-[130px]">
                  {usuarioActivo?.rol || 'Equipo'}
                </div>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-amber-300/80 ml-0.5" />
            </button>

            {/* Menu Desplegable de Usuario */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#1b0f1d] border border-amber-500/30 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-white">
                
                <div className="px-3.5 py-2 border-b border-white/10">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                    Sesión Activa
                  </span>
                  <div className="font-bold text-sm text-white mt-0.5">
                    {usuarioActivo?.nombre}
                  </div>
                  <div className="text-xs text-slate-300">
                    {usuarioActivo?.rol}
                  </div>
                </div>

                <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Cambiar Operador Activo:
                </div>

                <div className="max-h-56 overflow-y-auto">
                  {USUARIOS.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setUsuarioActivo(u);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition cursor-pointer ${
                        usuarioActivo?.id === u.id
                          ? 'bg-[#7d1728]/40 text-amber-200 font-bold border-l-2 border-amber-400'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
                          style={{ backgroundColor: u.avatar_color }}
                        >
                          {u.nombre.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold">{u.nombre}</span>
                          <span className="text-[10px] text-slate-400 ml-1.5">({u.badge})</span>
                        </div>
                      </div>
                      {usuarioActivo?.id === u.id && (
                        <span className="text-[10px] font-bold text-amber-400">Activo</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Cerrar Sesión */}
                <div className="mt-1 pt-1.5 border-t border-white/10 px-2">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-bold text-rose-300 hover:bg-rose-950/40 hover:text-rose-100 rounded-xl transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>

      {/* -------------------------------------------------------------------
          PESTAÑAS MÓVILES (SCROLL HORIZONTAL EN DISPOSITIVOS CHICOS)
         ------------------------------------------------------------------- */}
      <div className="md:hidden bg-[#1f1122] border-t border-amber-900/30 px-3 py-1.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const estaProtegido = tab.protegido && !cajaDesbloqueada;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#7d1728] to-[#911f33] text-white shadow-sm border border-amber-400/40'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-200' : 'text-slate-400'}`} />
                <span>{tab.number}. {tab.shortLabel}</span>
                {estaProtegido && (
                  <Lock className="w-2.5 h-2.5 text-amber-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
}
