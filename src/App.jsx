import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import LiveEventBanner from './components/LiveEventBanner';
import PinModal from './components/PinModal';
import LoginModal from './components/LoginModal';
import SemanaAccionesView from './components/SemanaAccionesView';
import CajaView from './components/CajaView';
import CalendarioView from './components/CalendarioView';
import ChecklistView from './components/ChecklistView';
import MarketingView from './components/MarketingView';
import MomentsLogo from './components/MomentsLogo';

import { 
  USUARIOS, 
  MOVIMIENTOS_SEED, 
  EVENTOS_SEED, 
  CHECKLIST_INICIAL,
  ACTIVIDADES_SEMANA_SEED 
} from './utils/mockData';

import { 
  Calendar,
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
  // Usuario autenticado (con login por desplegable y contraseña '123')
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(() => {
    const guardado = localStorage.getItem('moments_auth_user');
    if (guardado) {
      try {
        return JSON.parse(guardado);
      } catch (e) {}
    }
    return null;
  });

  // Usuario activo para autoría de operaciones
  const [usuarioActivo, setUsuarioActivo] = useState(() => {
    return usuarioAutenticado || USUARIOS[0]; // Álvaro (Estratega Integrador) por defecto
  });

  // Sincronizar usuario activo cuando cambia la autenticación
  useEffect(() => {
    if (usuarioAutenticado) {
      setUsuarioActivo(usuarioAutenticado);
      localStorage.setItem('moments_auth_user', JSON.stringify(usuarioAutenticado));
    }
  }, [usuarioAutenticado]);

  // Pestaña activa: POR DEFECTO "semana" (Semana & Acciones) como solicitó el usuario
  const [activeTab, setActiveTab] = useState('semana');

  // Ambiente visual / Fondo del salón
  const [fondoActual, setFondoActual] = useState(() => {
    return localStorage.getItem('moments_fondo') || 'fiesta';
  });

  // Estado de seguridad de Caja
  const [cajaPin, setCajaPin] = useState(() => sessionStorage.getItem('moments_caja_pin') || '');
  const cajaDesbloqueada = Boolean(cajaPin);
  const [pinModalOpen, setPinModalOpen] = useState(false);

  // Datos compartidos desde el servidor
  const [actividadesSemana, setActividadesSemana] = useState(ACTIVIDADES_SEMANA_SEED);
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

  useEffect(() => {
    localStorage.setItem('moments_fondo', fondoActual);
  }, [fondoActual]);

  // Traer datos del servidor
  const cargarDatos = useCallback(async () => {
    try {
      const res = await fetch('/api/data', { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (guardadosPendientes.current === 0) {
        setEventos(data.eventos || []);
        setChecklist(data.checklist || []);
        if (Array.isArray(data.actividades_semana)) {
          setActividadesSemana(data.actividades_semana);
        }
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

  // Carga inicial y sondeo cada 4 segundos
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

  // Guardar un registro individual en el servidor
  const guardarRegistro = async (coleccion, metodo, item, id) => {
    guardadosPendientes.current += 1;
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (coleccion === 'movimientos') headers['x-caja-pin'] = cajaPin;
      const res = await fetch(`/api/${coleccion}/${encodeURIComponent(id ?? item?.id)}`, {
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
      console.error('Error al guardar en servidor:', e);
    } finally {
      guardadosPendientes.current -= 1;
      if (guardadosPendientes.current === 0) cargarDatos();
    }
  };

  // -------------------------------------------------------------------------
  // Handlers para "Semana & Acciones"
  // -------------------------------------------------------------------------
  
  // 1. Confirmar asistencia a reunión
  const handleConfirmarAsistencia = async (actividadId, confirmada = true) => {
    const ahora = new Date();
    const fechaHoraStr = `${ahora.toISOString().slice(0, 10)} ${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;

    // Actualización optimista inmediata en UI
    setActividadesSemana(prev => prev.map(act => {
      if (act.id !== actividadId) return act;
      const participantes = [...(act.participantes || [])];
      const pIdx = participantes.findIndex(p => p.usuarioId === usuarioActivo.id);
      if (pIdx >= 0) {
        participantes[pIdx] = {
          ...participantes[pIdx],
          confirmada,
          fechaConfirmacion: confirmada ? fechaHoraStr : null
        };
      } else {
        participantes.push({
          usuarioId: usuarioActivo.id,
          nombre: usuarioActivo.nombre,
          rol: usuarioActivo.rol,
          confirmada,
          fechaConfirmacion: confirmada ? fechaHoraStr : null
        });
      }
      return { ...act, participantes };
    }));

    try {
      const res = await fetch(`/api/actividades_semana/${encodeURIComponent(actividadId)}/confirmar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: usuarioActivo.id, confirmada })
      });
      if (res.ok) {
        const data = await res.json();
        versionRef.current = data.version;
      }
    } catch (e) {
      console.error('Error al confirmar asistencia:', e);
    }
  };

  // 2. Marcar o desmarcar pago a proveedor (impacta automáticamente en Caja Variable)
  const handleTogglePagoProveedor = async (actividadId, nuevoPagado) => {
    // Actualización optimista de la actividad
    setActividadesSemana(prev => prev.map(act => {
      if (act.id !== actividadId) return act;
      return {
        ...act,
        pagado: nuevoPagado,
        responsablePago: nuevoPagado ? usuarioActivo.nombre : act.responsablePago
      };
    }));

    try {
      const res = await fetch(`/api/actividades_semana/${encodeURIComponent(actividadId)}/pagar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pagado: nuevoPagado,
          responsable: usuarioActivo.nombre
        })
      });

      if (res.ok) {
        const data = await res.json();
        versionRef.current = data.version;
        // Si el backend retornó la lista actualizada de movimientos, sincronizamos caja al instante
        if (Array.isArray(data.movimientos)) {
          setMovimientos(data.movimientos);
        }
      }
    } catch (e) {
      console.error('Error al actualizar pago:', e);
    }
  };

  // 3. Crear nueva actividad o reunión
  const handleCrearActividad = async (nueva) => {
    setActividadesSemana(prev => [nueva, ...prev]);
    await guardarRegistro('actividades_semana', 'PUT', nueva);

    // Si es un pago ya marcado como pagado, impactar en caja
    if (nueva.tipo === 'pago_proveedor' && nueva.pagado) {
      handleTogglePagoProveedor(nueva.id, true);
    }
  };

  // 4. Eliminar actividad
  const handleEliminarActividad = (id) => {
    setActividadesSemana(prev => prev.filter(a => a.id !== id));
    guardarRegistro('actividades_semana', 'DELETE', null, id);
  };

  // -------------------------------------------------------------------------
  // Handlers para Caja
  // -------------------------------------------------------------------------
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
      setActiveTab('semana');
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

  // -------------------------------------------------------------------------
  // Handlers para Calendario
  // -------------------------------------------------------------------------
  const handleAgregarEvento = (nuevo) => {
    setEventos(prev => [...prev, nuevo]);
    guardarRegistro('eventos', 'PUT', nuevo);
  };

  const handleEliminarEvento = (id) => {
    setEventos(prev => prev.filter(e => e.id !== id));
    guardarRegistro('eventos', 'DELETE', null, id);
  };

  // -------------------------------------------------------------------------
  // Handlers para Checklist
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // Login y Logout
  // -------------------------------------------------------------------------
  const handleLogin = (usuario) => {
    setUsuarioAutenticado(usuario);
    setUsuarioActivo(usuario);
    localStorage.setItem('moments_auth_user', JSON.stringify(usuario));
    setActiveTab('semana');
  };

  const handleLogout = () => {
    setUsuarioAutenticado(null);
    localStorage.removeItem('moments_auth_user');
    sessionStorage.removeItem('moments_caja_pin');
    setCajaPin('');
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

  // Si NO hay sesión iniciada, mostrar la pantalla de login por desplegable + password
  if (!usuarioAutenticado) {
    return (
      <LoginModal 
        onLogin={handleLogin}
      />
    );
  }

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
        
        {/* Barra de Navegación Superior con Logo Oficial y Estilo MIFA */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cajaDesbloqueada={cajaDesbloqueada}
          onOpenPinModal={handleOpenPinModal}
          onBloquearCaja={handleBloquearCaja}
          usuarioActivo={usuarioActivo}
          setUsuarioActivo={setUsuarioActivo}
          onLogout={handleLogout}
          fondoActual={fondoActual}
          setFondoActual={setFondoActual}
          conexion={conexion}
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

          {/* 1. Pestaña SEMANA & ACCIONES (Inicial) */}
          {activeTab === 'semana' && (
            <SemanaAccionesView
              actividades={actividadesSemana}
              onConfirmarAsistencia={handleConfirmarAsistencia}
              onTogglePagoProveedor={handleTogglePagoProveedor}
              onCrearActividad={handleCrearActividad}
              onEliminarActividad={handleEliminarActividad}
              usuarioActivo={usuarioActivo}
              onIrACaja={handleOpenPinModal}
              onIrAChecklist={() => setActiveTab('checklist')}
              eventoDelDia={eventoActivo}
            />
          )}

          {/* 2. Pestaña Caja (Ingresos y Gastos) */}
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
                  className="px-6 py-2.5 bg-gradient-to-r from-[#7d1728] to-[#9c2037] hover:from-[#6b1422] hover:to-[#881a2e] text-white text-xs font-black rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  Ingresar PIN de Gerencia
                </button>
              </div>
            )
          )}

          {/* 3. Pestaña Calendario */}
          {activeTab === 'calendario' && (
            <CalendarioView
              eventos={eventos}
              onAgregarEvento={handleAgregarEvento}
              onEliminarEvento={handleEliminarEvento}
              usuarioActivo={usuarioActivo}
            />
          )}

          {/* 4. Pestaña Checklist */}
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

          {/* 5. Pestaña Marketing, Tarifario y Ventas */}
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
                <span>2604-001122 (Ventas)</span>
              </span>
              <span>•</span>
              <span className="text-slate-400">
                Puesta en marcha v2.0
              </span>
            </div>

            <div className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} Moments · Salón de Eventos
            </div>
          </div>
        </footer>

      </div>

      {/* Modal para ingresar el PIN de la Caja */}
      <PinModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSuccess={handlePinSuccess}
      />

    </div>
  );
}
