import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  Receipt, 
  CheckSquare, 
  Sparkles, 
  Plus, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  DollarSign, 
  ChevronRight, 
  ArrowRight,
  Filter,
  Check,
  X,
  Trash2,
  AlertTriangle,
  Wallet,
  ShieldAlert,
  Bell,
  HelpCircle,
  Building,
  Hourglass
} from 'lucide-react';
import { USUARIOS } from '../utils/mockData';

export default function SemanaAccionesView({
  actividades = [],
  onConfirmarAsistencia,
  onTogglePagoProveedor,
  onCrearActividad,
  onEliminarActividad,
  usuarioActivo,
  onIrACaja,
  onIrAChecklist,
  eventoDelDia,
  eventos = [],
  movimientos = [],
  configuracion,
  cajaDesbloqueada = false,
  prestamosTramos = []
}) {
  const [filtroTipo, setFiltroTipo] = useState('todas'); // 'todas' | 'reunion' | 'pago_proveedor' | 'tarea_operativa' | 'mis_pendientes'
  const [modalNuevoOpen, setModalNuevoOpen] = useState(false);

  // Formulario nueva actividad
  const [nuevoTipo, setNuevoTipo] = useState('reunion');
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoDia, setNuevoDia] = useState('Lunes');
  const [nuevaFecha, setNuevaFecha] = useState('2026-10-26');
  const [nuevaHora, setNuevaHora] = useState('10:00');
  const [nuevoLugar, setNuevoLugar] = useState('Salón Moments');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [participantesSeleccionados, setParticipantesSeleccionados] = useState([
    usuarioActivo?.id || 'alvaro'
  ]);
  const [nuevoProveedor, setNuevoProveedor] = useState('');
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevoResponsablePago, setNuevoResponsablePago] = useState(usuarioActivo?.nombre || 'Gabriela');
  const [pagoInmediato, setPagoInmediato] = useState(false);

  // Formateador de moneda
  const formatARS = (monto) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(Number(monto) || 0);
  };


  // -------------------------------------------------------------------------
  // Métricas para el Panel "Pendientes" (Punto 9 de la especificación)
  // -------------------------------------------------------------------------
  const esGerencia = Boolean(
    cajaDesbloqueada ||
    usuarioActivo?.id === 'jesica' ||
    usuarioActivo?.id === 'leandro' ||
    String(usuarioActivo?.rol || '').toLowerCase().includes('gerencia') ||
    String(usuarioActivo?.rol || '').toLowerCase().includes('dueño')
  );

  const hoyStr = new Date().toISOString().slice(0, 10);
  const hoyMas30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  // 1. Eventos ya realizados sin gastos cargados
  const eventosSinGastos = useMemo(() => {
    return (eventos || []).filter(e => {
      if (e.tipo === 'mantenimiento') return false;
      if (e.fecha >= hoyStr) return false;
      const tieneGasto = (movimientos || []).some(m => {
        if (m.tipo !== 'egreso') return false;
        if (m.eventoId && String(m.eventoId) === String(e.id)) return true;
        if (e.cliente && e.cliente !== 'A definir' && String(m.concepto || '').toLowerCase().includes(e.cliente.toLowerCase())) return true;
        return false;
      });
      return !tieneGasto;
    });
  }, [eventos, movimientos, hoyStr]);

  // 2. Eventos próximos (30 días) sin seña registrada
  const eventosSinSena = useMemo(() => {
    return (eventos || []).filter(e => {
      if (e.tipo === 'mantenimiento') return false;
      if (e.fecha < hoyStr || e.fecha > hoyMas30) return false;
      const tieneSena = (movimientos || []).some(m => {
        if (m.tipo !== 'ingreso') return false;
        if (m.eventoId && String(m.eventoId) === String(e.id)) return true;
        if (e.cliente && e.cliente !== 'A definir' && String(m.concepto || '').toLowerCase().includes(e.cliente.toLowerCase())) return true;
        return false;
      });
      return !tieneSena;
    });
  }, [eventos, movimientos, hoyStr, hoyMas30]);

  // 3. Fijos vencidos o pendientes del mes con responsable
  const fijosPendientesOVencidos = useMemo(() => {
    const plantilla = configuracion?.plantillaCostosFijos || [
      { subcategoria: 'Alquiler', concepto: 'Alquiler salón e instalaciones', diaVencimiento: 10, responsable: 'Gabriela' },
      { subcategoria: 'Luz', concepto: 'Servicio de Electricidad (Edemsa)', diaVencimiento: 15, responsable: 'Paulina' },
      { subcategoria: 'Gas', concepto: 'Gas Natural / Envasado', diaVencimiento: 18, responsable: 'Paulina' },
      { subcategoria: 'Agua / Municipalidad', concepto: 'Tasas municipales y agua potable', diaVencimiento: 20, responsable: 'Pablo' },
      { subcategoria: 'Internet / Telefonía', concepto: 'Fibra óptica salón y administración', diaVencimiento: 12, responsable: 'Gabriela' },
      { subcategoria: 'Seguro', concepto: 'Póliza integral de comercio y responsabilidad civil', diaVencimiento: 5, responsable: 'Gabriela' },
      { subcategoria: 'Monotributo / Contador', concepto: 'Honorarios contables y monotributo', diaVencimiento: 20, responsable: 'Jesica' },
      { subcategoria: 'Software / Sistemas', concepto: 'Hosting, dominio y licencias', diaVencimiento: 1, responsable: 'Joaquina' }
    ];
    const diaHoy = new Date().getDate();
    const mesActual = hoyStr.slice(0, 7);

    return plantilla.map(f => {
      const pagado = (movimientos || []).some(m => {
        if (!m.fecha || !m.fecha.startsWith(mesActual) || m.tipo !== 'egreso') return false;
        const sub = String(m.subcategoria || '').toLowerCase();
        const conc = String(m.concepto || '').toLowerCase();
        return sub.includes(f.subcategoria.toLowerCase()) || conc.includes(f.subcategoria.toLowerCase());
      });
      const vencido = !pagado && diaHoy > (f.diaVencimiento || 10);
      return {
        ...f,
        pagado,
        vencido,
        estado: pagado ? 'Pagado' : (vencido ? 'Vencido' : 'Pendiente')
      };
    }).filter(f => !f.pagado);
  }, [configuracion, movimientos, hoyStr]);

  // 4. Eventos a_definir para completar
  const eventosADefinir = useMemo(() => {
    return (eventos || []).filter(e => e.tipo === 'a_definir');
  }, [eventos]);

  // 5. Días desde la última carga de cada responsable
  const actividadResponsables = useMemo(() => {
    const lista = ['Gabriela', 'Paulina', 'Pablo', 'Jesica', 'Joaquina'];
    const ahoraMs = Date.now();

    return lista.map(nombre => {
      let ultimaFechaStr = null;
      (movimientos || []).forEach(m => {
        const por = String(m.cargadoPor || m.cargo || '');
        if (por.toLowerCase().includes(nombre.toLowerCase())) {
          if (!ultimaFechaStr || m.fecha > ultimaFechaStr) {
            ultimaFechaStr = m.fecha;
          }
        }
      });

      let dias = null;
      if (ultimaFechaStr) {
        const diffMs = ahoraMs - new Date(ultimaFechaStr + 'T12:00:00').getTime();
        dias = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      }

      return {
        nombre,
        dias,
        alerta: dias === null || dias > 7
      };
    });
  }, [movimientos]);

  // 6. Alerta tramo préstamo del simulador
  const alertaTramoSimulador = useMemo(() => {
    const costoPromedio = Number(configuracion?.costoPromedioEvento) || 10000000;
    const colchon = Number(configuracion?.colchonSeguridad) || 1;
    const totalCajas = (movimientos || []).reduce((acc, m) => {
      const val = Number(m.monto) || 0;
      return m.tipo === 'ingreso' ? acc + val : acc - val;
    }, 0);
    const eventosFuturos = (eventos || []).filter(e => e.fecha >= hoyStr && e.tipo !== 'mantenimiento');
    const eventosCubiertos = costoPromedio > 0 ? Math.floor(Math.max(0, totalCajas) / costoPromedio) : 0;
    const necesitaPedir = eventosCubiertos <= colchon && eventosFuturos.length > 0;
    return {
      necesitaPedir,
      eventosCubiertos,
      colchon,
      totalCajas
    };
  }, [configuracion, movimientos, eventos, hoyStr]);

  // -------------------------------------------------------------------------
  // Métricas para las tarjetas KPI superiores (Estilo MIFA)
  // -------------------------------------------------------------------------
  const totalReuniones = actividades.filter(a => a.tipo === 'reunion');
  const reunionesConPendientes = totalReuniones.filter(r => 
    (r.participantes || []).some(p => !p.confirmada)
  ).length;

  const misReuniones = totalReuniones.filter(r => 
    (r.participantes || []).some(p => p.usuarioId === usuarioActivo?.id)
  );
  const misReunionesPendientes = misReuniones.filter(r => 
    (r.participantes || []).some(p => p.usuarioId === usuarioActivo?.id && !p.confirmada)
  );

  const pagos = actividades.filter(a => a.tipo === 'pago_proveedor');
  const totalPagosMonto = pagos.reduce((acc, p) => acc + (Number(p.monto) || 0), 0);
  const pagosRealizados = pagos.filter(p => p.pagado);
  const montoPagado = pagosRealizados.reduce((acc, p) => acc + (Number(p.monto) || 0), 0);
  const pagosPendientes = pagos.filter(p => !p.pagado);
  const montoPendiente = pagosPendientes.reduce((acc, p) => acc + (Number(p.monto) || 0), 0);

  const tareas = actividades.filter(a => a.tipo === 'tarea_operativa');
  const tareasCompletadas = tareas.filter(t => t.completada).length;

  // Filtrado de actividades
  const actividadesFiltradas = actividades.filter(act => {
    if (filtroTipo === 'todas') return true;
    if (filtroTipo === 'reunion') return act.tipo === 'reunion';
    if (filtroTipo === 'pago_proveedor') return act.tipo === 'pago_proveedor';
    if (filtroTipo === 'tarea_operativa') return act.tipo === 'tarea_operativa';
    if (filtroTipo === 'mis_pendientes') {
      if (act.tipo === 'reunion') {
        return (act.participantes || []).some(p => p.usuarioId === usuarioActivo?.id && !p.confirmada);
      }
      if (act.tipo === 'pago_proveedor') {
        return !act.pagado && (act.responsablePago === usuarioActivo?.nombre || act.creadorId === usuarioActivo?.id);
      }
      return false;
    }
    return true;
  });

  // Agrupación por días de la semana
  const diasOrden = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const actividadesPorDia = diasOrden.map(dia => {
    return {
      dia,
      items: actividadesFiltradas.filter(a => (a.dia || '').toLowerCase() === dia.toLowerCase())
    };
  }).filter(grupo => grupo.items.length > 0);

  // Manejar apertura del modal con valores limpios
  const handleAbrirModal = () => {
    setNuevoTitulo('');
    setNuevaDescripcion('');
    setNuevoMonto('');
    setNuevoProveedor('');
    setParticipantesSeleccionados([usuarioActivo?.id || 'alvaro']);
    setModalNuevoOpen(true);
  };

  const handleToggleParticipante = (userId) => {
    if (participantesSeleccionados.includes(userId)) {
      setParticipantesSeleccionados(prev => prev.filter(id => id !== userId));
    } else {
      setParticipantesSeleccionados(prev => [...prev, userId]);
    }
  };

  const handleGuardarActividad = (e) => {
    e.preventDefault();
    if (!nuevoTitulo.trim()) return;

    const participantesData = nuevoTipo === 'reunion'
      ? participantesSeleccionados.map(userId => {
          const u = USUARIOS.find(usr => usr.id === userId);
          const esCreador = userId === usuarioActivo?.id;
          return {
            usuarioId: userId,
            nombre: u ? u.nombre : userId,
            rol: u ? u.rol : '',
            confirmada: esCreador, // Creador ya confirma
            fechaConfirmacion: esCreador ? new Date().toISOString().slice(0, 16).replace('T', ' ') : null
          };
        })
      : [];

    const nueva = {
      id: `act-${Date.now()}`,
      tipo: nuevoTipo,
      titulo: nuevoTitulo.trim(),
      dia: nuevoDia,
      fecha: nuevaFecha,
      hora: nuevaHora,
      creadorId: usuarioActivo?.id || 'alvaro',
      creadorNombre: usuarioActivo?.nombre || 'Álvaro',
      creadorCargo: usuarioActivo?.rol || 'Estratega Integrador',
      lugar: nuevoLugar.trim(),
      descripcion: nuevaDescripcion.trim(),
      participantes: participantesData,
      proveedor: nuevoTipo === 'pago_proveedor' ? nuevoProveedor.trim() : null,
      monto: nuevoTipo === 'pago_proveedor' ? Number(nuevoMonto) || 0 : null,
      pagado: nuevoTipo === 'pago_proveedor' ? pagoInmediato : false,
      responsablePago: nuevoTipo === 'pago_proveedor' ? nuevoResponsablePago : null,
      movimientoCajaId: null,
      completada: false,
      responsableTarea: nuevoTipo === 'tarea_operativa' ? usuarioActivo?.nombre : null
    };

    onCrearActividad(nueva);
    setModalNuevoOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* =====================================================================
          1. TARJETAS DE MÉTRICAS KPI (ESTILO MIFA DASHBOARD)
         ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        
        {/* KPI 1: Reuniones de la Semana */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-amber-200/60 p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-900">
              Reuniones Semanales
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-tight">
            {totalReuniones.length}
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            {reunionesConPendientes > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {reunionesConPendientes} con confirmación pendiente
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                ✓ Todas confirmadas
              </span>
            )}
          </div>
        </div>

        {/* KPI 2: Mis Convocatorias */}
        <div className={`bg-white/95 backdrop-blur-xl rounded-2xl border p-4 shadow-sm hover:shadow-md transition ${
          misReunionesPendientes.length > 0 
            ? 'border-rose-300 ring-2 ring-rose-200/50 bg-rose-50/20' 
            : 'border-amber-200/60'
        }`}>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-950">
              Mis Convocatorias
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
              misReunionesPendientes.length > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-black text-slate-900 leading-tight">
              {misReuniones.length}
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              asignadas a {usuarioActivo?.nombre || 'vos'}
            </span>
          </div>
          <div className="mt-1">
            {misReunionesPendientes.length > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-900 bg-rose-100 px-2 py-0.5 rounded-lg border border-rose-300 animate-pulse">
                👉 Tenés {misReunionesPendientes.length} por confirmar
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                ✓ Al día (confirmadas)
              </span>
            )}
          </div>
        </div>

        {/* KPI 3: Pagos a Proveedores (Impacto Caja) */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-amber-200/60 p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-950">
              Pagos a Proveedores
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-tight">
            {formatARS(totalPagosMonto)}
          </div>
          <div className="text-[11px] text-slate-600 font-medium mt-1 truncate flex items-center justify-between">
            <span className="text-emerald-700 font-bold">Pagado: {formatARS(montoPagado)}</span>
            <span className="text-amber-700 font-bold">Resta: {formatARS(montoPendiente)}</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400 font-semibold flex items-center gap-1">
            <Wallet className="w-3 h-3 text-emerald-600" />
            <span>Impacta caja automáticamente</span>
          </div>
        </div>

        {/* KPI 4: Tareas Operativas */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-amber-200/60 p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-950">
              Tareas Operativas
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-black text-slate-900 leading-tight">
              {tareas.length}
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              ({tareasCompletadas} completadas)
            </span>
          </div>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
              Puesta a punto evento
            </span>
          </div>
        </div>

        {/* KPI 5: Fiesta del Fin de Semana */}
        <div className="bg-gradient-to-br from-[#2F3A2A]/10 via-[#C6A96A]/10 to-[#5A6B4A]/10 bg-white/95 backdrop-blur-xl rounded-2xl border border-[#C6A96A]/40 p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#2F3A2A] font-['Montserrat']">
              Evento del Sábado
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#2F3A2A] text-[#C6A96A] flex items-center justify-center font-bold shadow-sm border border-[#C6A96A]/30">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-black text-slate-900 truncate font-['Playfair_Display']" title="15 de Federica Morales">
            15 de Federica Morales
          </div>
          <div className="text-xs text-slate-600 font-semibold mt-0.5">
            160 invitados · 20:30 hs
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-[#2F3A2A] bg-[#E8EDE3] px-2 py-0.5 rounded-md border border-[#5A6B4A]/30 w-fit">
            <span>👑 Salón + Pista</span>
          </div>
        </div>

      </div>


      {/* =====================================================================
          PANEL "PENDIENTES" EN EL INICIO (Punto 9 de la especificación)
         ===================================================================== */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-[#C6A96A]/40 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3DCCE] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider font-['Montserrat']">
                Panel de Pendientes y Atención Inmediata
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {esGerencia 
                  ? 'Alertas de cobranzas, costos, fijos por vencer y ritmo de carga de la gerencia'
                  : 'Tus actividades clave de la semana que requieren confirmación o ejecución'}
              </p>
            </div>
          </div>
          {esGerencia && onIrACaja && (
            <button
              onClick={onIrACaja}
              className="text-xs font-bold text-[#5A6B4A] hover:text-[#2F3A2A] flex items-center gap-1 hover:underline"
            >
              <span>Ver en Caja</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ALERTA SIMULADOR: Si el saldo cubre <= colchón de seguridad */}
        {esGerencia && alertaTramoSimulador.necesitaPedir && (
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border-2 border-amber-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-amber-900">
                  Alerta Financiera · Pedir Próximo Tramo de Préstamo
                </div>
                <div className="text-xs text-amber-800 font-medium">
                  El saldo actual ({formatARS(alertaTramoSimulador.totalCajas)}) cubre solo{' '}
                  <strong>{alertaTramoSimulador.eventosCubiertos} evento(s)</strong> (colchón de seguridad:{' '}
                  {alertaTramoSimulador.colchon}). Solicitá el próximo tramo del préstamo familiar.
                </div>
              </div>
            </div>
            {onIrACaja && (
              <button
                onClick={onIrACaja}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition shadow-sm"
              >
                Abrir Simulador
              </button>
            )}
          </div>
        )}

        {/* VISTA SEGÚN ROL: GERENCIA VS EQUIPO */}
        {esGerencia ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            
            {/* 1. Eventos pasados sin gastos */}
            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-rose-900 uppercase text-[10px]">Costos Faltantes</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${eventosSinGastos.length > 0 ? 'bg-rose-200 text-rose-900' : 'bg-slate-200 text-slate-800'}`}>
                    {eventosSinGastos.length} pendientes
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2">
                  Eventos pasados sin ningún gasto registrado en la caja.
                </p>
              </div>
              <div className="space-y-1 mt-1">
                {eventosSinGastos.slice(0, 2).map(e => (
                  <div key={e.id} className="text-[11px] font-semibold text-rose-950 truncate">
                    • {e.titulo || e.cliente} ({e.fecha})
                  </div>
                ))}
                {eventosSinGastos.length === 0 && (
                  <span className="text-[11px] font-bold text-emerald-700">✓ Todos los costos al día</span>
                )}
              </div>
            </div>

            {/* 2. Próximos 30 días sin seña */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-900 uppercase text-[10px]">Señas Pendientes</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${eventosSinSena.length > 0 ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-800'}`}>
                    {eventosSinSena.length} próximos
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2">
                  Eventos de los próximos 30 días sin ingreso de seña registrado.
                </p>
              </div>
              <div className="space-y-1 mt-1">
                {eventosSinSena.slice(0, 2).map(e => (
                  <div key={e.id} className="text-[11px] font-semibold text-amber-950 truncate">
                    • {e.titulo || e.cliente} ({e.fecha})
                  </div>
                ))}
                {eventosSinSena.length === 0 && (
                  <span className="text-[11px] font-bold text-emerald-700">✓ Todas las señas registradas</span>
                )}
              </div>
            </div>

            {/* 3. Costos fijos del mes */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 uppercase text-[10px]">Fijos del Mes</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${fijosPendientesOVencidos.some(f => f.vencido) ? 'bg-rose-200 text-rose-900' : 'bg-slate-200 text-slate-800'}`}>
                    {fijosPendientesOVencidos.length} pendientes
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2">
                  Impuestos y servicios mensuales sin registrar pago este mes.
                </p>
              </div>
              <div className="space-y-1 mt-1">
                {fijosPendientesOVencidos.slice(0, 2).map((f, i) => (
                  <div key={i} className="text-[11px] font-semibold text-slate-700 truncate">
                    • {f.concepto} ({f.responsable}) {f.vencido ? '⚠️' : '⏳'}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Eventos a_definir */}
            <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-cyan-950 uppercase text-[10px]">Por Completar</span>
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-cyan-200 text-cyan-950">
                    {eventosADefinir.length} eventos
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2">
                  Fechas precargadas de la planilla pendientes de tipo y cantidad de personas.
                </p>
              </div>
              <div className="text-[11px] text-cyan-900 font-bold mt-1">
                Revisar en calendario de Noviembre / Diciembre
              </div>
            </div>

          </div>
        ) : (
          /* VISTA PENDIENTES DEL EQUIPO (SIN NÚMEROS ECONÓMICOS) */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">Mis Reuniones Pendientes</span>
              <div className="text-xl font-bold text-[#2F3A2A] mb-1">
                {misReunionesPendientes.length}
              </div>
              <p className="text-[11px] text-slate-500">
                Reuniones de coordinación asignadas que requieren tu confirmación.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">Mis Tareas Operativas</span>
              <div className="text-xl font-bold text-[#2F3A2A] mb-1">
                {tareas.filter(t => !t.completada && (t.responsable === usuarioActivo?.nombre || t.creadorId === usuarioActivo?.id)).length}
              </div>
              <p className="text-[11px] text-slate-500">
                Puesta a punto y logística asignada a tu cargo para esta semana.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">Próximo Evento a Coordinar</span>
              <div className="text-sm font-bold text-[#5A6B4A] mb-1 truncate">
                {eventoDelDia ? eventoDelDia.titulo : 'Sin evento asignado'}
              </div>
              <p className="text-[11px] text-slate-500">
                Consultá el checklist de logística en vivo durante la jornada.
              </p>
            </div>
          </div>
        )}

        {/* 5. Días desde la última carga por responsable (Solo Gerencia) */}
        {esGerencia && (
          <div className="pt-3 border-t border-[#E3DCCE] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-600 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#5A6B4A]" />
              <span>Actividad y días desde última carga:</span>
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {actividadResponsables.map(r => (
                <span 
                  key={r.nombre}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold text-[11px] border ${
                    r.dias === null ? 'bg-slate-100 text-slate-400 border-slate-200' :
                    r.dias <= 2 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                    r.dias <= 7 ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  <span>{r.nombre}:</span>
                  <strong>{r.dias !== null ? `${r.dias}d` : 'Sin cargas'}</strong>
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* =====================================================================
          2. BARRA DE CONTROL DE LA SEMANA Y FILTROS DIDÁCTICOS
         ===================================================================== */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-[#C6A96A]/30 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Título de la semana */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2F3A2A]/10 text-[#2F3A2A] flex items-center justify-center shrink-0 border border-[#C6A96A]/30">
            <Calendar className="w-5 h-5 text-[#2F3A2A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 font-['Playfair_Display']">
                Semana Operativa · 26 Oct al 01 Nov 2026
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                EN CURSO
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Reuniones de coordinación, pagos que impactan en caja y tareas clave del equipo.
            </p>
          </div>
        </div>

        {/* Filtros + Botón Agregar */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          
          {/* Chips de filtro */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setFiltroTipo('todas')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filtroTipo === 'todas' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Todas ({actividades.length})
            </button>
            <button
              onClick={() => setFiltroTipo('reunion')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filtroTipo === 'reunion' ? 'bg-purple-100 text-purple-900 shadow-xs' : 'hover:text-purple-900'
              }`}
            >
              Reuniones ({totalReuniones.length})
            </button>
            <button
              onClick={() => setFiltroTipo('pago_proveedor')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filtroTipo === 'pago_proveedor' ? 'bg-amber-100 text-amber-950 shadow-xs' : 'hover:text-amber-900'
              }`}
            >
              Pagos ({pagos.length})
            </button>
            <button
              onClick={() => setFiltroTipo('mis_pendientes')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filtroTipo === 'mis_pendientes' ? 'bg-rose-100 text-rose-900 shadow-xs' : 'hover:text-rose-900'
              }`}
            >
              ⭐ Mis Pendientes ({misReunionesPendientes.length})
            </button>
          </div>

          {/* Botón "+ Nueva Actividad / Reunión" */}
          <button
            onClick={handleAbrirModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#2F3A2A] hover:bg-[#3D4C37] text-[#F6F3E9] border border-[#C6A96A]/60 hover:border-[#C6A96A] font-bold text-xs rounded-xl shadow-md shadow-[#2F3A2A]/20 transition-all active:scale-95 cursor-pointer shrink-0 font-['Montserrat']"
          >
            <Plus className="w-4 h-4 text-[#C6A96A]" />
            <span>+ Nueva Actividad / Reunión</span>
          </button>

        </div>
      </div>

      {/* =====================================================================
          3. LISTA DÍA POR DÍA DE LA SEMANA (LUNES A DOMINGO)
         ===================================================================== */}
      {actividadesPorDia.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 text-center border border-amber-200/60 max-w-lg mx-auto shadow-sm">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No hay actividades para el filtro seleccionado</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Podés cambiar el filtro a "Todas" o agregar una nueva reunión o pago a proveedores.
          </p>
          <button
            onClick={() => setFiltroTipo('todas')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
          >
            Ver todas las actividades
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {actividadesPorDia.map(({ dia, items }) => (
            <div key={dia} className="space-y-3">
              
              {/* Encabezado del Día */}
              <div className="flex items-center gap-2.5 px-1">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs" />
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  {dia}
                </h3>
                <span className="text-xs font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded-lg border border-slate-200">
                  {items.length} {items.length === 1 ? 'actividad' : 'actividades'}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-300/40 via-slate-200 to-transparent ml-2" />
              </div>

              {/* Grilla de Tarjetas del Día */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {items.map((act) => {
                  const esReunion = act.tipo === 'reunion';
                  const esPago = act.tipo === 'pago_proveedor';
                  const esTarea = act.tipo === 'tarea_operativa';

                  // Estado del usuario activo en caso de ser reunión
                  const miParticipacion = (act.participantes || []).find(p => p.usuarioId === usuarioActivo?.id);
                  const estoyConvocado = Boolean(miParticipacion);
                  const yaConfirme = miParticipacion?.confirmada;

                  return (
                    <div
                      key={act.id}
                      className={`bg-white/95 backdrop-blur-xl rounded-2xl border transition-all p-5 shadow-sm hover:shadow-md flex flex-col justify-between ${
                        estoyConvocado && !yaConfirme
                          ? 'border-rose-400 ring-2 ring-rose-300/60 shadow-rose-100'
                          : esPago && !act.pagado
                          ? 'border-amber-300'
                          : 'border-slate-200/80 hover:border-amber-300'
                      }`}
                    >
                      {/* Parte Superior: Tipo, Horario, Ubicación */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-2">
                            {esReunion && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-900 border border-purple-200">
                                <Users className="w-3 h-3" />
                                Reunión
                              </span>
                            )}
                            {esPago && (
                              <span className={`inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${
                                act.pagado
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-amber-100 text-amber-950 border-amber-300'
                              }`}>
                                <Receipt className="w-3 h-3" />
                                {act.pagado ? '✓ Pago Realizado' : '⏳ Pago Pendiente'}
                              </span>
                            )}
                            {esTarea && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-900 border border-sky-200">
                                <CheckSquare className="w-3 h-3" />
                                Tarea Operativa
                              </span>
                            )}

                            <span className="flex items-center gap-1 text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                              <Clock className="w-3 h-3 text-slate-500" />
                              {act.hora} hs
                            </span>
                          </div>

                          {/* Botón eliminar */}
                          <button
                            onClick={() => onEliminarActividad(act.id)}
                            title="Eliminar actividad"
                            className="text-slate-400 hover:text-rose-600 transition p-1 rounded-lg hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Título */}
                        <h4 className="text-base font-black text-slate-900 leading-snug mb-1">
                          {act.titulo}
                        </h4>

                        {/* Creador / Responsable didáctico */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
                          <span className="font-semibold">
                            Cargado por: <span className="font-bold text-slate-800">{act.creadorNombre}</span>
                            {act.creadorCargo && (
                              <span className="text-slate-500 font-medium ml-1">
                                ({act.creadorCargo})
                              </span>
                            )}
                          </span>
                          {act.lugar && (
                            <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {act.lugar}
                            </span>
                          )}
                        </div>

                        {/* Descripción / Notas */}
                        {act.descripcion && (
                          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3 leading-relaxed">
                            {act.descripcion}
                          </p>
                        )}

                        {/* ----------------------------------------------------
                            DETALLES DE REUNIÓN: CONVOCADOS Y CONFIRMACIONES
                           ---------------------------------------------------- */}
                        {esReunion && (
                          <div className="space-y-2 mt-3 pt-3 border-t border-slate-100">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                                Equipo Convocado ({act.participantes?.length || 0}):
                              </span>
                              <span className="text-[11px] font-semibold text-slate-400">
                                {(act.participantes || []).filter(p => p.confirmada).length} de {act.participantes?.length || 0} confirmaron
                              </span>
                            </div>

                            {/* Lista de Chips con Avatar y Estado */}
                            <div className="flex flex-wrap gap-2">
                              {(act.participantes || []).map((p) => {
                                const u = USUARIOS.find(usr => usr.id === p.usuarioId);
                                const esActivo = p.usuarioId === usuarioActivo?.id;

                                return (
                                  <div
                                    key={p.usuarioId}
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                                      p.confirmada
                                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                        : 'bg-amber-50/80 text-amber-900 border-amber-200'
                                    } ${esActivo ? 'ring-2 ring-purple-300 font-black' : ''}`}
                                  >
                                    <div
                                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
                                      style={{ backgroundColor: u?.avatar_color || '#6366f1' }}
                                    >
                                      {p.nombre.charAt(0)}
                                    </div>
                                    <span>{p.nombre}</span>

                                    {p.confirmada ? (
                                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-700 font-bold ml-1" title={`Confirmada: ${p.fechaConfirmacion || 'Sí'}`}>
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                        <span>Confirmó</span>
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-0.5 text-[10px] text-amber-700 font-bold ml-1">
                                        <Clock className="w-3 h-3 text-amber-600" />
                                        <span>Pendiente</span>
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* ----------------------------------------------------
                            DETALLES DE PAGO A PROVEEDOR
                           ---------------------------------------------------- */}
                        {esPago && (
                          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900/70">
                                Proveedor & Monto a pagar
                              </span>
                              <div className="text-lg font-black text-slate-900">
                                {formatARS(act.monto)}
                              </div>
                              <p className="text-xs font-bold text-slate-700">
                                {act.proveedor || 'Proveedor de evento'}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                Resp. de pago: <span className="font-semibold text-slate-700">{act.responsablePago || act.creadorNombre}</span>
                              </p>
                            </div>

                            {/* Botón de Impacto Automático en Caja */}
                            <div className="flex flex-col items-end gap-1">
                              <button
                                onClick={() => onTogglePagoProveedor(act.id, !act.pagado)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm ${
                                  act.pagado
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                                }`}
                              >
                                {act.pagado ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Pagado (En Caja)</span>
                                  </>
                                ) : (
                                  <>
                                    <Receipt className="w-3.5 h-3.5" />
                                    <span>Marcar como Pagado</span>
                                  </>
                                )}
                              </button>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {act.pagado ? 'Desmarcar para retirar de caja' : 'Crea egreso en Caja Variable'}
                              </span>
                            </div>
                          </div>
                        )}

                      </div>

                      {/* ------------------------------------------------------
                          BANNER DE ACCIÓN DESTACADA PARA EL USUARIO ACTIVO
                         ------------------------------------------------------ */}
                      {esReunion && estoyConvocado && (
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          {!yaConfirme ? (
                            <div className="p-3 bg-gradient-to-r from-rose-50 to-amber-50 rounded-xl border border-rose-300 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                              <div className="text-xs">
                                <span className="font-black text-rose-900 flex items-center gap-1.5">
                                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                  ¡{usuarioActivo?.nombre}, confirmá tu asistencia!
                                </span>
                                <p className="text-[11px] text-slate-600">
                                  Para que el resto del equipo sepa que lo viste y vas a participar.
                                </p>
                              </div>
                              <button
                                onClick={() => onConfirmarAsistencia(act.id, true)}
                                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
                              >
                                <Check className="w-4 h-4" />
                                <span>Confirmar Asistencia</span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                              <span className="flex items-center gap-1.5 font-bold">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                Asistencia confirmada por vos ({miParticipacion.fechaConfirmacion || 'OK'})
                              </span>
                              <button
                                onClick={() => onConfirmarAsistencia(act.id, false)}
                                className="text-[11px] text-slate-400 hover:text-slate-600 underline font-semibold"
                              >
                                Cambiar
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* =====================================================================
          4. MODAL: NUEVA ACTIVIDAD / REUNIÓN / PAGO A PROVEEDOR
         ===================================================================== */}
      {modalNuevoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-300 p-6 animate-in fade-in zoom-in-95 duration-200 text-slate-800 my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E3DCCE] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2F3A2A] text-[#C6A96A] border border-[#C6A96A]/40 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5 text-[#C6A96A]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#2F3A2A] font-serif">
                    Nueva Actividad de la Semana
                  </h3>
                  <p className="text-[11px] text-slate-500 font-['Montserrat']">
                    Agendá reuniones con el equipo o pagos a proveedores.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalNuevoOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardarActividad} className="space-y-4 text-xs">
              
              {/* Selector de Tipo */}
              <div>
                <label className="block font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Tipo de Actividad
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNuevoTipo('reunion')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                      nuevoTipo === 'reunion'
                        ? 'bg-purple-100 text-purple-900 border-purple-400 ring-2 ring-purple-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-4 h-4 text-purple-700" />
                    <span>🤝 Reunión</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNuevoTipo('pago_proveedor')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                      nuevoTipo === 'pago_proveedor'
                        ? 'bg-amber-100 text-amber-950 border-amber-400 ring-2 ring-amber-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Receipt className="w-4 h-4 text-amber-700" />
                    <span>💳 Pago Proveedor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNuevoTipo('tarea_operativa')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                      nuevoTipo === 'tarea_operativa'
                        ? 'bg-sky-100 text-sky-900 border-sky-400 ring-2 ring-sky-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4 text-sky-700" />
                    <span>📋 Tarea</span>
                  </button>
                </div>
              </div>

              {/* Título */}
              <div>
                <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                  Título de la actividad *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    nuevoTipo === 'reunion'
                      ? 'Ej: Reunión lunes con marketing y ventas'
                      : nuevoTipo === 'pago_proveedor'
                      ? 'Ej: Pago mozos y sonido fiesta sábado'
                      : 'Ej: Recepción de bebidas y hielo'
                  }
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl font-bold text-slate-900 focus:outline-none"
                />
              </div>

              {/* Día, Fecha y Horario */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                    Día
                  </label>
                  <select
                    value={nuevoDia}
                    onChange={(e) => setNuevoDia(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    {diasOrden.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={nuevaFecha}
                    onChange={(e) => setNuevaFecha(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={nuevaHora}
                    onChange={(e) => setNuevaHora(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Ubicación / Sala */}
              <div>
                <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                  Lugar / Sala
                </label>
                <input
                  type="text"
                  placeholder="Ej: Salón Principal, Oficina o Llamada Virtual"
                  value={nuevoLugar}
                  onChange={(e) => setNuevoLugar(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none"
                />
              </div>

              {/* Campos específicos si es REUNIÓN: Convocados */}
              {nuevoTipo === 'reunion' && (
                <div>
                  <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                    Convocados del Equipo (deben confirmar asistencia):
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl max-h-40 overflow-y-auto">
                    {USUARIOS.map(u => {
                      const checked = participantesSeleccionados.includes(u.id);
                      return (
                        <label
                          key={u.id}
                          className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition select-none ${
                            checked ? 'bg-purple-100/70 text-purple-950 font-bold' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleParticipante(u.id)}
                            className="w-3.5 h-3.5 text-purple-600 rounded border-slate-300"
                          />
                          <span className="truncate">{u.nombre} ({u.badge})</span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    * Cada persona convocada verá un botón destacado para confirmar su asistencia.
                  </p>
                </div>
              )}

              {/* Campos específicos si es PAGO A PROVEEDOR */}
              {nuevoTipo === 'pago_proveedor' && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-black text-amber-950 uppercase tracking-wider mb-1">
                        Proveedor
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: DJ Cuyo Pro / Carnicería"
                        value={nuevoProveedor}
                        onChange={(e) => setNuevoProveedor(e.target.value)}
                        className="w-full p-2 bg-white border border-amber-300 rounded-xl font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-black text-amber-950 uppercase tracking-wider mb-1">
                        Monto ($ ARS)
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="Ej: 320000"
                        value={nuevoMonto}
                        onChange={(e) => setNuevoMonto(e.target.value)}
                        className="w-full p-2 bg-white border border-amber-300 rounded-xl font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-black text-amber-950 uppercase tracking-wider mb-1">
                      Responsable de Pago
                    </label>
                    <select
                      value={nuevoResponsablePago}
                      onChange={(e) => setNuevoResponsablePago(e.target.value)}
                      className="w-full p-2 bg-white border border-amber-300 rounded-xl font-bold text-slate-900 focus:outline-none"
                    >
                      {USUARIOS.map(u => (
                        <option key={u.id} value={u.nombre}>{u.nombre} ({u.rol})</option>
                      ))}
                    </select>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={pagoInmediato}
                      onChange={(e) => setPagoInmediato(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-amber-300"
                    />
                    <span className="text-xs font-black text-amber-950">
                      Ya fue pagado hoy (crear egreso en Caja Variable ahora mismo)
                    </span>
                  </label>
                </div>
              )}

              {/* Descripción */}
              <div>
                <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                  Descripción / Temario (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles adicionales o puntos a tratar..."
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalNuevoOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2F3A2A] hover:bg-[#3D4C37] text-[#F6F3E9] border border-[#C6A96A]/60 hover:border-[#C6A96A] font-bold shadow-md cursor-pointer transition-all font-['Montserrat']"
                >
                  Guardar Actividad
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
