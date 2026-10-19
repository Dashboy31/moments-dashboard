import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  List, 
  Plus, 
  Sparkles, 
  HeartHandshake, 
  GraduationCap, 
  PartyPopper, 
  Wrench, 
  Clock, 
  Users, 
  User, 
  ChevronLeft, 
  ChevronRight,
  X,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { USUARIOS } from '../utils/mockData';

export default function CalendarioView({ 
  eventos, 
  onAgregarEvento, 
  onEliminarEvento, 
  usuarioActivo 
}) {
  const [vistaModo, setVistaModo] = useState('mes'); // 'mes' o 'lista'
  const [filtroCategoria, setFiltroCategoria] = useState('todos'); // 'todos', 'eventos', 'mantenimiento'
  const [modalAbierto, setModalAbierto] = useState(false);

  // Navegación mensual para la vista almanaque (por defecto Octubre 2026)
  const [mesActual, setMesActual] = useState(new Date(2026, 9, 1)); // Octubre 2026

  // Formulario nuevo evento
  const [formTipo, setFormTipo] = useState('15_anos');
  const [formTitulo, setFormTitulo] = useState('');
  const [formFecha, setFormFecha] = useState('2026-10-25');
  const [formHoraInicio, setFormHoraInicio] = useState('21:00');
  const [formHoraFin, setFormHoraFin] = useState('05:30');
  const [formCliente, setFormCliente] = useState('');
  const [formInvitadosCena, setFormInvitadosCena] = useState('90');
  const [formInvitadosBrindis, setFormInvitadosBrindis] = useState('30');
  const [formResponsable, setFormResponsable] = useState(usuarioActivo.nombre);
  const [formEstado, setFormEstado] = useState('Confirmado');
  const [formNotas, setFormNotas] = useState('');

  // Iconos y colores por tipo de evento
  const getBadgeInfo = (tipo) => {
    switch (tipo) {
      case '15_anos':
        return {
          label: '15 Años',
          icon: Sparkles,
          badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
          dotColor: 'bg-pink-500',
          borderColor: 'border-l-pink-500'
        };
      case 'casamiento':
        return {
          label: 'Casamiento',
          icon: HeartHandshake,
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          dotColor: 'bg-amber-500',
          borderColor: 'border-l-amber-500'
        };
      case 'egresados':
        return {
          label: 'Egresados',
          icon: GraduationCap,
          badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          dotColor: 'bg-indigo-500',
          borderColor: 'border-l-indigo-500'
        };
      case 'aniversario':
        return {
          label: 'Aniversario / Social',
          icon: PartyPopper,
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dotColor: 'bg-emerald-500',
          borderColor: 'border-l-emerald-500'
        };
      case 'mantenimiento':
        return {
          label: 'Mantenimiento / Operativo',
          icon: Wrench,
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
          dotColor: 'bg-slate-500',
          borderColor: 'border-l-slate-600'
        };
      default:
        return {
          label: 'Otro',
          icon: CalendarIcon,
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
          dotColor: 'bg-slate-400',
          borderColor: 'border-l-slate-400'
        };
    }
  };

  // Filtrado de eventos
  const eventosFiltrados = useMemo(() => {
    return eventos.filter(ev => {
      if (filtroCategoria === 'eventos' && ev.tipo === 'mantenimiento') return false;
      if (filtroCategoria === 'mantenimiento' && ev.tipo !== 'mantenimiento') return false;
      return true;
    }).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }, [eventos, filtroCategoria]);

  // Generación de días para la vista calendario
  const diasCalendario = useMemo(() => {
    const year = mesActual.getFullYear();
    const month = mesActual.getMonth();

    const primerDiaMes = new Date(year, month, 1);
    const ultimoDiaMes = new Date(year, month + 1, 0);

    // Ajuste lunes = 0 (0 domingo -> 6, 1 lunes -> 0, etc.)
    let primerDiaSemana = primerDiaMes.getDay() - 1;
    if (primerDiaSemana === -1) primerDiaSemana = 6;

    const dias = [];

    // Días mes anterior
    const diasMesAnterior = new Date(year, month, 0).getDate();
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      dias.push({
        numero: diasMesAnterior - i,
        esMesActual: false,
        fechaStr: `${year}-${String(month).padStart(2, '0')}-${String(diasMesAnterior - i).padStart(2, '0')}`
      });
    }

    // Días mes actual
    for (let i = 1; i <= ultimoDiaMes.getDate(); i++) {
      dias.push({
        numero: i,
        esMesActual: true,
        fechaStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }

    // Completar días mes siguiente hasta múltiplo de 7
    const restantes = (7 - (dias.length % 7)) % 7;
    for (let i = 1; i <= restantes; i++) {
      dias.push({
        numero: i,
        esMesActual: false,
        fechaStr: `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }

    return dias;
  }, [mesActual]);

  const nombreMes = mesActual.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  const handleMesAnterior = () => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1));
  };

  const handleMesSiguiente = () => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formTitulo || !formFecha) return;

    const esMantenimiento = formTipo === 'mantenimiento';

    const nuevo = {
      id: 'ev-' + Date.now(),
      titulo: formTitulo,
      tipo: formTipo,
      fecha: formFecha,
      horaInicio: formHoraInicio,
      horaFin: formHoraFin,
      cliente: formCliente || (esMantenimiento ? 'Operativa Interna' : 'Cliente Particular'),
      invitadosCena: esMantenimiento ? 0 : Number(formInvitadosCena) || 0,
      invitadosBrindis: esMantenimiento ? 0 : Number(formInvitadosBrindis) || 0,
      responsable: formResponsable,
      estado: formEstado,
      notas: formNotas
    };

    onAgregarEvento(nuevo);
    setModalAbierto(false);
    // Limpiar formulario
    setFormTitulo('');
    setFormCliente('');
    setFormNotas('');
  };

  return (
    <div className="space-y-6">
      
      {/* Encabezado y Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Calendario del Salón
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Fiestas y Operaciones
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Vista unificada de fiestas, reservas comerciales y cronograma de mantenimiento (jardinero, proveedores).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Alternar Vista: Calendario vs Lista */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setVistaModo('mes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                vistaModo === 'mes' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Mes</span>
            </button>
            <button
              onClick={() => setVistaModo('lista')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                vistaModo === 'lista' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Agenda</span>
            </button>
          </div>

          {/* Botón Nuevo Evento */}
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-black rounded-2xl bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-900/10 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Cargar Evento / Mantenimiento</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros y Navegación de Mes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl shadow-soft border border-moments-border">
        
        {/* Filtros de Categoría */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFiltroCategoria('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filtroCategoria === 'todos' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos los Eventos
          </button>
          <button
            onClick={() => setFiltroCategoria('eventos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filtroCategoria === 'eventos' ? 'bg-pink-600 text-white' : 'bg-pink-50 text-pink-800 hover:bg-pink-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Solo Fiestas (15, Bodas, Egresados)</span>
          </button>
          <button
            onClick={() => setFiltroCategoria('mantenimiento')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filtroCategoria === 'mantenimiento' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Solo Mantenimiento / Jardinero</span>
          </button>
        </div>

        {/* Navegador de Mes (en vista almanaque) */}
        {vistaModo === 'mes' && (
          <div className="flex items-center gap-2 self-center sm:self-auto">
            <button
              onClick={handleMesAnterior}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-black text-slate-800 capitalize min-w-[130px] text-center">
              {nombreMes}
            </span>
            <button
              onClick={handleMesSiguiente}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* VISTA 1: CALENDARIO MENSUAL (ALMANAQUE) */}
      {vistaModo === 'mes' && (
        <div className="bg-white rounded-3xl shadow-soft border border-moments-border overflow-hidden p-4 sm:p-5">
          
          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 text-center font-black text-[11px] uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-100">
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div className="text-amber-800">Sáb</div>
            <div className="text-amber-800">Dom</div>
          </div>

          {/* Celdas de días */}
          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {diasCalendario.map((dia, idx) => {
              // Buscar eventos que caigan en este día
              const eventosDia = eventosFiltrados.filter(e => e.fecha === dia.fechaStr);
              const esHoy = dia.fechaStr === '2026-10-17'; // Simulación de hoy

              return (
                <div
                  key={idx}
                  className={`min-h-[95px] sm:min-h-[110px] p-1.5 sm:p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                    dia.esMesActual ? 'bg-slate-50/50 border-slate-200/80 hover:bg-amber-50/20' : 'bg-slate-100/40 border-transparent opacity-40'
                  } ${esHoy ? 'ring-2 ring-amber-500 bg-amber-50/40' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black px-1.5 py-0.5 rounded-lg ${
                      esHoy ? 'bg-amber-600 text-white' : 'text-slate-700'
                    }`}>
                      {dia.numero}
                    </span>
                    {esHoy && (
                      <span className="text-[9px] font-bold uppercase text-amber-700 hidden sm:inline">Hoy</span>
                    )}
                  </div>

                  {/* Lista de eventos del día */}
                  <div className="space-y-1 mt-1 flex-1 overflow-y-auto no-scrollbar">
                    {eventosDia.map(ev => {
                      const badge = getBadgeInfo(ev.tipo);
                      const Icon = badge.icon;

                      return (
                        <div
                          key={ev.id}
                          title={`${ev.titulo} (${ev.horaInicio} hs) - ${ev.cliente}`}
                          className={`text-[10px] p-1 rounded-lg border leading-tight flex items-center gap-1 font-semibold truncate ${badge.badgeColor}`}
                        >
                          <Icon className="w-3 h-3 shrink-0" />
                          <span className="truncate">{ev.titulo}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leyenda de colores */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-5 pt-4 border-t border-slate-100 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
              <span>15 Años</span>
            </span>
            <span className="flex items-center gap-1.5 font-bold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Casamientos</span>
            </span>
            <span className="flex items-center gap-1.5 font-bold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>Egresados</span>
            </span>
            <span className="flex items-center gap-1.5 font-bold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Aniversarios</span>
            </span>
            <span className="flex items-center gap-1.5 font-bold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              <span>Mantenimiento / Jardinero</span>
            </span>
          </div>

        </div>
      )}

      {/* VISTA 2: LISTA / AGENDA CRONOLÓGICA */}
      {vistaModo === 'lista' && (
        <div className="space-y-3">
          {eventosFiltrados.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 font-medium border border-moments-border">
              No hay eventos ni actividades programadas con este filtro.
            </div>
          ) : (
            eventosFiltrados.map((ev) => {
              const badge = getBadgeInfo(ev.tipo);
              const Icon = badge.icon;
              const esMantenimiento = ev.tipo === 'mantenimiento';

              return (
                <div
                  key={ev.id}
                  className={`bg-white rounded-3xl p-4 sm:p-5 shadow-soft border border-moments-border border-l-8 ${badge.borderColor} flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-card transition-all`}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${badge.badgeColor}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{badge.label}</span>
                      </span>

                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${
                        ev.estado === 'Confirmado' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}>
                        {ev.estado}
                      </span>

                      {ev.esEventoDelDia && (
                        <span className="bg-rose-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">
                          Evento de Hoy
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      {ev.titulo}
                    </h3>
                    
                    <p className="text-xs text-slate-500 mt-0.5">
                      Cliente / Detalle: <strong className="text-slate-700">{ev.cliente}</strong>
                    </p>

                    {/* Datos de Invitados y Horarios */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2.5">
                      <span className="flex items-center gap-1 font-semibold">
                        <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
                        <span>{ev.fecha}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{ev.horaInicio} a {ev.horaFin} hs</span>
                      </span>

                      {!esMantenimiento && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-semibold text-slate-800">
                            <Users className="w-3.5 h-3.5 text-amber-600" />
                            <span>{ev.invitadosCena} cena + {ev.invitadosBrindis} brindis ({ev.invitadosCena + ev.invitadosBrindis} personas)</span>
                          </span>
                        </>
                      )}

                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Responsable: <strong className="text-slate-800">{ev.responsable}</strong></span>
                      </span>
                    </div>

                    {ev.notas && (
                      <p className="text-xs text-slate-500 italic mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        "{ev.notas}"
                      </p>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar evento "${ev.titulo}"?`)) {
                          onEliminarEvento(ev.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      title="Eliminar evento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal para Cargar Nuevo Evento o Mantenimiento */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-modal max-w-lg w-full p-6 border border-moments-border max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                <span>Nuevo Evento o Actividad</span>
              </h3>
              <button 
                onClick={() => setModalAbierto(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Tipo de Evento */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tipo de Actividad / Evento *</label>
                <select
                  value={formTipo}
                  onChange={(e) => setFormTipo(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
                >
                  <option value="15_anos">🎉 Cumpleaños de 15</option>
                  <option value="casamiento">💍 Casamiento / Boda</option>
                  <option value="egresados">🎓 Fiesta de Egresados</option>
                  <option value="aniversario">🥂 Aniversario / Cumpleaños Familiar</option>
                  <option value="mantenimiento">🌿 Operativo / Mantenimiento / Jardinero</option>
                </select>
              </div>

              {/* Título y Cliente */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Título del Evento o Tarea *</label>
                <input
                  type="text"
                  required
                  placeholder={formTipo === 'mantenimiento' ? 'Ej: Poda de parque y fertilización con Don Carlos' : 'Ej: 15 de Camila / Casamiento Pérez'}
                  value={formTitulo}
                  onChange={(e) => setFormTitulo(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Cliente / Familia / Proveedor</label>
                <input
                  type="text"
                  placeholder="Ej: Familia Rossi / Fumigaciones Cuyo"
                  value={formCliente}
                  onChange={(e) => setFormCliente(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Fecha y Horarios */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={formFecha}
                    onChange={(e) => setFormFecha(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Inicio</label>
                  <input
                    type="time"
                    value={formHoraInicio}
                    onChange={(e) => setFormHoraInicio(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fin</label>
                  <input
                    type="time"
                    value={formHoraFin}
                    onChange={(e) => setFormHoraFin(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Cantidad de Invitados (si no es mantenimiento) */}
              {formTipo !== 'mantenimiento' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/50 rounded-2xl border border-amber-200/60">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Invitados Cena</label>
                    <input
                      type="number"
                      min="0"
                      value={formInvitadosCena}
                      onChange={(e) => setFormInvitadosCena(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-black"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Invitados Brindis</label>
                    <input
                      type="number"
                      min="0"
                      value={formInvitadosBrindis}
                      onChange={(e) => setFormInvitadosBrindis(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-black"
                    />
                  </div>
                </div>
              )}

              {/* Responsable y Estado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Jefe / Responsable</label>
                  <select
                    value={formResponsable}
                    onChange={(e) => setFormResponsable(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
                  >
                    {USUARIOS.map(u => (
                      <option key={u.id} value={u.nombre}>{u.nombre} ({u.badge})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Estado de la Reserva</label>
                  <select
                    value={formEstado}
                    onChange={(e) => setFormEstado(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="Confirmado">Confirmado (Señado)</option>
                    <option value="Tentativo">Tentativo (En reserva)</option>
                  </select>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Notas u Observaciones Operativas</label>
                <textarea
                  rows="2"
                  placeholder="Detalles sobre vajilla, horarios de ingreso, proveedores involucrados..."
                  value={formNotas}
                  onChange={(e) => setFormNotas(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md transition-all active:scale-95"
                >
                  Guardar en Calendario
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
