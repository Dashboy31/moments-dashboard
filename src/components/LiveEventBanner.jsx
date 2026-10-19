import React from 'react';
import { Radio, CheckCircle2, Clock, ChevronRight, Sparkles, Users } from 'lucide-react';

export default function LiveEventBanner({ 
  eventoActivo, 
  checklist, 
  onIrAlChecklist,
  todosEventos,
  onCambiarEventoActivo 
}) {
  if (!eventoActivo) return null;

  // Cálculos de progreso
  const itemsEvento = checklist;
  const totalItems = itemsEvento.length;
  const completados = itemsEvento.filter(i => i.completado).length;
  const porcentaje = totalItems > 0 ? Math.round((completados / totalItems) * 100) : 0;

  // Por etapas
  const antesTotal = itemsEvento.filter(i => i.etapa === 'antes').length;
  const antesComp = itemsEvento.filter(i => i.etapa === 'antes' && i.completado).length;

  const duranteTotal = itemsEvento.filter(i => i.etapa === 'durante').length;
  const duranteComp = itemsEvento.filter(i => i.etapa === 'durante' && i.completado).length;

  const despuesTotal = itemsEvento.filter(i => i.etapa === 'despues').length;
  const despuesComp = itemsEvento.filter(i => i.etapa === 'despues' && i.completado).length;

  // Último ítem completado
  const itemsConHora = itemsEvento.filter(i => i.completado && i.hora);
  const ultimoItem = itemsConHora.length > 0 ? itemsConHora[itemsConHora.length - 1] : null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-4 sm:p-5 shadow-card border border-amber-900/40 mb-6 relative overflow-hidden">
      {/* Luz ambiental decorativa */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Info del evento en curso */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              <span>En Vivo Hoy</span>
            </span>

            {/* Selector de evento para simular o cambiar */}
            <select
              value={eventoActivo.id}
              onChange={(e) => {
                const ev = todosEventos.find(item => item.id === e.target.value);
                if (ev) onCambiarEventoActivo(ev);
              }}
              className="bg-slate-800/80 text-amber-200 border border-slate-700 rounded-lg text-xs px-2 py-0.5 font-semibold focus:outline-none cursor-pointer"
            >
              {todosEventos.filter(e => e.tipo !== 'mantenimiento').map(e => (
                <option key={e.id} value={e.id}>
                  {e.titulo} ({e.fecha})
                </option>
              ))}
            </select>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{eventoActivo.titulo}</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{eventoActivo.horaInicio} a {eventoActivo.horaFin} hs</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{eventoActivo.invitadosCena} cena + {eventoActivo.invitadosBrindis} brindis ({eventoActivo.invitadosCena + eventoActivo.invitadosBrindis} invitados)</span>
            </span>
            <span>•</span>
            <span className="text-slate-300">
              Coordina: <strong className="text-amber-200">{eventoActivo.responsable}</strong>
            </span>
          </div>

          {/* Último reporte en tiempo real */}
          {ultimoItem && (
            <p className="text-xs text-amber-200/90 mt-2.5 flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/5 w-fit">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Última tarea: <strong>{ultimoItem.titulo}</strong> ({ultimoItem.hora} hs por {ultimoItem.responsable})
              </span>
            </p>
          )}
        </div>

        {/* Barra de progreso y etapas para Leandro */}
        <div className="lg:w-80 shrink-0 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-200">Avance de Logística</span>
            <span className="text-amber-300 text-sm font-black">{porcentaje}% ({completados}/{totalItems})</span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full h-3 bg-slate-700/80 rounded-full overflow-hidden p-0.5 border border-slate-600/60 mb-3">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-500 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${porcentaje}%` }}
            />
          </div>

          {/* Mini píldoras por etapa */}
          <div className="grid grid-cols-3 gap-1.5 text-[11px] text-center font-bold mb-3">
            <div className={`p-1.5 rounded-lg border ${antesComp === antesTotal ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40' : 'bg-slate-800/60 text-slate-300 border-slate-700'}`}>
              <div className="text-[10px] uppercase text-slate-400 font-semibold">Antes</div>
              <div>{antesComp}/{antesTotal} ✓</div>
            </div>
            <div className={`p-1.5 rounded-lg border ${duranteComp === duranteTotal ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40' : 'bg-amber-950/40 text-amber-200 border-amber-600/50'}`}>
              <div className="text-[10px] uppercase text-amber-400/90 font-semibold">Durante</div>
              <div>{duranteComp}/{duranteTotal} ⏳</div>
            </div>
            <div className={`p-1.5 rounded-lg border ${despuesComp === despuesTotal && despuesTotal > 0 ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40' : 'bg-slate-800/60 text-slate-400 border-slate-700'}`}>
              <div className="text-[10px] uppercase text-slate-400 font-semibold">Cierre</div>
              <div>{despuesComp}/{despuesTotal}</div>
            </div>
          </div>

          <button
            onClick={onIrAlChecklist}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md active:scale-98"
          >
            <span>Ver y marcar Checklist en vivo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
