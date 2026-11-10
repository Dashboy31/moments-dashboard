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
  AlertCircle,
  Edit2,
  DollarSign,
  Sun,
  Home,
  HelpCircle,
  TrendingUp,
  Tag,
  Save,
  ShieldCheck,
  Info
} from 'lucide-react';
import { USUARIOS, formatARS } from '../utils/mockData';

export default function CalendarioView({ 
  eventos = [], 
  onAgregarEvento, 
  onEditarEvento,
  onEliminarEvento, 
  usuarioActivo,
  cajaDesbloqueada = false,
  movimientos = [],
  eventosFinanzas = [],
  onGuardarFinanzasEvento,
  configuracion
}) {
  const [vistaModo, setVistaModo] = useState('mes'); // 'mes' o 'lista'
  const [filtroCategoria, setFiltroCategoria] = useState('todos'); // 'todos', 'eventos', 'mantenimiento'
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventoEditandoId, setEventoEditandoId] = useState(null);

  // Ficha económica del evento
  const [eventoFicha, setEventoFicha] = useState(null);
  const [ingresoPactadoInput, setIngresoPactadoInput] = useState('');
  const [notasFinancierasInput, setNotasFinancierasInput] = useState('');
  const [guardandoFinanzas, setGuardandoFinanzas] = useState(false);

  // Navegación mensual para la vista almanaque: ARRANCA EN EL MES ACTUAL (no octubre 2026 fijo)
  const [mesActual, setMesActual] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Parámetros de configuración por defecto
  const cfg = configuracion || {
    eventoMinimo: 4000000,
    eventoBasePersonas: 85,
    eventoBaseCosto: 7000000,
    tarifaAdultoVigente: 127000,
    margenVerdeMin: 20,
    margenAmarilloMin: 0
  };

  // Formulario evento
  const [formTipo, setFormTipo] = useState('15_anos');
  const [formTitulo, setFormTitulo] = useState('');
  const [formFecha, setFormFecha] = useState(new Date().toISOString().slice(0, 10));
  const [formHoraInicio, setFormHoraInicio] = useState('21:00');
  const [formHoraFin, setFormHoraFin] = useState('05:30');
  const [formCliente, setFormCliente] = useState('');
  const [formInvitadosCena, setFormInvitadosCena] = useState('90');
  const [formInvitadosBrindis, setFormInvitadosBrindis] = useState('30');
  const [formResponsable, setFormResponsable] = useState(usuarioActivo?.nombre || 'Jesica');
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
          label: 'Cumple de décadas / Aniversario',
          icon: PartyPopper,
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dotColor: 'bg-emerald-500',
          borderColor: 'border-l-emerald-500'
        };
      case 'tardeo':
        return {
          label: 'Tardeo',
          icon: Sun,
          badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
          dotColor: 'bg-orange-500',
          borderColor: 'border-l-orange-500'
        };
      case 'prestamo_salon':
        return {
          label: 'Préstamo del salón',
          icon: Home,
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
          dotColor: 'bg-purple-500',
          borderColor: 'border-l-purple-500'
        };
      case 'mantenimiento':
        return {
          label: 'Mantenimiento / Operativo',
          icon: Wrench,
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
          dotColor: 'bg-slate-500',
          borderColor: 'border-l-slate-600'
        };
      case 'a_definir':
        return {
          label: 'A definir',
          icon: HelpCircle,
          badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
          dotColor: 'bg-cyan-500',
          borderColor: 'border-l-cyan-500'
        };
      default:
        return {
          label: 'Otro',
          icon: CalendarIcon,
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
          dotColor: 'bg-blue-500',
          borderColor: 'border-l-blue-500'
        };
    }
  };

  // Filtrado de eventos
  const eventosFiltrados = useMemo(() => {
    return (eventos || []).filter(ev => {
      if (filtroCategoria === 'eventos' && ev.tipo === 'mantenimiento') return false;
      if (filtroCategoria === 'mantenimiento' && ev.tipo !== 'mantenimiento') return false;
      return true;
    }).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }, [eventos, filtroCategoria]);

  // Eventos del mes visible para el resumen superior
  const mesAnioStr = useMemo(() => {
    const y = mesActual.getFullYear();
    const m = String(mesActual.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }, [mesActual]);

  const resumenMes = useMemo(() => {
    const evMes = (eventos || []).filter(ev => ev.fecha && ev.fecha.startsWith(mesAnioStr));
    const totalEventos = evMes.filter(ev => ev.tipo !== 'mantenimiento').length;
    const totalMantenimiento = evMes.filter(ev => ev.tipo === 'mantenimiento').length;
    const totalPersonas = evMes.reduce((acc, ev) => {
      const cena = Number(ev.invitadosCena) || 0;
      const brindis = Number(ev.invitadosBrindis) || 0;
      return acc + (cena + brindis);
    }, 0);

    // Conteo por tipo
    const conteoTipos = {};
    evMes.forEach(ev => {
      const info = getBadgeInfo(ev.tipo);
      conteoTipos[info.label] = (conteoTipos[info.label] || 0) + 1;
    });

    const isNov2026 = mesAnioStr === '2026-11';
    const isDic2026 = mesAnioStr === '2026-12';

    return {
      totalEventos,
      totalMantenimiento,
      totalPersonas,
      conteoTipos,
      isNov2026,
      isDic2026
    };
  }, [eventos, mesAnioStr]);

  // Generación de días para la vista calendario
  const diasCalendario = useMemo(() => {
    const year = mesActual.getFullYear();
    const month = mesActual.getMonth();

    const primerDiaMes = new Date(year, month, 1);
    const ultimoDiaMes = new Date(year, month + 1, 0);

    const diaSemanaInicio = (primerDiaMes.getDay() + 6) % 7;
    const totalDiasMes = ultimoDiaMes.getDate();

    const dias = [];
    const mesAnteriorUltimoDia = new Date(year, month, 0).getDate();
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
      dias.push({
        numero: mesAnteriorUltimoDia - i,
        fechaStr: null,
        esDelMes: false
      });
    }

    for (let i = 1; i <= totalDiasMes; i++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(i).padStart(2, '0');
      dias.push({
        numero: i,
        fechaStr: `${year}-${mStr}-${dStr}`,
        esDelMes: true
      });
    }

    const celdasRestantes = 42 - dias.length;
    for (let i = 1; i <= celdasRestantes; i++) {
      dias.push({
        numero: i,
        fechaStr: null,
        esDelMes: false
      });
    }

    return dias;
  }, [mesActual]);

  const handleMesAnterior = () => {
    setMesActual(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleMesSiguiente = () => {
    setMesActual(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const nombreMes = mesActual.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  // Abrir modal de creación
  const handleAbrirCrear = (fechaSugerida = null) => {
    setModoEdicion(false);
    setEventoEditandoId(null);
    setFormTipo('15_anos');
    setFormTitulo('');
    setFormFecha(fechaSugerida || new Date().toISOString().slice(0, 10));
    setFormHoraInicio('21:00');
    setFormHoraFin('05:30');
    setFormCliente('');
    setFormInvitadosCena('90');
    setFormInvitadosBrindis('30');
    setFormResponsable(usuarioActivo?.nombre || 'Jesica');
    setFormEstado('Confirmado');
    setFormNotas('');
    setModalAbierto(true);
  };

  // Abrir modal de edición
  const handleAbrirEditar = (ev) => {
    setModoEdicion(true);
    setEventoEditandoId(ev.id);
    setFormTipo(ev.tipo || '15_anos');
    setFormTitulo(ev.titulo || '');
    setFormFecha(ev.fecha || new Date().toISOString().slice(0, 10));
    setFormHoraInicio(ev.horaInicio || '21:00');
    setFormHoraFin(ev.horaFin || '05:30');
    setFormCliente(ev.cliente || '');
    setFormInvitadosCena(String(ev.invitadosCena ?? 0));
    setFormInvitadosBrindis(String(ev.invitadosBrindis ?? 0));
    setFormResponsable(ev.responsable || (usuarioActivo?.nombre || 'Jesica'));
    setFormEstado(ev.estado || 'Confirmado');
    setFormNotas(ev.notas || '');
    setModalAbierto(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formTitulo.trim()) return;

    const eventoData = {
      tipo: formTipo,
      titulo: formTitulo.trim(),
      fecha: formFecha,
      horaInicio: formHoraInicio,
      horaFin: formHoraFin,
      cliente: formCliente.trim() || 'A definir',
      invitadosCena: formTipo === 'mantenimiento' ? 0 : Number(formInvitadosCena) || 0,
      invitadosBrindis: formTipo === 'mantenimiento' ? 0 : Number(formInvitadosBrindis) || 0,
      responsable: formResponsable,
      estado: formEstado,
      notas: formNotas.trim()
    };

    if (modoEdicion && eventoEditandoId) {
      if (onEditarEvento) {
        onEditarEvento({ ...eventoData, id: eventoEditandoId });
      }
    } else {
      const nuevoEvento = {
        ...eventoData,
        id: 'ev-custom-' + Date.now()
      };
      onAgregarEvento(nuevoEvento);
    }

    setModalAbierto(false);
  };

  // ---------------------------------------------------------------------------
  // Ficha Económica del Evento (Solo Gerencia con Caja Desbloqueada)
  // ---------------------------------------------------------------------------
  const handleAbrirFicha = (ev) => {
    setEventoFicha(ev);
    const fin = (eventosFinanzas || []).find(f => f.eventoId === ev.id);
    const personasCena = Number(ev.invitadosCena) || 0;
    const personasBase = personasCena > 0 ? personasCena : 85;
    const pactadoDefault = fin?.ingresoPactado ?? (personasBase * (cfg.tarifaAdultoVigente || 127000));
    
    setIngresoPactadoInput(String(pactadoDefault));
    setNotasFinancierasInput(fin?.notasFinancieras || '');
  };

  const calculosFicha = useMemo(() => {
    if (!eventoFicha) return null;
    const ev = eventoFicha;
    const fin = (eventosFinanzas || []).find(f => f.eventoId === ev.id);

    const totalPersonas = (Number(ev.invitadosCena) || 0) + (Number(ev.invitadosBrindis) || 0);
    const personasBase = totalPersonas > 0 ? totalPersonas : (Number(ev.invitadosCena) || 85);
    const ingresoPactado = Number(ingresoPactadoInput) || (personasBase * (cfg.tarifaAdultoVigente || 127000));

    // Movimientos vinculados
    const movsEvento = (movimientos || []).filter(m => {
      if (m.eventoId && String(m.eventoId) === String(ev.id)) return true;
      if (ev.cliente && ev.cliente !== 'A definir' && String(m.concepto || '').toLowerCase().includes(ev.cliente.toLowerCase())) return true;
      return false;
    });

    const ingresosEvento = movsEvento.filter(m => m.tipo === 'ingreso');
    const gastosEvento = movsEvento.filter(m => m.tipo === 'egreso');

    const senaCobrada = ingresosEvento.reduce((acc, m) => acc + (Number(m.monto) || 0), 0);
    const saldoPendiente = Math.max(0, ingresoPactado - senaCobrada);

    // Costo de referencia: hasta 85 personas, max(minimo, personas * costoPersona); > 85, personas * costoPersona
    const costoPersonaBase = cfg.eventoBasePersonas > 0 ? (cfg.eventoBaseCosto / cfg.eventoBasePersonas) : 82353;
    let costoReferencia = 0;
    if (personasBase <= (cfg.eventoBasePersonas || 85)) {
      costoReferencia = Math.max(cfg.eventoMinimo || 4000000, Math.round(personasBase * costoPersonaBase));
    } else {
      costoReferencia = Math.round(personasBase * costoPersonaBase);
    }

    const costoReal = gastosEvento.reduce((acc, m) => acc + (Number(m.monto) || 0), 0);
    const tieneGastosReales = gastosEvento.length > 0;
    const costoUsar = tieneGastosReales ? costoReal : costoReferencia;
    const esCostoEstimado = !tieneGastosReales;

    const margen = ingresoPactado - costoUsar;
    const margenPct = ingresoPactado > 0 ? Math.round((margen / ingresoPactado) * 100) : 0;

    let semaforo = 'rojo';
    if (margenPct > (cfg.margenVerdeMin ?? 20)) semaforo = 'verde';
    else if (margenPct >= (cfg.margenAmarilloMin ?? 0)) semaforo = 'amarillo';

    return {
      ingresoPactado,
      senaCobrada,
      saldoPendiente,
      costoReferencia,
      costoReal,
      costoUsar,
      esCostoEstimado,
      margen,
      margenPct,
      semaforo,
      movsEvento,
      gastosEvento,
      ingresosEvento,
      totalPersonas: personasBase
    };
  }, [eventoFicha, eventosFinanzas, ingresoPactadoInput, movimientos, cfg]);

  const handleGuardarFicha = async () => {
    if (!eventoFicha || !onGuardarFinanzasEvento) return;
    setGuardandoFinanzas(true);
    try {
      await onGuardarFinanzasEvento({
        id: `efin-${eventoFicha.id}`,
        eventoId: eventoFicha.id,
        ingresoPactado: Number(ingresoPactadoInput) || 0,
        notasFinancieras: notasFinancierasInput.trim(),
        actualizadoPor: usuarioActivo?.nombre || 'Gerencia',
        actualizadoFecha: new Date().toISOString().slice(0, 10)
      });
      setEventoFicha(null);
    } catch (e) {
      console.error(e);
    } finally {
      setGuardandoFinanzas(false);
    }
  };

  return (
    <div className="space-y-6 font-['Montserrat']">
      
      {/* Encabezado y Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#2F3A2A] font-serif tracking-tight">
              Calendario del Salón
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#2F3A2A]/10 text-[#2F3A2A] border border-[#5A6B4A]/30">
              Fiestas y Operaciones
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Vista unificada de fiestas, reservas comerciales y cronograma operativo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Alternar Vista: Calendario vs Lista */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-[#E3DCCE] shadow-sm">
            <button
              onClick={() => setVistaModo('mes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                vistaModo === 'mes' ? 'bg-[#2F3A2A] text-[#F6F3E9] shadow-sm' : 'text-slate-600 hover:text-[#2F3A2A]'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Mes</span>
            </button>
            <button
              onClick={() => setVistaModo('lista')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                vistaModo === 'lista' ? 'bg-[#2F3A2A] text-[#F6F3E9] shadow-sm' : 'text-slate-600 hover:text-[#2F3A2A]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Agenda</span>
            </button>
          </div>

          {/* Botón Nuevo Evento */}
          <button
            onClick={() => handleAbrirCrear()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-[#2F3A2A] hover:bg-[#3D4C37] text-[#F6F3E9] border border-[#C6A96A]/60 hover:border-[#C6A96A] shadow-md shadow-[#2F3A2A]/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C6A96A]" />
            <span>+ Cargar Evento</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          RESUMEN MENSUAL VISIBLE PARA TODO EL EQUIPO (SIN MONTOS ECONÓMICOS)
         ===================================================================== */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 shadow-soft border border-[#E3DCCE]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E3DCCE]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2F3A2A]/10 text-[#2F3A2A] flex items-center justify-center font-bold">
              <CalendarIcon className="w-4 h-4 text-[#5A6B4A]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#2F3A2A] capitalize font-serif">
                Resumen de {nombreMes}
              </h2>
              <span className="text-[11px] text-slate-500">
                Visible para todo el equipo · Operaciones y asistencia
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
            <div className="bg-[#F6F3E9] px-3 py-1.5 rounded-xl border border-[#E3DCCE]">
              🎉 <strong className="text-[#2F3A2A]">{resumenMes.totalEventos}</strong> eventos
            </div>
            <div className="bg-[#F6F3E9] px-3 py-1.5 rounded-xl border border-[#E3DCCE]">
              👥 <strong className="text-[#2F3A2A]">{resumenMes.totalPersonas.toLocaleString('es-AR')}</strong> personas estimadas
            </div>
          </div>
        </div>

        {/* Detalle por tipos de evento del mes */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
          {Object.entries(resumenMes.conteoTipos).map(([tipoLabel, cant]) => (
            <span key={tipoLabel} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5A6B4A]" />
              <strong>{cant}</strong> {tipoLabel}
            </span>
          ))}
        </div>

        {/* NOTAS ESPECIALES DE GERENCIA PARA NOVIEMBRE Y DICIEMBRE 2026 */}
        {resumenMes.isNov2026 && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-50/80 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Nota de Gerencia (Noviembre 2026):</strong>
              <span>Según la gerenta, este mes tiene 3 cumpleaños, 1 casamiento y 4 egresados, con unas 1.300 personas en total. Fechas cargadas listas para completar con cliente y detalles.</span>
            </div>
          </div>
        )}

        {resumenMes.isDic2026 && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-300 text-emerald-950 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Nota de Gerencia (Diciembre 2026):</strong>
              <span>Mes de máxima temporada con unas 1.800 personas en total. Fechas tentativas precargadas para coordinar logística y turnos del personal.</span>
            </div>
          </div>
        )}
      </div>

      {/* Barra de Filtros y Navegación de Mes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl shadow-soft border border-[#E3DCCE]">
        
        {/* Filtros de Categoría */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFiltroCategoria('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filtroCategoria === 'todos' ? 'bg-[#2F3A2A] text-[#F6F3E9]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos los Eventos
          </button>
          <button
            onClick={() => setFiltroCategoria('eventos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filtroCategoria === 'eventos' ? 'bg-[#5A6B4A] text-[#F6F3E9]' : 'bg-[#5A6B4A]/10 text-[#5A6B4A] hover:bg-[#5A6B4A]/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C6A96A]" />
            <span>Solo Fiestas</span>
          </button>
          <button
            onClick={() => setFiltroCategoria('mantenimiento')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filtroCategoria === 'mantenimiento' ? 'bg-[#C6A96A] text-[#1E251B]' : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Mantenimiento</span>
          </button>
        </div>

        {/* Navegador de Mes (en vista almanaque) */}
        {vistaModo === 'mes' && (
          <div className="flex items-center gap-2 self-center sm:self-auto">
            <button
              onClick={handleMesAnterior}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-800 capitalize min-w-[130px] text-center">
              {nombreMes}
            </span>
            <button
              onClick={handleMesSiguiente}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* VISTA 1: ALMANAQUE MENSUAL */}
      {vistaModo === 'mes' && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-soft border border-moments-border">
          
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-black text-slate-400 uppercase tracking-wider">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mié</span>
            <span>Jue</span>
            <span>Vie</span>
            <span className="text-amber-800">Sáb</span>
            <span className="text-amber-800">Dom</span>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {diasCalendario.map((dia, idx) => {
              if (!dia.esDelMes) {
                return (
                  <div 
                    key={idx} 
                    className="min-h-[85px] sm:min-h-[115px] p-1.5 rounded-2xl bg-slate-50/50 border border-dashed border-slate-200/60 opacity-40 text-slate-400 text-xs font-bold"
                  >
                    <span>{dia.numero}</span>
                  </div>
                );
              }

              const eventosDia = (eventos || []).filter(e => e.fecha === dia.fechaStr);
              const esHoy = dia.fechaStr === new Date().toISOString().slice(0, 10);

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (eventosDia.length === 0) handleAbrirCrear(dia.fechaStr);
                  }}
                  className={`min-h-[85px] sm:min-h-[115px] p-1.5 sm:p-2 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                    esHoy 
                      ? 'bg-amber-50/40 border-amber-400 ring-2 ring-amber-400/20 shadow-sm' 
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${esHoy ? 'text-amber-800 font-black' : 'text-slate-700'}`}>
                      {dia.numero}
                    </span>
                    {esHoy && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-amber-500 text-white rounded-md">
                        Hoy
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1 flex-1 overflow-hidden">
                    {eventosDia.map(ev => {
                      const badge = getBadgeInfo(ev.tipo);
                      const Icon = badge.icon;

                      return (
                        <div
                          key={ev.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (cajaDesbloqueada) handleAbrirFicha(ev);
                            else handleAbrirEditar(ev);
                          }}
                          title={`${ev.titulo} (${ev.horaInicio} hs) - ${ev.cliente} · Clic para ver`}
                          className={`text-[10px] p-1 rounded-lg border leading-tight flex items-center gap-1 font-semibold truncate cursor-pointer hover:scale-[1.02] transition-transform ${badge.badgeColor}`}
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

          {/* Leyenda de colores ampliada */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
            <span className="flex items-center gap-1 font-semibold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
              <span>15 Años</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Casamiento</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>Egresados</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Aniversarios</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>Tardeo</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Préstamo Salón</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span>A definir</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <span>Mantenimiento</span>
            </span>
          </div>

        </div>
      )}

      {/* VISTA 2: LISTA / AGENDA CRONOLÓGICA CON EDICIÓN Y FICHA */}
      {vistaModo === 'lista' && (
        <div className="space-y-3">
          {eventosFiltrados.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 font-medium border border-[#E3DCCE]">
              No hay eventos ni actividades programadas con este filtro.
            </div>
          ) : (
            eventosFiltrados.map((ev) => {
              const badge = getBadgeInfo(ev.tipo);
              const Icon = badge.icon;
              const totalPers = (Number(ev.invitadosCena) || 0) + (Number(ev.invitadosBrindis) || 0);

              return (
                <div
                  key={ev.id}
                  className={`bg-white rounded-3xl p-4 sm:p-5 shadow-soft border border-[#E3DCCE] border-l-8 ${badge.borderColor} flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-card transition-all`}
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

                    <h3 className="text-lg font-bold text-slate-900 tracking-tight font-serif">
                      {ev.titulo}
                    </h3>
                    
                    <p className="text-xs text-slate-500 mt-0.5">
                      Cliente / Contacto: <strong className="text-slate-700">{ev.cliente}</strong>
                    </p>

                    {/* Datos de Invitados y Horarios */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2.5">
                      <span className="flex items-center gap-1 font-semibold">
                        <CalendarIcon className="w-3.5 h-3.5 text-[#5A6B4A]" />
                        <span>{ev.fecha}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#5A6B4A]" />
                        <span>{ev.horaInicio} a {ev.horaFin} hs</span>
                      </span>

                      {ev.tipo !== 'mantenimiento' && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-bold text-[#2F3A2A]">
                            <Users className="w-3.5 h-3.5 text-[#5A6B4A]" />
                            <span>{totalPers} personas ({ev.invitadosCena} cena + {ev.invitadosBrindis} brindis)</span>
                          </span>
                        </>
                      )}

                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Coordina: <strong>{ev.responsable}</strong></span>
                      </span>
                    </div>

                    {ev.notas && (
                      <p className="text-xs text-slate-500 italic mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        "{ev.notas}"
                      </p>
                    )}
                  </div>

                  {/* Acciones del evento: Editar, Ficha Económica, Borrar */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {cajaDesbloqueada && ev.tipo !== 'mantenimiento' && (
                      <button
                        onClick={() => handleAbrirFicha(ev)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 transition-all cursor-pointer"
                        title="Ver ficha de margen, seña y costos de este evento"
                      >
                        <DollarSign className="w-3.5 h-3.5 text-amber-700" />
                        <span>Ficha Económica</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleAbrirEditar(ev)}
                      className="p-2 text-slate-600 hover:text-[#2F3A2A] rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                      title="Editar evento"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar "${ev.titulo}" del calendario?`)) {
                          onEliminarEvento(ev.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors border border-slate-200 cursor-pointer"
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

      {/* =====================================================================
          MODAL: CREAR / EDITAR EVENTO (PUNTO 2)
         ===================================================================== */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#F6F3E9] rounded-3xl shadow-modal max-w-lg w-full p-6 border border-[#C6A96A]/60 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E3DCCE]">
              <h3 className="text-lg font-bold text-[#2F3A2A] font-serif flex items-center gap-2">
                {modoEdicion ? <Edit2 className="w-5 h-5 text-[#C6A96A]" /> : <Plus className="w-5 h-5 text-[#C6A96A]" />}
                <span>{modoEdicion ? 'Editar Evento / Tarea' : 'Nuevo Evento o Actividad'}</span>
              </h3>
              <button 
                onClick={() => setModalAbierto(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Tipo de Evento Ampliado */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tipo de Actividad / Evento *</label>
                <select
                  value={formTipo}
                  onChange={(e) => setFormTipo(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3DCCE] bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C6A96A]/40"
                >
                  <option value="15_anos">🎉 Cumpleaños de 15</option>
                  <option value="casamiento">💍 Casamiento / Boda</option>
                  <option value="egresados">🎓 Fiesta de Egresados</option>
                  <option value="aniversario">🥂 Cumple de décadas / Aniversario</option>
                  <option value="tardeo">☀️ Tardeo</option>
                  <option value="prestamo_salon">🏡 Préstamo del salón</option>
                  <option value="mantenimiento">🌿 Operativo / Mantenimiento / Jardinero</option>
                  <option value="a_definir">❓ A definir</option>
                  <option value="otro">📌 Otro</option>
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
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3DCCE] bg-white font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C6A96A]/40"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Cliente / Familia / Proveedor</label>
                <input
                  type="text"
                  placeholder="Ej: Familia Rossi / Fumigaciones Cuyo"
                  value={formCliente}
                  onChange={(e) => setFormCliente(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3DCCE] bg-white text-slate-900 focus:outline-none"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3DCCE] bg-white font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Inicio</label>
                  <input
                    type="time"
                    value={formHoraInicio}
                    onChange={(e) => setFormHoraInicio(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3DCCE] bg-white text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fin</label>
                  <input
                    type="time"
                    value={formHoraFin}
                    onChange={(e) => setFormHoraFin(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3DCCE] bg-white text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cantidad de Invitados (si no es mantenimiento) */}
              {formTipo !== 'mantenimiento' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-white/70 rounded-2xl border border-[#E3DCCE]">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Invitados Cena</label>
                    <input
                      type="number"
                      min="0"
                      value={formInvitadosCena}
                      onChange={(e) => setFormInvitadosCena(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3DCCE] font-bold text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Invitados Brindis</label>
                    <input
                      type="number"
                      min="0"
                      value={formInvitadosBrindis}
                      onChange={(e) => setFormInvitadosBrindis(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3DCCE] font-bold text-slate-900 bg-white"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3DCCE] bg-white font-bold text-slate-900"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3DCCE] bg-white text-slate-900"
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
                  placeholder="Detalles sobre vajilla, horarios de ingreso, proveedores..."
                  value={formNotas}
                  onChange={(e) => setFormNotas(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3DCCE] bg-white text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E3DCCE]">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/50 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-[#2F3A2A] hover:bg-[#3D4C37] text-[#F6F3E9] border border-[#C6A96A] rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  {modoEdicion ? 'Guardar Cambios' : 'Guardar en Calendario'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: FICHA ECONÓMICA DE CADA EVENTO (PUNTO 4 - SOLO GERENCIA)
         ===================================================================== */}
      {eventoFicha && calculosFicha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#F6F3E9] rounded-3xl shadow-modal max-w-2xl w-full p-6 border border-[#C6A96A]/60 max-h-[90vh] overflow-y-auto space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E3DCCE]">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-[#2F3A2A] text-[#C6A96A] flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5 text-[#C6A96A]" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-[#2F3A2A] font-serif">
                    Ficha Económica: {eventoFicha.titulo}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Fecha: {eventoFicha.fecha} · {calculosFicha.totalPersonas} personas estimadas
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setEventoFicha(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Principal de Métricas del Evento */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Ingreso Pactado */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#E3DCCE]">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Ingreso Pactado</span>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={ingresoPactadoInput}
                    onChange={(e) => setIngresoPactadoInput(e.target.value)}
                    className="w-full pl-6 pr-2 py-1 text-sm font-bold text-[#2F3A2A] bg-slate-50 rounded-lg border border-[#E3DCCE]"
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Default: {calculosFicha.totalPersonas} personas × {formatARS(cfg.tarifaAdultoVigente)}
                </div>
              </div>

              {/* Seña Cobrada y Saldo */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#E3DCCE]">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Seña Cobrada</span>
                <div className="text-base font-bold text-emerald-800">
                  {formatARS(calculosFicha.senaCobrada)}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 mt-1">
                  Saldo pendiente: <strong className="text-amber-800">{formatARS(calculosFicha.saldoPendiente)}</strong>
                </div>
              </div>

              {/* Costo a Usar y Margen */}
              <div className={`p-3.5 rounded-2xl border ${
                calculosFicha.semaforo === 'verde' ? 'bg-emerald-50/70 border-emerald-300' : 
                calculosFicha.semaforo === 'amarillo' ? 'bg-amber-50/70 border-amber-300' : 'bg-rose-50/70 border-rose-300'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-600 uppercase">Margen Proyectado</span>
                  <span className="text-xs">
                    {calculosFicha.semaforo === 'verde' ? '🟢 Saludable' : calculosFicha.semaforo === 'amarillo' ? '🟡 Ajustado' : '🔴 Crítico'}
                  </span>
                </div>
                <div className="text-base font-bold text-[#2F3A2A]">
                  {formatARS(calculosFicha.margen)} ({calculosFicha.margenPct}%)
                </div>
                <div className="text-[10px] text-slate-600 mt-1">
                  Costo usado: {formatARS(calculosFicha.costoUsar)} {calculosFicha.esCostoEstimado ? '(Estimado)' : '(Real)'}
                </div>
              </div>
            </div>

            {/* Detalle de Costo Real vs Referencia */}
            <div className="p-4 rounded-2xl bg-white border border-[#E3DCCE] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Costo de Referencia del Modelo (hasta 85 p / base):</span>
                <span className="font-bold text-slate-800">{formatARS(calculosFicha.costoReferencia)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Costo Real cargado en caja (gastos con este evento):</span>
                <span className="font-bold text-[#2F3A2A]">{formatARS(calculosFicha.costoReal)} ({calculosFicha.gastosEvento.length} gastos)</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                Regla: Si hay al menos un gasto cargado, se usa el costo real. Si no hay gastos, se presupuesta con el costo de referencia y etiqueta <em>"Estimado"</em>.
              </div>
            </div>

            {/* Movimientos de Caja Vinculados a este Evento */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#2F3A2A] uppercase text-[11px] block">
                Movimientos de Caja Vinculados ({calculosFicha.movsEvento.length})
              </span>
              
              {calculosFicha.movsEvento.length === 0 ? (
                <div className="p-4 rounded-xl bg-white border border-[#E3DCCE] text-center text-slate-400">
                  No hay movimientos de caja asociados a este evento todavía.
                </div>
              ) : (
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {calculosFicha.movsEvento.map(m => (
                    <div key={m.id} className="p-2.5 rounded-xl bg-white border border-[#E3DCCE] flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800">{m.concepto}</div>
                        <div className="text-[10px] text-slate-400">{m.fecha} · {m.categoria} · {m.caja}</div>
                      </div>
                      <span className={`font-bold ${m.tipo === 'ingreso' ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {m.tipo === 'ingreso' ? '+' : '-'} {formatARS(m.monto)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notas Financieras */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Observaciones Financieras del Evento
              </label>
              <textarea
                rows="2"
                placeholder="Condiciones de pago, facilidades, cuotas acordadas con el cliente..."
                value={notasFinancierasInput}
                onChange={(e) => setNotasFinancierasInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#E3DCCE] text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E3DCCE]">
              <button
                type="button"
                onClick={() => setEventoFicha(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/50 rounded-xl"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleGuardarFicha}
                disabled={guardandoFinanzas}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-[#2F3A2A] hover:bg-[#3D4C37] text-[#F6F3E9] text-xs font-bold rounded-xl border border-[#C6A96A] shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-[#C6A96A]" />
                <span>{guardandoFinanzas ? 'Guardando...' : 'Guardar Ficha Económica'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
