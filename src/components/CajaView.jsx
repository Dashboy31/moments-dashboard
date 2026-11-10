import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { 
  Plus, 
  Download, 
  Upload,
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
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  FileSpreadsheet,
  Building,
  Store,
  Clock,
  Info,
  RefreshCw,
  Phone
} from 'lucide-react';
import { 
  CATEGORIAS_CAJA, 
  CATEGORIAS_EGRESO,
  CATEGORIAS_INGRESO,
  USUARIOS, 
  formatARS, 
  normalizarCategoriaMovimiento,
  CAJAS_LISTA
} from '../utils/mockData';

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

export function getCajaMovimiento(m) {
  if (m?.caja && ['naranja', 'banco_nacion', 'mercado_pago', 'efectivo'].includes(m.caja)) {
    return m.caja;
  }
  const metodo = String(m?.metodoPago || '').toLowerCase();
  const concepto = String(m?.concepto || '').toLowerCase();
  if (metodo.includes('efectivo') || concepto.includes('efectivo')) return 'efectivo';
  if (metodo.includes('naranja') || metodo.includes('tarjeta') || concepto.includes('naranja')) return 'naranja';
  if (metodo.includes('mercado') || metodo.includes('mp') || concepto.includes('mercado') || concepto.includes('mp')) return 'mercado_pago';
  return 'banco_nacion';
}

export default function CajaView({ 
  movimientos = [], 
  onAgregarMovimiento, 
  onEditarMovimiento, 
  onEliminarMovimiento, 
  usuarioActivo,
  eventos = [],
  configuracion,
  onGuardarConfiguracion,
  prestamosTramos = [],
  onRegistrarTramoPrestamo,
  onEliminarTramoPrestamo,
  proveedoresDatos = [],
  onGuardarProveedorDatos
}) {
  // Pestañas principales de Caja: 'cajas' | 'resultado' | 'fijos' | 'proveedores' | 'importar'
  const [seccionCaja, setSeccionCaja] = useState('cajas');

  // Sub-pestaña de cuentas en 'cajas': 'naranja' | 'banco_nacion' | 'mercado_pago' | 'efectivo' | 'general'
  const [subTabActiva, setSubTabActiva] = useState('general');

  // Filtros de tabla
  const mesActualStr = new Date().toISOString().slice(0, 7);
  const [filtroMes, setFiltroMes] = useState(mesActualStr); // Arranca en el mes actual
  const [filtroTipo, setFiltroTipo] = useState('todos'); // 'todos', 'ingreso', 'egreso'
  const [busqueda, setBusqueda] = useState('');
  const [filtroCajaGeneral, setFiltroCajaGeneral] = useState('todas');

  // Modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState('nuevo'); // 'nuevo' | 'editar' | 'traspaso'
  const [movimientoAEditar, setMovimientoAEditar] = useState(null);

  // Formulario movimiento
  const [formCaja, setFormCaja] = useState('naranja');
  const [formFecha, setFormFecha] = useState(new Date().toISOString().split('T')[0]);
  const [formConcepto, setFormConcepto] = useState('');
  const [formTipo, setFormTipo] = useState('egreso');
  const [formCategoria, setFormCategoria] = useState('Variables – Otros');
  const [formSubcategoria, setFormSubcategoria] = useState('Proveedores de evento');
  const [formMonto, setFormMonto] = useState('');
  const [formMetodo, setFormMetodo] = useState('Transferencia');
  const [formCargo, setFormCargo] = useState(usuarioActivo?.nombre || 'Jesica');
  const [formEventoId, setFormEventoId] = useState('');
  const [formOrigen, setFormOrigen] = useState('Seña');
  const [formProveedor, setFormProveedor] = useState('');
  const [formNotas, setFormNotas] = useState('');

  // Formulario de Traspaso
  const [traspasoOrigen, setTraspasoOrigen] = useState('efectivo');
  const [traspasoDestino, setTraspasoDestino] = useState('banco_nacion');
  const [traspasoMonto, setTraspasoMonto] = useState('');
  const [traspasoFecha, setTraspasoFecha] = useState(new Date().toISOString().split('T')[0]);
  const [traspasoConcepto, setTraspasoConcepto] = useState('Traspaso interno entre cuentas');

  const cfg = configuracion || {
    costoPromedioPlanificacion: 10000000,
    tramoPrestamoSugerido: 20000000,
    colchonSeguridadEventos: 1,
    tarifaAdultoVigente: 127000,
    eventoBaseCosto: 7000000,
    eventoBasePersonas: 85,
    fijosReferenciaMes: 5000000
  };

  // Totales de movimientos y saldos reales de cajas
  const metricasPorCaja = useMemo(() => {
    const res = {
      naranja: { ingresos: 0, egresos: 0, saldo: 0 },
      banco_nacion: { ingresos: 0, egresos: 0, saldo: 0 },
      mercado_pago: { ingresos: 0, egresos: 0, saldo: 0 },
      efectivo: { ingresos: 0, egresos: 0, saldo: 0 },
      general: { ingresos: 0, egresos: 0, saldo: 0 }
    };

    (movimientos || []).forEach(m => {
      const c = getCajaMovimiento(m);
      const val = Number(m.monto) || 0;
      const esIngreso = m.tipo === 'ingreso';

      if (esIngreso) {
        if (res[c]) res[c].ingresos += val;
        res.general.ingresos += val;
      } else {
        if (res[c]) res[c].egresos += val;
        res.general.egresos += val;
      }
    });

    for (const key of ['naranja', 'banco_nacion', 'mercado_pago', 'efectivo', 'general']) {
      res[key].saldo = res[key].ingresos - res[key].egresos;
    }

    return res;
  }, [movimientos]);

  // Lista de meses disponibles para filtro
  const mesesDisponibles = useMemo(() => {
    const setM = new Set();
    setM.add(mesActualStr);
    (movimientos || []).forEach(m => {
      if (m.fecha && m.fecha.length >= 7) setM.add(m.fecha.slice(0, 7));
    });
    return Array.from(setM).sort().reverse();
  }, [movimientos, mesActualStr]);

  // Movimientos filtrados para la tabla
  const movimientosFiltrados = useMemo(() => {
    return (movimientos || []).filter(m => {
      const c = getCajaMovimiento(m);
      if (subTabActiva !== 'general' && c !== subTabActiva) return false;
      if (subTabActiva === 'general' && filtroCajaGeneral !== 'todas' && c !== filtroCajaGeneral) return false;
      if (filtroMes !== 'todos' && (!m.fecha || !m.fecha.startsWith(filtroMes))) return false;
      if (filtroTipo !== 'todos' && m.tipo !== filtroTipo) return false;
      if (busqueda.trim() !== '') {
        const q = busqueda.toLowerCase();
        const coincide = 
          (m.concepto && m.concepto.toLowerCase().includes(q)) ||
          (m.categoria && m.categoria.toLowerCase().includes(q)) ||
          (m.subcategoria && m.subcategoria.toLowerCase().includes(q)) ||
          (m.cargo && m.cargo.toLowerCase().includes(q)) ||
          (m.proveedor && m.proveedor.toLowerCase().includes(q)) ||
          (m.cargadoPor && m.cargadoPor.toLowerCase().includes(q));
        if (!coincide) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [movimientos, subTabActiva, filtroCajaGeneral, filtroMes, filtroTipo, busqueda]);

  // Handlers para modales
  const handleAbrirNuevo = (cajaDest = null) => {
    const destino = cajaDest || (subTabActiva !== 'general' ? subTabActiva : 'naranja');
    setModoModal('nuevo');
    setMovimientoAEditar(null);
    setFormCaja(destino);
    setFormFecha(new Date().toISOString().split('T')[0]);
    setFormConcepto('');
    setFormTipo('egreso');
    setFormCategoria('Variables – Insumos');
    setFormSubcategoria('Carnes');
    setFormMonto('');
    setFormEventoId('');
    setFormOrigen('Seña');
    setFormProveedor('');
    setFormCargo(usuarioActivo?.nombre || 'Jesica');
    setFormNotas('');
    setModalAbierto(true);
  };

  const handleCambiarTipo = (nuevoTipo) => {
    setFormTipo(nuevoTipo);
    if (nuevoTipo === 'ingreso') {
      if (!CATEGORIAS_INGRESO[formCategoria]) {
        const primerCat = Object.keys(CATEGORIAS_INGRESO)[0]; // 'Cumpleaños de 15'
        setFormCategoria(primerCat);
        setFormSubcategoria(CATEGORIAS_INGRESO[primerCat][0]); // 'Seña'
      }
    } else {
      if (!CATEGORIAS_EGRESO[formCategoria]) {
        const primerCat = Object.keys(CATEGORIAS_EGRESO)[0]; // 'Variables – Insumos'
        setFormCategoria(primerCat);
        setFormSubcategoria(CATEGORIAS_EGRESO[primerCat][0]); // 'Carnes'
      }
    }
  };

  const handleAbrirEditar = (m) => {
    setModoModal('editar');
    setMovimientoAEditar(m);
    setFormCaja(getCajaMovimiento(m));
    setFormFecha(m.fecha || new Date().toISOString().split('T')[0]);
    setFormConcepto(m.concepto || '');
    const t = m.tipo || 'egreso';
    setFormTipo(t);
    if (t === 'ingreso') {
      const cats = CATEGORIAS_INGRESO;
      const catExiste = Boolean(cats[m.categoria]);
      const catFinal = catExiste ? m.categoria : 'Cumpleaños de 15';
      setFormCategoria(catFinal);
      setFormSubcategoria(m.subcategoria || cats[catFinal][0] || 'Seña');
    } else {
      const norm = normalizarCategoriaMovimiento(m.categoria, m.subcategoria);
      setFormCategoria(norm.categoria);
      setFormSubcategoria(norm.subcategoria);
    }
    setFormMonto(m.monto ? String(m.monto) : '');
    setFormEventoId(m.eventoId || '');
    setFormOrigen(m.origen || m.subcategoria || 'Seña');
    setFormProveedor(m.proveedor || '');
    setFormCargo(m.cargo || (usuarioActivo?.nombre || 'Jesica'));
    setFormNotas(m.notas || '');
    setModalAbierto(true);
  };

  const handleAbrirTraspaso = () => {
    setModoModal('traspaso');
    setTraspasoOrigen(subTabActiva !== 'general' ? subTabActiva : 'efectivo');
    setTraspasoDestino(subTabActiva === 'banco_nacion' ? 'efectivo' : 'banco_nacion');
    setTraspasoMonto('');
    setTraspasoFecha(new Date().toISOString().split('T')[0]);
    setTraspasoConcepto('Traspaso interno entre cuentas');
    setModalAbierto(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modoModal === 'traspaso') {
      const montoNum = Number(traspasoMonto);
      if (!montoNum || montoNum <= 0 || traspasoOrigen === traspasoDestino) {
        alert('Ingresá un monto válido y seleccioná cajas de origen y destino distintas.');
        return;
      }
      const fecha = traspasoFecha || new Date().toISOString().split('T')[0];
      const origenNom = CAJAS_DEF.find(c => c.id === traspasoOrigen)?.nombre || traspasoOrigen;
      const destinoNom = CAJAS_DEF.find(c => c.id === traspasoDestino)?.nombre || traspasoDestino;

      const egreso = {
        id: `mov-trasp-egr-${Date.now()}`,
        fecha,
        concepto: `[Traspaso a ${destinoNom}] ${traspasoConcepto}`,
        tipo: 'egreso',
        categoria: 'Otros / No recurrente',
        subcategoria: 'Traspaso interno',
        monto: montoNum,
        caja: traspasoOrigen,
        metodoPago: 'Traspaso interno',
        cargo: usuarioActivo?.nombre || 'Jesica',
        cargadoPor: `${usuarioActivo?.nombre || 'Jesica'} · ${fecha}`,
        notas: `Salida de fondos a ${destinoNom}`
      };

      const ingreso = {
        id: `mov-trasp-ing-${Date.now() + 1}`,
        fecha,
        concepto: `[Traspaso desde ${origenNom}] ${traspasoConcepto}`,
        tipo: 'ingreso',
        categoria: 'Otros / No recurrente',
        subcategoria: 'Traspaso interno',
        monto: montoNum,
        caja: traspasoDestino,
        metodoPago: 'Traspaso interno',
        cargo: usuarioActivo?.nombre || 'Jesica',
        cargadoPor: `${usuarioActivo?.nombre || 'Jesica'} · ${fecha}`,
        notas: `Entrada de fondos desde ${origenNom}`
      };

      onAgregarMovimiento(egreso);
      setTimeout(() => onAgregarMovimiento(ingreso), 80);
      setModalAbierto(false);
      return;
    }

    const numMonto = Number(formMonto);
    if (!numMonto || numMonto <= 0 || !formConcepto.trim()) return;

    const ahora = new Date();
    const horaStr = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    const cargadoPorActual = `${usuarioActivo?.nombre || 'Jesica'} · ${ahora.toLocaleDateString('es-AR')} ${horaStr}`;

    const movimientoData = {
      fecha: formFecha,
      concepto: formConcepto.trim(),
      tipo: formTipo,
      caja: formCaja,
      categoria: formCategoria,
      subcategoria: formSubcategoria,
      monto: numMonto,
      metodoPago: formCaja === 'naranja' ? 'Tarjeta Naranja' : (formCaja === 'banco_nacion' ? 'Transferencia BNA' : (formCaja === 'mercado_pago' ? 'Mercado Pago' : 'Efectivo')),
      cargo: formCargo,
      cargadoPor: modoModal === 'editar' ? (movimientoAEditar?.cargadoPor || cargadoPorActual) : cargadoPorActual,
      eventoId: formEventoId || null,
      origen: formTipo === 'ingreso' ? (formSubcategoria || formOrigen || 'Seña') : null,
      proveedor: formProveedor.trim() || null,
      notas: formNotas.trim()
    };

    if (modoModal === 'editar' && movimientoAEditar) {
      onEditarMovimiento({ ...movimientoData, id: movimientoAEditar.id });
    } else {
      onAgregarMovimiento({ ...movimientoData, id: `mov-${Date.now()}` });
    }

    setModalAbierto(false);
  };

  // ===========================================================================
  // SUB-PESTAÑA 2: RESULTADO MENSUAL (PUNTO 6)
  // ===========================================================================
  const [mesResultadoActivo, setMesResultadoActivo] = useState(mesActualStr);
  const [segundoMesResultado, setSegundoMesResultado] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 7);
  });

  const calcularMetricasMes = (mes) => {
    const movsMes = (movimientos || []).filter(m => m.fecha && m.fecha.startsWith(mes));
    
    // Ingresos operativos por tipo de evento
    let ingOperativos = 0;
    const ingPorTipo = {};

    // Variables: Insumos, Personal, Otros
    let varInsumos = 0;
    let varPersonal = 0;
    let varOtros = 0;

    // Fijos
    let fijosTotal = 0;

    // Retiros
    let retirosTotal = 0;

    // Financiamiento
    let prestamosRecibidos = 0;
    let prestamosDevueltos = 0;

    // Conteo de items reales vs estimados
    let totalMovs = movsMes.length;

    movsMes.forEach(m => {
      const val = Number(m.monto) || 0;
      const esIng = m.tipo === 'ingreso';
      const norm = normalizarCategoriaMovimiento(m.categoria, m.subcategoria);

      if (esIng) {
        if (norm.categoria === 'Financiamiento') {
          prestamosRecibidos += val;
        } else {
          ingOperativos += val;
          // Asociar a tipo de evento
          const ev = (eventos || []).find(e => String(e.id) === String(m.eventoId));
          const tipoKey = ev ? ev.tipo : 'Otros Eventos';
          ingPorTipo[tipoKey] = (ingPorTipo[tipoKey] || 0) + val;
        }
      } else {
        if (norm.categoria === 'Financiamiento') {
          prestamosDevueltos += val;
        } else if (norm.categoria === 'Retiros personales') {
          retirosTotal += val;
        } else if (norm.categoria === 'Variables – Insumos') {
          varInsumos += val;
        } else if (norm.categoria === 'Variables – Personal') {
          varPersonal += val;
        } else if (norm.categoria === 'Fijos') {
          fijosTotal += val;
        } else {
          varOtros += val;
        }
      }
    });

    // Si los fijos del mes no tienen movimientos cargados, usamos el fijosReferenciaMes de configuración
    const fijosUsados = fijosTotal > 0 ? fijosTotal : (cfg.fijosReferenciaMes || 5000000);
    const esFijosEstimado = fijosTotal === 0;

    const totalVariables = varInsumos + varPersonal + varOtros;
    const resultadoOperativo = ingOperativos - totalVariables - fijosUsados;
    const financiamientoNeto = prestamosRecibidos - prestamosDevueltos;
    const cajaFinal = resultadoOperativo - retirosTotal + financiamientoNeto;

    // Porcentaje de datos reales
    const pctDatosReales = totalMovs > 0 ? (esFijosEstimado ? 75 : 100) : 0;

    // Punto de equilibrio: eventos base para cubrir fijos
    // Margen evento base = (tarifaAdulto * personasBase) - costoBase
    const margenBase = ((cfg.tarifaAdultoVigente || 127000) * (cfg.eventoBasePersonas || 85)) - (cfg.eventoBaseCosto || 7000000);
    const puntoEquilibrio = margenBase > 0 ? (fijosUsados / margenBase).toFixed(1) : 0;

    // Eventos del mes con semáforo
    const evMes = (eventos || []).filter(e => e.fecha && e.fecha.startsWith(mes) && e.tipo !== 'mantenimiento');

    return {
      mes,
      ingPorTipo,
      ingOperativos,
      varInsumos,
      varPersonal,
      varOtros,
      totalVariables,
      fijosUsados,
      esFijosEstimado,
      resultadoOperativo,
      retirosTotal,
      prestamosRecibidos,
      prestamosDevueltos,
      financiamientoNeto,
      cajaFinal,
      pctDatosReales,
      puntoEquilibrio,
      eventos: evMes
    };
  };

  const metricasMes1 = useMemo(() => calcularMetricasMes(mesResultadoActivo), [mesResultadoActivo, movimientos, eventos, cfg]);
  const metricasMes2 = useMemo(() => calcularMetricasMes(segundoMesResultado), [segundoMesResultado, movimientos, eventos, cfg]);

  // Exportar Resultado Mensual a Excel
  const handleExportResultadoExcel = () => {
    const wb = XLSX.utils.book_new();
    const data = [
      ['Moments · Salón de Eventos - Cuadro de Resultado Mensual'],
      ['Concepto', mesResultadoActivo, segundoMesResultado],
      ['Total Ingresos Operativos', metricasMes1.ingOperativos, metricasMes2.ingOperativos],
      ['Variables - Insumos', metricasMes1.varInsumos, metricasMes2.varInsumos],
      ['Variables - Personal', metricasMes1.varPersonal, metricasMes2.varPersonal],
      ['Variables - Otros', metricasMes1.varOtros, metricasMes2.varOtros],
      ['Total Variables', metricasMes1.totalVariables, metricasMes2.totalVariables],
      ['Costos Fijos', metricasMes1.fijosUsados, metricasMes2.fijosUsados],
      ['RESULTADO OPERATIVO', metricasMes1.resultadoOperativo, metricasMes2.resultadoOperativo],
      ['Retiros de Socios', metricasMes1.retirosTotal, metricasMes2.retirosTotal],
      ['Financiamiento Familiar (Neto)', metricasMes1.financiamientoNeto, metricasMes2.financiamientoNeto],
      ['CAJA FINAL', metricasMes1.cajaFinal, metricasMes2.cajaFinal],
      ['Punto de Equilibrio (eventos base)', metricasMes1.puntoEquilibrio, metricasMes2.puntoEquilibrio]
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Resultado');
    XLSX.writeFile(wb, `Moments_Resultado_${mesResultadoActivo}_${segundoMesResultado}.xlsx`);
  };

  // ===========================================================================
  // SUB-PESTAÑA 3: CONTROL DE COSTOS FIJOS (PUNTO 5)
  // ===========================================================================
  const estadoCostosFijos = useMemo(() => {
    const plantilla = cfg.plantillaCostosFijos || [];
    const diaHoy = new Date().getDate();
    const movsFijosMes = (movimientos || []).filter(m => {
      if (!m.fecha || !m.fecha.startsWith(filtroMes === 'todos' ? mesActualStr : filtroMes)) return false;
      if (m.tipo !== 'egreso') return false;
      const norm = normalizarCategoriaMovimiento(m.categoria, m.subcategoria);
      return norm.categoria === 'Fijos';
    });

    return plantilla.map(fijo => {
      // Buscar si hay pago en el mes
      const pago = movsFijosMes.find(m => {
        const norm = normalizarCategoriaMovimiento(m.categoria, m.subcategoria);
        return norm.subcategoria.toLowerCase() === fijo.subcategoria.toLowerCase() ||
               (m.concepto && m.concepto.toLowerCase().includes(fijo.subcategoria.toLowerCase()));
      });

      const pagado = Boolean(pago);
      const diaVence = Number(fijo.diaVencimiento) || 10;
      const vencido = !pagado && diaHoy > diaVence;
      const estado = pagado ? 'Pagado' : (vencido ? 'Vencido' : 'Pendiente');
      const montoReal = pago ? Number(pago.monto) : null;
      const montoMostrar = montoReal !== null ? montoReal : (Number(fijo.montoEstimado) || 0);

      return {
        ...fijo,
        pagado,
        vencido,
        estado,
        montoReal,
        montoMostrar,
        esEstimado: montoReal === null,
        movimientoId: pago ? pago.id : null
      };
    });
  }, [cfg, movimientos, filtroMes, mesActualStr]);

  // ===========================================================================
  // SUB-PESTAÑA 4: DIRECTORIO DE PROVEEDORES (PUNTO 10)
  // ===========================================================================
  const [modalProveedor, setModalProveedor] = useState(null);
  const [provTel, setProvTel] = useState('');
  const [provNotas, setProvNotas] = useState('');

  const listaProveedores = useMemo(() => {
    const map = {};
    const anioActual = new Date().getFullYear().toString();

    (movimientos || []).forEach(m => {
      if (m.tipo !== 'egreso') return;
      const provNom = m.proveedor ? String(m.proveedor).trim() : null;
      if (!provNom) return;

      if (!map[provNom]) {
        map[provNom] = {
          nombre: provNom,
          categoria: m.subcategoria || m.categoria || 'Insumos',
          ultimoPrecio: Number(m.monto) || 0,
          ultimaFecha: m.fecha || '',
          totalAnio: 0,
          cantidadCompras: 0
        };
      }

      const val = Number(m.monto) || 0;
      if (m.fecha && (!map[provNom].ultimaFecha || m.fecha >= map[provNom].ultimaFecha)) {
        map[provNom].ultimaFecha = m.fecha;
        map[provNom].ultimoPrecio = val;
        map[provNom].categoria = m.subcategoria || m.categoria;
      }

      if (m.fecha && m.fecha.startsWith(anioActual)) {
        map[provNom].totalAnio += val;
      }
      map[provNom].cantidadCompras += 1;
    });

    // Enriquecer con proveedoresDatos
    return Object.values(map).map(p => {
      const extra = (proveedoresDatos || []).find(pd => pd.id === p.nombre || pd.nombre === p.nombre);
      return {
        ...p,
        telefono: extra?.telefono || '',
        notas: extra?.notas || ''
      };
    }).sort((a, b) => b.totalAnio - a.totalAnio);
  }, [movimientos, proveedoresDatos]);

  const handleGuardarDatosProveedor = async (e) => {
    e.preventDefault();
    if (!modalProveedor || !onGuardarProveedorDatos) return;
    await onGuardarProveedorDatos({
      id: modalProveedor.nombre,
      nombre: modalProveedor.nombre,
      telefono: provTel.trim(),
      notas: provNotas.trim()
    });
    setModalProveedor(null);
  };

  // ===========================================================================
  // SUB-PESTAÑA 5: IMPORTAR EXCEL CON PLANTILLA OFICIAL (PUNTO 8)
  // ===========================================================================
  const [archivoImportar, setArchivoImportar] = useState(null);
  const [filasPreview, setFilasPreview] = useState([]);
  const [importando, setImportando] = useState(false);
  const [resumenImportacion, setResumenImportacion] = useState(null);
  const [modoManualExcel, setModoManualExcel] = useState(false);
  const [columnasExcel, setColumnasExcel] = useState([]);
  const [mapeoCols, setMapeoCols] = useState({
    fecha: '',
    concepto: '',
    monto: '',
    tipo: '',
    caja: '',
    categoria: ''
  });

  // Descarga de la plantilla oficial con 2 hojas: Movimientos e Instrucciones
  const handleDescargarPlantilla = () => {
    const wb = XLSX.utils.book_new();

    // Hoja 1: Movimientos
    const encabezados = [
      'Fecha',
      'Tipo',
      'Categoría',
      'Subcategoría',
      'Concepto',
      'Monto',
      'Caja',
      'Fecha del evento',
      'Origen',
      'Proveedor',
      'Notas'
    ];
    const ejemplos = [
      [
        new Date().toLocaleDateString('es-AR'),
        'Egreso',
        'Variables – Insumos',
        'Carnes',
        'Compra de lomos y asado para fiesta',
        450000,
        'Efectivo',
        '',
        '',
        'Carnicería Don Juan',
        'Factura B 0041'
      ],
      [
        new Date().toLocaleDateString('es-AR'),
        'Ingreso',
        'Variables – Otros',
        'Proveedores de evento',
        'Seña Boda Rossi',
        1500000,
        'Banco Nación',
        '2026-11-20',
        'Seña',
        '',
        'Transferencia BNA confirmada'
      ]
    ];
    const wsMov = XLSX.utils.aoa_to_sheet([encabezados, ...ejemplos]);
    XLSX.utils.book_append_sheet(wb, wsMov, 'Movimientos');

    // Hoja 2: Instrucciones
    const instrucciones = [
      ['INSTRUCCIONES PARA LA CARGA DE MOVIMIENTOS EN MOMENT\'S'],
      [''],
      ['Columna', 'Regla / Valor Permitido', 'Detalle'],
      ['Fecha', 'dd/mm/aaaa', 'Fecha en la que ocurrió el pago o cobro.'],
      ['Tipo', 'Ingreso o Egreso', 'Escribir exactamente "Ingreso" o "Egreso".'],
      ['Categoría', 'Variables – Insumos | Variables – Personal | Variables – Otros | Fijos | Retiros personales | Financiamiento | Otros / No recurrente', 'Categoría oficial.'],
      ['Subcategoría', 'Ver lista completa debajo', 'Debe corresponder a la categoría seleccionada.'],
      ['Concepto', 'Texto descriptivo', 'Detalle claro del movimiento.'],
      ['Monto', 'Número positivo', 'Sin signo $ ni separador de miles. Ej: 450000'],
      ['Caja', 'Naranja, Banco Nación, Mercado Pago o Efectivo', 'Cuenta en la que ingresa o egresa el dinero.'],
      ['Fecha del evento', 'aaaa-mm-dd o dd/mm/aaaa (Opcional)', 'Si se completa, se vincula automáticamente al evento de esa fecha.'],
      ['Origen', 'Seña, Cuota, Saldo final, Otro', 'Solo para ingresos. En egresos dejar vacío.'],
      ['Proveedor', 'Texto (Opcional)', 'Nombre del proveedor o persona destinataria.'],
      ['Notas', 'Texto (Opcional)', 'Comprobante, nro de transferencia, etc.'],
      [''],
      ['LISTADO DE CATEGORÍAS Y SUBCATEGORÍAS VÁLIDAS:'],
      ['']
    ];

    Object.entries(CATEGORIAS_CAJA).forEach(([cat, subs]) => {
      instrucciones.push([cat, subs.join(' · ')]);
    });

    const wsInst = XLSX.utils.aoa_to_sheet(instrucciones);
    XLSX.utils.book_append_sheet(wb, wsInst, 'Instrucciones');

    XLSX.writeFile(wb, 'Plantilla_Moments_Movimientos.xlsx');
  };

  // Leer y validar archivo Excel seleccionado
  const handleArchivoSeleccionado = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArchivoImportar(file);
    setResumenImportacion(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

        if (json.length < 2) {
          alert('El archivo no contiene filas de datos.');
          return;
        }

        const headers = json[0].map(h => String(h || '').trim());
        setColumnasExcel(headers);

        // Detectar si tiene el formato estándar oficial
        const headersOficiales = [
          'Fecha', 'Tipo', 'Categoría', 'Subcategoría', 'Concepto', 
          'Monto', 'Caja', 'Fecha del evento', 'Origen', 'Proveedor', 'Notas'
        ];
        const esOficial = headers.length >= 7 && headers.slice(0, 7).every((h, i) => h.toLowerCase() === headersOficiales[i].toLowerCase());

        if (esOficial) {
          setModoManualExcel(false);
          validarFilasOficiales(json.slice(1));
        } else {
          setModoManualExcel(true);
        }
      } catch (err) {
        alert('Error al leer el archivo Excel: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const validarFilasOficiales = (filas) => {
    const preview = [];
    const duplicadosExistentes = (movimientos || []);

    filas.forEach((f, idx) => {
      if (!f || f.length === 0 || f.every(c => !c)) return;

      const [fFecha, fTipo, fCat, fSubcat, fConcepto, fMonto, fCaja, fFechaEv, fOrigen, fProv, fNotas] = f;
      const errores = [];

      // Validar monto
      const montoLimpio = String(fMonto || '').replace(/[^0-9.-]/g, '');
      const montoNum = Number(montoLimpio);
      if (isNaN(montoNum) || montoNum <= 0) {
        errores.push('Monto vacío o inválido');
      }

      // Validar tipo
      const tipoNorm = String(fTipo || '').toLowerCase();
      if (!tipoNorm.includes('ingreso') && !tipoNorm.includes('egreso')) {
        errores.push('Tipo debe ser Ingreso o Egreso');
      }

      // Validar caja
      const cajaNorm = getCajaMovimiento({ metodoPago: fCaja, concepto: fConcepto, caja: fCaja });

      // Detectar posible duplicado
      const conceptoStr = String(fConcepto || '').trim().toLowerCase();
      const posibleDuplicado = duplicadosExistentes.some(m => {
        return m.monto === montoNum && 
               String(m.concepto || '').toLowerCase().includes(conceptoStr.slice(0, 10)) &&
               conceptoStr.length > 3;
      });

      let estado = 'ok';
      if (errores.length > 0) estado = 'error';
      else if (posibleDuplicado) estado = 'duplicado';

      preview.push({
        numFila: idx + 2,
        fecha: fFecha || new Date().toISOString().slice(0, 10),
        tipo: tipoNorm.includes('ingreso') ? 'ingreso' : 'egreso',
        categoria: fCat || 'Variables – Otros',
        subcategoria: fSubcat || 'Proveedores de evento',
        concepto: fConcepto || 'Movimiento importado',
        monto: montoNum || 0,
        caja: cajaNorm,
        eventoId: null,
        fechaEvento: fFechaEv || null,
        origen: fOrigen || null,
        proveedor: fProv || null,
        notas: fNotas || '',
        estado,
        errores,
        ignorarDuplicado: false
      });
    });

    setFilasPreview(preview);
  };

  const handleConfirmarImportacion = () => {
    const filasAImportar = filasPreview.filter(f => f.estado === 'ok' || (f.estado === 'duplicado' && f.ignorarDuplicado));
    if (filasAImportar.length === 0) {
      alert('No hay filas válidas para importar.');
      return;
    }

    setImportando(true);
    const ahoraStr = new Date().toLocaleDateString('es-AR');
    let cant = 0;

    filasAImportar.forEach((f, i) => {
      // Buscar si coincide con la fecha de algún evento
      let evId = null;
      if (f.fechaEvento) {
        const ev = (eventos || []).find(e => e.fecha === f.fechaEvento);
        if (ev) evId = ev.id;
      }

      const nuevo = {
        id: `mov-imp-${Date.now()}-${i}`,
        fecha: f.fecha,
        concepto: f.concepto,
        tipo: f.tipo,
        categoria: f.categoria,
        subcategoria: f.subcategoria,
        monto: f.monto,
        caja: f.caja,
        metodoPago: f.caja === 'naranja' ? 'Tarjeta Naranja' : (f.caja === 'banco_nacion' ? 'Transferencia BNA' : (f.caja === 'mercado_pago' ? 'Mercado Pago' : 'Efectivo')),
        cargo: usuarioActivo?.nombre || 'Jesica',
        cargadoPor: `Importación Excel – ${usuarioActivo?.nombre || 'Jesica'} – ${ahoraStr}`,
        eventoId: evId,
        origen: f.tipo === 'ingreso' ? (f.origen || 'Otro') : null,
        proveedor: f.proveedor,
        notas: f.notas
      };

      onAgregarMovimiento(nuevo);
      cant++;
    });

    setResumenImportacion({
      importados: cant,
      errores: filasPreview.filter(f => f.estado === 'error').length,
      duplicadosOmitidos: filasPreview.filter(f => f.estado === 'duplicado' && !f.ignorarDuplicado).length
    });

    setImportando(false);
    setFilasPreview([]);
    setArchivoImportar(null);
  };

  // Exportar Excel tradicional
  const handleExportCSV = () => {
    const headers = ['Fecha', 'Caja', 'Concepto', 'Tipo', 'Categoría', 'Subcategoría', 'Monto', 'Método', 'Cargado Por', 'Notas'];
    const rows = movimientosFiltrados.map(m => [
      m.fecha,
      CAJAS_DEF.find(c => c.id === getCajaMovimiento(m))?.nombre || m.caja,
      m.concepto || '',
      m.tipo.toUpperCase(),
      m.categoria || '',
      m.subcategoria || '',
      m.monto || 0,
      m.metodoPago || '',
      m.cargadoPor || m.cargo || '',
      m.notas || ''
    ]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    XLSX.utils.book_append_sheet(wb, ws, 'Movimientos');
    XLSX.writeFile(wb, `Moments_Movimientos_${filtroMes}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const cajaActivaConfig = CAJAS_DEF.find(c => c.id === subTabActiva);

  return (
    <div className="space-y-6 animate-fadeIn font-['Montserrat']">
      
      {/* =====================================================================
          2. NAVEGACIÓN ENTRE SECCIONES DE CAJA
          Cajas & Cuentas | Resultado Mensual | Control de Fijos | Proveedores | Importar Excel
         ===================================================================== */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
        <button
          onClick={() => setSeccionCaja('cajas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
            seccionCaja === 'cajas'
              ? 'bg-[#2F3A2A] text-[#F6F3E9] shadow-md border border-[#C6A96A]/60'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-[#E3DCCE]'
          }`}
        >
          <Wallet className="w-4 h-4 text-[#C6A96A]" />
          <span>Cuentas & Movimientos</span>
        </button>

        <button
          onClick={() => setSeccionCaja('resultado')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
            seccionCaja === 'resultado'
              ? 'bg-[#2F3A2A] text-[#F6F3E9] shadow-md border border-[#C6A96A]/60'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-[#E3DCCE]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#C6A96A]" />
          <span>Resultado Mensual (Punto 6)</span>
        </button>

        <button
          onClick={() => setSeccionCaja('fijos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
            seccionCaja === 'fijos'
              ? 'bg-[#2F3A2A] text-[#F6F3E9] shadow-md border border-[#C6A96A]/60'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-[#E3DCCE]'
          }`}
        >
          <Building className="w-4 h-4 text-[#C6A96A]" />
          <span>Control de Fijos (Punto 5)</span>
        </button>

        <button
          onClick={() => setSeccionCaja('proveedores')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
            seccionCaja === 'proveedores'
              ? 'bg-[#2F3A2A] text-[#F6F3E9] shadow-md border border-[#C6A96A]/60'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-[#E3DCCE]'
          }`}
        >
          <Store className="w-4 h-4 text-[#C6A96A]" />
          <span>Proveedores ({listaProveedores.length})</span>
        </button>

        <button
          onClick={() => setSeccionCaja('importar')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
            seccionCaja === 'importar'
              ? 'bg-[#2F3A2A] text-[#F6F3E9] shadow-md border border-[#C6A96A]/60'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-[#E3DCCE]'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-[#C6A96A]" />
          <span>Importar Excel (Punto 8)</span>
        </button>
      </div>

      {/* =====================================================================
          SECCIÓN A: CUENTAS & MOVIMIENTOS TRADICIONALES
         ===================================================================== */}
      {seccionCaja === 'cajas' && (
        <div className="space-y-6">
          
          {/* Pestañas de las 4 Cajas + General */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-soft border border-[#E3DCCE]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E3DCCE]">
              <div>
                <h3 className="text-xl font-bold text-[#2F3A2A] font-serif">
                  Planillas de Caja por Cuenta
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Organizadas por cada vía de ingreso y gasto solicitada por la dueña.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleAbrirTraspaso}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Traspaso entre Cajas</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-[#E3DCCE] transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Exportar Excel</span>
                </button>

                <button
                  onClick={() => handleAbrirNuevo(subTabActiva !== 'general' ? subTabActiva : 'naranja')}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#2F3A2A] hover:bg-[#3D4C37] text-[#F6F3E9] border border-[#C6A96A] shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#C6A96A]" />
                  <span>{subTabActiva === 'general' ? '+ Nuevo Movimiento' : `+ Cargar en ${cajaActivaConfig?.nombre}`}</span>
                </button>
              </div>
            </div>

            {/* Selector de Cajas */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-4">
              {CAJAS_DEF.map(caja => {
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
                        : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-700 shadow-xs'}`}>
                          <Icono className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-xs">{caja.nombre}</span>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${caja.dot}`} />
                    </div>
                    <div>
                      <div className="text-[10px] opacity-80 font-medium">Saldo:</div>
                      <div className={`text-xs font-bold ${isActive ? 'text-white' : saldo >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                        {formatARS(saldo)}
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* General Consolidado */}
              <button
                onClick={() => setSubTabActiva('general')}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  subTabActiva === 'general'
                    ? 'bg-[#2F3A2A] text-[#F6F3E9] shadow-md border-[#C6A96A] ring-2 ring-[#C6A96A]/40 scale-[1.01]'
                    : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${subTabActiva === 'general' ? 'bg-[#C6A96A]/20 text-[#C6A96A]' : 'bg-white text-slate-700'}`}>
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-xs">General</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 rounded bg-[#C6A96A]/20 text-[#C6A96A]">Total</span>
                </div>
                <div>
                  <div className="text-[10px] opacity-80 font-medium">Total en Salón:</div>
                  <div className={`text-xs font-bold ${subTabActiva === 'general' ? 'text-[#C6A96A]' : 'text-slate-900'}`}>
                    {formatARS(metricasPorCaja.general.saldo)}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Barra de Filtros de la Tabla */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl shadow-soft border border-[#E3DCCE] text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filtroMes}
                  onChange={(e) => setFiltroMes(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="todos">Todos los Meses</option>
                  {mesesDisponibles.map(m => (
                    <option key={m} value={m}>{m} {m === mesActualStr ? '(Actual)' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                {['todos', 'ingreso', 'egreso'].map(t => (
                  <button
                    key={t}
                    onClick={() => setFiltroTipo(t)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all capitalize cursor-pointer ${
                      filtroTipo === t ? 'bg-[#2F3A2A] text-[#F6F3E9]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t === 'todos' ? 'Todos' : (t === 'ingreso' ? 'Ingresos' : 'Egresos')}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar concepto, proveedor, cargo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 w-full sm:w-64 focus:outline-none"
              />
            </div>
          </div>

          {/* Tabla de Movimientos */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-soft border border-[#E3DCCE] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#E3DCCE] text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Fecha</th>
                    <th className="py-2.5 px-3">Cuenta / Caja</th>
                    <th className="py-2.5 px-3">Concepto & Proveedor</th>
                    <th className="py-2.5 px-3">Categoría</th>
                    <th className="py-2.5 px-3">Cargado Por</th>
                    <th className="py-2.5 px-3 text-right">Monto</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3DCCE]/60">
                  {movimientosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400">
                        No hay movimientos cargados con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    movimientosFiltrados.map(m => {
                      const cInfo = CAJAS_DEF.find(c => c.id === getCajaMovimiento(m));
                      const esIng = m.tipo === 'ingreso';

                      return (
                        <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                            {m.fecha}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${cInfo?.badge || 'bg-slate-100 text-slate-800'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cInfo?.dot || 'bg-slate-400'}`} />
                              {cInfo?.nombre || m.caja}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{m.concepto}</div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              {m.proveedor && <span className="text-[#5A6B4A] font-semibold">📍 {m.proveedor}</span>}
                              {m.origen && <span className="bg-emerald-50 text-emerald-800 px-1 rounded">Origen: {m.origen}</span>}
                              {m.notas && <span className="truncate max-w-xs italic">"{m.notas}"</span>}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="font-semibold text-slate-800">{m.categoria}</div>
                            <div className="text-[10px] text-slate-400">{m.subcategoria}</div>
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-600 whitespace-nowrap">
                            {m.cargadoPor || m.cargo || 'Jesica'}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap font-bold text-sm">
                            <span className={esIng ? 'text-emerald-700' : 'text-rose-700'}>
                              {esIng ? '+' : '-'} {formatARS(m.monto)}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleAbrirEditar(m)}
                                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                                title="Editar movimiento"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar movimiento "${m.concepto}"?`)) {
                                    onEliminarMovimiento(m.id);
                                  }
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
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

        </div>
      )}

      {/* =====================================================================
          SECCIÓN B: RESULTADO MENSUAL (PUNTO 6)
         ===================================================================== */}
      {seccionCaja === 'resultado' && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-soft border border-[#E3DCCE] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E3DCCE]">
            <div>
              <h3 className="text-xl font-bold text-[#2F3A2A] font-serif">
                Cuadro de Resultado Mensual & Proyección Operativa
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparativa mensual, cálculo del punto de equilibrio y financiamiento familiar aislado.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportResultadoExcel}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#2F3A2A] hover:bg-[#3D4C37] text-[#F6F3E9] text-xs font-bold rounded-xl border border-[#C6A96A] shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#C6A96A]" />
                <span>Exportar Resultado a Excel</span>
              </button>
            </div>
          </div>

          {/* Selectores de Meses para Comparar */}
          <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <span>Columna 1:</span>
              <select
                value={mesResultadoActivo}
                onChange={(e) => setMesResultadoActivo(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#E3DCCE] bg-slate-50"
              >
                {mesesDisponibles.map(m => (
                  <option key={m} value={m}>{m} {m === mesActualStr ? '(Actual)' : ''}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span>Columna 2:</span>
              <select
                value={segundoMesResultado}
                onChange={(e) => setSegundoMesResultado(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#E3DCCE] bg-slate-50"
              >
                {mesesDisponibles.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabla de Resultados Comparativa */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-[#2F3A2A] text-[#2F3A2A] font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Línea del Cuadro Financiero</th>
                  <th className="py-3 px-4 text-right">{mesResultadoActivo}</th>
                  <th className="py-3 px-4 text-right">{segundoMesResultado}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                
                {/* 1. Ingresos Operativos */}
                <tr className="bg-slate-50/60 font-bold text-[#2F3A2A]">
                  <td className="py-2.5 px-4">TOTAL INGRESOS OPERATIVOS (Eventos)</td>
                  <td className="py-2.5 px-4 text-right text-emerald-800 font-bold">{formatARS(metricasMes1.ingOperativos)}</td>
                  <td className="py-2.5 px-4 text-right text-emerald-800 font-bold">{formatARS(metricasMes2.ingOperativos)}</td>
                </tr>

                {/* 2. Variables */}
                <tr>
                  <td className="py-2 px-4 pl-8 text-slate-600">• Insumos (Carnes, Verduras, Bebida, Fiambres)</td>
                  <td className="py-2 px-4 text-right">{formatARS(metricasMes1.varInsumos)}</td>
                  <td className="py-2 px-4 text-right">{formatARS(metricasMes2.varInsumos)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 pl-8 text-slate-600">• Personal (Cocina, Limpieza, Mozos, Música)</td>
                  <td className="py-2 px-4 text-right">{formatARS(metricasMes1.varPersonal)}</td>
                  <td className="py-2 px-4 text-right">{formatARS(metricasMes2.varPersonal)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 pl-8 text-slate-600">• Otros Variables (Librería, Proveedores, Marketing)</td>
                  <td className="py-2 px-4 text-right">{formatARS(metricasMes1.varOtros)}</td>
                  <td className="py-2 px-4 text-right">{formatARS(metricasMes2.varOtros)}</td>
                </tr>
                <tr className="font-semibold text-slate-800 bg-slate-50/30">
                  <td className="py-2 px-4 pl-6">Total Variables</td>
                  <td className="py-2 px-4 text-right">{formatARS(metricasMes1.totalVariables)}</td>
                  <td className="py-2 px-4 text-right">{formatARS(metricasMes2.totalVariables)}</td>
                </tr>

                {/* 3. Costos Fijos */}
                <tr>
                  <td className="py-2 px-4 pl-6 text-slate-800">
                    Costos Fijos del Salón {metricasMes1.esFijosEstimado ? '(Estimados de referencia)' : '(Cargados)'}
                  </td>
                  <td className="py-2 px-4 text-right">{formatARS(metricasMes1.fijosUsados)}</td>
                  <td className="py-2 px-4 text-right">{formatARS(metricasMes2.fijosUsados)}</td>
                </tr>

                {/* 4. RESULTADO OPERATIVO */}
                <tr className="bg-amber-50/60 font-bold text-sm text-[#2F3A2A] border-y border-amber-200">
                  <td className="py-3 px-4">RESULTADO OPERATIVO (Ingresos − Variables − Fijos)</td>
                  <td className={`py-3 px-4 text-right ${metricasMes1.resultadoOperativo >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {formatARS(metricasMes1.resultadoOperativo)}
                  </td>
                  <td className={`py-3 px-4 text-right ${metricasMes2.resultadoOperativo >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {formatARS(metricasMes2.resultadoOperativo)}
                  </td>
                </tr>

                {/* 5. Retiros de Socios */}
                <tr>
                  <td className="py-2 px-4 pl-6 text-slate-600">Retiros de Socios (Leandro, Jesica, Iris)</td>
                  <td className="py-2 px-4 text-right text-rose-700">− {formatARS(metricasMes1.retirosTotal)}</td>
                  <td className="py-2 px-4 text-right text-rose-700">− {formatARS(metricasMes2.retirosTotal)}</td>
                </tr>

                {/* 6. Financiamiento Familiar (Línea aparte, nunca sumada a ingresos) */}
                <tr className="bg-purple-50/40 text-purple-950 font-semibold">
                  <td className="py-2 px-4 pl-6">Financiamiento Familiar (Tramos recibidos − Devoluciones)</td>
                  <td className="py-2 px-4 text-right">{formatARS(metricasMes1.financiamientoNeto)}</td>
                  <td className="py-2 px-4 text-right">{formatARS(metricasMes2.financiamientoNeto)}</td>
                </tr>

                {/* 7. CAJA FINAL */}
                <tr className="bg-[#2F3A2A] text-[#F6F3E9] font-bold text-base border-t-2 border-[#C6A96A]">
                  <td className="py-3.5 px-4 font-serif">CAJA FINAL DEL MES</td>
                  <td className="py-3.5 px-4 text-right text-[#C6A96A]">{formatARS(metricasMes1.cajaFinal)}</td>
                  <td className="py-3.5 px-4 text-right text-[#C6A96A]">{formatARS(metricasMes2.cajaFinal)}</td>
                </tr>

                {/* 8. Indicadores Clave: Datos Reales y Punto de Equilibrio */}
                <tr className="text-slate-500 text-[11px] bg-slate-50/80">
                  <td className="py-2 px-4 font-bold">Datos Reales Cargados (%)</td>
                  <td className="py-2 px-4 text-right font-bold text-slate-700">{metricasMes1.pctDatosReales}%</td>
                  <td className="py-2 px-4 text-right font-bold text-slate-700">{metricasMes2.pctDatosReales}%</td>
                </tr>

                <tr className="text-slate-500 text-[11px] bg-slate-50/80">
                  <td className="py-2 px-4 font-bold">Punto de Equilibrio (eventos base para cubrir fijos)</td>
                  <td className="py-2 px-4 text-right font-bold text-[#5A6B4A]">{metricasMes1.puntoEquilibrio} eventos</td>
                  <td className="py-2 px-4 text-right font-bold text-[#5A6B4A]">{metricasMes2.puntoEquilibrio} eventos</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECCIÓN C: CONTROL DE COSTOS FIJOS (PUNTO 5)
         ===================================================================== */}
      {seccionCaja === 'fijos' && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-soft border border-[#E3DCCE] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E3DCCE]">
            <div>
              <h3 className="text-xl font-bold text-[#2F3A2A] font-serif">
                Control de Costos Fijos Mensuales
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Seguimiento de servicios e impuestos para el período {filtroMes === 'todos' ? mesActualStr : filtroMes}.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-[#2F3A2A]/10 text-[#2F3A2A]">
                Responsable principal: Gabriela
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E3DCCE] text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Concepto Fijo</th>
                  <th className="py-2.5 px-3">Subcategoría</th>
                  <th className="py-2.5 px-3">Monto del Mes</th>
                  <th className="py-2.5 px-3">Vencimiento</th>
                  <th className="py-2.5 px-3">Responsable</th>
                  <th className="py-2.5 px-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DCCE]/60">
                {estadoCostosFijos.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.concepto}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.subcategoria}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {formatARS(item.montoMostrar)} {item.esEstimado && <span className="text-[10px] text-amber-700 font-semibold">(Estimado)</span>}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">Día {item.diaVencimiento} de cada mes</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{item.responsable}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.estado === 'Pagado' 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                          : item.estado === 'Vencido' 
                          ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse' 
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {item.estado === 'Pagado' ? '✓ Pagado' : item.estado === 'Vencido' ? '⚠️ Vencido' : '⏳ Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECCIÓN D: DIRECTORIO DE PROVEEDORES (PUNTO 10)
         ===================================================================== */}
      {seccionCaja === 'proveedores' && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-soft border border-[#E3DCCE] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E3DCCE]">
            <div>
              <h3 className="text-xl font-bold text-[#2F3A2A] font-serif">
                Directorio Inteligente de Proveedores
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Conocimiento que queda en el salón: precios históricos, fecha de última compra y acumulado anual.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {listaProveedores.length} proveedores registrados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E3DCCE] text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Proveedor</th>
                  <th className="py-2.5 px-3">Rubro / Categoría</th>
                  <th className="py-2.5 px-3">Último Precio Pagado</th>
                  <th className="py-2.5 px-3">Fecha Último Pago</th>
                  <th className="py-2.5 px-3">Total del Año</th>
                  <th className="py-2.5 px-3">Teléfono</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DCCE]/60">
                {listaProveedores.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400">
                      No hay compras a proveedores registradas en los movimientos aún.
                    </td>
                  </tr>
                ) : (
                  listaProveedores.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{p.nombre}</td>
                      <td className="py-2.5 px-3 text-slate-600">{p.categoria}</td>
                      <td className="py-2.5 px-3 font-bold text-[#2F3A2A]">{formatARS(p.ultimoPrecio)}</td>
                      <td className="py-2.5 px-3 text-slate-600">{p.ultimaFecha}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-800">{formatARS(p.totalAnio)}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono">
                        {p.telefono || <span className="text-slate-300 italic">Sin teléfono</span>}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setModalProveedor(p);
                            setProvTel(p.telefono || '');
                            setProvNotas(p.notas || '');
                          }}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-[#E3DCCE] hover:bg-slate-100 text-slate-700"
                        >
                          Editar Datos
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECCIÓN E: IMPORTAR EXCEL (PUNTO 8)
         ===================================================================== */}
      {seccionCaja === 'importar' && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-soft border border-[#E3DCCE] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DCCE]">
            <div>
              <h3 className="text-xl font-bold text-[#2F3A2A] font-serif">
                Importación Masiva de Excel
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Migrá planillas de gerencia al sistema con validación fila por fila y detección de duplicados.
              </p>
            </div>

            <button
              onClick={handleDescargarPlantilla}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#2F3A2A] hover:bg-[#3D4C37] text-[#F6F3E9] text-xs font-bold rounded-xl border border-[#C6A96A] shadow-md transition-all cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-[#C6A96A]" />
              <span>Descargar Plantilla Oficial Moments (.xlsx)</span>
            </button>
          </div>

          {/* Selector de Archivo */}
          <div className="p-6 rounded-3xl bg-[#F6F3E9] border-2 border-dashed border-[#C6A96A]/60 text-center space-y-3">
            <Upload className="w-8 h-8 text-[#5A6B4A] mx-auto" />
            <h4 className="text-sm font-bold text-[#2F3A2A]">
              Seleccioná o arrastrá el archivo Excel (.xlsx o .xls)
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Si usás la plantilla oficial se importa directo. Si es un Excel antiguo de gerencia, podés mapear las columnas manualmente.
            </p>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleArchivoSeleccionado}
              className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2F3A2A] file:text-[#F6F3E9] file:cursor-pointer cursor-pointer"
            />
          </div>

          {/* Resumen de Importación Previa */}
          {resumenImportacion && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs">
              <strong className="block font-bold mb-1">¡Importación completada!</strong>
              <div>✓ {resumenImportacion.importados} movimientos importados correctamente.</div>
              {resumenImportacion.errores > 0 && <div>⚠️ {resumenImportacion.errores} filas con error fueron omitidas.</div>}
              {resumenImportacion.duplicadosOmitidos > 0 && <div>🟡 {resumenImportacion.duplicadosOmitidos} posibles duplicados no fueron importados.</div>}
            </div>
          )}

          {/* Previsualización de Filas Validadas */}
          {filasPreview.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700">
                  Previsualización ({filasPreview.length} filas analizadas)
                </span>
                
                <button
                  onClick={handleConfirmarImportacion}
                  disabled={importando}
                  className="px-6 py-2.5 bg-[#2F3A2A] hover:bg-[#3D4C37] text-[#F6F3E9] text-xs font-bold rounded-xl border border-[#C6A96A] shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {importando ? 'Importando...' : 'Confirmar e Importar Filas Válidas'}
                </button>
              </div>

              <div className="overflow-x-auto max-h-80 border border-[#E3DCCE] rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 sticky top-0 font-bold text-[10px] text-slate-600 uppercase">
                    <tr>
                      <th className="py-2 px-3">Estado</th>
                      <th className="py-2 px-3">Fila</th>
                      <th className="py-2 px-3">Fecha</th>
                      <th className="py-2 px-3">Concepto</th>
                      <th className="py-2 px-3">Tipo</th>
                      <th className="py-2 px-3">Categoría</th>
                      <th className="py-2 px-3">Monto</th>
                      <th className="py-2 px-3">Caja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filasPreview.map((f, i) => (
                      <tr 
                        key={i} 
                        className={
                          f.estado === 'ok' ? 'bg-emerald-50/40 text-emerald-950' : 
                          f.estado === 'duplicado' ? 'bg-amber-50/60 text-amber-950' : 
                          'bg-rose-50/60 text-rose-950'
                        }
                      >
                        <td className="py-2 px-3 font-bold whitespace-nowrap">
                          {f.estado === 'ok' && '🟢 OK'}
                          {f.estado === 'duplicado' && '🟡 Posible Duplicado'}
                          {f.estado === 'error' && `🔴 Error: ${f.errores.join(', ')}`}
                        </td>
                        <td className="py-2 px-3">#{f.numFila}</td>
                        <td className="py-2 px-3 whitespace-nowrap">{f.fecha}</td>
                        <td className="py-2 px-3 font-medium">{f.concepto}</td>
                        <td className="py-2 px-3 capitalize">{f.tipo}</td>
                        <td className="py-2 px-3">{f.categoria} / {f.subcategoria}</td>
                        <td className="py-2 px-3 font-bold">{formatARS(f.monto)}</td>
                        <td className="py-2 px-3 capitalize">{f.caja}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* =====================================================================
          MODAL: NUEVO / EDITAR MOVIMIENTO DE CAJA
         ===================================================================== */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn font-['Montserrat']">
          <div className="relative w-full max-w-lg bg-[#F6F3E9] rounded-3xl shadow-2xl border border-[#C6A96A]/60 p-6 my-8 text-slate-800">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E3DCCE] mb-4">
              <h3 className="font-bold text-base text-[#2F3A2A] font-serif">
                {modoModal === 'traspaso' ? 'Traspaso entre Cuentas' : (modoModal === 'editar' ? 'Editar Movimiento' : 'Cargar Movimiento')}
              </h3>
              <button onClick={() => setModalAbierto(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {modoModal === 'traspaso' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Caja Origen (Sale)</label>
                      <select
                        value={traspasoOrigen}
                        onChange={(e) => setTraspasoOrigen(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE] font-bold"
                      >
                        {CAJAS_DEF.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Caja Destino (Entra)</label>
                      <select
                        value={traspasoDestino}
                        onChange={(e) => setTraspasoDestino(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE] font-bold"
                      >
                        {CAJAS_DEF.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Monto del Traspaso *</label>
                    <input
                      type="number"
                      required
                      value={traspasoMonto}
                      onChange={(e) => setTraspasoMonto(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE] font-bold text-sm"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Tipo de Movimiento */}
                  <div className="grid grid-cols-2 gap-2 bg-white/70 p-1.5 rounded-2xl border border-[#E3DCCE]">
                    <button
                      type="button"
                      onClick={() => handleCambiarTipo('egreso')}
                      className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        formTipo === 'egreso' ? 'bg-[#2F3A2A] text-[#F6F3E9]' : 'text-slate-600'
                      }`}
                    >
                      💸 Egreso / Gasto
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCambiarTipo('ingreso')}
                      className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        formTipo === 'ingreso' ? 'bg-[#5A6B4A] text-[#F6F3E9]' : 'text-slate-600'
                      }`}
                    >
                      💰 Ingreso / Cobro
                    </button>
                  </div>

                  {/* Fecha y Monto */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Fecha</label>
                      <input
                        type="date"
                        value={formFecha}
                        onChange={(e) => setFormFecha(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE] font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Monto ($ ARS) *</label>
                      <input
                        type="number"
                        required
                        value={formMonto}
                        onChange={(e) => setFormMonto(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE] font-bold text-sm text-[#2F3A2A]"
                      />
                    </div>
                  </div>

                  {/* Concepto */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Concepto *</label>
                    <input
                      type="text"
                      required
                      placeholder={formTipo === 'ingreso' ? 'Ej: Seña Boda, Cuota Quinceañera...' : 'Ej: Pago DJ, Compra bebidas...'}
                      value={formConcepto}
                      onChange={(e) => setFormConcepto(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE] font-bold"
                    />
                  </div>

                  {/* Categoría y Subcategoría Reorganizadas */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        {formTipo === 'ingreso' ? 'Tipo de Evento / Origen' : 'Categoría del Gasto'}
                      </label>
                      <select
                        value={formCategoria}
                        onChange={(e) => {
                          const nuevaCat = e.target.value;
                          setFormCategoria(nuevaCat);
                          const cats = formTipo === 'ingreso' ? CATEGORIAS_INGRESO : CATEGORIAS_EGRESO;
                          const subs = cats[nuevaCat] || [];
                          setFormSubcategoria(subs[0] || '');
                        }}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE] font-bold text-xs"
                      >
                        {Object.keys(formTipo === 'ingreso' ? CATEGORIAS_INGRESO : CATEGORIAS_EGRESO).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        {formTipo === 'ingreso' ? 'Modo de Pago / Concepto' : 'Subcategoría'}
                      </label>
                      <select
                        value={formSubcategoria}
                        onChange={(e) => setFormSubcategoria(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE] font-bold text-xs"
                      >
                        {((formTipo === 'ingreso' ? CATEGORIAS_INGRESO : CATEGORIAS_EGRESO)[formCategoria] || []).map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Caja Destino */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Cuenta / Caja</label>
                    <div className="grid grid-cols-4 gap-2">
                      {CAJAS_DEF.map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setFormCaja(c.id)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                            formCaja === c.id ? 'bg-[#2F3A2A] text-white border-[#C6A96A]' : 'bg-white text-slate-700 border-[#E3DCCE]'
                          }`}
                        >
                          {c.nombre}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vincular a Evento (Opcional) */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Vincular a Evento (Opcional)</label>
                    <select
                      value={formEventoId}
                      onChange={(e) => setFormEventoId(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE]"
                    >
                      <option value="">-- Sin evento vinculado --</option>
                      {(eventos || []).filter(e => e.tipo !== 'mantenimiento').map(ev => (
                        <option key={ev.id} value={ev.id}>
                          {ev.fecha} · {ev.titulo} ({ev.cliente})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Proveedor y Responsable (Solo Egreso) o Cliente (Ingreso) */}
                  {formTipo === 'egreso' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Proveedor / Destinatario</label>
                        <input
                          type="text"
                          placeholder="Ej: Carnicería Don Juan"
                          value={formProveedor}
                          onChange={(e) => setFormProveedor(e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE]"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Responsable</label>
                        <input
                          type="text"
                          value={formCargo}
                          onChange={(e) => setFormCargo(e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Cliente / Titular que abona (Opcional)</label>
                      <input
                        type="text"
                        placeholder="Ej: Familia Morales, Quinceañera Sofía, Empresa..."
                        value={formProveedor}
                        onChange={(e) => setFormProveedor(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE]"
                      />
                    </div>
                  )}

                  {/* Notas */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Notas u Observaciones</label>
                    <input
                      type="text"
                      placeholder="Detalles adicionales, número de recibo, etc..."
                      value={formNotas}
                      onChange={(e) => setFormNotas(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE]"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E3DCCE]">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/50 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2F3A2A] hover:bg-[#3D4C37] text-[#F6F3E9] text-xs font-bold rounded-xl border border-[#C6A96A] shadow-md transition-all cursor-pointer"
                >
                  Guardar en Caja
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: EDITAR DATOS DE PROVEEDOR (PUNTO 10)
         ===================================================================== */}
      {modalProveedor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn font-['Montserrat']">
          <div className="relative w-full max-w-sm bg-[#F6F3E9] rounded-3xl shadow-2xl border border-[#C6A96A]/60 p-6 my-8 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3DCCE] mb-4">
              <h3 className="font-bold text-base text-[#2F3A2A] font-serif">
                Proveedor: {modalProveedor.nombre}
              </h3>
              <button onClick={() => setModalProveedor(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardarDatosProveedor} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  placeholder="Ej: 2604-123456"
                  value={provTel}
                  onChange={(e) => setProvTel(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE] font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notas de Servicio / Condiciones</label>
                <textarea
                  rows="3"
                  placeholder="Horarios de entrega, persona de contacto, descuentos..."
                  value={provNotas}
                  onChange={(e) => setProvNotas(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E3DCCE]">
                <button
                  type="button"
                  onClick={() => setModalProveedor(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2F3A2A] hover:bg-[#3D4C37] text-[#F6F3E9] text-xs font-bold rounded-xl border border-[#C6A96A]"
                >
                  Guardar Datos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
