import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Download, 
  Search, 
  Filter, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Users, 
  DollarSign, 
  Calendar,
  X,
  CreditCard,
  Banknote,
  Landmark,
  Smartphone,
  Layers,
  ArrowLeftRight,
  Pencil,
  Check,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CATEGORIAS_CAJA, USUARIOS } from '../utils/mockData';

// Definición oficial de las 4 Cajas solicitadas por la dueña de Moments + Vista General Consolidada
export const CAJAS_DEF = [
  {
    id: 'naranja',
    nombre: 'Naranja',
    nombreCorto: 'Naranja',
    subtitulo: 'Tarjeta Naranja / Naranja X',
    icono: CreditCard,
    colorName: 'orange',
    accentBg: 'bg-orange-50',
    accentBorder: 'border-orange-200',
    accentText: 'text-orange-950',
    tabActive: 'bg-orange-600 text-white shadow-md shadow-orange-900/20 border-orange-600',
    badge: 'bg-orange-100 text-orange-950 border border-orange-300',
    btnPrimary: 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-900/20',
    dot: 'bg-orange-500'
  },
  {
    id: 'banco_nacion',
    nombre: 'Banco Nación',
    nombreCorto: 'Banco Nación',
    subtitulo: 'Cuenta Corriente / Transferencias BNA',
    icono: Landmark,
    colorName: 'blue',
    accentBg: 'bg-blue-50',
    accentBorder: 'border-blue-200',
    accentText: 'text-blue-950',
    tabActive: 'bg-blue-700 text-white shadow-md shadow-blue-900/20 border-blue-700',
    badge: 'bg-blue-100 text-blue-950 border border-blue-300',
    btnPrimary: 'bg-blue-700 hover:bg-blue-800 text-white shadow-blue-900/20',
    dot: 'bg-blue-600'
  },
  {
    id: 'mercado_pago',
    nombre: 'Mercado Pago',
    nombreCorto: 'Mercado Pago',
    subtitulo: 'Cobros QR / CVU / Dinero en cuenta MP',
    icono: Smartphone,
    colorName: 'sky',
    accentBg: 'bg-sky-50',
    accentBorder: 'border-sky-200',
    accentText: 'text-sky-950',
    tabActive: 'bg-sky-600 text-white shadow-md shadow-sky-900/20 border-sky-600',
    badge: 'bg-sky-100 text-sky-950 border border-sky-300',
    btnPrimary: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-900/20',
    dot: 'bg-sky-500'
  },
  {
    id: 'efectivo',
    nombre: 'Efectivo',
    nombreCorto: 'Efectivo',
    subtitulo: 'Caja física / Dinero en mano en el Salón',
    icono: Banknote,
    colorName: 'emerald',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
    accentText: 'text-emerald-950',
    tabActive: 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20 border-emerald-600',
    badge: 'bg-emerald-100 text-emerald-950 border border-emerald-300',
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20',
    dot: 'bg-emerald-500'
  }
];

// Helper para normalizar la caja de cualquier movimiento existente
export function getCajaMovimiento(m) {
  if (m?.caja && ['naranja', 'banco_nacion', 'mercado_pago', 'efectivo'].includes(m.caja)) {
    return m.caja;
  }
  const metodo = String(m?.metodoPago || '').toLowerCase();
  const concepto = String(m?.concepto || '').toLowerCase();
  if (metodo.includes('efectivo') || concepto.includes('efectivo')) return 'efectivo';
  if (metodo.includes('naranja') || metodo.includes('tarjeta') || concepto.includes('naranja')) return 'naranja';
  if (metodo.includes('mercado') || metodo.includes('mp') || concepto.includes('mercado') || concepto.includes('qr')) return 'mercado_pago';
  return 'banco_nacion';
}

export default function CajaView({ 
  movimientos = [], 
  onAgregarMovimiento, 
  onEditarMovimiento,
  onEliminarMovimiento, 
  usuarioActivo 
}) {
  // Pestaña activa dentro de Caja: 'naranja' | 'banco_nacion' | 'mercado_pago' | 'efectivo' | 'general'
  const [subTabActiva, setSubTabActiva] = useState('naranja');

  // Filtros
  const [filtroMes, setFiltroMes] = useState('2026-10');
  const [filtroTipo, setFiltroTipo] = useState('todos'); // 'todos' | 'ingreso' | 'egreso'
  const [busqueda, setBusqueda] = useState('');
  const [filtroCajaGeneral, setFiltroCajaGeneral] = useState('todas'); // para filtrar en la pestaña general

  // Modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState('nuevo'); // 'nuevo' | 'editar' | 'traspaso'
  const [movimientoAEditar, setMovimientoAEditar] = useState(null);

  // Formulario de Movimiento
  const [formCaja, setFormCaja] = useState('naranja');
  const [formFecha, setFormFecha] = useState(new Date().toISOString().split('T')[0]);
  const [formConcepto, setFormConcepto] = useState('');
  const [formTipo, setFormTipo] = useState('egreso');
  const [formCategoria, setFormCategoria] = useState('Variables');
  const [formSubcategoria, setFormSubcategoria] = useState('Proveedores de evento');
  const [formMonto, setFormMonto] = useState('');
  const [formMetodo, setFormMetodo] = useState('Tarjeta Naranja');
  const [formCargo, setFormCargo] = useState(usuarioActivo?.nombre || 'Jesica');
  const [formNotas, setFormNotas] = useState('');

  // Formulario de Traspaso entre Cajas
  const [traspasoOrigen, setTraspasoOrigen] = useState('efectivo');
  const [traspasoDestino, setTraspasoDestino] = useState('banco_nacion');
  const [traspasoMonto, setTraspasoMonto] = useState('');
  const [traspasoFecha, setTraspasoFecha] = useState(new Date().toISOString().split('T')[0]);
  const [traspasoConcepto, setTraspasoConcepto] = useState('Depósito de efectivo en cuenta BNA');

  const formatARS = (num) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(num || 0);
  };

  // ---------------------------------------------------------------------------
  // Cálculos de Saldos por Caja y General (en tiempo real)
  // ---------------------------------------------------------------------------
  const metricasPorCaja = useMemo(() => {
    const mapa = {
      naranja: { ingresos: 0, egresos: 0, saldo: 0, retiros: 0, cantidad: 0 },
      banco_nacion: { ingresos: 0, egresos: 0, saldo: 0, retiros: 0, cantidad: 0 },
      mercado_pago: { ingresos: 0, egresos: 0, saldo: 0, retiros: 0, cantidad: 0 },
      efectivo: { ingresos: 0, egresos: 0, saldo: 0, retiros: 0, cantidad: 0 },
      general: { ingresos: 0, egresos: 0, saldo: 0, retiros: 0, cantidad: 0 }
    };

    const itemsParaCalculo = filtroMes === 'todos' 
      ? movimientos 
      : movimientos.filter(m => m.fecha && m.fecha.startsWith(filtroMes));

    itemsParaCalculo.forEach(m => {
      const cajaKey = getCajaMovimiento(m);
      const val = Number(m.monto) || 0;
      const esIngreso = m.tipo === 'ingreso';

      if (mapa[cajaKey]) {
        mapa[cajaKey].cantidad += 1;
        if (esIngreso) {
          mapa[cajaKey].ingresos += val;
          mapa[cajaKey].saldo += val;
        } else {
          mapa[cajaKey].egresos += val;
          mapa[cajaKey].saldo -= val;
          if (m.categoria === 'Retiros personales') {
            mapa[cajaKey].retiros += val;
          }
        }
      }

      // Consolidado general
      mapa.general.cantidad += 1;
      if (esIngreso) {
        mapa.general.ingresos += val;
        mapa.general.saldo += val;
      } else {
        mapa.general.egresos += val;
        mapa.general.saldo -= val;
        if (m.categoria === 'Retiros personales') {
          mapa.general.retiros += val;
        }
      }
    });

    return mapa;
  }, [movimientos, filtroMes]);

  // Desglose de gastos por categoría para el general o caja seleccionada
  const desgloseCategorias = useMemo(() => {
    const desglose = {};
    const items = filtroMes === 'todos' 
      ? movimientos 
      : movimientos.filter(m => m.fecha && m.fecha.startsWith(filtroMes));

    const filtradosPorCaja = subTabActiva === 'general'
      ? items
      : items.filter(m => getCajaMovimiento(m) === subTabActiva);

    filtradosPorCaja.forEach(m => {
      if (m.tipo === 'egreso') {
        const val = Number(m.monto) || 0;
        const cat = m.categoria || 'Otros / No recurrente';
        desglose[cat] = (desglose[cat] || 0) + val;
      }
    });

    return desglose;
  }, [movimientos, filtroMes, subTabActiva]);

  // Lista filtrada para la tabla
  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter(m => {
      const cajaKey = getCajaMovimiento(m);

      // Si estamos en una pestaña de caja específica (Naranja, BNA, MP, Efectivo), solo mostrar esa caja
      if (subTabActiva !== 'general' && cajaKey !== subTabActiva) {
        return false;
      }

      // Si estamos en General, pero el usuario filtró por una caja específica dentro de General
      if (subTabActiva === 'general' && filtroCajaGeneral !== 'todas' && cajaKey !== filtroCajaGeneral) {
        return false;
      }

      // Filtro mes
      if (filtroMes !== 'todos' && (!m.fecha || !m.fecha.startsWith(filtroMes))) {
        return false;
      }

      // Filtro tipo
      if (filtroTipo !== 'todos' && m.tipo !== filtroTipo) {
        return false;
      }

      // Búsqueda de texto libre
      if (busqueda.trim() !== '') {
        const query = busqueda.toLowerCase();
        const coincide = 
          (m.concepto && m.concepto.toLowerCase().includes(query)) ||
          (m.categoria && m.categoria.toLowerCase().includes(query)) ||
          (m.subcategoria && m.subcategoria.toLowerCase().includes(query)) ||
          (m.cargo && m.cargo.toLowerCase().includes(query)) ||
          (m.notas && m.notas.toLowerCase().includes(query)) ||
          (m.metodoPago && m.metodoPago.toLowerCase().includes(query));
        if (!coincide) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [movimientos, subTabActiva, filtroCajaGeneral, filtroMes, filtroTipo, busqueda]);

  // ---------------------------------------------------------------------------
  // Handlers para abrir el modal preconfigurado
  // ---------------------------------------------------------------------------
  const abrirModalNuevo = (cajaPreseleccionada = null) => {
    const destino = cajaPreseleccionada || (subTabActiva !== 'general' ? subTabActiva : 'naranja');
    setModoModal('nuevo');
    setMovimientoAEditar(null);
    setFormCaja(destino);
    setFormFecha(new Date().toISOString().split('T')[0]);
    setFormConcepto('');
    setFormTipo('egreso');
    setFormCategoria('Variables');
    setFormSubcategoria(CATEGORIAS_CAJA['Variables'][0]);
    setFormMonto('');
    setFormCargo(usuarioActivo?.nombre || 'Jesica');
    setFormNotas('');
    
    // Método de pago acorde a la caja
    if (destino === 'naranja') setFormMetodo('Tarjeta Naranja');
    else if (destino === 'banco_nacion') setFormMetodo('Transferencia BNA');
    else if (destino === 'mercado_pago') setFormMetodo('Mercado Pago');
    else setFormMetodo('Efectivo');

    setModalAbierto(true);
  };

  const abrirModalEditar = (m) => {
    setModoModal('editar');
    setMovimientoAEditar(m);
    setFormCaja(getCajaMovimiento(m));
    setFormFecha(m.fecha || new Date().toISOString().split('T')[0]);
    setFormConcepto(m.concepto || '');
    setFormTipo(m.tipo || 'egreso');
    setFormCategoria(m.categoria || 'Variables');
    setFormSubcategoria(m.subcategoria || '');
    setFormMonto(m.monto ? String(m.monto) : '');
    setFormMetodo(m.metodoPago || 'Transferencia');
    setFormCargo(m.cargo || (usuarioActivo?.nombre || 'Jesica'));
    setFormNotas(m.notas || '');
    setModalAbierto(true);
  };

  const abrirModalTraspaso = () => {
    setModoModal('traspaso');
    setTraspasoOrigen(subTabActiva !== 'general' ? subTabActiva : 'efectivo');
    setTraspasoDestino(subTabActiva === 'banco_nacion' ? 'efectivo' : 'banco_nacion');
    setTraspasoMonto('');
    setTraspasoFecha(new Date().toISOString().split('T')[0]);
    setTraspasoConcepto('Traspaso / Movimiento interno entre cuentas');
    setModalAbierto(true);
  };

  // ---------------------------------------------------------------------------
  // Guardado de Movimiento (Nuevo, Edición o Traspaso)
  // ---------------------------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (modoModal === 'traspaso') {
      if (!traspasoMonto || Number(traspasoMonto) <= 0 || traspasoOrigen === traspasoDestino) {
        alert('Ingresá un monto válido y seleccioná cajas de origen y destino distintas.');
        return;
      }
      const montoNum = Number(traspasoMonto);
      const fecha = traspasoFecha || new Date().toISOString().split('T')[0];
      const origenInfo = CAJAS_DEF.find(c => c.id === traspasoOrigen)?.nombre || traspasoOrigen;
      const destinoInfo = CAJAS_DEF.find(c => c.id === traspasoDestino)?.nombre || traspasoDestino;

      // Egreso en caja de origen
      const egresoTraspaso = {
        id: 'mov-trasp-egr-' + Date.now(),
        fecha,
        concepto: `[Traspaso a ${destinoInfo}] ${traspasoConcepto}`,
        tipo: 'egreso',
        caja: traspasoOrigen,
        categoria: 'Otros / No recurrente',
        subcategoria: 'Traspaso interno',
        monto: montoNum,
        metodoPago: 'Traspaso interno',
        cargo: usuarioActivo?.nombre || 'Jesica',
        notas: `Salida de fondos enviada a caja ${destinoInfo}`
      };

      // Ingreso en caja de destino
      const ingresoTraspaso = {
        id: 'mov-trasp-ing-' + (Date.now() + 1),
        fecha,
        concepto: `[Traspaso desde ${origenInfo}] ${traspasoConcepto}`,
        tipo: 'ingreso',
        caja: traspasoDestino,
        categoria: 'Otros / No recurrente',
        subcategoria: 'Traspaso interno',
        monto: montoNum,
        metodoPago: 'Traspaso interno',
        cargo: usuarioActivo?.nombre || 'Jesica',
        notas: `Entrada de fondos recibida desde caja ${origenInfo}`
      };

      onAgregarMovimiento(egresoTraspaso);
      setTimeout(() => onAgregarMovimiento(ingresoTraspaso), 100);
      setModalAbierto(false);
      return;
    }

    if (!formConcepto || !formMonto || Number(formMonto) <= 0) return;

    const dataMov = {
      fecha: formFecha,
      concepto: formConcepto.trim(),
      tipo: formTipo,
      caja: formCaja,
      categoria: formCategoria,
      subcategoria: formSubcategoria,
      monto: Number(formMonto),
      metodoPago: formMetodo,
      cargo: formCargo,
      notas: formNotas.trim()
    };

    if (modoModal === 'editar' && movimientoAEditar) {
      if (onEditarMovimiento) {
        onEditarMovimiento({ ...movimientoAEditar, ...dataMov });
      } else {
        // Fallback si no está onEditarMovimiento
        onEliminarMovimiento(movimientoAEditar.id);
        onAgregarMovimiento({ id: movimientoAEditar.id, ...dataMov });
      }
    } else {
      onAgregarMovimiento({
        id: 'mov-' + Date.now(),
        ...dataMov
      });
    }

    setModalAbierto(false);
  };

  // ---------------------------------------------------------------------------
  // Exportar a Excel (CSV) compatible
  // ---------------------------------------------------------------------------
  const handleExportCSV = () => {
    const headers = ['Fecha', 'Caja / Cuenta', 'Concepto', 'Tipo', 'Categoría', 'Subcategoría', 'Monto (ARS)', 'Método de Pago', 'Quién Cargó', 'Notas'];
    const rows = movimientosFiltrados.map(m => {
      const cNombre = CAJAS_DEF.find(c => c.id === getCajaMovimiento(m))?.nombre || m.caja || 'General';
      return [
        m.fecha,
        `"${cNombre}"`,
        `"${(m.concepto || '').replace(/"/g, '""')}"`,
        m.tipo.toUpperCase(),
        `"${m.categoria || ''}"`,
        `"${m.subcategoria || ''}"`,
        m.monto,
        `"${m.metodoPago || ''}"`,
        `"${m.cargo || ''}"`,
        `"${(m.notas || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const nombreArchivo = subTabActiva === 'general' ? 'Moments_Caja_Consolidada' : `Moments_Caja_${subTabActiva.toUpperCase()}`;
    link.setAttribute('download', `${nombreArchivo}_${filtroMes}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Configuración de la caja activa actualmente seleccionada
  const cajaActivaConfig = CAJAS_DEF.find(c => c.id === subTabActiva);
  const metricasActivas = metricasPorCaja[subTabActiva] || { ingresos: 0, egresos: 0, saldo: 0, retiros: 0, cantidad: 0 };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* -------------------------------------------------------------------
          1. ENCABEZADO Y SELECTOR DE PESTAÑAS POR CAJA (ESTRUCTURA DE LA DUEÑA)
          Naranja -> Banco Nación -> Mercado Pago -> Efectivo -> General Consolidado
         ------------------------------------------------------------------- */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-soft border border-moments-border">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center font-black">
                <Wallet className="w-4 h-4 text-amber-700" />
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Caja y Gestión Financiera
              </h1>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Acceso Gerencia (Jesica & Leandro)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Administración por cajas separadas solicitada por la dueña: cada movimiento ingresa en su propia cuenta y se unifica en el general.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={abrirModalTraspaso}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Mover dinero de una caja a otra (ej: de Efectivo a Banco Nación)"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-600" />
              <span>Traspaso entre Cajas</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-all cursor-pointer"
              title="Descargar datos en formato Excel (CSV)"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Exportar Excel</span>
            </button>

            <button
              onClick={() => abrirModalNuevo(subTabActiva !== 'general' ? subTabActiva : 'naranja')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-2xl text-white shadow-md transition-all active:scale-95 cursor-pointer ${
                cajaActivaConfig ? cajaActivaConfig.btnPrimary : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>
                {subTabActiva === 'general' ? '+ Nuevo Movimiento' : `+ Cargar en ${cajaActivaConfig?.nombre}`}
              </span>
            </button>
          </div>
        </div>

        {/* BARRA DE PESTAÑAS: LAS 4 CAJAS + GENERAL CONSOLIDADO */}
        <div className="mt-4 pt-1">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
            Seleccioná la Caja a revisar o cargar:
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {CAJAS_DEF.map((caja) => {
              const Icono = caja.icono;
              const isActive = subTabActiva === caja.id;
              const saldo = metricasPorCaja[caja.id]?.saldo || 0;

              return (
                <button
                  key={caja.id}
                  onClick={() => setSubTabActiva(caja.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive 
                      ? `${caja.tabActive} border-transparent ring-2 ring-offset-1 ring-slate-400/30 scale-[1.01]` 
                      : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-700 shadow-xs'}`}>
                        <Icono className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-black text-xs tracking-tight">{caja.nombre}</span>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${caja.dot}`} />
                  </div>
                  
                  <div className="mt-1">
                    <div className="text-[10px] opacity-80 font-medium">Saldo disponible:</div>
                    <div className={`text-xs font-black tracking-tight ${isActive ? 'text-white' : saldo >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                      {formatARS(saldo)}
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Pestaña 5: General Consolidado */}
            <button
              onClick={() => setSubTabActiva('general')}
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                subTabActiva === 'general'
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/30 border-slate-900 ring-2 ring-offset-1 ring-slate-400/30 scale-[1.01]'
                  : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${subTabActiva === 'general' ? 'bg-white/20 text-white' : 'bg-white text-slate-700 shadow-xs'}`}>
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-black text-xs tracking-tight">General</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400">Total</span>
              </div>

              <div className="mt-1">
                <div className="text-[10px] opacity-80 font-medium">Total en Salón:</div>
                <div className={`text-xs font-black tracking-tight ${subTabActiva === 'general' ? 'text-amber-300' : 'text-slate-900'}`}>
                  {formatARS(metricasPorCaja.general.saldo)}
                </div>
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* -------------------------------------------------------------------
          2. TARJETAS DE TOTALES SEGÚN LA PESTAÑA ACTIVA
         ------------------------------------------------------------------- */}
      {subTabActiva !== 'general' && cajaActivaConfig ? (
        /* Vista de Caja Individual (Naranja, Banco Nación, Mercado Pago o Efectivo) */
        <div className="bg-white rounded-3xl p-5 shadow-soft border border-moments-border space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${cajaActivaConfig.dot}`} />
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>Caja {cajaActivaConfig.nombre}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cajaActivaConfig.badge}`}>
                    {cajaActivaConfig.subtitulo}
                  </span>
                </h3>
              </div>
            </div>

            {/* Selector de Mes */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-500">Período:</span>
              <select
                value={filtroMes}
                onChange={(e) => setFiltroMes(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl px-2.5 py-1 focus:outline-none cursor-pointer"
              >
                <option value="2026-10">Octubre 2026 (Actual)</option>
                <option value="2026-09">Septiembre 2026</option>
                <option value="2026-08">Agosto 2026</option>
                <option value="todos">Todo el Histórico</option>
              </select>
            </div>
          </div>

          {/* Tarjetas de Métricas de la Caja Seleccionada */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* Saldo de esta Caja */}
            <div className={`p-4 rounded-2xl border ${cajaActivaConfig.accentBg} ${cajaActivaConfig.accentBorder}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-slate-700">Saldo Actual en {cajaActivaConfig.nombre}</span>
                <div className="w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center text-slate-700 shadow-xs">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl font-black ${metricasActivas.saldo >= 0 ? 'text-slate-950' : 'text-rose-600'}`}>
                {formatARS(metricasActivas.saldo)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Disponible en esta cuenta</p>
            </div>

            {/* Ingresos en esta Caja */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-emerald-800">Total Ingresos ({cajaActivaConfig.nombre})</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-200/60 flex items-center justify-center text-emerald-800">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-950">
                {formatARS(metricasActivas.ingresos)}
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">Cobros y señas cobradas por esta caja</p>
            </div>

            {/* Egresos de esta Caja */}
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-rose-800">Total Gastos ({cajaActivaConfig.nombre})</span>
                <div className="w-7 h-7 rounded-lg bg-rose-200/60 flex items-center justify-center text-rose-800">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-rose-950">
                {formatARS(metricasActivas.egresos)}
              </div>
              <p className="text-[11px] text-rose-700 mt-1">Pagos y salidas efectuadas desde esta caja</p>
            </div>

          </div>

        </div>
      ) : (
        /* Vista General Consolidada: Comparativa de las 4 Cajas + Totales Generales */
        <div className="bg-white rounded-3xl p-5 shadow-soft border border-moments-border space-y-5">
          
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-700" />
                <span>Resumen General Consolidado</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Consolidación automática de las 4 cuentas: Naranja, Banco Nación, Mercado Pago y Efectivo.
              </p>
            </div>

            {/* Selector de Mes */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-500">Período:</span>
              <select
                value={filtroMes}
                onChange={(e) => setFiltroMes(e.target.value)}
                className="bg-amber-50 border border-amber-200 text-amber-950 font-bold text-xs rounded-xl px-2.5 py-1 focus:outline-none cursor-pointer"
              >
                <option value="2026-10">Octubre 2026 (Actual)</option>
                <option value="2026-09">Septiembre 2026</option>
                <option value="2026-08">Agosto 2026</option>
                <option value="todos">Todo el Histórico</option>
              </select>
            </div>
          </div>

          {/* Grilla Comparativa de las 4 Cajas en paralelo */}
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2.5">
              Disponibilidad de fondos en cada una de las 4 Cajas:
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CAJAS_DEF.map(c => {
                const s = metricasPorCaja[c.id]?.saldo || 0;
                const tot = metricasPorCaja.general.saldo || 1;
                const pct = tot > 0 ? Math.max(0, Math.round((s / tot) * 100)) : 0;

                return (
                  <div 
                    key={c.id} 
                    className={`p-3.5 rounded-2xl border ${c.accentBg} ${c.accentBorder} flex flex-col justify-between`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-xs text-slate-800">{c.nombre}</span>
                      <button
                        onClick={() => setSubTabActiva(c.id)}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-900 hover:underline cursor-pointer"
                      >
                        Abrir caja →
                      </button>
                    </div>
                    <div className="text-lg font-black text-slate-900">
                      {formatARS(s)}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-slate-500">
                      <span>{pct}% de la liquidez</span>
                      <span className="text-emerald-700 font-extrabold">+{formatARS(metricasPorCaja[c.id]?.ingresos || 0)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tarjetas Principales del General */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Saldo Total Consolidado */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-amber-950">Saldo Total en Salón</span>
                <div className="w-7 h-7 rounded-lg bg-amber-200/70 text-amber-900 flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-950">
                {formatARS(metricasPorCaja.general.saldo)}
              </div>
              <p className="text-[11px] text-amber-800 mt-1">Suma de las 4 cuentas</p>
            </div>

            {/* Total Ingresos Generales */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-emerald-950">Total Ingresos</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-200/70 text-emerald-900 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-950">
                {formatARS(metricasPorCaja.general.ingresos)}
              </div>
              <p className="text-[11px] text-emerald-800 mt-1">Todas las cajas sumadas</p>
            </div>

            {/* Total Gastos Generales */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-rose-950">Total Gastos</span>
                <div className="w-7 h-7 rounded-lg bg-rose-200/70 text-rose-900 flex items-center justify-center">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-rose-950">
                {formatARS(metricasPorCaja.general.egresos)}
              </div>
              <p className="text-[11px] text-rose-800 mt-1">Costos fijos, variables y retiros</p>
            </div>

            {/* Retiros Personales */}
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-indigo-950">Retiros Personales</span>
                <div className="w-7 h-7 rounded-lg bg-indigo-200/70 text-indigo-900 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-indigo-950">
                {formatARS(metricasPorCaja.general.retiros)}
              </div>
              <p className="text-[11px] text-indigo-800 mt-1">Leandro, Jesica e Iris</p>
            </div>

          </div>

          {/* Desglose de Gastos por Categoría */}
          {metricasPorCaja.general.egresos > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
                Desglose de gastos por categoría ({filtroMes === 'todos' ? 'Histórico' : 'Mes seleccionado'}):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {Object.entries(desgloseCategorias).map(([cat, total]) => {
                  const pct = Math.round((total / (metricasPorCaja.general.egresos || 1)) * 100);
                  return (
                    <div key={cat} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="flex justify-between items-center text-xs font-semibold mb-1">
                        <span className="text-slate-700 truncate pr-1">{cat}</span>
                        <span className="text-slate-500 font-bold">{pct}%</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">{formatARS(total)}</div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div className="bg-amber-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* -------------------------------------------------------------------
          3. BARRA DE FILTROS Y BÚSQUEDA DENTRO DE LA PLANILLA
         ------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl shadow-soft border border-moments-border">
        
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">Mostrar:</span>
          
          <button
            onClick={() => setFiltroTipo('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filtroTipo === 'todos' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos
          </button>
          
          <button
            onClick={() => setFiltroTipo('ingreso')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filtroTipo === 'ingreso' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            Solo Ingresos
          </button>
          
          <button
            onClick={() => setFiltroTipo('egreso')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filtroTipo === 'egreso' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-rose-800 hover:bg-rose-50'
            }`}
          >
            Solo Gastos
          </button>

          {/* Filtro extra si está en la pestaña General para aislar una caja */}
          {subTabActiva === 'general' && (
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-slate-200">
              <span className="text-[11px] font-bold text-slate-400">Caja:</span>
              <select
                value={filtroCajaGeneral}
                onChange={(e) => setFiltroCajaGeneral(e.target.value)}
                className="bg-slate-100 text-slate-700 text-xs font-bold rounded-lg px-2 py-1 border border-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="todas">Todas las Cajas</option>
                <option value="naranja">Solo Naranja</option>
                <option value="banco_nacion">Solo Banco Nación</option>
                <option value="mercado_pago">Solo Mercado Pago</option>
                <option value="efectivo">Solo Efectivo</option>
              </select>
            </div>
          )}
        </div>

        {/* Buscador */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por concepto, responsable..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          {busqueda && (
            <button 
              onClick={() => setBusqueda('')} 
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* -------------------------------------------------------------------
          4. TABLA TIPO PLANILLA EXCEL (FILTRADA POR LA CAJA ACTIVA)
         ------------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl shadow-soft border border-moments-border overflow-hidden">
        
        {/* Cabecera de la tabla */}
        <div className="p-4 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-black text-slate-700 flex items-center gap-2">
            <span>
              {subTabActiva === 'general' ? 'Movimientos de Todas las Cajas' : `Planilla de Movimientos: Caja ${cajaActivaConfig?.nombre}`}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-slate-200 text-slate-700">
              {movimientosFiltrados.length} registros
            </span>
          </div>

          <button
            onClick={() => abrirModalNuevo(subTabActiva !== 'general' ? subTabActiva : 'naranja')}
            className="text-xs font-bold text-amber-700 hover:text-amber-900 cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar fila</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-black uppercase tracking-wider text-[11px] border-b border-slate-200">
                <th className="py-3 px-4 whitespace-nowrap">Fecha</th>
                {subTabActiva === 'general' && (
                  <th className="py-3 px-3 whitespace-nowrap">Caja / Cuenta</th>
                )}
                <th className="py-3 px-4 min-w-[200px]">Concepto / Detalle</th>
                <th className="py-3 px-3 whitespace-nowrap">Tipo</th>
                <th className="py-3 px-3 min-w-[140px]">Categoría</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Monto</th>
                <th className="py-3 px-3 whitespace-nowrap">Quién Cargó</th>
                <th className="py-3 px-3 text-center whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movimientosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={subTabActiva === 'general' ? 8 : 7} className="py-12 text-center text-slate-400 font-medium">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Wallet className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs">
                        No hay movimientos registrados en {subTabActiva === 'general' ? 'este período' : `la Caja ${cajaActivaConfig?.nombre}`}.
                      </p>
                      <button
                        onClick={() => abrirModalNuevo(subTabActiva !== 'general' ? subTabActiva : 'naranja')}
                        className="text-xs font-bold text-amber-600 hover:text-amber-800 underline cursor-pointer"
                      >
                        + Cargar el primer movimiento ahora
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                movimientosFiltrados.map((m) => {
                  const esIngreso = m.tipo === 'ingreso';
                  const cajaKey = getCajaMovimiento(m);
                  const cajaItem = CAJAS_DEF.find(c => c.id === cajaKey);

                  return (
                    <tr key={m.id} className="hover:bg-amber-50/20 transition-colors">
                      
                      {/* Fecha */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-semibold">
                        {m.fecha}
                      </td>

                      {/* Columna Caja (en vista General) */}
                      {subTabActiva === 'general' && (
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black ${cajaItem?.badge || 'bg-slate-100 text-slate-700'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cajaItem?.dot || 'bg-slate-400'}`} />
                            <span>{cajaItem?.nombre || 'General'}</span>
                          </span>
                        </td>
                      )}

                      {/* Concepto */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{m.concepto}</div>
                        {m.notas && (
                          <div className="text-[11px] text-slate-400 mt-0.5">{m.notas}</div>
                        )}
                      </td>

                      {/* Tipo (+ Ingreso / - Egreso) */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                          esIngreso 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {esIngreso ? '+ Ingreso' : '- Egreso'}
                        </span>
                      </td>

                      {/* Categoría */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{m.categoria}</div>
                        {m.subcategoria && (
                          <div className="text-[10px] text-slate-500">{m.subcategoria}</div>
                        )}
                      </td>

                      {/* Monto */}
                      <td className={`py-3 px-4 text-right font-black text-sm whitespace-nowrap ${
                        esIngreso ? 'text-emerald-700' : 'text-slate-900'
                      }`}>
                        {esIngreso ? '+' : '-'}{formatARS(m.monto)}
                      </td>

                      {/* Quién Cargó */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] border border-slate-200">
                          {m.cargo}
                        </span>
                      </td>

                      {/* Acciones (Editar y Eliminar) */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => abrirModalEditar(m)}
                            className="p-1.5 text-slate-400 hover:text-amber-700 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                            title="Editar movimiento (cambiar monto, concepto o mover de caja)"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Eliminar movimiento "${m.concepto}" de $ ${Number(m.monto).toLocaleString('es-AR')}?`)) {
                                onEliminarMovimiento(m.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Eliminar movimiento"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* -------------------------------------------------------------------
          5. MODAL DE CARGA Y EDICIÓN DE MOVIMIENTO (O TRASPASO)
         ------------------------------------------------------------------- */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-modal max-w-lg w-full p-6 border border-moments-border">
            
            {/* Encabezado del modal */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                {modoModal === 'traspaso' ? (
                  <>
                    <ArrowLeftRight className="w-5 h-5 text-indigo-600" />
                    <span>Traspaso entre Cajas de Moments</span>
                  </>
                ) : modoModal === 'editar' ? (
                  <>
                    <Pencil className="w-5 h-5 text-amber-600" />
                    <span>Editar Movimiento</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-amber-600" />
                    <span>Cargar en {CAJAS_DEF.find(c => c.id === formCaja)?.nombre || 'Caja'}</span>
                  </>
                )}
              </h3>
              <button 
                onClick={() => setModalAbierto(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORMULARIO DE TRASPASO */}
            {modoModal === 'traspaso' ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-[11px] text-indigo-900 font-medium leading-relaxed">
                  Registra un movimiento entre cuentas (ejemplo: sacás efectivo del salón para depositarlo en el Banco Nación). Se crea el egreso en origen y el ingreso en destino automáticamente.
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Caja Origen (Sale el dinero)</label>
                    <select
                      value={traspasoOrigen}
                      onChange={(e) => setTraspasoOrigen(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800"
                    >
                      {CAJAS_DEF.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre} ({c.subtitulo})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Caja Destino (Entra el dinero)</label>
                    <select
                      value={traspasoDestino}
                      onChange={(e) => setTraspasoDestino(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800"
                    >
                      {CAJAS_DEF.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre} ({c.subtitulo})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Monto en ARS ($) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Ej: 500000"
                      value={traspasoMonto}
                      onChange={(e) => setTraspasoMonto(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-black text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Fecha</label>
                    <input
                      type="date"
                      required
                      value={traspasoFecha}
                      onChange={(e) => setTraspasoFecha(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Motivo / Concepto del Traspaso</label>
                  <input
                    type="text"
                    required
                    value={traspasoConcepto}
                    onChange={(e) => setTraspasoConcepto(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalAbierto(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Confirmar Traspaso
                  </button>
                </div>

              </form>
            ) : (
              /* FORMULARIO ESTÁNDAR: NUEVO O EDITAR */
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* 1. SELECTOR VISUAL DE CAJA (NARANJA / BNA / MP / EFECTIVO) */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    ¿En qué Caja / Cuenta se registra? *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CAJAS_DEF.map(c => {
                      const Icono = c.icono;
                      const sel = formCaja === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setFormCaja(c.id);
                            if (c.id === 'naranja') setFormMetodo('Tarjeta Naranja');
                            else if (c.id === 'banco_nacion') setFormMetodo('Transferencia BNA');
                            else if (c.id === 'mercado_pago') setFormMetodo('Mercado Pago');
                            else setFormMetodo('Efectivo');
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            sel 
                              ? `${c.tabActive} ring-2 ring-slate-400/20 scale-[1.02]` 
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Icono className="w-3.5 h-3.5" />
                            {sel && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="font-extrabold text-[11px] truncate">{c.nombre}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Tipo de Movimiento (Cobro vs Gasto) */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setFormTipo('egreso');
                      if (formCategoria === 'Variables') {
                        setFormSubcategoria(CATEGORIAS_CAJA['Variables'][0]);
                      }
                    }}
                    className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                      formTipo === 'egreso' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    - Gasto / Egreso
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormTipo('ingreso');
                      setFormCategoria('Variables');
                      setFormSubcategoria('Proveedores de evento');
                    }}
                    className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                      formTipo === 'ingreso' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    + Cobro / Ingreso
                  </button>
                </div>

                {/* 3. Concepto y Monto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">Concepto / Detalle *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Seña Boda Sofía / Compra de carnes Don Pedro"
                      value={formConcepto}
                      onChange={(e) => setFormConcepto(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Monto en ARS ($) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Ej: 450000"
                      value={formMonto}
                      onChange={(e) => setFormMonto(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-black text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Fecha</label>
                    <input
                      type="date"
                      required
                      value={formFecha}
                      onChange={(e) => setFormFecha(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* 4. Categoría y Subcategoría */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Categoría Principal</label>
                    <select
                      value={formCategoria}
                      onChange={(e) => {
                        const nuevaCat = e.target.value;
                        setFormCategoria(nuevaCat);
                        setFormSubcategoria(CATEGORIAS_CAJA[nuevaCat]?.[0] || '');
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    >
                      {Object.keys(CATEGORIAS_CAJA).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Subcategoría específica</label>
                    <select
                      value={formSubcategoria}
                      onChange={(e) => setFormSubcategoria(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    >
                      {(CATEGORIAS_CAJA[formCategoria] || []).map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 5. Quién Carga y Notas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Quién Carga</label>
                    <select
                      value={formCargo}
                      onChange={(e) => setFormCargo(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
                    >
                      {USUARIOS.map(u => (
                        <option key={u.id} value={u.nombre}>{u.nombre} ({u.badge})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Observaciones / Notas (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej: Pago de mozos / Seña evento"
                      value={formNotas}
                      onChange={(e) => setFormNotas(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalAbierto(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-black bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    {modoModal === 'editar' ? 'Guardar Cambios' : `Cargar en ${CAJAS_DEF.find(c => c.id === formCaja)?.nombre || 'Caja'}`}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
