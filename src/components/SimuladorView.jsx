import React, { useState, useMemo } from 'react';
import { 
  Percent, 
  Coins, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  Plus, 
  Minus, 
  DollarSign, 
  Sliders, 
  TrendingUp, 
  Clock, 
  Trash2, 
  Info,
  Layers,
  Sparkles,
  Lock,
  Wallet
} from 'lucide-react';
import { CAJAS_DEF } from './CajaView';
import { formatARS } from '../utils/mockData';

export default function SimuladorView({
  movimientos = [],
  eventos = [],
  configuracion,
  onGuardarConfiguracion,
  prestamosTramos = [],
  onRegistrarTramoPrestamo,
  onEliminarTramoPrestamo,
  usuarioActivo,
  onIrACaja
}) {
  const cfg = configuracion || {};
  const hoyStr = new Date().toISOString().slice(0, 10);

  // Parámetros del simulador (con defaults solicitados por la gerenta)
  const costoPromedioConfig = Number(cfg.costoPromedioPlanificacion || cfg.costoPromedioEvento) || 10000000;
  const colchonConfig = Number(cfg.colchonSeguridad) || 1;
  const tramoSugeridoConfig = Number(cfg.tamanioTramoSugerido) || 20000000;

  // Estado local interactivo del simulador
  const [simCostoPromedio, setSimCostoPromedio] = useState(costoPromedioConfig);
  const [colchon, setColchon] = useState(colchonConfig);
  const [montoTramoSugerido, setMontoTramoSugerido] = useState(tramoSugeridoConfig);
  const [simCantEventos, setSimCantEventos] = useState(14);
  const [simCajaManualOverride, setSimCajaManualOverride] = useState(null);
  const [simIngresosInesperados, setSimIngresosInesperados] = useState(0);

  // Modal para registrar tramo o amortización
  const [modalTramoAbierto, setModalTramoAbierto] = useState(false);
  const [tramoTipo, setTramoTipo] = useState('recibido'); // 'recibido' | 'devolucion'
  const [tramoMonto, setTramoMonto] = useState(String(montoTramoSugerido));
  const [tramoFecha, setTramoFecha] = useState(hoyStr);
  const [tramoCaja, setTramoCaja] = useState('efectivo');
  const [tramoConcepto, setTramoConcepto] = useState('Desembolso tramo préstamo familiar');
  const [tramoNotas, setTramoNotas] = useState('');

  // 1. Saldo actual en las 4 cajas operativas (excluyendo financiamiento para no duplicar)
  const saldoRealSinPrestamos = useMemo(() => {
    return (movimientos || []).reduce((acc, m) => {
      const val = Number(m.monto) || 0;
      if (m.tipo === 'ingreso') return acc + val;
      if (m.tipo === 'egreso') return acc - val;
      return acc;
    }, 0);
  }, [movimientos]);

  // Caja efectiva a usar en el simulador
  const simCajaActual = simCajaManualOverride !== null ? simCajaManualOverride : saldoRealSinPrestamos;

  // 2. Eventos futuros confirmados o tentativos (excluyendo mantenimientos)
  const eventosFuturos = useMemo(() => {
    return (eventos || [])
      .filter(e => e.tipo !== 'mantenimiento' && e.fecha >= hoyStr)
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [eventos, hoyStr]);

  // Si no se sobreescribió la cantidad, usar la cantidad de eventos futuros registrados o mínimo 14
  const cantEventosReales = eventosFuturos.length > 0 ? eventosFuturos.length : 14;

  // Sincronizar cantidad si no fue tocada manualmente
  useMemo(() => {
    if (eventosFuturos.length > 0 && simCantEventos === 14) {
      setSimCantEventos(Math.max(14, eventosFuturos.length));
    }
  }, [eventosFuturos.length]);

  // 3. Cálculos centrales del Simulador (Punto 12)
  // Costo total de eventos a cubrir (en rojo grande)
  const simCostoEventos = simCantEventos * simCostoPromedio;

  // Fondos disponibles operativos (en verde grande)
  const simDisponible = Math.max(0, simCajaActual) + Math.max(0, simIngresosInesperados);

  // Préstamo total necesario
  const simPrestamoNecesario = Math.max(0, simCostoEventos - simDisponible);

  // Total de tramos de préstamo familiar recibidos históricamente y devueltos
  const simPrestamoRecibido = useMemo(() => {
    return (prestamosTramos || []).reduce((acc, t) => {
      const v = Number(t.monto) || 0;
      return t.tipo === 'recibido' ? acc + v : acc;
    }, 0);
  }, [prestamosTramos]);

  const simPrestamoDevuelto = useMemo(() => {
    return (prestamosTramos || []).reduce((acc, t) => {
      const v = Number(t.monto) || 0;
      return t.tipo === 'devolucion' ? acc + v : acc;
    }, 0);
  }, [prestamosTramos]);

  // Saldo adeudado actual al prestamista
  const simSaldoAdeudado = Math.max(0, simPrestamoRecibido - simPrestamoDevuelto);

  // Caja para operar (disponible actual)
  const simCajaParaOperar = simDisponible;

  // Falta pedir
  const simFaltaPedir = Math.max(0, simPrestamoNecesario - simSaldoAdeudado);

  // Cantidad de eventos cubiertos con los fondos operativos actuales
  const simEventosCubiertos = simCostoPromedio > 0 ? Math.floor(simCajaParaOperar / simCostoPromedio) : 0;

  // ALERTA: Salta si los eventos cubiertos son menores o iguales al colchón de seguridad
  const alertaTramoActiva = simEventosCubiertos <= colchon && simCantEventos > 0;

  const proximoEvento = eventosFuturos[0] || null;

  // Handler para registrar nuevo tramo o devolución
  const handleGuardarTramo = (e) => {
    e.preventDefault();
    const num = Number(tramoMonto);
    if (!num || num <= 0) return;

    const nuevoTramo = {
      id: `tramo-${Date.now()}`,
      tipo: tramoTipo,
      monto: num,
      fecha: tramoFecha || hoyStr,
      caja: tramoCaja,
      concepto: tramoConcepto.trim() || (tramoTipo === 'recibido' ? 'Desembolso tramo préstamo' : 'Devolución de préstamo'),
      cargadoPor: `${usuarioActivo?.nombre || 'Gerencia'} · ${new Date().toLocaleDateString('es-AR')}`,
      notas: tramoNotas.trim()
    };

    if (onRegistrarTramoPrestamo) {
      onRegistrarTramoPrestamo(nuevoTramo);
    }

    setModalTramoAbierto(false);
    setTramoMonto(String(montoTramoSugerido));
    setTramoNotas('');
  };

  return (
    <div className="space-y-6 font-['Montserrat',sans-serif] text-slate-800 pb-16 animate-fadeIn">
      
      {/* =====================================================================
          ENCABEZADO DE PANTALLA PRIVADA
         ===================================================================== */}
      <div className="bg-[#1E251B] text-[#F6F3E9] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#C6A96A]/50 relative overflow-hidden">
        {/* Glow dorado cálido en el fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C6A96A]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#C6A96A]/30 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#2F3A2A] text-[#C6A96A] flex items-center justify-center border-2 border-[#C6A96A]/40 shadow-lg shrink-0">
              <Percent className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[#C6A96A] uppercase tracking-widest">
                  Gestión Financiera Privada · Gerencia
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                  🔒 Clave 1616
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-['Playfair_Display']">
                Simulador de Cobertura y Préstamos
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Planificación preventiva de caja para garantizar que todos los eventos tengan fondos asegurados.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-auto">
            {onIrACaja && (
              <button
                onClick={onIrACaja}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#E8EDE3] text-xs font-bold transition flex items-center gap-1.5 border border-white/20 cursor-pointer"
              >
                <Wallet className="w-3.5 h-3.5 text-[#C6A96A]" />
                <span>Ver Caja Diaria</span>
              </button>
            )}
            <button
              onClick={() => {
                setTramoTipo('recibido');
                setTramoMonto(String(montoTramoSugerido));
                setTramoConcepto('Desembolso tramo préstamo familiar');
                setModalTramoAbierto(true);
              }}
              className="px-4 py-2 bg-[#C6A96A] hover:bg-[#D4B97B] text-[#1C251B] text-xs font-black rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer font-['Montserrat']"
            >
              <Plus className="w-4 h-4 text-[#1C251B]" />
              <span>Registrar Tramo Recibido</span>
            </button>
          </div>
        </div>

        {/* ALERTA CRÍTICA: PEDIR PRÓXIMO TRAMO AL PRESTAMISTA */}
        {alertaTramoActiva && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-rose-950/90 border-2 border-rose-500 text-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl animate-pulse">
            <div className="flex items-start sm:items-center gap-3.5">
              <span className="w-11 h-11 rounded-2xl bg-rose-600 flex items-center justify-center font-bold text-white shrink-0 shadow-md">
                <AlertTriangle className="w-6 h-6 text-white" />
              </span>
              <div>
                <strong className="block text-sm sm:text-base font-black text-white font-['Playfair_Display']">
                  🚨 ATENCIÓN: Solicitar Próximo Tramo al Prestamista
                </strong>
                <span className="text-xs text-rose-200 block mt-0.5">
                  Los fondos operativos cubren solo <strong>{simEventosCubiertos} evento(s)</strong> (colchón de seguridad: {colchon} evento).
                  {proximoEvento && ` Próxima fiesta: ${proximoEvento.titulo} (${proximoEvento.fecha}).`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-black bg-rose-900 px-3.5 py-2 rounded-xl border border-rose-400 text-white">
                Tramo sugerido: <strong>{formatARS(montoTramoSugerido)}</strong>
              </span>
              <button
                onClick={() => {
                  setTramoTipo('recibido');
                  setTramoMonto(String(montoTramoSugerido));
                  setModalTramoAbierto(true);
                }}
                className="px-4 py-2 rounded-xl bg-white text-rose-950 font-black text-xs hover:bg-rose-100 transition shadow-md cursor-pointer"
              >
                + Cargar Desembolso
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            LOS 4 GRANDES NÚMEROS VISUALES (PUNTO 12)
           ===================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          
          {/* 1. COSTO DE LOS EVENTOS (NÚMERO GRANDE EN ROJO) */}
          <div className="p-5 rounded-3xl bg-rose-950/50 border border-rose-500/50 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-300 block mb-1">
                Costo de próximos {simCantEventos} eventos
              </span>
              <div className="text-3xl sm:text-4xl font-black text-rose-400 font-['Playfair_Display'] leading-none">
                {formatARS(simCostoEventos)}
              </div>
            </div>
            <div className="text-[11px] text-rose-300/80 mt-3 pt-2 border-t border-rose-800/60 font-medium">
              {simCantEventos} eventos × {formatARS(simCostoPromedio)} prom.
            </div>
          </div>

          {/* 2. DISPONIBLE (NÚMERO GRANDE EN VERDE BOSQUE) */}
          <div className="p-5 rounded-3xl bg-[#2F3A2A]/90 border border-[#5A6B4A]/70 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#A5B29B] block mb-1">
                Fondos Operativos Disponibles
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#E8EDE3] font-['Playfair_Display'] leading-none">
                {formatARS(simDisponible)}
              </div>
            </div>
            <div className="text-[11px] text-[#A5B29B] mt-3 pt-2 border-t border-[#5A6B4A]/50 font-medium">
              Caja real en las 4 cuentas + imprevistos
            </div>
          </div>

          {/* 3. PRÉSTAMO NECESARIO Y BARRA DE PROGRESO */}
          <div className="p-5 rounded-3xl bg-black/50 border border-[#C6A96A]/50 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#C6A96A] block mb-1">
                Préstamo Necesario Total
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#C6A96A] font-['Playfair_Display'] leading-none">
                {formatARS(simPrestamoNecesario)}
              </div>
            </div>
            
            <div className="mt-3 pt-2 border-t border-white/10 space-y-1.5">
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#C6A96A] rounded-full transition-all duration-500"
                  style={{ width: `${simPrestamoNecesario > 0 ? Math.min(100, Math.round((simPrestamoRecibido / simPrestamoNecesario) * 100)) : 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-300">
                <span>Recibido: <strong>{formatARS(simPrestamoRecibido)}</strong></span>
                <span className="font-bold text-rose-400">Resta pedir: {formatARS(simFaltaPedir)}</span>
              </div>
            </div>
          </div>

          {/* 4. EVENTOS CUBIERTOS & DEUDA */}
          <div className="p-5 rounded-3xl bg-black/50 border border-white/20 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 block mb-1">
                Cobertura Operativa
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white font-['Playfair_Display'] leading-tight">
                {simEventosCubiertos} de {simCantEventos} eventos
              </div>
              <div className="text-xs text-[#C6A96A] font-bold mt-1">
                Caja para operar: {formatARS(simCajaParaOperar)}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Deuda con prestamista:</span>
              <strong className="text-amber-400 font-black">{formatARS(simSaldoAdeudado)}</strong>
            </div>
          </div>

        </div>

        {/* =====================================================================
            CRONOGRAMA VISUAL DE PRÓXIMOS EVENTOS CON PUNTO DE CORTE
           ===================================================================== */}
        {eventosFuturos.length > 0 && (
          <div className="mt-7 pt-5 border-t border-white/10">
            <div className="text-xs font-bold text-[#E3DCCE]/90 mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C6A96A]" />
                <span>Cronograma y Cobertura de Próximas Fechas:</span>
              </span>
              <span className="text-[11px] text-[#C6A96A] font-bold">
                Con los fondos actuales cubrimos hasta el evento #{simEventosCubiertos || 0}
              </span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
              {eventosFuturos.slice(0, 12).map((ev, i) => {
                const cubierto = i < simEventosCubiertos;
                const esPuntoCorte = i === simEventosCubiertos;

                return (
                  <div 
                    key={ev.id}
                    className={`p-3 rounded-2xl border shrink-0 text-xs transition-all min-w-[170px] ${
                      cubierto 
                        ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200' 
                        : esPuntoCorte 
                        ? 'bg-rose-950/80 border-rose-500 text-rose-100 ring-2 ring-rose-500/60 shadow-lg' 
                        : 'bg-black/40 border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                      <span>#{i + 1} · {ev.fecha}</span>
                      <span>{cubierto ? '🟢 Cubierto' : '🔴 Tramo'}</span>
                    </div>
                    <div className="font-bold truncate text-white">{ev.titulo}</div>
                    <div className="text-[10px] text-slate-300 mt-0.5 truncate">{ev.cliente}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* =====================================================================
          CONTROLES DE PARÁMETROS DEL SIMULADOR & HISTORIAL DE TRAMOS
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PANEL DE PARÁMETROS EDITABLES */}
        <div className="lg:col-span-1 bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/40 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E3DCCE] pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#5A6B4A]" />
              <h3 className="font-bold text-sm text-slate-900 font-['Montserrat']">
                Parámetros del Simulador
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Ajuste Dinámico</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Cantidad de Eventos */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Cantidad de Eventos a Planificar
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={simCantEventos}
                onChange={(e) => setSimCantEventos(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 font-bold text-slate-800"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Planificación por defecto: 14 eventos.
              </span>
            </div>

            {/* Costo Promedio por Evento */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Costo Promedio por Evento ($ ARS)
              </label>
              <input
                type="number"
                step="500000"
                value={simCostoPromedio}
                onChange={(e) => setSimCostoPromedio(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 font-bold text-[#2F3A2A]"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Valor de referencia: {formatARS(simCostoPromedio)}.
              </span>
            </div>

            {/* Colchón de Seguridad */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Colchón de Seguridad (Eventos)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={colchon}
                onChange={(e) => setColchon(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 font-bold text-slate-800"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Si la caja cubre $\le$ este número, se activa la alerta roja de pedir tramo.
              </span>
            </div>

            {/* Tamaño Sugerido de Tramo */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Tamaño Sugerido de Cada Tramo
              </label>
              <input
                type="number"
                step="1000000"
                value={montoTramoSugerido}
                onChange={(e) => setMontoTramoSugerido(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 font-bold text-slate-800"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Desembolso estándar: {formatARS(montoTramoSugerido)}.
              </span>
            </div>

            {/* Ingresos Inesperados */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Ingresos Inesperados / Cobros Extra
              </label>
              <input
                type="number"
                step="100000"
                value={simIngresosInesperados}
                onChange={(e) => setSimIngresosInesperados(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 font-bold text-emerald-800"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Suma temporalmente a los fondos disponibles para simular.
              </span>
            </div>
          </div>
        </div>

        {/* HISTORIAL DE MOVIMIENTOS DEL PRÉSTAMO FAMILIAR */}
        <div className="lg:col-span-2 bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/40 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E3DCCE] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#C6A96A]" />
                <h3 className="font-bold text-sm text-slate-900 font-['Montserrat']">
                  Historial de Tramos y Devoluciones
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setTramoTipo('recibido');
                    setTramoMonto(String(montoTramoSugerido));
                    setTramoConcepto('Desembolso tramo préstamo familiar');
                    setModalTramoAbierto(true);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition cursor-pointer"
                >
                  + Desembolso
                </button>
                <button
                  onClick={() => {
                    setTramoTipo('devolucion');
                    setTramoMonto('5000000');
                    setTramoConcepto('Devolución parcial préstamo familiar');
                    setModalTramoAbierto(true);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold text-xs border border-rose-200 transition cursor-pointer"
                >
                  - Devolución
                </button>
              </div>
            </div>

            {/* TABLA DE TRAMOS */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E3DCCE] text-slate-400 uppercase text-[10px] font-black">
                    <th className="py-2 px-2">Fecha</th>
                    <th className="py-2 px-2">Operación</th>
                    <th className="py-2 px-2">Caja Destino</th>
                    <th className="py-2 px-2 text-right">Monto</th>
                    <th className="py-2 px-2 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prestamosTramos.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400 text-xs">
                        No hay tramos de préstamo registrados aún. Pulsá "+ Registrar Tramo Recibido".
                      </td>
                    </tr>
                  ) : (
                    prestamosTramos.map(t => {
                      const esRecibido = t.tipo === 'recibido';
                      const cInfo = CAJAS_DEF.find(c => c.id === t.caja);

                      return (
                        <tr key={t.id} className="hover:bg-slate-50 transition">
                          <td className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap">
                            {t.fecha}
                          </td>
                          <td className="py-2.5 px-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              esRecibido ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
                            }`}>
                              {esRecibido ? '📥 Tramo Recibido' : '📤 Devolución'}
                            </span>
                            <div className="text-[11px] font-bold text-slate-900 mt-0.5">{t.concepto}</div>
                          </td>
                          <td className="py-2.5 px-2 whitespace-nowrap">
                            <span className="text-[11px] font-semibold text-slate-700">
                              {cInfo?.nombre || t.caja}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-right font-black text-sm whitespace-nowrap">
                            <span className={esRecibido ? 'text-emerald-700' : 'text-rose-700'}>
                              {esRecibido ? '+' : '-'} {formatARS(t.monto)}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            {onEliminarTramoPrestamo && (
                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar registro de ${formatARS(t.monto)}?`)) {
                                    onEliminarTramoPrestamo(t.id);
                                  }
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition"
                                title="Eliminar registro"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RESUMEN DEL SALDO DEUDA */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">
                Estado Actual de la Deuda Familiar
              </span>
              <div className="text-base font-black text-slate-900 font-['Playfair_Display']">
                Total Recibido: {formatARS(simPrestamoRecibido)} · Amortizado: {formatARS(simPrestamoDevuelto)}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-amber-800 block">
                Saldo Pendiente a Devolver
              </span>
              <div className="text-xl font-black text-amber-700 font-['Playfair_Display']">
                {formatARS(simSaldoAdeudado)}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* =====================================================================
          MODAL: REGISTRAR TRAMO O DEVOLUCIÓN
         ===================================================================== */}
      {modalTramoAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#F6F3E9] rounded-3xl shadow-2xl max-w-md w-full p-6 border border-[#C6A96A]/60 text-slate-800">
            <h3 className="font-bold text-base text-[#2F3A2A] font-serif mb-3">
              {tramoTipo === 'recibido' ? 'Registrar Tramo de Préstamo Recibido' : 'Registrar Devolución de Préstamo'}
            </h3>

            <form onSubmit={handleGuardarTramo} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-white/70 p-1.5 rounded-2xl border border-[#E3DCCE]">
                <button
                  type="button"
                  onClick={() => {
                    setTramoTipo('recibido');
                    setTramoConcepto('Desembolso tramo préstamo familiar');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    tramoTipo === 'recibido' ? 'bg-[#2F3A2A] text-white' : 'text-slate-600'
                  }`}
                >
                  📥 Tramo Recibido
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTramoTipo('devolucion');
                    setTramoConcepto('Devolución préstamo familiar');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    tramoTipo === 'devolucion' ? 'bg-[#5A6B4A] text-white' : 'text-slate-600'
                  }`}
                >
                  📤 Devolución
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={tramoFecha}
                    onChange={(e) => setTramoFecha(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE] font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monto ($ ARS) *</label>
                  <input
                    type="number"
                    step="1000000"
                    required
                    value={tramoMonto}
                    onChange={(e) => setTramoMonto(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE] font-bold text-sm text-[#2F3A2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cuenta / Caja que {tramoTipo === 'recibido' ? 'Recibe' : 'Paga'}</label>
                <select
                  value={tramoCaja}
                  onChange={(e) => setTramoCaja(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE] font-bold"
                >
                  {CAJAS_DEF.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Concepto</label>
                <input
                  type="text"
                  required
                  value={tramoConcepto}
                  onChange={(e) => setTramoConcepto(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notas u Observaciones</label>
                <input
                  type="text"
                  placeholder="Detalles sobre el tramo..."
                  value={tramoNotas}
                  onChange={(e) => setTramoNotas(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E3DCCE]">
                <button
                  type="button"
                  onClick={() => setModalTramoAbierto(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200/50 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2F3A2A] hover:bg-[#3D4C37] text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Confirmar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
