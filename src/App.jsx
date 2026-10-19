import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import LiveEventBanner from './components/LiveEventBanner';
import PinModal from './components/PinModal';
import CajaView from './components/CajaView';
import CalendarioView from './components/CalendarioView';
import ChecklistView from './components/ChecklistView';
import MarketingView from './components/MarketingView';
import MomentsLogo from './components/MomentsLogo';

import { 
  USUARIOS, 
  MOVIMIENTOS_SEED, 
  EVENTOS_SEED, 
  CHECKLIST_INICIAL 
} from './utils/mockData';

import { 
  Wallet, 
  CalendarDays, 
  CheckSquare, 
  TrendingUp, 
  Lock,
  Phone,
  Instagram,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Pestaña activa (por defecto Calendario, para que todo el equipo entre sin bloqueo)
  const [activeTab, setActiveTab] = useState('calendario');

  // Ambiente visual / Fondo del salón
  const [fondoActual, setFondoActual] = useState(() => {
    return localStorage.getItem('moments_fondo') || 'fiesta';
  });

  // Estado de seguridad de Caja (el PIN lo valida el servidor; acá solo se recuerda en la sesión)
  const [cajaPin, setCajaPin] = useState(() => sessionStorage.getItem('moments_caja_pin') || '');
  const cajaDesbloqueada = Boolean(cajaPin);
  const [pinModalOpen, setPinModalOpen] = useState(false);

  // Usuario activo (para autoría sin login)
  const [usuarioActivo, setUsuarioActivo] = useState(() => {
    const guardado = localStorage.getItem('moments_usuario_activo');
    if (guardado) {
      try {
        return JSON.parse(guardado);
      } catch (e) {}
    }
    return USUARIOS[1]; // Leandro (Dueño) por defecto
  });

  // Datos compartidos: SIEMPRE vienen del servidor (la nube), no del navegador de cada equipo.
  // Se arranca con la data de ejemplo solo para que la pantalla no aparezca vacía mientras carga.
  const [movimientos, setMovimientos] = useState([]);
  const [eventos, setEventos] = useState(EVENTOS_SEED);
  const [checklist, setChecklist] = useState(CHECKLIST_INICIAL);
  const [conexion, setConexion] = useState('cargando'); // 'cargando' | 'ok' | 'error'

  // Evento activo de hoy para el checklist y el banner en vivo
  const [eventoActivoId, setEventoActivoId] = useState(() => {
    const e = EVENTOS_SEED.find(e => e.esEventoDelDia) || EVENTOS_SEED[0];
    return e ? e.id : null;
  });
  const eventoActivo =
    eventos.find(e => e.id === eventoActivoId) ||
    eventos.find(e => e.esEventoDelDia) ||
    eventos[0];
  const setEventoActivo = (ev) => setEventoActivoId(ev ? ev.id : null);

  const versionRef = useRef(0);
  const guardadosPendientes = useRef(0);

  // Preferencias personales de cada equipo (no son datos del negocio)
  useEffect(() => {
    localStorage.setItem('moments_fondo', fondoActual);
  }, [fondoActual]);

  useEffect(() => {
    localStorage.setItem('moments_usuario_activo', JSON.stringify(usuarioActivo));
  }, [usuarioActivo]);

  // Traer datos del servidor
  const cargarDatos = useCallback(async () => {
    try {
      const res = await fetch('/api/data', { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (guardadosPendientes.current === 0) {
        setEventos(data.eventos || []);
        setChecklist(data.checklist || []);
        versionRef.current = data.version;
      }
      if (cajaPin) {
        const rm = await fetch('/api/movimientos', { headers: { 'x-caja-pin': cajaPin }, cache: 'no-store' });
        if (rm.status === 401) {
          sessionStorage.removeItem('moments_caja_pin');
          setCajaPin('');
        } else if (rm.ok && guardadosPendientes.current === 0) {
          const dm = await rm.json();
          setMovimientos(dm.movimientos || []);
        }
      }
      setConexion('ok');
    } catch (e) {
      setConexion('error');
    }
  }, [cajaPin]);

  // Carga inicial + revisar cambios de otros dispositivos cada 4 segundos
  useEffect(() => {
    cargarDatos();
    const intervalo = setInterval(async () => {
      try {
        const res = await fetch('/api/version', { cache: 'no-store' });
        const { version } = await res.json();
        setConexion('ok');
        if (version !== versionRef.current) cargarDatos();
      } catch (e) {
        setConexion('error');
      }
    }, 4000);
    const alVolver = () => cargarDatos();
    window.addEventListener('focus', alVolver);
    return () => {
      clearInterval(intervalo);
      window.removeEventListener('focus', alVolver);
    };
  }, [cargarDatos]);

  // Guardar UN registro en el servidor (alta/modificación o baja)
  const guardarRegistro = async (coleccion, metodo, item, id) => {
    guardadosPendientes.current += 1;
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (coleccion === 'movimientos') headers['x-caja-pin'] = cajaPin;
      const res = await fetch(`/api/${coleccion}/${encodeURIComponent(id ?? item.id)}`, {
        method: metodo,
        headers,
        body: metodo === 'PUT' ? JSON.stringify(item) : undefined
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const r = await res.json();
      versionRef.current = r.version;
      setConexion('ok');
    } catch (e) {
      setConexion('error');
      alert('⚠️ No se pudo guardar el cambio. Revisá la conexión a internet e intentá de nuevo.');
    } finally {
      guardadosPendientes.current -= 1;
      if (guardadosPendientes.current === 0) cargarDatos();
    }
  };

  // Handlers para Caja
  const handleOpenPinModal = () => {
    setPinModalOpen(true);
  };

  const handlePinSuccess = (pinValidado) => {
    setCajaPin(pinValidado);
    sessionStorage.setItem('moments_caja_pin', pinValidado);
    setPinModalOpen(false);
    setActiveTab('caja');
  };

  const handleBloquearCaja = () => {
    setCajaPin('');
    setMovimientos([]);
    sessionStorage.removeItem('moments_caja_pin');
    if (activeTab === 'caja') {
      setActiveTab('calendario');
    }
  };

  const handleAgregarMovimiento = (nuevo) => {
    setMovimientos(prev => [nuevo, ...prev]);
    guardarRegistro('movimientos', 'PUT', nuevo);
  };

  const handleEliminarMovimiento = (id) => {
    setMovimientos(prev => prev.filter(m => m.id !== id));
    guardarRegistro('movimientos', 'DELETE', null, id);
  };

  // Handlers para Calendario
  const handleAgregarEvento = (nuevo) => {
    setEventos(prev => [...prev, nuevo]);
    guardarRegistro('eventos', 'PUT', nuevo);
  };

  const handleEliminarEvento = (id) => {
    setEventos(prev => prev.filter(e => e.id !== id));
    guardarRegistro('eventos', 'DELETE', null, id);
  };

  // Handlers para Checklist
  const handleToggleItem = (itemId, responsableNombre) => {
    const ahora = new Date();
    const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;

    const item = checklist.find(i => i.id === itemId);
    if (!item) return;
    const nuevoEstado = !item.completado;
    const actualizado = {
      ...item,
      completado: nuevoEstado,
      hora: nuevoEstado ? horaActual : null,
      responsable: nuevoEstado ? responsableNombre : item.responsable
    };

    setChecklist(prev => prev.map(i => (i.id === itemId ? actualizado : i)));
    guardarRegistro('checklist', 'PUT', actualizado);
  };

  const handleAgregarChecklistItem = (nuevo) => {
    setChecklist(prev => [...prev, nuevo]);
    guardarRegistro('checklist', 'PUT', nuevo);
  };

  // URL del fondo según la selección
  const getFondoUrl = () => {
    switch (fondoActual) {
      case 'fiesta': return '/images/salon_fiesta_baile.jpg';
      case 'mesas': return '/images/salon_mesas_elegantes.jpg';
      case 'quince': return '/images/salon_15_anos.jpg';
      case 'egresados': return '/images/salon_egresados.jpg';
      case 'mesa_vip': return '/images/salon_mesa_principal.jpg';
      default: return null;
    }
  };

  const fondoUrl = getFondoUrl();

  return (
    <div className="relative min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-20 sm:pb-8 text-slate-800">
      
      {/* FONDO AMBIENTAL DE SALÓN DE EVENTOS */}
      {fondoUrl ? (
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 pointer-events-none"
          style={{ backgroundImage: `url(${fondoUrl})` }}
        >
          {/* Capa de iluminación y viñeta de gala para máxima legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#180a12]/85 via-[#12080f]/88 to-[#0a0408]/92 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-black/60" />
        </div>
      ) : (
        <div className="fixed inset-0 z-0 bg-[#f9f6f0] pointer-events-none" />
      )}

      {/* Contenedor relativo sobre el fondo */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Barra de Navegación Superior con Logo Oficial */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cajaDesbloqueada={cajaDesbloqueada}
          onOpenPinModal={handleOpenPinModal}
          onBloquearCaja={handleBloquearCaja}
          usuarioActivo={usuarioActivo}
          setUsuarioActivo={setUsuarioActivo}
          fondoActual={fondoActual}
          setFondoActual={setFondoActual}
        />

        {/* Contenido Principal */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
          
          {/* Banner de Estado en Vivo (visible en Calendario o Checklist para Leandro) */}
          {(activeTab === 'calendario' || activeTab === 'checklist') && (
            <LiveEventBanner
              eventoActivo={eventoActivo}
              checklist={checklist}
              onIrAlChecklist={() => setActiveTab('checklist')}
              todosEventos={eventos}
              onCambiarEventoActivo={setEventoActivo}
            />
          )}

          {/* 1. Pestaña Caja (Ingresos y Gastos) */}
          {activeTab === 'caja' && (
            cajaDesbloqueada ? (
              <CajaView
                movimientos={movimientos}
                onAgregarMovimiento={handleAgregarMovimiento}
                onEliminarMovimiento={handleEliminarMovimiento}
                usuarioActivo={usuarioActivo}
              />
            ) : (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 text-center max-w-md mx-auto shadow-2xl border border-amber-200">
                <div className="w-16 h-16 bg-[#7d1728]/10 text-[#7d1728] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#7d1728]/20">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Caja Gerencial Protegida</h2>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  Ingresá el PIN de seguridad de Gerencia (Jesica y Leandro) para acceder a los números y retiros.
                </p>
                <button
                  onClick={handleOpenPinModal}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#7d1728] to-[#9c2037] hover:from-[#6b1422] hover:to-[#881a2e] text-white text-xs font-black rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  Ingresar PIN de Gerencia
                </button>
              </div>
            )
          )}

          {/* 2. Pestaña Calendario */}
          {activeTab === 'calendario' && (
            <CalendarioView
              eventos={eventos}
              onAgregarEvento={handleAgregarEvento}
              onEliminarEvento={handleEliminarEvento}
              usuarioActivo={usuarioActivo}
            />
          )}

          {/* 3. Pestaña Checklist */}
          {activeTab === 'checklist' && (
            <ChecklistView
              checklist={checklist}
              onToggleItem={handleToggleItem}
              onAgregarItem={handleAgregarChecklistItem}
              eventoActivo={eventoActivo}
              todosEventos={eventos}
              onCambiarEventoActivo={setEventoActivo}
              usuarioActivo={usuarioActivo}
            />
          )}

          {/* 4. Pestaña Marketing, Tarifario y Ventas */}
          {activeTab === 'marketing' && (
            <MarketingView
              usuarioActivo={usuarioActivo}
            />
          )}

        </main>

        {/* Footer Oficial con Datos de Contacto de Moments */}
        <footer className="mt-auto border-t border-white/10 bg-black/40 backdrop-blur-md py-5 text-center text-xs text-slate-300">
          <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-amber-200" style={{ fontFamily: "'Great Vibes', cursive" }}>
                Moment's
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                · San Rafael, Mendoza
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>@moments.tulugar</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>2604-055777 (Joaquina · Pablo · Gabriela)</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Veta Consultoría
            </p>
          </div>
        </footer>

      </div>

      {/* Indicador de conexión con la nube */}
      <div
        className={`fixed z-50 right-3 bottom-20 sm:bottom-4 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg border backdrop-blur-md flex items-center gap-1.5 ${
          conexion === 'error'
            ? 'bg-rose-600/95 text-white border-rose-300 animate-pulse'
            : conexion === 'ok'
              ? 'bg-emerald-600/90 text-white border-emerald-300'
              : 'bg-slate-700/90 text-white border-slate-400'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-white" />
        {conexion === 'error'
          ? 'Sin conexión: los cambios no se guardan'
          : conexion === 'ok'
            ? 'Guardado en la nube'
            : 'Conectando…'}
      </div>

      {/* Barra de Navegación Inferior para Celulares (Mobile Dock para Paulina y Leandro) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#150c12]/95 backdrop-blur-xl border-t border-amber-900/40 px-2 py-1.5 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => {
            if (!cajaDesbloqueada) handleOpenPinModal();
            else setActiveTab('caja');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'caja' ? 'text-amber-400 font-black scale-105' : 'text-slate-400'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Caja</span>
        </button>

        <button
          onClick={() => setActiveTab('calendario')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'calendario' ? 'text-amber-400 font-black scale-105' : 'text-slate-400'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Calendario</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'checklist' ? 'text-amber-400 font-black scale-105' : 'text-slate-400'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('marketing')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'marketing' ? 'text-amber-400 font-black scale-105' : 'text-slate-400'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Ventas</span>
        </button>
      </nav>

      {/* Modal PIN de Caja */}
      <PinModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSuccess={handlePinSuccess}
      />

    </div>
  );
}
