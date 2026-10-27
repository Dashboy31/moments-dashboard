import React, { useState } from 'react';
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
  Wallet
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
  eventoDelDia
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
        <div className="bg-gradient-to-br from-[#7d1728]/10 via-amber-500/10 to-purple-950/10 bg-white/95 backdrop-blur-xl rounded-2xl border border-amber-300 p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#7d1728]">
              Evento del Sábado
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#7d1728] text-amber-200 flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-black text-slate-900 truncate" title="15 de Federica Morales">
            15 de Federica Morales
          </div>
          <div className="text-xs text-slate-600 font-semibold mt-0.5">
            160 invitados · 20:30 hs
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-300 w-fit">
            <span>👑 Salón + Pista</span>
          </div>
        </div>

      </div>

      {/* =====================================================================
          2. BARRA DE CONTROL DE LA SEMANA Y FILTROS DIDÁCTICOS
         ===================================================================== */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-amber-200/70 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Título de la semana */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7d1728]/10 text-[#7d1728] flex items-center justify-center shrink-0 border border-[#7d1728]/20">
            <Calendar className="w-5 h-5 text-[#7d1728]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">
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
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7d1728] to-[#911f33] hover:from-[#6b1422] hover:to-[#7d1728] text-white font-black text-xs rounded-xl shadow-md shadow-rose-950/20 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
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
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#7d1728]/10 text-[#7d1728] flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5 text-[#7d1728]" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    Nueva Actividad de la Semana
                  </h3>
                  <p className="text-[11px] text-slate-500">
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
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7d1728] to-[#911f33] hover:from-[#6b1422] hover:to-[#7d1728] text-white font-black shadow-md cursor-pointer"
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
