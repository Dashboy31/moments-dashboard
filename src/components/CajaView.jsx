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
  Sparkles
} from 'lucide-react';
import { CATEGORIAS_CAJA, USUARIOS } from '../utils/mockData';

export default function CajaView({ movimientos, onAgregarMovimiento, onEliminarMovimiento, usuarioActivo }) {
  const [filtroMes, setFiltroMes] = useState('2026-10');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);

  // Formulario nuevo movimiento
  const [formFecha, setFormFecha] = useState(new Date().toISOString().split('T')[0]);
  const [formConcepto, setFormConcepto] = useState('');
  const [formTipo, setFormTipo] = useState('egreso');
  const [formCategoria, setFormCategoria] = useState('Variables');
  const [formSubcategoria, setFormSubcategoria] = useState('Proveedores de evento');
  const [formMonto, setFormMonto] = useState('');
  const [formMetodo, setFormMetodo] = useState('Transferencia');
  const [formCargo, setFormCargo] = useState(usuarioActivo.nombre);
  const [formNotas, setFormNotas] = useState('');

  // Filtrado de movimientos
  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter(m => {
      // Filtro mes
      if (filtroMes !== 'todos' && !m.fecha.startsWith(filtroMes)) return false;
      // Filtro tipo
      if (filtroTipo !== 'todos' && m.tipo !== filtroTipo) return false;
      // Búsqueda
      if (busqueda.trim() !== '') {
        const query = busqueda.toLowerCase();
        const coincide = 
          m.concepto.toLowerCase().includes(query) ||
          m.categoria.toLowerCase().includes(query) ||
          (m.subcategoria && m.subcategoria.toLowerCase().includes(query)) ||
          m.cargo.toLowerCase().includes(query) ||
          (m.notas && m.notas.toLowerCase().includes(query));
        if (!coincide) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [movimientos, filtroMes, filtroTipo, busqueda]);

  // Cálculos de Totales para el mes seleccionado
  const resumen = useMemo(() => {
    let ingresos = 0;
    let egresos = 0;
    let retiros = 0;
    const desgloseCat = {};

    const itemsParaTotales = filtroMes === 'todos' 
      ? movimientos 
      : movimientos.filter(m => m.fecha.startsWith(filtroMes));

    itemsParaTotales.forEach(m => {
      const val = Number(m.monto) || 0;
      if (m.tipo === 'ingreso') {
        ingresos += val;
      } else {
        egresos += val;
        if (m.categoria === 'Retiros personales') {
          retiros += val;
        }
        // Desglose
        desgloseCat[m.categoria] = (desgloseCat[m.categoria] || 0) + val;
      }
    });

    const balance = ingresos - egresos;
    return { ingresos, egresos, balance, retiros, desgloseCat };
  }, [movimientos, filtroMes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formConcepto || !formMonto || Number(formMonto) <= 0) return;

    const nuevo = {
      id: 'mov-' + Date.now(),
      fecha: formFecha,
      concepto: formConcepto,
      tipo: formTipo,
      categoria: formCategoria,
      subcategoria: formSubcategoria,
      monto: Number(formMonto),
      metodoPago: formMetodo,
      cargo: formCargo,
      notas: formNotas
    };

    onAgregarMovimiento(nuevo);
    setModalAbierto(false);
    // Limpiar formulario
    setFormConcepto('');
    setFormMonto('');
    setFormNotas('');
  };

  const handleExportCSV = () => {
    const headers = ['Fecha', 'Concepto', 'Tipo', 'Categoría', 'Subcategoría', 'Monto (ARS)', 'Método de Pago', 'Quién Cargó', 'Notas'];
    const rows = movimientosFiltrados.map(m => [
      m.fecha,
      `"${m.concepto.replace(/"/g, '""')}"`,
      m.tipo.toUpperCase(),
      `"${m.categoria}"`,
      `"${m.subcategoria || ''}"`,
      m.monto,
      `"${m.metodoPago}"`,
      `"${m.cargo}"`,
      `"${(m.notas || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Moments_Caja_${filtroMes}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatARS = (num) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6">
      
      {/* Encabezado de la pestaña */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Ingresos y Gastos
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              Caja Gerencial
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Planilla de movimientos, cobros de eventos, costos operativos y retiros de utilidades.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
            title="Descargar planilla compatible con Excel"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Exportar a Excel (CSV)</span>
            <span className="sm:hidden">Excel</span>
          </button>

          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-black rounded-2xl bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-900/10 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nuevo Movimiento</span>
          </button>
        </div>
      </div>

      {/* Selector de Mes y Tarjetas de Totales Simples */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-moments-border">
        
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Período de análisis:</span>
            <select
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
              className="bg-amber-50/70 border border-amber-200 text-amber-900 font-bold text-sm rounded-xl px-3 py-1 focus:outline-none cursor-pointer"
            >
              <option value="2026-10">Octubre 2026 (Actual)</option>
              <option value="2026-09">Septiembre 2026</option>
              <option value="2026-08">Agosto 2026</option>
              <option value="todos">Todo el Histórico</option>
            </select>
          </div>

          <span className="text-xs text-slate-400">
            {movimientosFiltrados.length} movimientos registrados
          </span>
        </div>

        {/* Las 4 Tarjetas Clave */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Ingresos */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-800">Total Ingresos</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-200/60 flex items-center justify-center text-emerald-800">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-950">
              {formatARS(resumen.ingresos)}
            </div>
            <p className="text-[11px] text-emerald-700/80 mt-1">Cobros y señas del mes</p>
          </div>

          {/* Egresos */}
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-800">Total Gastos</span>
              <div className="w-7 h-7 rounded-lg bg-rose-200/60 flex items-center justify-center text-rose-800">
                <ArrowDownRight className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-950">
              {formatARS(resumen.egresos)}
            </div>
            <p className="text-[11px] text-rose-700/80 mt-1">Costos fijos, variables y retiros</p>
          </div>

          {/* Balance Neto */}
          <div className={`p-4 rounded-2xl border ${resumen.balance >= 0 ? 'bg-sky-50/80 border-sky-200 text-sky-950' : 'bg-amber-50/80 border-amber-200 text-amber-950'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-700">Saldo Neto en Caja</span>
              <div className="w-7 h-7 rounded-lg bg-sky-200/60 flex items-center justify-center text-sky-800">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-xl sm:text-2xl font-black ${resumen.balance >= 0 ? 'text-sky-950' : 'text-rose-600'}`}>
              {formatARS(resumen.balance)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {resumen.balance >= 0 ? 'Superávit disponible' : 'Déficit operativo'}
            </p>
          </div>

          {/* Retiros Personales */}
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-indigo-800">Retiros Personales</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-200/60 flex items-center justify-center text-indigo-800">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-indigo-950">
              {formatARS(resumen.retiros)}
            </div>
            <p className="text-[11px] text-indigo-700/80 mt-1">Leandro, Jesica e Iris</p>
          </div>

        </div>

        {/* Desglose de Gastos por Categoría */}
        {resumen.egresos > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
              Desglose simple de gastos por categoría ({filtroMes === 'todos' ? 'Histórico' : 'Mes seleccionado'}):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {Object.entries(resumen.desgloseCat).map(([cat, total]) => {
                const pct = Math.round((total / resumen.egresos) * 100);
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

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl shadow-soft border border-moments-border">
        
        {/* Filtro tipo */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFiltroTipo('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filtroTipo === 'todos' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltroTipo('ingreso')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filtroTipo === 'ingreso' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            Solo Ingresos
          </button>
          <button
            onClick={() => setFiltroTipo('egreso')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filtroTipo === 'egreso' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-rose-800 hover:bg-rose-50'
            }`}
          >
            Solo Gastos
          </button>
        </div>

        {/* Buscador */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por concepto, quién cargó..."
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

      {/* Tabla estilo Planilla Excel */}
      <div className="bg-white rounded-3xl shadow-soft border border-moments-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-black uppercase tracking-wider text-[11px] border-b border-slate-200">
                <th className="py-3.5 px-4 whitespace-nowrap">Fecha</th>
                <th className="py-3.5 px-4 min-w-[200px]">Concepto</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Tipo</th>
                <th className="py-3.5 px-3 min-w-[140px]">Categoría</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Método</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Monto</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Quién Cargó</th>
                <th className="py-3.5 px-3 text-center whitespace-nowrap">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movimientosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 font-medium">
                    No se encontraron movimientos registrados con estos filtros.
                  </td>
                </tr>
              ) : (
                movimientosFiltrados.map((m) => {
                  const esIngreso = m.tipo === 'ingreso';

                  return (
                    <tr key={m.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-semibold">
                        {m.fecha}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{m.concepto}</div>
                        {m.notas && (
                          <div className="text-[11px] text-slate-400 mt-0.5">{m.notas}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                          esIngreso 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {esIngreso ? '+ Ingreso' : '- Egreso'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{m.categoria}</div>
                        {m.subcategoria && (
                          <div className="text-[10px] text-slate-500">{m.subcategoria}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 rounded-md text-slate-600 border border-slate-200">
                          {m.metodoPago}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-right font-black text-sm whitespace-nowrap ${
                        esIngreso ? 'text-emerald-700' : 'text-slate-900'
                      }`}>
                        {esIngreso ? '+' : '-'}{formatARS(m.monto)}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-bold text-slate-700 bg-amber-50/60 px-2 py-1 rounded-lg border border-amber-200/60 text-[11px]">
                          {m.cargo}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar movimiento "${m.concepto}"?`)) {
                              onEliminarMovimiento(m.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Eliminar movimiento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Nuevo Movimiento */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-modal max-w-lg w-full p-6 border border-moments-border">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                <span>Cargar Nuevo Movimiento en Caja</span>
              </h3>
              <button 
                onClick={() => setModalAbierto(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Tipo de Movimiento (Tabs) */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setFormTipo('egreso');
                    setFormCategoria('Variables');
                    setFormSubcategoria(CATEGORIAS_CAJA['Variables'][0]);
                  }}
                  className={`py-2 text-xs font-black rounded-xl transition-all ${
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
                  className={`py-2 text-xs font-black rounded-xl transition-all ${
                    formTipo === 'ingreso' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  + Cobro / Ingreso
                </button>
              </div>

              {/* Concepto y Monto */}
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

              {/* Categorías y Subcategorías */}
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

              {/* Método de Pago y Quién Cargó */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Método de Pago</label>
                  <select
                    value={formMetodo}
                    onChange={(e) => setFormMetodo(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="Transferencia">Transferencia Bancaria</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Dólares (USD)">Dólares (USD)</option>
                    <option value="Tarjeta">Tarjeta / Débito</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

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
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Observaciones / Notas (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Pago de 8 mozos + 2 de barra"
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
                  Guardar Movimiento
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
