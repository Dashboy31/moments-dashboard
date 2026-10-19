import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  User, 
  Plus, 
  Sparkles, 
  Calendar, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Smartphone,
  Eye,
  Check,
  X,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

export default function ChecklistView({ 
  checklist, 
  onToggleItem, 
  onAgregarItem, 
  eventoActivo, 
  todosEventos, 
  onCambiarEventoActivo,
  usuarioActivo 
}) {
  const [etapaFiltro, setEtapaFiltro] = useState('todas'); // 'todas', 'antes', 'durante', 'despues'
  const [modalNuevaTarea, setModalNuevaTarea] = useState(false);
  const [modalNotaItem, setModalNotaItem] = useState(null); // item para editar nota
  const [notaTexto, setNotaTexto] = useState('');

  // Nueva tarea
  const [tareaTitulo, setTareaTitulo] = useState('');
  const [tareaDescripcion, setTareaDescripcion] = useState('');
  const [tareaEtapa, setTareaEtapa] = useState('durante');

  // Modo Solo Lectura / Vista Leandro
  const [modoLeandro, setModoLeandro] = useState(usuarioActivo.id === 'leandro');

  // Cálculos de avance
  const total = checklist.length;
  const completados = checklist.filter(i => i.completado).length;
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;

  const etapas = [
    { id: 'antes', nombre: '1. Antes del Evento (Pre-evento)', subtitulo: 'Armado, montaje, sanitarios, bebidas, grupo electrógeno y recepción de familia' },
    { id: 'durante', nombre: '2. Durante el Evento (En Vivo)', subtitulo: 'Ingreso, cena, barra de bebidas, vals/brindis, rondas horarias de baños y tanda de baile' },
    { id: 'despues', nombre: '3. Después del Evento (Cierre)', subtitulo: 'Cierre de música, retiro de invitados, conteo de vajilla, entrega de pertenencias y alarma' }
  ];

  const handleGuardarNota = (e) => {
    e.preventDefault();
    if (modalNotaItem) {
      modalNotaItem.nota = notaTexto;
      setModalNotaItem(null);
    }
  };

  const handleCrearTarea = (e) => {
    e.preventDefault();
    if (!tareaTitulo.trim()) return;

    const nueva = {
      id: 'chk-custom-' + Date.now(),
      etapa: tareaEtapa,
      titulo: tareaTitulo.trim(),
      descripcion: tareaDescripcion.trim() || 'Tarea agregada en vivo durante la jornada',
      completado: false,
      hora: null,
      responsable: usuarioActivo.nombre,
      nota: ''
    };

    onAgregarItem(nueva);
    setModalNuevaTarea(false);
    setTareaTitulo('');
    setTareaDescripcion('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Encabezado con selector de Evento Activo */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-moments-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Checklist Operativo en Vivo
              </h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                Logística de Evento
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ideal para uso desde el celular durante el evento (Paulina) y monitoreo en vivo (Leandro).
            </p>
          </div>

          {/* Toggle Modo Leandro / Modo Operativo */}
          <button
            onClick={() => setModoLeandro(!modoLeandro)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all border ${
              modoLeandro 
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>{modoLeandro ? 'Modo Visor (Leandro: Solo Ver)' : 'Modo Paulina (Tocar para Marcar)'}</span>
          </button>
        </div>

        {/* Ficha del Evento que se está chequeando */}
        <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Evento Seleccionado:
            </div>
            <div className="flex items-center gap-3">
              <select
                value={eventoActivo?.id || ''}
                onChange={(e) => {
                  const ev = todosEventos.find(item => item.id === e.target.value);
                  if (ev) onCambiarEventoActivo(ev);
                }}
                className="bg-amber-50 text-slate-900 border border-amber-300 rounded-xl px-3 py-1.5 font-black text-sm sm:text-base focus:outline-none cursor-pointer"
              >
                {todosEventos.filter(e => e.tipo !== 'mantenimiento').map(e => (
                  <option key={e.id} value={e.id}>
                    {e.titulo} · {e.fecha} ({e.invitadosCena + e.invitadosBrindis} personas)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Progreso Total */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 min-w-[200px]">
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="text-slate-600">Avance General:</span>
              <span className="text-amber-800 font-black text-sm">{porcentaje}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 font-medium text-right mt-1">
              {completados} de {total} ítems completados
            </div>
          </div>
        </div>

      </div>

      {/* Filtro rápido por Etapa y Botón Nueva Tarea */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setEtapaFiltro('todas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              etapaFiltro === 'todas' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Todas las Etapas
          </button>
          <button
            onClick={() => setEtapaFiltro('antes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              etapaFiltro === 'antes' ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            1. Antes
          </button>
          <button
            onClick={() => setEtapaFiltro('durante')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              etapaFiltro === 'durante' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            2. Durante (En Vivo)
          </button>
          <button
            onClick={() => setEtapaFiltro('despues')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              etapaFiltro === 'despues' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            3. Cierre
          </button>
        </div>

        {!modoLeandro && (
          <button
            onClick={() => setModalNuevaTarea(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all whitespace-nowrap active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Agregar Tarea Imprevista</span>
            <span className="sm:hidden">+ Tarea</span>
          </button>
        )}
      </div>

      {/* Listado de Etapas con Ítems Táctiles */}
      <div className="space-y-6">
        {etapas
          .filter(e => etapaFiltro === 'todas' || etapaFiltro === e.id)
          .map((etapa) => {
            const itemsEtapa = checklist.filter(i => i.etapa === etapa.id);
            const compEtapa = itemsEtapa.filter(i => i.completado).length;
            const pctEtapa = itemsEtapa.length > 0 ? Math.round((compEtapa / itemsEtapa.length) * 100) : 0;

            return (
              <div 
                key={etapa.id} 
                className="bg-white rounded-3xl p-4 sm:p-5 shadow-soft border border-moments-border"
              >
                {/* Cabecera de Etapa */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      {etapa.nombre}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {etapa.subtitulo}
                    </p>
                  </div>

                  <span className={`text-xs font-black px-2.5 py-1 rounded-xl w-fit ${
                    pctEtapa === 100 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {compEtapa} / {itemsEtapa.length} ({pctEtapa}%)
                  </span>
                </div>

                {/* Ítems táctiles */}
                <div className="space-y-2">
                  {itemsEtapa.map((item) => {
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (!modoLeandro) {
                            onToggleItem(item.id, usuarioActivo.nombre);
                          }
                        }}
                        className={`touch-card p-3 sm:p-3.5 rounded-2xl border transition-all flex items-start gap-3 select-none ${
                          modoLeandro ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'
                        } ${
                          item.completado
                            ? 'bg-emerald-50/40 border-emerald-200 text-slate-700'
                            : 'bg-white hover:bg-slate-50/70 border-slate-200 text-slate-900 shadow-sm'
                        }`}
                      >
                        {/* Botón de Check Táctil Grande */}
                        <div className="pt-0.5 shrink-0">
                          {item.completado ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-300 hover:border-amber-500 bg-white" />
                          )}
                        </div>

                        {/* Contenido del ítem */}
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-bold leading-snug ${item.completado ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {item.titulo}
                          </div>
                          
                          {item.descripcion && (
                            <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                              {item.descripcion}
                            </div>
                          )}

                          {/* Metadatos: Hora, quién completó y notas */}
                          <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
                            {item.completado && item.hora && (
                              <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                                <Clock className="w-3 h-3" />
                                <span>{item.hora} hs</span>
                              </span>
                            )}

                            {item.completado && item.responsable && (
                              <span className="inline-flex items-center gap-1 font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                <User className="w-3 h-3 text-slate-400" />
                                <span>{item.responsable}</span>
                              </span>
                            )}

                            {item.nota && (
                              <span className="inline-flex items-center gap-1 font-medium text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                                <MessageSquare className="w-3 h-3 text-amber-600" />
                                <span>"{item.nota}"</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Botón para editar nota rápida */}
                        {!modoLeandro && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalNotaItem(item);
                              setNotaTexto(item.nota || '');
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-700 rounded-lg hover:bg-amber-50 shrink-0"
                            title="Agregar o editar nota sobre este ítem"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* Modal para Agregar Tarea Rápida */}
      {modalNuevaTarea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-modal max-w-md w-full p-6 border border-moments-border">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                <span>Agregar Tarea Imprevista</span>
              </h3>
              <button 
                onClick={() => setModalNuevaTarea(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearTarea} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Momento / Etapa *</label>
                <select
                  value={tareaEtapa}
                  onChange={(e) => setTareaEtapa(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
                >
                  <option value="antes">1. Antes del Evento</option>
                  <option value="durante">2. Durante el Evento (En Vivo)</option>
                  <option value="despues">3. Después del Evento (Cierre)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Título de la Tarea *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Reponer 5 bolsas de hielo adicionales de urgencia"
                  value={tareaTitulo}
                  onChange={(e) => setTareaTitulo(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Detalle u Observación</label>
                <input
                  type="text"
                  placeholder="Ej: Se trajeron de la estación de servicio"
                  value={tareaDescripcion}
                  onChange={(e) => setTareaDescripcion(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalNuevaTarea(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md transition-all active:scale-95"
                >
                  Agregar al Checklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Editar Nota de Ítem */}
      {modalNotaItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-modal max-w-sm w-full p-5 border border-moments-border">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <span>Nota sobre la tarea</span>
              </h3>
              <button 
                onClick={() => setModalNotaItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-semibold text-slate-700 mb-2 truncate">
              {modalNotaItem.titulo}
            </p>

            <form onSubmit={handleGuardarNota}>
              <textarea
                rows="3"
                placeholder="Escriba alguna aclaración (ej: 'Se rompieron 2 copas', 'Se usó generador 20 min')..."
                value={notaTexto}
                onChange={(e) => setNotaTexto(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />

              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setModalNotaItem(null)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-black bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md"
                >
                  Guardar Nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
