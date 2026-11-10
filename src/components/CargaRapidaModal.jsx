import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Check, 
  DollarSign, 
  Calendar, 
  Tag, 
  CreditCard, 
  FileText, 
  Store,
  Sparkles
} from 'lucide-react';
import { CATEGORIAS_CAJA, CAJAS_LISTA, formatARS } from '../utils/mockData';

export default function CargaRapidaModal({ 
  isOpen, 
  onClose, 
  eventos = [], 
  usuarioActivo,
  onMovimientoGuardado,
  proveedoresSugeridos = []
}) {
  const hoyStr = new Date().toISOString().slice(0, 10);
  const [tipo, setTipo] = useState('egreso'); // 'egreso' | 'ingreso'
  const [fecha, setFecha] = useState(hoyStr);
  const [eventoId, setEventoId] = useState('');
  const [categoria, setCategoria] = useState('Variables – Otros');
  const [subcategoria, setSubcategoria] = useState('Proveedores de evento');
  const [monto, setMonto] = useState('');
  const [caja, setCaja] = useState('efectivo');
  const [proveedor, setProveedor] = useState('');
  const [concepto, setConcepto] = useState('');
  const [origen, setOrigen] = useState('Seña');
  const [notas, setNotas] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCategoriaChange = (nuevaCat) => {
    setCategoria(nuevaCat);
    const subcats = CATEGORIAS_CAJA[nuevaCat] || [];
    setSubcategoria(subcats[0] || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const numMonto = Number(monto);
    if (!numMonto || isNaN(numMonto) || numMonto <= 0) {
      setErrorMsg('Por favor ingresá un monto válido mayor a 0');
      return;
    }

    setEnviando(true);
    try {
      const payload = {
        fecha,
        tipo,
        categoria,
        subcategoria,
        monto: numMonto,
        caja,
        concepto: concepto.trim() || `${tipo === 'ingreso' ? 'Ingreso' : 'Egreso'} de ${subcategoria}`,
        eventoId: eventoId || null,
        proveedor: proveedor.trim() || null,
        origen: tipo === 'ingreso' ? origen : null,
        notas: notas.trim() || '',
        usuarioNombre: usuarioActivo?.nombre || 'Equipo Moments'
      };

      const res = await fetch('/api/movimientos/rapido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error al registrar operación');

      setExito(true);
      if (onMovimientoGuardado) onMovimientoGuardado();
      setTimeout(() => {
        setExito(false);
        // Reset form
        setMonto('');
        setConcepto('');
        setProveedor('');
        setNotas('');
        setEventoId('');
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || 'No se pudo guardar la operación');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn font-['Montserrat']">
      <div className="relative w-full max-w-lg bg-[#F6F3E9] rounded-3xl shadow-2xl border border-[#C6A96A]/60 p-6 my-8 text-slate-800">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E3DCCE] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2F3A2A] text-[#C6A96A] border border-[#C6A96A]/40 flex items-center justify-center font-bold shadow-md">
              <Plus className="w-5 h-5 text-[#C6A96A]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2F3A2A] font-serif">
                Carga Rápida de Operación
              </h3>
              <p className="text-[11px] text-slate-500">
                Registrá gastos de proveedores o ingresos en segundos.
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {exito ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 bg-[#2F3A2A] text-[#C6A96A] rounded-full flex items-center justify-center mx-auto border border-[#C6A96A] shadow-lg animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#2F3A2A] font-serif">
              ¡Operación Registrada con Éxito!
            </h4>
            <p className="text-xs text-slate-600">
              Quedó guardada con autoría de <strong>{usuarioActivo?.nombre}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Alternar Tipo: Egreso (Gasto) vs Ingreso */}
            <div className="grid grid-cols-2 gap-2 bg-white/70 p-1.5 rounded-2xl border border-[#E3DCCE]">
              <button
                type="button"
                onClick={() => setTipo('egreso')}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  tipo === 'egreso' 
                    ? 'bg-[#2F3A2A] text-[#F6F3E9] shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                💸 Registrar Gasto / Egreso
              </button>
              <button
                type="button"
                onClick={() => setTipo('ingreso')}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  tipo === 'ingreso' 
                    ? 'bg-[#5A6B4A] text-[#F6F3E9] shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                💰 Registrar Cobro / Ingreso
              </button>
            </div>

            {/* Fecha y Monto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold bg-white rounded-xl border border-[#E3DCCE] focus:outline-none focus:ring-2 focus:ring-[#C6A96A]/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monto ($ ARS) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    placeholder="Ej: 450000"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-sm font-bold text-[#2F3A2A] bg-white rounded-xl border border-[#E3DCCE] focus:outline-none focus:ring-2 focus:ring-[#C6A96A]/40"
                    required
                    autoFocus
                  />
                </div>
              </div>
            </div>

            {/* Categoría y Subcategoría */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Categoría
                </label>
                <select
                  value={categoria}
                  onChange={(e) => handleCategoriaChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold bg-white rounded-xl border border-[#E3DCCE] focus:outline-none focus:ring-2 focus:ring-[#C6A96A]/40"
                >
                  {Object.keys(CATEGORIAS_CAJA).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subcategoría
                </label>
                <select
                  value={subcategoria}
                  onChange={(e) => setSubcategoria(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold bg-white rounded-xl border border-[#E3DCCE] focus:outline-none focus:ring-2 focus:ring-[#C6A96A]/40"
                >
                  {(CATEGORIAS_CAJA[categoria] || []).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Caja Destino / Origen */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cuenta / Caja
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CAJAS_LISTA.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCaja(c.id)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      caja === c.id
                        ? 'bg-[#2F3A2A] text-[#F6F3E9] border-[#C6A96A]'
                        : 'bg-white text-slate-700 border-[#E3DCCE] hover:bg-slate-50'
                    }`}
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* Evento Vinculado (Opcional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Vincular a Evento (Opcional)
              </label>
              <select
                value={eventoId}
                onChange={(e) => setEventoId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#E3DCCE] text-slate-800 focus:outline-none"
              >
                <option value="">-- Sin evento específico vinculado --</option>
                {eventos.filter(ev => ev.tipo !== 'mantenimiento').map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.fecha} · {ev.titulo} ({ev.cliente || 'Sin cliente'})
                  </option>
                ))}
              </select>
            </div>

            {/* Origen (Solo para Ingresos) */}
            {tipo === 'ingreso' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tipo de Cobro / Origen
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Seña', 'Cuota', 'Saldo final', 'Otro'].map(orig => (
                    <button
                      key={orig}
                      type="button"
                      onClick={() => setOrigen(orig)}
                      className={`py-1.5 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                        origen === orig
                          ? 'bg-[#5A6B4A] text-white border-[#5A6B4A]'
                          : 'bg-white text-slate-600 border-[#E3DCCE]'
                      }`}
                    >
                      {orig}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Proveedor con autocompletado */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Proveedor / Destinatario (Opcional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  list="lista-proveedores"
                  placeholder="Ej: Carnicería Don Juan, DJ Cuyo..."
                  value={proveedor}
                  onChange={(e) => setProveedor(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#E3DCCE] text-slate-800 focus:outline-none"
                />
                <datalist id="lista-proveedores">
                  {proveedoresSugeridos.map((p, idx) => (
                    <option key={idx} value={p} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Concepto y Notas Opcionales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Concepto (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Detalle breve del gasto o ingreso..."
                  value={concepto}
                  onChange={(e) => setConcepto(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#E3DCCE] text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notas / Observación
                </label>
                <input
                  type="text"
                  placeholder="Ej: factura nro, remito, etc..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#E3DCCE] text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="text-xs font-bold text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {errorMsg}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E3DCCE]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="px-6 py-2.5 bg-[#2F3A2A] hover:bg-[#3D4C37] active:scale-95 text-[#F6F3E9] text-xs font-bold rounded-xl border border-[#C6A96A] shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {enviando ? 'Guardando...' : 'Guardar Operación'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
