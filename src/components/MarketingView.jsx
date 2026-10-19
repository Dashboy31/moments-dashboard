import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Copy, 
  Check, 
  ExternalLink, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  LayoutGrid, 
  FileCheck, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Clock, 
  Phone,
  Trash2,
  X,
  Calculator,
  Utensils,
  Wine,
  PartyPopper,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Award
} from 'lucide-react';
import { GUIONES_VENTAS, CONSULTAS_PIPELINE_SEED, USUARIOS } from '../utils/mockData';
import MomentsLogo from './MomentsLogo';

export default function MarketingView({ usuarioActivo }) {
  // Pestañas internas de la sección
  const [subTab, setSubTab] = useState('calculadora'); // 'calculadora', 'menu', 'guiones', 'galeria', 'pipeline'
  const [guionActivoId, setGuionActivoId] = useState('guion-15');
  const [copiadoId, setCopiadoId] = useState(null);
  const [fotoModal, setFotoModal] = useState(null);

  // ==========================================
  // CALCULADORA OFICIAL DE PRESUPUESTOS (VENTAS)
  // ==========================================
  const [calcTipoEvento, setCalcTipoEvento] = useState('15_anos');
  const [calcAdultosCena, setCalcAdultosCena] = useState(90);
  const [calcMenores4a8, setCalcMenores4a8] = useState(8);
  const [calcInvitadosBrindis, setCalcInvitadosBrindis] = useState(40);
  const [calcPrecioTarjetaCena, setCalcPrecioTarjetaCena] = useState(127000); // $127.000 o $108.000
  const [calcIncluirTecnica, setCalcIncluirTecnica] = useState(true); // $1.500.000
  const [calcOpcionDulce, setCalcOpcionDulce] = useState('promo'); // 'ninguno', 'mesa_dulce', 'fondue', 'promo'
  const [calcClienteNombre, setCalcClienteNombre] = useState('Familia Gómez');
  const [calcFechaTentativa, setCalcFechaTentativa] = useState('Noviembre 2026');

  // Cálculos de presupuesto en tiempo real
  const presupuestoCalculado = useMemo(() => {
    // 1. Tarjetas cena adultos
    const totalAdultos = calcAdultosCena * calcPrecioTarjetaCena;
    
    // 2. Tarjetas menores (4 a 8 años pagan 50%)
    const precioMenor = calcPrecioTarjetaCena * 0.5;
    const totalMenores = calcMenores4a8 * precioMenor;

    // 3. Tarjetas brindis (15s: $33.000 con obsequios oficiales; Bodas: $44.000)
    let precioBrindis = calcTipoEvento === 'casamiento' ? 44000 : 33000;
    let brindisObsequio = 0;

    if (calcTipoEvento === '15_anos') {
      if (calcInvitadosBrindis >= 150) brindisObsequio = 25;
      else if (calcInvitadosBrindis >= 110) brindisObsequio = 20;
      else if (calcInvitadosBrindis >= 80) brindisObsequio = 15;
      else if (calcInvitadosBrindis >= 50) brindisObsequio = 10;
    }

    const brindisACobrar = Math.max(0, calcInvitadosBrindis - brindisObsequio);
    const totalBrindis = brindisACobrar * precioBrindis;

    // 4. Técnica Integral ($1.500.000)
    const costoTecnica = calcIncluirTecnica ? 1500000 : 0;

    // 5. Opcionales dulces
    let costoDulceUnitario = 0;
    if (calcOpcionDulce === 'mesa_dulce') costoDulceUnitario = 11000;
    else if (calcOpcionDulce === 'fondue') costoDulceUnitario = 8000;
    else if (calcOpcionDulce === 'promo') costoDulceUnitario = 17500;

    const totalDulces = (calcAdultosCena + calcMenores4a8) * costoDulceUnitario;

    // Total general
    const granTotal = totalAdultos + totalMenores + totalBrindis + costoTecnica + totalDulces;

    // Seña oficial (10 tarjetas cena)
    const senaContado = 10 * calcPrecioTarjetaCena;
    const senaDosCuotas = (senaContado * 1.03) / 2;

    return {
      totalAdultos,
      totalMenores,
      precioMenor,
      brindisObsequio,
      brindisACobrar,
      precioBrindis,
      totalBrindis,
      costoTecnica,
      totalDulces,
      granTotal,
      senaContado,
      senaDosCuotas,
      totalInvitados: calcAdultosCena + calcMenores4a8 + calcInvitadosBrindis
    };
  }, [
    calcTipoEvento, 
    calcAdultosCena, 
    calcMenores4a8, 
    calcInvitadosBrindis, 
    calcPrecioTarjetaCena, 
    calcIncluirTecnica, 
    calcOpcionDulce
  ]);

  // Copiar presupuesto formal para WhatsApp
  const handleCopiarPresupuestoWhatsApp = () => {
    const texto = `✨ *PRESUPUESTO OFICIAL · MOMENTS SALÓN DE EVENTOS* ✨
Empresa Gastronómica · San Rafael, Mendoza
Instagram: @moments.tulugar
Teléfono: 2604-055777 (Joaquina, Pablo, Gabriela)

Estimados *${calcClienteNombre}*, les compartimos la propuesta formal para su *${calcTipoEvento === '15_anos' ? 'Cumpleaños de 15' : calcTipoEvento === 'casamiento' ? 'Casamiento' : 'Fiesta de Egresados'}* (${calcFechaTentativa}):

🍽️ *1. SERVICIO GASTRONÓMICO Y SALÓN:*
• ${calcAdultosCena} Adultos a la cena ($${calcPrecioTarjetaCena.toLocaleString('es-AR')} c/u): $${presupuestoCalculado.totalAdultos.toLocaleString('es-AR')}
${calcMenores4a8 > 0 ? `• ${calcMenores4a8} Menores (4 a 8 años al 50%): $${presupuestoCalculado.totalMenores.toLocaleString('es-AR')}\n` : ''}• Menores de 3 años: *Sin cargo*
${calcInvitadosBrindis > 0 ? `• ${calcInvitadosBrindis} Invitados al Brindis (${presupuestoCalculado.brindisObsequio > 0 ? `${presupuestoCalculado.brindisObsequio} de obsequio, se abonan ${presupuestoCalculado.brindisACobrar}` : `${calcInvitadosBrindis} tarjetas`} a $${presupuestoCalculado.precioBrindis.toLocaleString('es-AR')} c/u): $${presupuestoCalculado.totalBrindis.toLocaleString('es-AR')}\n` : ''}
⚡ *2. TÉCNICA INTEGRAL PROFESIONAL:*
${calcIncluirTecnica ? '• Sonido envolvente, DJ en vivo, pantalla gigante, 8 pantallas LCD, iluminación robotizada, 5 láser bicolor, pista exterior LED, Galaxia 3D, 4 juegos de living y 10 mesas bar: *$1.500.000*' : '• No incluida'}

🍰 *3. MOMENTO DULCE & TRASNOCHE:*
• Carro de helados con salsas y chips + café incluidos sin cargo.
${calcOpcionDulce !== 'ninguno' ? `• Opcional contratado (${calcOpcionDulce === 'promo' ? 'Promo Mesa Dulce Variada + Fondue de Chocolate' : calcOpcionDulce === 'mesa_dulce' ? 'Mesa Dulce Artesanal' : 'Fondue de Chocolate'}): $${presupuestoCalculado.totalDulces.toLocaleString('es-AR')}\n` : ''}• Cierre con Pizza Show por metro (especial, calabresa, fugazzeta, roquefort).

👑 *AGASAJADOS:* Invitados de lujo sin costo (novios o quinceañera).

========================================
💰 *INVERSIÓN TOTAL ESTIMADA: $${presupuestoCalculado.granTotal.toLocaleString('es-AR')}*
========================================

🔒 *CONDICIONES DE RESERVA:*
• Para congelar fecha se abona el equivalente a *10 tarjetas cena* ($${presupuestoCalculado.senaContado.toLocaleString('es-AR')}).
• Modalidad de seña: Contado o en 2 cuotas de $${Math.round(presupuestoCalculado.senaDosCuotas).toLocaleString('es-AR')} (3% interés).
• Entregas parciales mensuales hasta cancelar 30 días antes de la fiesta.
• Horario del salón: 21:00 hs a 05:00 hs.

¿Coordinamos una visita esta semana para que conozcan el salón y el parque en persona? ¡Será un placer recibirlos! ✨`;

    navigator.clipboard.writeText(texto);
    setCopiadoId('presupuesto');
    setTimeout(() => setCopiadoId(null), 2500);
  };

  // Pipeline de Consultas
  const [consultas, setConsultas] = useState(CONSULTAS_PIPELINE_SEED);
  const [modalNuevaConsulta, setModalNuevaConsulta] = useState(false);
  const [formCliente, setFormCliente] = useState('');
  const [formTipo, setFormTipo] = useState('15_anos');
  const [formFecha, setFormFecha] = useState('2027-03-20');
  const [formInvitados, setFormInvitados] = useState('100');
  const [formContacto, setFormContacto] = useState('');
  const [formPresupuesto, setFormPresupuesto] = useState('4500000');
  const [formVendedor, setFormVendedor] = useState(usuarioActivo.nombre);
  const [formNotas, setFormNotas] = useState('');

  const guionSeleccionado = GUIONES_VENTAS.find(g => g.id === guionActivoId) || GUIONES_VENTAS[0];

  const handleCopiarWhatsApp = (texto, id) => {
    navigator.clipboard.writeText(texto);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  const handleCrearConsulta = (e) => {
    e.preventDefault();
    if (!formCliente) return;

    const nueva = {
      id: 'con-' + Date.now(),
      cliente: formCliente,
      tipo: formTipo,
      fechaTentativa: formFecha,
      invitadosEstimados: Number(formInvitados) || 0,
      estado: 'Nueva consulta',
      vendedor: formVendedor,
      contacto: formContacto,
      presupuestoEstimado: Number(formPresupuesto) || 0,
      notas: formNotas
    };

    setConsultas([nueva, ...consultas]);
    setModalNuevaConsulta(false);
    setFormCliente('');
    setFormContacto('');
    setFormNotas('');
  };

  const handleCambiarEstadoConsulta = (id, nuevoEstado) => {
    setConsultas(prev => prev.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c));
  };

  const handleEliminarConsulta = (id) => {
    if (window.confirm('¿Eliminar esta consulta del seguimiento?')) {
      setConsultas(prev => prev.filter(c => c.id !== id));
    }
  };

  const formatARS = (num) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(num);
  };

  // Fotos reales para la galería
  const galeriaFotos = [
    { src: '/images/salon_fiesta_baile.jpg', titulo: 'Pista de Baile y Candelabros LED', desc: 'Estructura metálica, bolas de espejos y lluvia de luces en plena fiesta.' },
    { src: '/images/salon_mesas_elegantes.jpg', titulo: 'Salón Vestido para Banquete', desc: 'Mesas redondas vestidas con mantelería fina y lazos rosa de gala.' },
    { src: '/images/salon_15_anos.jpg', titulo: 'Sector Principal 15 Años', desc: 'Panel de lentejuelas espejadas y número 15 iluminado en neon.' },
    { src: '/images/salon_egresados.jpg', titulo: 'Letras Gigantes Luminosas', desc: 'Pista de egresados con letras corporeas LED para fotos inolvidables.' },
    { src: '/images/salon_mesa_principal.jpg', titulo: 'Mesa VIP de Agasajados', desc: 'Centros de mesa con candelabros, flores y cristalería de primer nivel.' },
    { src: '/images/plato_medallon_carne.jpg', titulo: 'Gastronomía de Alta Cocina', desc: 'Medallón de carne braseada en su jugo con milhojas de papas gratinadas.' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Encabezado con selector de sub-sección */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-soft border border-moments-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Tarifario, Menú y Ventas
              </h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Oficial Moments
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tarifas vigentes, cotizador instantáneo de tarjetas, carta gastronómica completa y pipeline comercial.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setModalNuevaConsulta(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-black rounded-2xl bg-[#7d1728] hover:bg-[#681321] text-white shadow-md shadow-rose-950/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Registrar Consulta</span>
            </button>
          </div>
        </div>

        {/* Pestañas Secundarias */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 no-scrollbar">
          <button
            onClick={() => setSubTab('calculadora')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              subTab === 'calculadora' 
                ? 'bg-[#7d1728] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <Calculator className="w-4 h-4 text-amber-300" />
            <span>Cotizador Oficial de Presupuestos</span>
          </button>

          <button
            onClick={() => setSubTab('menu')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              subTab === 'menu' 
                ? 'bg-[#7d1728] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <Utensils className="w-4 h-4 text-amber-300" />
            <span>Carta Gastronómica Completa</span>
          </button>

          <button
            onClick={() => setSubTab('guiones')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              subTab === 'guiones' 
                ? 'bg-[#7d1728] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-300" />
            <span>Guiones de WhatsApp</span>
          </button>

          <button
            onClick={() => setSubTab('galeria')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              subTab === 'galeria' 
                ? 'bg-[#7d1728] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-amber-300" />
            <span>Fotos Reales del Salón</span>
          </button>

          <button
            onClick={() => setSubTab('pipeline')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              subTab === 'pipeline' 
                ? 'bg-[#7d1728] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-amber-300" />
            <span>Embudo Comercial ({consultas.length})</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. COTIZADOR OFICIAL DE PRESUPUESTOS (CALCULADORA DE VENTAS) */}
      {/* ============================================================== */}
      {subTab === 'calculadora' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Panel de Entradas (Formulario de Cotización) */}
          <div className="lg:col-span-7 bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-soft border border-moments-border space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-600" />
                <span>Simulador de Precios y Tarjetas</span>
              </h2>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                Valores Oficiales 2026/2027
              </span>
            </div>

            {/* Datos del Cliente y Tipo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Tipo de Evento</label>
                <select
                  value={calcTipoEvento}
                  onChange={(e) => setCalcTipoEvento(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 font-bold focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="15_anos">🎉 Cumpleaños de 15</option>
                  <option value="casamiento">💍 Casamiento / Boda</option>
                  <option value="egresados">🎓 Fiesta de Egresados</option>
                  <option value="aniversario">🥂 Aniversario / Cumple</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Nombre Familia / Cliente</label>
                <input
                  type="text"
                  value={calcClienteNombre}
                  onChange={(e) => setCalcClienteNombre(e.target.value)}
                  placeholder="Ej: Familia Morales"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Fecha Tentativa</label>
                <input
                  type="text"
                  value={calcFechaTentativa}
                  onChange={(e) => setCalcFechaTentativa(e.target.value)}
                  placeholder="Ej: Noviembre 2026"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            {/* Cantidades de Comensales */}
            <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 block">
                Composición de Invitados:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">Adultos a la Cena</label>
                  <input
                    type="number"
                    min="1"
                    value={calcAdultosCena}
                    onChange={(e) => setCalcAdultosCena(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-sm font-black rounded-xl border border-slate-300 bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Mínimo 85 para tarifa base</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">Menores (4 a 8 años)</label>
                  <input
                    type="number"
                    min="0"
                    value={calcMenores4a8}
                    onChange={(e) => setCalcMenores4a8(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-sm font-black rounded-xl border border-slate-300 bg-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Pagan el 50% ($63.500)</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">Invitados al Brindis</label>
                  <input
                    type="number"
                    min="0"
                    value={calcInvitadosBrindis}
                    onChange={(e) => setCalcInvitadosBrindis(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-sm font-black rounded-xl border border-slate-300 bg-white"
                  />
                  <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">
                    {presupuestoCalculado.brindisObsequio > 0 ? `¡${presupuestoCalculado.brindisObsequio} de obsequio!` : 'Entrada a las 00:30 hs'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tarifa unitaria y Técnica */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Tarifa Tarjeta Mayor Cena</label>
                <select
                  value={calcPrecioTarjetaCena}
                  onChange={(e) => setCalcPrecioTarjetaCena(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold bg-white"
                >
                  <option value={127000}>$127.000 (Tarifa Vigente 2026/27)</option>
                  <option value={113000}>$113.000 (Tarifa Base Anterior)</option>
                  <option value={108000}>$108.000 (Tarifa Promocional)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Servicio de Técnica Integral</label>
                <div 
                  onClick={() => setCalcIncluirTecnica(!calcIncluirTecnica)}
                  className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    calcIncluirTecnica ? 'bg-indigo-50 border-indigo-300 text-indigo-900' : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="text-xs font-bold">
                    <span>DJ + Luces + Pantalla + Living</span>
                  </div>
                  <span className="text-xs font-black">
                    {calcIncluirTecnica ? '$1.500.000' : 'No incluido'}
                  </span>
                </div>
              </div>
            </div>

            {/* Opcional Mesa Dulce */}
            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">Opcional Mesa Dulce & Fondue</label>
              <select
                value={calcOpcionDulce}
                onChange={(e) => setCalcOpcionDulce(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold bg-white"
              >
                <option value="promo">🎉 PROMO COMBO: Mesa Dulce + Fondue ($17.500 p/p)</option>
                <option value="mesa_dulce">Mesa Dulce Artesanal Variada ($11.000 p/p)</option>
                <option value="fondue">Fondue de Chocolate con Frutas ($8.000 p/p)</option>
                <option value="ninguno">Ninguno (Solo Torta Helada Moments y Carro de Helados incluidos)</option>
              </select>
            </div>

          </div>

          {/* Panel Resumen y Botón WhatsApp */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900 to-[#2c0e17] text-white rounded-3xl p-5 shadow-xl border border-amber-900/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Resumen de Cotización
                </span>
                <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  {presupuestoCalculado.totalInvitados} Personas
                </span>
              </div>

              {/* Desglose de Números */}
              <div className="space-y-2.5 my-4 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Cena Adultos ({calcAdultosCena} x {formatARS(calcPrecioTarjetaCena)}):</span>
                  <strong className="text-white">{formatARS(presupuestoCalculado.totalAdultos)}</strong>
                </div>

                {calcMenores4a8 > 0 && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Menores 4 a 8 ({calcMenores4a8} x {formatARS(presupuestoCalculado.precioMenor)}):</span>
                    <strong className="text-white">{formatARS(presupuestoCalculado.totalMenores)}</strong>
                  </div>
                )}

                {calcInvitadosBrindis > 0 && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>
                      Brindis ({calcInvitadosBrindis} pers. {presupuestoCalculado.brindisObsequio > 0 && `· ${presupuestoCalculado.brindisObsequio} gratis`}):
                    </span>
                    <strong className="text-white">{formatARS(presupuestoCalculado.totalBrindis)}</strong>
                  </div>
                )}

                {calcIncluirTecnica && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Técnica Integral (DJ, Luces, 8 LCDs, Livings):</span>
                    <strong className="text-white">$1.500.000</strong>
                  </div>
                )}

                {calcOpcionDulce !== 'ninguno' && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Opcional Dulce ({calcOpcionDulce === 'promo' ? 'Promo Combo' : 'Opcional'}):</span>
                    <strong className="text-white">{formatARS(presupuestoCalculado.totalDulces)}</strong>
                  </div>
                )}
              </div>

              {/* Total Final */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 my-4">
                <div className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">
                  Total Presupuestado:
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-200 mt-0.5">
                  {formatARS(presupuestoCalculado.granTotal)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Agasajados (cumpleañera / novios) sin cargo.
                </div>
              </div>

              {/* Seña oficial */}
              <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-600/40 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Seña para Reserva de Fecha (10 Tarjetas):</span>
                </div>
                <div className="text-sm font-black text-white pl-5">
                  {formatARS(presupuestoCalculado.senaContado)} <span className="text-[11px] font-normal text-slate-300">al contado</span>
                </div>
                <div className="text-[11px] text-amber-200/80 pl-5">
                  o en 2 cuotas de {formatARS(presupuestoCalculado.senaDosCuotas)} (3% interés).
                </div>
              </div>
            </div>

            {/* Botón WhatsApp */}
            <button
              onClick={handleCopiarPresupuestoWhatsApp}
              className={`w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-black shadow-lg transition-all active:scale-98 ${
                copiadoId === 'presupuesto'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
              }`}
            >
              {copiadoId === 'presupuesto' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Presupuesto Copiado para WhatsApp!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Presupuesto Formal para WhatsApp</span>
                </>
              )}
            </button>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 2. CARTA GASTRONÓMICA OFICIAL DE MOMENTS */}
      {/* ============================================================== */}
      {subTab === 'menu' && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-soft border border-moments-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-600" />
                <span>Menú y Propuesta Gastronómica Oficial</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Elaboración propia en salón. Opciones para celíacos, vegetarianos y alérgicos sin costo adicional.
              </p>
            </div>
            <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-xl self-start sm:self-auto">
              Empresa Gastronómica Moments
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            
            {/* Recepción Fría */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-sm text-[#7d1728] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>🥖 Recepción Fría</span>
                </h3>
                <ul className="space-y-1.5 text-slate-700">
                  <li>• <strong>Brusquetas:</strong> Queso azul con cebolla caramelizada y bondiola · Ciboulette con hongos al oliva · Atún en lomo con alcaparras y lima.</li>
                  <li>• <strong>Pinchos:</strong> Caprese cherry y bocaccini · Salame y gruyere · Jamón crudo y mango · Panceta, melón y parmesano.</li>
                  <li>• <strong>Tostadas & Canapés:</strong> Focaccia con hummus y cherry · Pasta de berenjena · Shots de queso con ciruelas y frutillas.</li>
                  <li>• <strong>Sándwiches:</strong> Jamón y queso, verdura, pasta de aceituna.</li>
                </ul>
              </div>
            </div>

            {/* Recepción Caliente */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/70 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-sm text-[#7d1728] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <span>Recepción Caliente</span>
                </h3>
                <ul className="space-y-1.5 text-slate-700">
                  <li>• <strong>Empanadas caseras:</strong> Carne cortada a cuchillo, jamón y queso, pollo, caprese.</li>
                  <li>• <strong>Bocaditos crujientes:</strong> Chicken fried, salchicha parrillera con panceta crocante.</li>
                  <li>• <strong>Canastitas & Especialidades:</strong> Canastas de puerro, panceta y pollo · Champignon relleno · Mollejas al verdeo.</li>
                  <li>• Papas con queso cheddar fundido y panceta.</li>
                </ul>
              </div>
            </div>

            {/* Mini Estaciones Cocción a la Vista */}
            <div className="p-4 rounded-2xl bg-amber-100/60 border border-amber-300/80 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-sm text-amber-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Mini Estaciones (Cocción en Vivo)</span>
                </h3>
                <ul className="space-y-1.5 text-slate-800 font-medium">
                  <li>• <strong>Pernil de Cerdo / Cordero</strong> con panes saborizados y variedad de salsas caseras.</li>
                  <li>• <strong>Vacío al espiedo</strong> y bondiola a la llama.</li>
                  <li>• <strong>Disco de Arado:</strong> carnes mixtas salteadas.</li>
                  <li>• <strong>Tacos mexicanos:</strong> 6 variedades de rellenos (3 calientes, 3 fríos) y salsa picante.</li>
                  <li>• Pata de jamón con spianatta y cubos de queso.</li>
                  <li>• Paella de mariscos y asado de achuras.</li>
                </ul>
              </div>
            </div>

            {/* Plato de Entrada y Plato Principal */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>🍽️ Entrada y Manjar (Repetición)</span>
                </h3>
                <div className="space-y-2 text-slate-700">
                  <p>• <strong>Entrada:</strong> Jamón crudo, colchón de hojas verdes, cubos de queso, cherry confitado y focaccia con vinagreta de limón (con repetición).</p>
                  <p>• <strong>Plato Principal a elección:</strong> Medallón de carne braseada con milhojas de papas gratinadas · Suprema rellena de espinaca y gratén de provoleta con papines andinos.</p>
                  <p className="text-[11px] text-slate-500">• Opcionales: Ojo de bife al grill, Bondiola mostaza/miel, Rol de chivo al chardonnay.</p>
                </div>
              </div>
            </div>

            {/* Barra Libre & Bebidas */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/70 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-sm text-indigo-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Wine className="w-4 h-4 text-indigo-600" />
                  <span>Barra Libre & Bebidas</span>
                </h3>
                <ul className="space-y-1.5 text-slate-700">
                  <li>• <strong>Vinos finos varietales</strong> en la cena.</li>
                  <li>• Gaseosas línea Coca-Cola (Coca, Sprite) y aguas.</li>
                  <li>• <strong>Cervezas:</strong> Rubia, negra y roja + Sidra.</li>
                  <li>• <strong>Coctelería de Pista:</strong> Fernet Branca, Gin Tonic, Aperol Spritz, Campari, Mojito, Jägermeister, Cuba Libre, Daiquiri, Negroni, Vodka, Whisky.</li>
                </ul>
              </div>
            </div>

            {/* Momento Dulce & Fin de Fiesta */}
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/70 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-sm text-purple-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <PartyPopper className="w-4 h-4 text-purple-600" />
                  <span>Postre & Fin de Fiesta</span>
                </h3>
                <ul className="space-y-1.5 text-slate-700">
                  <li>• <strong>Torta Helada Moment's:</strong> Sabores americana y chocolate con frutas de estación.</li>
                  <li>• <strong>Carro de Helados artesanal</strong> con chips y salsas + servicio de café.</li>
                  <li>• <strong>Final de Fiesta:</strong> Pizza Show por metro (especial, calabresa, fugazzeta, roquefort) y pernil con panes saborizados.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. GUIONES DE VENTA PARA WHATSAPP */}
      {/* ============================================================== */}
      {subTab === 'guiones' && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-soft border border-moments-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>Guiones de Respuesta para WhatsApp</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mensajes con la información oficial de Moments listos para copiar con 1 click.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl self-start sm:self-auto">
              1-Click Copy
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {GUIONES_VENTAS.map(g => (
              <button
                key={g.id}
                onClick={() => setGuionActivoId(g.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap shrink-0 ${
                  guionActivoId === g.id
                    ? 'bg-[#7d1728] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g.tipo}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 bg-amber-50/60 p-4 rounded-2xl border border-amber-200 flex flex-col justify-between text-xs">
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-900 mb-1">
                  Argumentos de venta clave:
                </div>
                <ul className="space-y-2 text-slate-700 mt-2">
                  {guionSeleccionado.puntosClave.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-200 text-[11px] text-amber-900 italic">
                📞 Teléfono oficial: 2604-055777 (Joaquina · Pablo · Gabriela)
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed shadow-inner max-h-[300px] overflow-y-auto">
                {guionSeleccionado.textoWhatsApp}
              </div>

              <div className="mt-4 flex items-center justify-end">
                <button
                  onClick={() => handleCopiarWhatsApp(guionSeleccionado.textoWhatsApp, guionSeleccionado.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 ${
                    copiadoId === guionSeleccionado.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {copiadoId === guionSeleccionado.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>¡Copiado para WhatsApp!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Guion para WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. GALERÍA DE FOTOS REALES DEL SALÓN */}
      {/* ============================================================== */}
      {subTab === 'galeria' && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-soft border border-moments-border space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-600" />
              <span>Instalaciones y Eventos Reales de Moments</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Material fotográfico para mostrar a los clientes durante la consulta comercial.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galeriaFotos.map((foto, idx) => (
              <div
                key={idx}
                onClick={() => setFotoModal(foto)}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer bg-slate-900"
              >
                <img
                  src={foto.src}
                  alt={foto.titulo}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3.5 text-white">
                  <h3 className="font-bold text-sm tracking-tight text-amber-200 leading-snug">
                    {foto.titulo}
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
                    {foto.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. EMBUDO COMERCIAL (PIPELINE) */}
      {/* ============================================================== */}
      {subTab === 'pipeline' && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-soft border border-moments-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Seguimiento de Consultas Entrantes</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pablo y Joaquina: control de estados desde la consulta inicial hasta la seña.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-bold">
              {consultas.length} prospectos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-black uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <th className="py-3 px-3">Cliente</th>
                  <th className="py-3 px-3">Tipo</th>
                  <th className="py-3 px-3 whitespace-nowrap">Fecha</th>
                  <th className="py-3 px-3">Invitados</th>
                  <th className="py-3 px-3">Presupuesto</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3">Vendedor</th>
                  <th className="py-3 px-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {consultas.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{c.cliente}</div>
                      {c.contacto && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{c.contacto}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700 capitalize">
                      {c.tipo.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                      {c.fechaTentativa}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {c.invitadosEstimados} pers.
                    </td>
                    <td className="py-3 px-3 font-black text-slate-900">
                      {formatARS(c.presupuestoEstimado)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <select
                        value={c.estado}
                        onChange={(e) => handleCambiarEstadoConsulta(c.id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          c.estado === 'Señado / Confirmado' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          c.estado === 'Visita agendada' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          c.estado === 'Presupuesto enviado' ? 'bg-sky-100 text-sky-800 border-sky-300' :
                          'bg-indigo-100 text-indigo-800 border-indigo-300'
                        }`}
                      >
                        <option value="Nueva consulta">Nueva consulta</option>
                        <option value="Presupuesto enviado">Presupuesto enviado</option>
                        <option value="Visita agendada">Visita agendada</option>
                        <option value="Señado / Confirmado">Señado / Confirmado 🎉</option>
                        <option value="Descartado">Descartado</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {c.vendedor}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleEliminarConsulta(c.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Eliminar consulta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Zoom Foto */}
      {fotoModal && (
        <div 
          onClick={() => setFotoModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/20"
          >
            <div className="relative">
              <img src={fotoModal.src} alt={fotoModal.titulo} className="w-full max-h-[75vh] object-cover" />
              <button 
                onClick={() => setFotoModal(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-900 text-white">
              <h3 className="font-bold text-lg text-amber-200">{fotoModal.titulo}</h3>
              <p className="text-xs text-slate-300 mt-1">{fotoModal.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva Consulta */}
      {modalNuevaConsulta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-modal max-w-md w-full p-6 border border-moments-border">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                <span>Registrar Consulta de Cliente</span>
              </h3>
              <button onClick={() => setModalNuevaConsulta(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearConsulta} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nombre del Cliente / Familia *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Familia Morales (15 de Luciana)"
                  value={formCliente}
                  onChange={(e) => setFormCliente(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tipo de Evento</label>
                  <select
                    value={formTipo}
                    onChange={(e) => setFormTipo(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                  >
                    <option value="15_anos">15 Años</option>
                    <option value="casamiento">Casamiento</option>
                    <option value="egresados">Egresados</option>
                    <option value="aniversario">Aniversario</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fecha Tentativa</label>
                  <input
                    type="date"
                    value={formFecha}
                    onChange={(e) => setFormFecha(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Invitados Aprox.</label>
                  <input
                    type="number"
                    min="1"
                    value={formInvitados}
                    onChange={(e) => setFormInvitados(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">WhatsApp de Contacto</label>
                  <input
                    type="text"
                    placeholder="2604-..."
                    value={formContacto}
                    onChange={(e) => setFormContacto(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Presupuesto Est. ($)</label>
                  <input
                    type="number"
                    value={formPresupuesto}
                    onChange={(e) => setFormPresupuesto(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-black"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Vendedor</label>
                  <select
                    value={formVendedor}
                    onChange={(e) => setFormVendedor(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                  >
                    {USUARIOS.map(u => (
                      <option key={u.id} value={u.nombre}>{u.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Observaciones</label>
                <textarea
                  rows="2"
                  value={formNotas}
                  onChange={(e) => setFormNotas(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalNuevaConsulta(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
