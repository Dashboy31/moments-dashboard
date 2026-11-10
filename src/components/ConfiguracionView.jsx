import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Save, 
  Check, 
  AlertCircle, 
  HelpCircle, 
  Plus, 
  Trash2, 
  DollarSign, 
  Users, 
  Calendar, 
  Layers, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { formatARS, CATEGORIAS_CAJA } from '../utils/mockData';

export default function ConfiguracionView({ 
  configuracion, 
  onGuardarConfiguracion, 
  usuarioActivo 
}) {
  const [form, setForm] = useState(() => ({
    eventoMinimo: configuracion?.eventoMinimo ?? 4000000,
    eventoBasePersonas: configuracion?.eventoBasePersonas ?? 85,
    eventoBaseCosto: configuracion?.eventoBaseCosto ?? 7000000,
    costoPromedioPlanificacion: configuracion?.costoPromedioPlanificacion ?? 10000000,
    tarifaAdultoVigente: configuracion?.tarifaAdultoVigente ?? 127000,
    fijosReferenciaMes: configuracion?.fijosReferenciaMes ?? 5000000,
    margenVerdeMin: configuracion?.margenVerdeMin ?? 20,
    margenAmarilloMin: configuracion?.margenAmarilloMin ?? 0,
    tramoPrestamoSugerido: configuracion?.tramoPrestamoSugerido ?? 20000000,
    colchonSeguridadEventos: configuracion?.colchonSeguridadEventos ?? 1,
    responsablesSugeridos: {
      fijos: configuracion?.responsablesSugeridos?.fijos || 'Gabriela',
      variables: configuracion?.responsablesSugeridos?.variables || 'Paulina',
      ingresos: configuracion?.responsablesSugeridos?.ingresos || 'Jesica'
    },
    plantillaCostosFijos: Array.isArray(configuracion?.plantillaCostosFijos) 
      ? [...configuracion.plantillaCostosFijos] 
      : [],
    mapeosExcel: configuracion?.mapeosExcel ? { ...configuracion.mapeosExcel } : {}
  }));

  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (configuracion) {
      setForm({
        eventoMinimo: configuracion.eventoMinimo ?? 4000000,
        eventoBasePersonas: configuracion.eventoBasePersonas ?? 85,
        eventoBaseCosto: configuracion.eventoBaseCosto ?? 7000000,
        costoPromedioPlanificacion: configuracion.costoPromedioPlanificacion ?? 10000000,
        tarifaAdultoVigente: configuracion.tarifaAdultoVigente ?? 127000,
        fijosReferenciaMes: configuracion.fijosReferenciaMes ?? 5000000,
        margenVerdeMin: configuracion.margenVerdeMin ?? 20,
        margenAmarilloMin: configuracion.margenAmarilloMin ?? 0,
        tramoPrestamoSugerido: configuracion.tramoPrestamoSugerido ?? 20000000,
        colchonSeguridadEventos: configuracion.colchonSeguridadEventos ?? 1,
        responsablesSugeridos: {
          fijos: configuracion.responsablesSugeridos?.fijos || 'Gabriela',
          variables: configuracion.responsablesSugeridos?.variables || 'Paulina',
          ingresos: configuracion.responsablesSugeridos?.ingresos || 'Jesica'
        },
        plantillaCostosFijos: Array.isArray(configuracion.plantillaCostosFijos) 
          ? [...configuracion.plantillaCostosFijos] 
          : [],
        mapeosExcel: configuracion.mapeosExcel ? { ...configuracion.mapeosExcel } : {}
      });
    }
  }, [configuracion]);

  const handleChange = (campo, valor) => {
    setForm(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleResponsableChange = (area, valor) => {
    setForm(prev => ({
      ...prev,
      responsablesSugeridos: {
        ...prev.responsablesSugeridos,
        [area]: valor
      }
    }));
  };

  const handleAgregarFijo = () => {
    const nuevo = {
      id: `pf-${Date.now()}`,
      concepto: 'Nuevo gasto fijo mensual',
      subcategoria: 'Administración',
      montoEstimado: 100000,
      diaVencimiento: 10,
      responsable: 'Gabriela'
    };
    setForm(prev => ({
      ...prev,
      plantillaCostosFijos: [...prev.plantillaCostosFijos, nuevo]
    }));
  };

  const handleModificarFijo = (idx, campo, valor) => {
    setForm(prev => {
      const lista = [...prev.plantillaCostosFijos];
      lista[idx] = { ...lista[idx], [campo]: valor };
      return { ...prev, plantillaCostosFijos: lista };
    });
  };

  const handleEliminarFijo = (idx) => {
    setForm(prev => ({
      ...prev,
      plantillaCostosFijos: prev.plantillaCostosFijos.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await onGuardarConfiguracion(form);
      setGuardadoExitoso(true);
      setTimeout(() => setGuardadoExitoso(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  const costoPorPersonaBase = form.eventoBasePersonas > 0 
    ? Math.round(form.eventoBaseCosto / form.eventoBasePersonas) 
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12 font-['Montserrat']">
      
      {/* Banner Principal */}
      <div className="bg-[#2F3A2A] rounded-3xl p-6 md:p-8 border border-[#C6A96A]/40 text-[#F6F3E9] shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#C6A96A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#C6A96A]/20 text-[#C6A96A] border border-[#C6A96A]/40 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Exclusivo Gerencia (Jesica & Leandro)
            </span>
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#F6F3E9] tracking-tight">
              Configuración y Parámetros del Salón
            </h1>
            <p className="text-xs md:text-sm text-[#E3DCCE]/90 mt-1 max-w-2xl leading-relaxed">
              Todos los valores que alimentan el simulador financiero, fichas económicas de eventos, punto de equilibrio y control de fijos se editan aquí sin tocar código.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={guardando}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#C6A96A] hover:bg-[#d8bb7a] active:scale-95 text-[#1E251B] font-bold text-sm shadow-lg transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            {guardadoExitoso ? (
              <>
                <Check className="w-5 h-5 text-emerald-900" />
                <span>¡Cambios Guardados!</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{guardando ? 'Guardando...' : 'Guardar Parámetros'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECCIÓN 1: PARÁMETROS OPERATIVOS DE EVENTOS Y MARGEN */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-soft border border-[#E3DCCE] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3DCCE]">
            <h2 className="text-lg font-bold text-[#2F3A2A] font-serif flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#C6A96A]" />
              <span>Parámetros de Eventos y Márgenes</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Fórmulas y Fichas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Evento Mínimo */}
            <div className="p-4 rounded-2xl bg-[#F6F3E9] border border-[#E3DCCE]">
              <label className="block text-xs font-bold text-[#2F3A2A] mb-1">
                Evento Mínimo ("Abrir el Salón")
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Costo base para eventos chicos (piso de costo).
              </p>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  value={form.eventoMinimo}
                  onChange={(e) => handleChange('eventoMinimo', Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-sm font-bold text-[#2F3A2A] bg-white rounded-xl border border-[#E3DCCE] focus:outline-none focus:ring-2 focus:ring-[#C6A96A]/40"
                />
              </div>
              <div className="text-[11px] font-bold text-[#5A6B4A] mt-1.5">
                {formatARS(form.eventoMinimo)}
              </div>
            </div>

            {/* Evento Base: Personas y Costo */}
            <div className="p-4 rounded-2xl bg-[#F6F3E9] border border-[#E3DCCE]">
              <label className="block text-xs font-bold text-[#2F3A2A] mb-1">
                Evento Base de Referencia
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Cantidad de personas y costo total del modelo estándar.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold">Personas:</span>
                  <input
                    type="number"
                    value={form.eventoBasePersonas}
                    onChange={(e) => handleChange('eventoBasePersonas', Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm font-bold text-[#2F3A2A] bg-white rounded-xl border border-[#E3DCCE] focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold">Costo:</span>
                  <input
                    type="number"
                    value={form.eventoBaseCosto}
                    onChange={(e) => handleChange('eventoBaseCosto', Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm font-bold text-[#2F3A2A] bg-white rounded-xl border border-[#E3DCCE] focus:outline-none"
                  />
                </div>
              </div>
              <div className="text-[11px] text-[#5A6B4A] font-bold mt-2">
                Costo / persona: {formatARS(costoPorPersonaBase)}
              </div>
            </div>

            {/* Tarifa Vigente Adulto */}
            <div className="p-4 rounded-2xl bg-[#F6F3E9] border border-[#E3DCCE]">
              <label className="block text-xs font-bold text-[#2F3A2A] mb-1">
                Tarifa Vigente por Tarjeta de Adulto
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Precio oficial sincronizado con Tarifario & Ventas.
              </p>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  value={form.tarifaAdultoVigente}
                  onChange={(e) => handleChange('tarifaAdultoVigente', Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-sm font-bold text-[#2F3A2A] bg-white rounded-xl border border-[#E3DCCE] focus:outline-none focus:ring-2 focus:ring-[#C6A96A]/40"
                />
              </div>
              <div className="text-[11px] font-bold text-[#5A6B4A] mt-1.5">
                {formatARS(form.tarifaAdultoVigente)} / tarjeta
              </div>
            </div>
          </div>

          {/* Umbrales de Semáforo */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-[#2F3A2A] uppercase tracking-wider mb-2">
              Umbrales del Semáforo de Margen por Evento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-emerald-900">🟢 Margen Verde</div>
                  <div className="text-[11px] text-emerald-700">Mayor al {form.margenVerdeMin}%</div>
                </div>
                <input
                  type="number"
                  value={form.margenVerdeMin}
                  onChange={(e) => handleChange('margenVerdeMin', Number(e.target.value))}
                  className="w-16 px-2 py-1 text-center font-bold text-sm bg-white rounded-lg border border-emerald-300"
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-amber-900">🟡 Margen Amarillo</div>
                  <div className="text-[11px] text-amber-700">Entre {form.margenAmarilloMin}% y {form.margenVerdeMin}%</div>
                </div>
                <input
                  type="number"
                  value={form.margenAmarilloMin}
                  onChange={(e) => handleChange('margenAmarilloMin', Number(e.target.value))}
                  className="w-16 px-2 py-1 text-center font-bold text-sm bg-white rounded-lg border border-amber-300"
                />
              </div>

              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-rose-900">🔴 Margen Rojo</div>
                  <div className="text-[11px] text-rose-700">Menor a {form.margenAmarilloMin}% (negativo)</div>
                </div>
                <span className="text-xs font-bold text-rose-700">Automático</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: PARÁMETROS DEL SIMULADOR Y PRÉSTAMO FAMILIAR */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-soft border border-[#E3DCCE] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3DCCE]">
            <h2 className="text-lg font-bold text-[#2F3A2A] font-serif flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#C6A96A]" />
              <span>Simulador de Cobertura y Préstamo Familiar</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Planificación de Caja</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Costo promedio por evento */}
            <div className="p-4 rounded-2xl bg-[#F6F3E9] border border-[#E3DCCE]">
              <label className="block text-xs font-bold text-[#2F3A2A] mb-1">
                Costo Promedio por Evento (Planificación)
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Promedio para organizar la caja en el simulador.
              </p>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  value={form.costoPromedioPlanificacion}
                  onChange={(e) => handleChange('costoPromedioPlanificacion', Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-sm font-bold text-[#2F3A2A] bg-white rounded-xl border border-[#E3DCCE] focus:outline-none"
                />
              </div>
              <div className="text-[11px] font-bold text-[#5A6B4A] mt-1.5">
                {formatARS(form.costoPromedioPlanificacion)}
              </div>
            </div>

            {/* Tamaño sugerido de tramo */}
            <div className="p-4 rounded-2xl bg-[#F6F3E9] border border-[#E3DCCE]">
              <label className="block text-xs font-bold text-[#2F3A2A] mb-1">
                Tamaño Sugerido de Cada Tramo
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Monto recomendado a solicitar a la familia por etapa.
              </p>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  value={form.tramoPrestamoSugerido}
                  onChange={(e) => handleChange('tramoPrestamoSugerido', Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-sm font-bold text-[#2F3A2A] bg-white rounded-xl border border-[#E3DCCE] focus:outline-none"
                />
              </div>
              <div className="text-[11px] font-bold text-[#5A6B4A] mt-1.5">
                {formatARS(form.tramoPrestamoSugerido)}
              </div>
            </div>

            {/* Colchón de seguridad */}
            <div className="p-4 rounded-2xl bg-[#F6F3E9] border border-[#E3DCCE]">
              <label className="block text-xs font-bold text-[#2F3A2A] mb-1">
                Colchón de Seguridad (Alerta de Tramo)
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Cuántos eventos de reserva deben asegurarse antes de disparar la alerta roja.
              </p>
              <div className="relative">
                <input
                  type="number"
                  value={form.colchonSeguridadEventos}
                  onChange={(e) => handleChange('colchonSeguridadEventos', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold text-[#2F3A2A] bg-white rounded-xl border border-[#E3DCCE] focus:outline-none"
                />
              </div>
              <div className="text-[11px] font-bold text-[#5A6B4A] mt-1.5">
                Alerta si la caja cubre menos de {form.colchonSeguridadEventos} evento(s)
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: RESPONSABLES SUGERIDOS DE CARGA */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-soft border border-[#E3DCCE] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3DCCE]">
            <h2 className="text-lg font-bold text-[#2F3A2A] font-serif flex items-center gap-2">
              <Users className="w-5 h-5 text-[#C6A96A]" />
              <span>Responsables Asignados por Área</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Carga Rápida y Fijos</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#F6F3E9] border border-[#E3DCCE]">
              <span className="font-bold text-[#2F3A2A] block mb-1">Costos Fijos e Impuestos</span>
              <input
                type="text"
                value={form.responsablesSugeridos.fijos}
                onChange={(e) => handleResponsableChange('fijos', e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE] font-bold text-slate-800"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Por defecto: Gabriela</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F6F3E9] border border-[#E3DCCE]">
              <span className="font-bold text-[#2F3A2A] block mb-1">Gastos Variables del Evento</span>
              <input
                type="text"
                value={form.responsablesSugeridos.variables}
                onChange={(e) => handleResponsableChange('variables', e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE] font-bold text-slate-800"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Por defecto: Paulina</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F6F3E9] border border-[#E3DCCE]">
              <span className="font-bold text-[#2F3A2A] block mb-1">Ingresos y Señas</span>
              <input
                type="text"
                value={form.responsablesSugeridos.ingresos}
                onChange={(e) => handleResponsableChange('ingresos', e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#E3DCCE] font-bold text-slate-800"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Por defecto: Jesica</span>
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: PLANTILLA OFICIAL DE COSTOS FIJOS */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-soft border border-[#E3DCCE] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3DCCE]">
            <div>
              <h2 className="text-lg font-bold text-[#2F3A2A] font-serif flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#C6A96A]" />
                <span>Plantilla Maestra de Costos Fijos Mensuales</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Gastos fijos que el salón monitorea cada mes. Se marcan como pagados cuando se registra el egreso.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAgregarFijo}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#2F3A2A] hover:bg-[#3D4C37] text-[#F6F3E9] text-xs font-bold rounded-xl border border-[#C6A96A]/60 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#C6A96A]" />
              <span>+ Agregar Concepto Fijo</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E3DCCE] text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Concepto</th>
                  <th className="py-2.5 px-3">Subcategoría Fija</th>
                  <th className="py-2.5 px-3">Monto Estimado</th>
                  <th className="py-2.5 px-3">Día Vence</th>
                  <th className="py-2.5 px-3">Responsable</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DCCE]/60">
                {form.plantillaCostosFijos.map((fijo, idx) => (
                  <tr key={fijo.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={fijo.concepto}
                        onChange={(e) => handleModificarFijo(idx, 'concepto', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E3DCCE] font-bold text-slate-900 bg-white"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <select
                        value={fijo.subcategoria}
                        onChange={(e) => handleModificarFijo(idx, 'subcategoria', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-[#E3DCCE] text-slate-800 bg-white"
                      >
                        {CATEGORIAS_CAJA.Fijos.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={fijo.montoEstimado}
                        onChange={(e) => handleModificarFijo(idx, 'montoEstimado', Number(e.target.value))}
                        className="w-32 px-2 py-1.5 rounded-lg border border-[#E3DCCE] font-bold text-slate-900 bg-white"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={fijo.diaVencimiento}
                        onChange={(e) => handleModificarFijo(idx, 'diaVencimiento', Number(e.target.value))}
                        className="w-16 px-2 py-1.5 rounded-lg border border-[#E3DCCE] text-center font-bold text-slate-900 bg-white"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={fijo.responsable}
                        onChange={(e) => handleModificarFijo(idx, 'responsable', e.target.value)}
                        className="w-28 px-2 py-1.5 rounded-lg border border-[#E3DCCE] text-slate-800 bg-white"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleEliminarFijo(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Eliminar concepto fijo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-[#E3DCCE] flex items-center justify-between text-xs text-slate-600">
            <span>Total plantilla fija estimada:</span>
            <span className="font-bold text-[#2F3A2A] text-sm">
              {formatARS(form.plantillaCostosFijos.reduce((acc, f) => acc + (Number(f.montoEstimado) || 0), 0))}
            </span>
          </div>
        </div>

        {/* BOTÓN FINAL DE GUARDAR */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={guardando}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#2F3A2A] hover:bg-[#3D4C37] active:scale-95 text-[#F6F3E9] border border-[#C6A96A] font-bold text-sm shadow-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {guardadoExitoso ? (
              <>
                <Check className="w-5 h-5 text-[#C6A96A]" />
                <span>¡Configuración Actualizada Exitosamente!</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5 text-[#C6A96A]" />
                <span>{guardando ? 'Guardando...' : 'Guardar Todos los Parámetros'}</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
