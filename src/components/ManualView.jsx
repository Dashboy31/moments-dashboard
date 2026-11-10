import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Calendar,
  Wallet,
  CalendarDays,
  CheckSquare,
  TrendingUp,
  Sliders,
  FileSpreadsheet,
  Users,
  Shield,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  Clock,
  Printer,
  ChevronDown,
  ChevronRight,
  Layers,
  Percent,
  Calculator,
  PlusCircle,
  ExternalLink,
  Phone,
  Info
} from 'lucide-react';
import { USUARIOS } from '../utils/mockData';

export default function ManualView({
  onNavegarTab,
  cajaDesbloqueada = false,
  onOpenPinModal,
  usuarioActivo
}) {
  const [seccionActiva, setSeccionActiva] = useState('introduccion');
  const [busqueda, setBusqueda] = useState('');
  const [faqAbierto, setFaqAbierto] = useState({});

  const toggleFaq = (idx) => {
    setFaqAbierto(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Secciones del manual
  const SECCIONES = [
    {
      id: 'introduccion',
      titulo: '1. Introducción y Reglas de Oro',
      icono: Sparkles,
      color: 'bg-amber-100 text-amber-900',
      badge: 'Básico'
    },
    {
      id: 'semana',
      titulo: '2. Pestaña 1: Semana & Acciones',
      icono: Calendar,
      color: 'bg-emerald-100 text-emerald-900',
      badge: 'Equipo'
    },
    {
      id: 'carga_rapida',
      titulo: '3. Botón Flotante: Carga Rápida',
      icono: PlusCircle,
      color: 'bg-blue-100 text-blue-900',
      badge: 'Clave'
    },
    {
      id: 'caja_general',
      titulo: '4. Pestaña 2: Caja y las 4 Cuentas',
      icono: Wallet,
      color: 'bg-amber-100 text-amber-900',
      badge: 'Gerencia'
    },
    {
      id: 'resultado_mensual',
      titulo: '5. Resultado Mensual y Control de Fijos',
      icono: Calculator,
      color: 'bg-rose-100 text-rose-900',
      badge: 'Gerencia'
    },
    {
      id: 'simulador',
      titulo: '6. Simulador de Caja y Préstamo Familiar',
      icono: Percent,
      color: 'bg-purple-100 text-purple-900',
      badge: 'Gerencia'
    },
    {
      id: 'importador_excel',
      titulo: '7. Importador de Excel y Plantilla Oficial',
      icono: FileSpreadsheet,
      color: 'bg-green-100 text-green-900',
      badge: 'Transición'
    },
    {
      id: 'calendario',
      titulo: '8. Pestaña 3: Calendario y Ficha Económica',
      icono: CalendarDays,
      color: 'bg-indigo-100 text-indigo-900',
      badge: 'Eventos'
    },
    {
      id: 'checklist',
      titulo: '9. Pestaña 4: Checklist en Vivo de Salón',
      icono: CheckSquare,
      color: 'bg-teal-100 text-teal-900',
      badge: 'Operaciones'
    },
    {
      id: 'marketing',
      titulo: '10. Pestaña 5: Tarifario & Ventas',
      icono: TrendingUp,
      color: 'bg-orange-100 text-orange-900',
      badge: 'Comercial'
    },
    {
      id: 'configuracion',
      titulo: '11. Pestaña 6: Configuración Gerencial',
      icono: Sliders,
      color: 'bg-slate-100 text-slate-900',
      badge: 'PIN'
    },
    {
      id: 'proveedores',
      titulo: '12. Directorio de Proveedores',
      icono: Users,
      color: 'bg-cyan-100 text-cyan-900',
      badge: 'Compras'
    },
    {
      id: 'faq',
      titulo: '13. Preguntas Frecuentes y Respuestas',
      icono: HelpCircle,
      color: 'bg-yellow-100 text-yellow-900',
      badge: 'Ayuda'
    }
  ];

  // Filtrado por buscador
  const seccionesFiltradas = SECCIONES.filter(s =>
    s.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.id.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-['Montserrat',sans-serif] text-slate-800 pb-16">

      {/* ENCABEZADO PRINCIPAL DEL MANUAL */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/40 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#E3DCCE] pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#2F3A2A] text-[#C6A96A] flex items-center justify-center border-2 border-[#C6A96A]/40 shadow-lg shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-[#5A6B4A] uppercase tracking-widest">
                  Centro de Capacitación Oficial
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                  VERSIÓN 2.0
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Playfair_Display']">
                Manual de Uso del Panel · Moment's
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Guía completa para la gerencia (Jesica y Leandro) y el equipo de operaciones. Cómo usar cada pestaña, registrar gastos, simular caja y coordinar eventos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition border border-slate-300 cursor-pointer shadow-sm"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Imprimir Guía</span>
            </button>
          </div>
        </div>

        {/* BUSCADOR RÁPIDO */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar tema, pestaña o duda (ej: 'cargar gasto', 'seña', 'préstamo', 'proveedor', 'fijos')..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F6F3E9]/80 border border-[#C6A96A]/40 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A6B4A]"
          />
        </div>

        {/* NAVEGACIÓN RÁPIDA POR PÍLDORAS */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-4 pb-1">
          {seccionesFiltradas.map((s) => {
            const Icon = s.icono;
            const esActiva = seccionActiva === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSeccionActiva(s.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  esActiva
                    ? 'bg-[#2F3A2A] text-[#F6F3E9] shadow-md border border-[#C6A96A]'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${esActiva ? 'text-[#C6A96A]' : 'text-slate-500'}`} />
                <span>{s.titulo.split(':')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL SEGÚN LA SECCIÓN SELECCIONADA */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ÍNDICE LATERAL (STICKY) */}
        <div className="hidden lg:block lg:col-span-1 space-y-1 bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/30 p-4 shadow-sm h-fit sticky top-20">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-3 mb-2">
            Índice de Contenidos
          </span>
          {SECCIONES.map((s) => {
            const Icon = s.icono;
            const esActiva = seccionActiva === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSeccionActiva(s.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition cursor-pointer ${
                  esActiva
                    ? 'bg-[#2F3A2A] text-[#F6F3E9] shadow-sm'
                    : 'text-slate-700 hover:bg-[#F6F3E9] hover:text-[#2F3A2A]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${esActiva ? 'text-[#C6A96A]' : 'text-slate-400'}`} />
                  <span className="truncate">{s.titulo}</span>
                </div>
                {esActiva && <ChevronRight className="w-3.5 h-3.5 text-[#C6A96A]" />}
              </button>
            );
          })}
        </div>

        {/* CUERPO DE LA GUÍA */}
        <div className="lg:col-span-3 space-y-6">

          {/* ===================================================================
              1. INTRODUCCIÓN Y REGLAS DE ORO
             =================================================================== */}
          {(seccionActiva === 'introduccion' || busqueda) && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/30 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E3DCCE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                    <Sparkles className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-['Playfair_Display']">
                      1. Introducción y el Porqué del Sistema
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      El objetivo central de Moment's: independizar el salón de archivos dispersos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <p>
                  Hasta ahora, la gerenta (Jesica) manejaba la operación del salón mediante unos <strong>15 archivos Excel independientes</strong> (caja diaria, presupuestos, señas, listas de mozos, compras de carnicería, fijos e imprevistos). Este sistema fue diseñado para reemplazar esas planillas y permitir que el salón funcione de forma ordenada, con trazabilidad y sin depender de que una sola persona esté presente para autorizar o buscar un dato.
                </p>

                {/* LAS DOS REGLAS DE ORO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                        A
                      </span>
                      <h3 className="font-bold text-emerald-950 text-xs uppercase tracking-wide">
                        Cargar es más rápido que en Excel
                      </h3>
                    </div>
                    <p className="text-[11px] text-emerald-900 leading-normal">
                      Todo el personal puede anotar un gasto en 5 segundos desde el teléfono con el botón flotante <strong>+ Gasto / Ingreso</strong>, sin pedir contraseñas ni esperar a llegar a una PC de oficina.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-xs">
                        B
                      </span>
                      <h3 className="font-bold text-amber-950 text-xs uppercase tracking-wide">
                        El sistema nunca se rompe
                      </h3>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-normal">
                      No hay fórmulas rotas por filas insertadas ni celdas en blanco que generen <code className="bg-amber-200/60 px-1 rounded">#¡REF!</code>. Si falta un dato o un gasto real, el sistema utiliza valores de referencia estimados y lo señaliza con transparencia.
                    </p>
                  </div>
                </div>

                {/* ROLES Y ACCESOS */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#5A6B4A]" />
                    <span>Niveles de Acceso y Privacidad Económica</span>
                  </h4>
                  <ul className="space-y-1.5 text-[11px] text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-800 shrink-0">• Todo el Equipo:</span>
                      <span>Acceden a las semanas operativas, reuniones, checklist de logística en vivo durante la fiesta y botón de carga rápida de gastos. No ven ingresos globales ni márgenes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-800 shrink-0">• Gerencia (Jesica y Leandro con PIN):</span>
                      <span>Acceso exclusivo a Caja, Estado de Resultado Mensual, Fichas Económicas de cada evento, Simulador de Cobertura y Configuración del salón.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              2. PESTAÑA 1: SEMANA & ACCIONES
             =================================================================== */}
          {(seccionActiva === 'semana' || busqueda) && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/30 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E3DCCE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                    <Calendar className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-['Playfair_Display']">
                      2. Pestaña 1: Semana & Acciones
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      La pantalla principal que todo el equipo ve al ingresar al sistema.
                    </p>
                  </div>
                </div>
                {onNavegarTab && (
                  <button
                    onClick={() => onNavegarTab('semana')}
                    className="px-3 py-1.5 bg-[#2F3A2A] hover:bg-[#384532] text-[#F6F3E9] text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Ir a Semana</span>
                    <ArrowRight className="w-3 h-3 text-[#C6A96A]" />
                  </button>
                )}
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <p>
                  Esta pestaña resuelve el problema diario de <em>"¿cuándo es la reunión?", "¿quién paga el hielo?" o "¿quién confirmó que venía?"</em>.
                </p>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="font-bold text-slate-900 text-xs mb-1">
                      🤝 Reuniones de Coordinación y Confirmaciones
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Cualquiera puede crear una reunión (ej: <em>"Lunes 10:00 hs con Paulina y Álvaro para coordinar el cumple de 15"</em>). Cada persona convocada ingresa al dashboard con su usuario, ve la reunión en su lista y pulsa <strong>"Confirmar asistencia"</strong>. Queda registrado el día y la hora exacta en que confirmó.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="font-bold text-slate-900 text-xs mb-1">
                      💵 Pagos a Proveedores de la Semana
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Permite agendar los pagos programados para el fin de semana (mozos, sonido, hielo, vajilla). Cuando el responsable realiza el pago, tilda la casilla <strong>"Pagado"</strong> y el sistema <strong>impacta automáticamente el egreso en la caja de efectivo</strong> con autoría del usuario logueado.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="font-bold text-slate-900 text-xs mb-1">
                      🚨 Panel de Pendientes y Atención Inmediata
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Ubicado en la parte superior:
                    </p>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-[11px] text-slate-600">
                      <li><strong>Para Gerencia:</strong> Avisa si hay eventos pasados sin costos registrados, eventos a 30 días sin seña, fijos del mes por vencer, eventos pendientes de definir cantidad de personas, y si el simulador pide solicitar un nuevo tramo del préstamo familiar.</li>
                      <li><strong>Para el Equipo:</strong> Muestra solo sus reuniones sin confirmar y las tareas operativas a su cargo, sin revelar montos.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              3. BOTÓN FLOTANTE: CARGA RÁPIDA (+ GASTO / INGRESO)
             =================================================================== */}
          {(seccionActiva === 'carga_rapida' || busqueda) && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/30 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E3DCCE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black">
                    <PlusCircle className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-['Playfair_Display']">
                      3. Botón Flotante: Carga Rápida (+ Gasto / Ingreso)
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      El instrumento principal para que todo el equipo anote gastos al instante.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <h4 className="font-bold text-blue-950 text-xs mb-1">
                    ¿Dónde está y quién lo puede usar?
                  </h4>
                  <p className="text-[11px] text-blue-900">
                    Está siempre visible en la <strong>esquina inferior derecha</strong> de todas las pantallas con el texto <strong>+ Gasto / Ingreso</strong>. Lo puede usar cualquier miembro del equipo (Paulina, Gabriela, Pablo, etc.) desde su celular o la computadora sin necesidad de pedir el PIN de gerencia.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">Paso a paso para cargar un comprobante:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-[11px] text-slate-700">
                    <li>Hacer clic en el botón flotante <strong>+ Gasto / Ingreso</strong>.</li>
                    <li>
                      Seleccionar si es <strong>Gasto (Egreso)</strong> o <strong>Ingreso / Cobro</strong>:
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-slate-600">
                        <li>
                          <strong>Para Gasto:</strong> La <em>Categoría</em> es el rubro operativo (Insumos, Personal, Fijos) y la <em>Subcategoría</em> es el ítem puntual (Carnes, Mozos, Luz). Se indica el <em>Proveedor</em> a quien se le pagó.
                        </li>
                        <li>
                          <strong>Para Ingreso:</strong> La <em>Categoría</em> es el tipo de evento o procedencia (Cumpleaños de 15, Casamiento, Egresados, Préstamos) y la <em>Subcategoría</em> es el modo o concepto del cobro (Seña, Cuota, Saldo final, Transferencia, Efectivo). Se eliminan divisiones de gastos y proveedores que no aplican a un cobro.
                        </li>
                      </ul>
                    </li>
                    <li>Escribir el <strong>Concepto</strong> (ej: <em>"Seña 15 de Camila"</em> o <em>"Compra 20 kg de vacío"</em>).</li>
                    <li>Ingresar el <strong>Monto</strong> en pesos y seleccionar la <strong>Cuenta / Caja</strong> (Efectivo, Mercado Pago, Banco Nación o Naranja).</li>
                    <li><em>Opcional:</em> Vincular al <strong>Evento</strong> correspondiente en el desplegable.</li>
                    <li>Pulsar <strong>"Guardar en Caja"</strong>. El sistema confirma la carga y deja el modal listo para anotar otro comprobante.</li>
                  </ol>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>El sistema guarda automáticamente el usuario que lo cargó junto con la fecha y hora exacta (ej: <em>"Paulina · 2026-11-10 14:30"</em>).</span>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              4. PESTAÑA 2: CAJA Y LAS 4 CUENTAS
             =================================================================== */}
          {(seccionActiva === 'caja_general' || busqueda) && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/30 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E3DCCE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                    <Wallet className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-['Playfair_Display']">
                      4. Pestaña 2: Caja y Cuentas (Solo Gerencia)
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Control exhaustivo de dinero por cuenta bancaria y efectivo, traspasos y categorías.
                    </p>
                  </div>
                </div>
                {onNavegarTab && (
                  <button
                    onClick={() => {
                      if (!cajaDesbloqueada && onOpenPinModal) onOpenPinModal();
                      else onNavegarTab('caja');
                    }}
                    className="px-3 py-1.5 bg-[#2F3A2A] hover:bg-[#384532] text-[#F6F3E9] text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Abrir Caja</span>
                    <ArrowRight className="w-3 h-3 text-[#C6A96A]" />
                  </button>
                )}
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <p>
                  A pedido expreso de Jesica, la caja está organizada de manera que cada cuenta tiene su propia pestaña independiente, además de un consolidado general.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                    <span className="font-bold text-orange-950 block">🍊 Naranja</span>
                    <span className="text-[10px] text-orange-800">Caja virtual y transferencias</span>
                  </div>
                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
                    <span className="font-bold text-sky-950 block">🏛️ Banco Nación</span>
                    <span className="text-[10px] text-sky-800">Cuenta operativa del salón</span>
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200">
                    <span className="font-bold text-cyan-950 block">⚡ Mercado Pago</span>
                    <span className="text-[10px] text-cyan-800">Cobros por QR y señas</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="font-bold text-emerald-950 block">💵 Efectivo</span>
                    <span className="text-[10px] text-emerald-800">Caja física en administración</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-slate-900 text-xs">Operaciones Principales de Caja:</h4>
                  <ul className="space-y-2 text-[11px] text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#5A6B4A]">• Traspaso entre Cajas:</span>
                      <span>Permite mover fondos (ej: transferir \$ 200.000 de Mercado Pago a Banco Nación o retirar efectivo para compras). El sistema genera el egreso en origen y el ingreso en destino sin inflar los totales de ventas o gastos reales del salón.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#5A6B4A]">• Filtro Dinámico por Mes:</span>
                      <span>Inicia automáticamente en el mes en curso y permite seleccionar cualquier mes del año para auditar movimientos históricos o futuros.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#5A6B4A]">• Exportar a Excel:</span>
                      <span>Genera un archivo compatible con Excel con todas las columnas limpias y sumatorias listas para imprimir o enviar al contador.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              5. RESULTADO MENSUAL Y CONTROL DE FIJOS
             =================================================================== */}
          {(seccionActiva === 'resultado_mensual' || busqueda) && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/30 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E3DCCE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-black">
                    <Calculator className="w-5 h-5 text-rose-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-['Playfair_Display']">
                      5. Subpestañas: Resultado Mensual y Control de Fijos
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      El Estado de Resultados real de Moment's para saber si el mes ganó o perdió dinero.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs mb-2">
                    Estructura del Resultado Mensual (Económico vs. Financiero)
                  </h4>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="text-emerald-700 font-bold">+ Ingresos Operativos del Mes (Tarjetas y servicios)</div>
                    <div className="text-rose-700 font-bold">- Costos Variables (Carnes, Bebida, Mozos, Cocina, Limpieza)</div>
                    <div className="border-t border-slate-300 pt-1 text-slate-900 font-bold">= Margen de Contribución</div>
                    <div className="text-amber-700 font-bold">- Costos Fijos (Alquiler, Luz, Gas, Agua, Seguro, Contador, Sistemas)</div>
                    <div className="border-t border-slate-300 pt-1 text-slate-900 font-black">= RESULTADO OPERATIVO NETO</div>
                    <div className="text-indigo-700 mt-1">- Retiros Personales de Jesica / Leandro (No ensucian el costo del salón)</div>
                    <div className="text-purple-700">± Movimientos de Financiamiento (Tramos y amortizaciones de préstamos)</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <h4 className="font-bold text-emerald-950 text-xs mb-1">
                    🎯 Punto de Equilibrio Automático
                  </h4>
                  <p className="text-[11px] text-emerald-900">
                    El sistema calcula en tiempo real cuántos eventos al mes necesita realizar Moment's para que los costos fijos (\$ 5.000.000) queden completamente cubiertos. Si el margen unitario promedio es de \$ 3.000.000, el punto de equilibrio indica que a partir del 2º evento del mes el salón entra en zona de ganancia neta.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <h4 className="font-bold text-amber-950 text-xs mb-1">
                    📅 Control de Fijos con Responsables
                  </h4>
                  <p className="text-[11px] text-amber-900">
                    En la subpestaña <strong>Control de Fijos</strong> se observa la lista de servicios recurrentes con su fecha de vencimiento y el responsable asignado:
                  </p>
                  <ul className="list-disc list-inside mt-1.5 space-y-1 text-[11px] text-amber-950">
                    <li>Alquiler (día 10 · Gabriela)</li>
                    <li>Luz Edemsa (día 15 · Paulina)</li>
                    <li>Gas Natural / Envasado (día 18 · Paulina)</li>
                    <li>Tasas Municipales y Agua (día 20 · Pablo)</li>
                    <li>Internet y Seguros (Gabriela)</li>
                    <li>Monotributo y Contador (Jesica)</li>
                    <li>Software y Sistemas (Joaquina)</li>
                  </ul>
                  <p className="text-[11px] text-amber-900 mt-2">
                    Si llega el día de vencimiento y no se registró el pago en la caja, la fila cambia a color rojo <strong>"Vencido ⚠️"</strong> y aparece en el panel de pendientes de la gerencia.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              6. SIMULADOR DE CAJA Y PRÉSTAMO FAMILIAR
             =================================================================== */}
          {(seccionActiva === 'simulador' || busqueda) && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/30 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E3DCCE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-black">
                    <Percent className="w-5 h-5 text-purple-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-['Playfair_Display']">
                      6. Pestaña 3: Simulador de Cobertura y Préstamo Familiar (Privado)
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Planificación preventiva para no quedarse sin fondos operativos ante múltiples eventos.
                    </p>
                  </div>
                </div>
                {onNavegarTab && (
                  <button
                    onClick={() => {
                      if (!cajaDesbloqueada && onOpenPinModal) onOpenPinModal();
                      else onNavegarTab('simulador');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2F3A2A] hover:bg-[#3D4C37] text-[#F6F3E9] text-xs font-bold rounded-xl border border-[#C6A96A] cursor-pointer"
                  >
                    <span>Abrir Simulador</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <p>
                  Ubicado en la pestaña privada <strong>"3. Simulador"</strong> (con acceso restringido por clave 1616), este panel le responde a Leandro y a la Gerencia en un segundo: <strong>¿Cuántos eventos futuros podemos pagar con la plata que tenemos hoy en el banco y en la mano?</strong>
                </p>

                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C6A96A]">
                    Fórmulas Clave del Simulador
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1">
                    <div className="p-2.5 rounded-xl bg-white/10">
                      <span className="text-rose-300 font-bold block mb-0.5">Costo Total de Eventos (Rojo):</span>
                      <span>Cantidad de eventos futuros × Costo promedio (\$ 10.000.000).</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10">
                      <span className="text-emerald-300 font-bold block mb-0.5">Fondos Disponibles (Verde):</span>
                      <span>Suma de las 4 cajas operativas + Reserva para imprevistos.</span>
                    </div>
                  </div>
                  <div className="pt-2 text-[11px] text-slate-300">
                    <strong>Eventos Cubiertos:</strong> Fondos Disponibles / \$ 10.000.000.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <h4 className="font-bold text-amber-950 text-xs">
                      ¿Cuándo se activa la alerta "Pedir próximo tramo"?
                    </h4>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-normal">
                    La alerta parpadeante salta cuando los <strong>eventos cubiertos son menores o iguales al Colchón de Seguridad (1 evento)</strong>. En ese momento, el sistema indica solicitar un nuevo tramo del préstamo familiar (sugerido: \$ 20.000.000) para no cortar la cadena de compras de mercadería ni demorar el pago a cocineros y mozos.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-xs">Registro de Tramos y Devoluciones:</h4>
                  <p className="text-[11px] text-slate-600">
                    Al recibir un tramo, se pulsa el botón <strong>"+ Registrar Tramo Recibido"</strong>. El sistema automáticamente suma los \$ 20.000.000 a la caja seleccionada y actualiza el saldo de deuda con el prestamista. Cuando el salón amortiza o devuelve capital, se registra como devolución y descuenta el saldo pendiente sin afectar las ganancias operativas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              7. IMPORTADOR DE EXCEL Y PLANTILLA OFICIAL
             =================================================================== */}
          {(seccionActiva === 'importador_excel' || busqueda) && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/30 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E3DCCE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-800 flex items-center justify-center font-black">
                    <FileSpreadsheet className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-['Playfair_Display']">
                      7. Importador de Excel y Plantilla Oficial
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Cómo traer los datos de los Excel viejos al dashboard sin duplicar información.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <p>
                  Para facilitar la transición desde las 15 planillas de Jesica, el sistema incluye un generador de plantilla oficial y un importador con doble validación.
                </p>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">Las 11 Columnas Oficiales:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[10px]">
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">1. Fecha (YYYY-MM-DD)</div>
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">2. Tipo (Egreso / Ingreso)</div>
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">3. Categoría</div>
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">4. Subcategoría</div>
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">5. Concepto</div>
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">6. Monto</div>
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">7. Caja (Efectivo/Banco...)</div>
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">8. Fecha del Evento</div>
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">9. Origen (Seña/Saldo)</div>
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">10. Proveedor</div>
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">11. Notas</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">Paso a paso para importar:</h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-600">
                    <li>Entrar a <strong>Caja → Subpestaña "Importar Excel"</strong>.</li>
                    <li>Hacer clic en <strong>"Descargar Plantilla Oficial Excel (.xlsx)"</strong> si se quiere cargar ordenadamente desde cero.</li>
                    <li>Arrastrar o seleccionar el archivo Excel terminado.</li>
                    <li>El sistema previsualiza los renglones:
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5">
                        <li>Fila en <span className="text-emerald-700 font-bold">Verde</span>: Lista y válida para importar.</li>
                        <li>Fila en <span className="text-amber-700 font-bold">Amarillo</span>: Posible duplicado (mismo día, monto y concepto ya existente). El sistema la desmarca por precaución.</li>
                        <li>Fila en <span className="text-rose-700 font-bold">Rojo</span>: Monto o fecha inválida.</li>
                      </ul>
                    </li>
                    <li>Revisar y pulsar <strong>"Confirmar e Importar a Caja"</strong>.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              8. CALENDARIO Y FICHA ECONÓMICA DE EVENTOS
             =================================================================== */}
          {(seccionActiva === 'calendario' || busqueda) && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/30 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E3DCCE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black">
                    <CalendarDays className="w-5 h-5 text-indigo-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-['Playfair_Display']">
                      8. Pestaña 3: Calendario de Eventos & Fichas Económicas
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Agenda comercial, tipos de fiestas y análisis de rentabilidad evento por evento.
                    </p>
                  </div>
                </div>
                {onNavegarTab && (
                  <button
                    onClick={() => onNavegarTab('calendario')}
                    className="px-3 py-1.5 bg-[#2F3A2A] hover:bg-[#384532] text-[#F6F3E9] text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Ir a Calendario</span>
                    <ArrowRight className="w-3 h-3 text-[#C6A96A]" />
                  </button>
                )}
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">Tipos de Eventos Admitidos:</h4>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span className="px-2.5 py-1 rounded-lg bg-pink-100 text-pink-900 font-bold">Cumple de 15</span>
                    <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-900 font-bold">Casamiento</span>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 font-bold">Egresados</span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold">Cumple de décadas / Aniversario</span>
                    <span className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-900 font-bold">Tardeo</span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold">Préstamo del salón</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 font-bold">Mantenimiento</span>
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-100 text-cyan-950 font-bold">A definir</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-[#C6A96A]/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#C6A96A]" />
                    <h4 className="font-bold text-slate-900 text-xs font-['Playfair_Display']">
                      La Ficha Económica de Cada Evento (Solo con PIN)
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Al hacer clic en cualquier evento con la caja desbloqueada, se abre su expediente económico:
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-700 list-disc list-inside">
                    <li><strong>Ingreso Pactado:</strong> Calculado automáticamente (adultos × \$ 127.000) o editable manualmente.</li>
                    <li><strong>Seña y Saldo:</strong> Suma automática de todos los ingresos de caja vinculados a ese evento.</li>
                    <li><strong>Costo de Referencia:</strong> Si tiene hasta 85 personas, aplica el mayor entre el mínimo (\$ 4.000.000) y la tarifa base por persona. Si tiene más de 85, multiplica directamente por el costo por persona.</li>
                    <li><strong>Costo Real:</strong> Sumatoria en vivo de todos los gastos cargados que tengan vinculado ese evento.</li>
                    <li><strong>Margen y Semáforo:</strong> Verde si el margen supera el 20%, Amarillo entre 0% y 20%, y Rojo si arroja pérdida.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              9. CHECKLIST EN VIVO DE LOGÍSTICA
             =================================================================== */}
          {(seccionActiva === 'checklist' || busqueda) && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/30 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E3DCCE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-black">
                    <CheckSquare className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-['Playfair_Display']">
                      9. Pestaña 4: Checklist de Logística en Vivo
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      La herramienta de campo para Leandro y el equipo durante el día de la fiesta.
                    </p>
                  </div>
                </div>
                {onNavegarTab && (
                  <button
                    onClick={() => onNavegarTab('checklist')}
                    className="px-3 py-1.5 bg-[#2F3A2A] hover:bg-[#384532] text-[#F6F3E9] text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Ir a Checklist</span>
                    <ArrowRight className="w-3 h-3 text-[#C6A96A]" />
                  </button>
                )}
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <p>
                  Diseñado para usarse desde el teléfono celular o la tablet en el salón. Contempla las fases de preparación previa, puesta a punto, durante el evento y cierre.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">⏱️ Registro con Hora y Autor</span>
                    <span className="text-slate-600">Al tildar una tarea (ej: <em>"Chequeo de sonido y micrófonos"</em>), se graba la hora exacta y el nombre del operador que lo completó.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">📋 Banner en Vivo</span>
                    <span className="text-slate-600">Muestra el progreso porcentual del evento del día y las tareas críticas que aún restan completar antes de abrir las puertas a los invitados.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              10. TARIFARIO & VENTAS
             =================================================================== */}
          {(seccionActiva === 'marketing' || busqueda) && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/30 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E3DCCE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center font-black">
                    <TrendingUp className="w-5 h-5 text-orange-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-['Playfair_Display']">
                      10. Pestaña 5: Tarifario & Ventas
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Cotizador oficial para responder consultas comerciales y presupuestar en segundos.
                    </p>
                  </div>
                </div>
                {onNavegarTab && (
                  <button
                    onClick={() => onNavegarTab('marketing')}
                    className="px-3 py-1.5 bg-[#2F3A2A] hover:bg-[#384532] text-[#F6F3E9] text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Ir a Ventas</span>
                    <ArrowRight className="w-3 h-3 text-[#C6A96A]" />
                  </button>
                )}
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <p>
                  Utiliza la tarifa vigente unificada de <strong>\$ 127.000 por adulto</strong> (sincronizada con el panel de Configuración) y permite simular presupuestos completos según la cantidad de invitados, adicionales de pista, traslados o menú especial.
                </p>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  Ideal para cuando entra una consulta por WhatsApp o Instagram: en 10 segundos se ingresa el número de personas y el sistema arroja el total estimado, el monto sugerido de seña y el plan de cuotas.
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              11. CONFIGURACIÓN GERENCIAL
             =================================================================== */}
          {(seccionActiva === 'configuracion' || busqueda) && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/30 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E3DCCE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-black">
                    <Sliders className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-['Playfair_Display']">
                      11. Pestaña 6: Configuración Gerencial (Solo con PIN)
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Todos los valores económicos del salón se ajustan desde acá sin tocar código.
                    </p>
                  </div>
                </div>
                {onNavegarTab && (
                  <button
                    onClick={() => {
                      if (!cajaDesbloqueada && onOpenPinModal) onOpenPinModal();
                      else onNavegarTab('configuracion');
                    }}
                    className="px-3 py-1.5 bg-[#2F3A2A] hover:bg-[#384532] text-[#F6F3E9] text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Ir a Configuración</span>
                    <ArrowRight className="w-3 h-3 text-[#C6A96A]" />
                  </button>
                )}
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <p>
                  Cualquier aumento de precios por inflación o renegociación de tarifas se actualiza directamente desde esta pantalla:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-0.5">Evento Mínimo de Salón:</span>
                    <span>Hoy en <strong>\$ 4.000.000</strong>. Costo indispensable para encender equipos y abrir puertas.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-0.5">Evento Base:</span>
                    <span><strong>85 personas</strong> con costo de <strong>\$ 7.000.000</strong> (costo unitario de \$ 82.353).</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-0.5">Costo Promedio de Planificación:</span>
                    <span><strong>\$ 10.000.000</strong> por evento (utilizado para el Simulador de Cobertura).</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-0.5">Tarifa Adulto Vigente:</span>
                    <span><strong>\$ 127.000</strong> por tarjeta de adulto.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  También se configura acá el <strong>Tamaño del tramo del préstamo familiar (\$ 20.000.000)</strong>, el <strong>Colchón de seguridad (1 evento)</strong>, los umbrales del semáforo y la <strong>Plantilla de costos fijos</strong> con sus días de vencimiento y responsables.
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              12. DIRECTORIO DE PROVEEDORES
             =================================================================== */}
          {(seccionActiva === 'proveedores' || busqueda) && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/30 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E3DCCE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-black">
                    <Users className="w-5 h-5 text-cyan-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-['Playfair_Display']">
                      12. Subpestaña: Directorio de Proveedores
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Historial de compras, teléfonos de contacto y promedios por servicio.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <p>
                  Cada vez que alguien carga un gasto con el nombre de un comercio o profesional (ej: <em>Frigorífico San Rafael, Hielo Los Andes, DJ Rodrigo</em>), el sistema lo agrega automáticamente al directorio consolidado.
                </p>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-900 block">Beneficios de la libreta centralizada:</span>
                  <p>• Permite guardar el teléfono de contacto y el CBU / Alias bancario para transferencias rápidas.</p>
                  <p>• Muestra el monto total acumulado que se le pagó en el año y el costo promedio por evento.</p>
                  <p>• Alimenta el autocompletado del botón de Carga Rápida para no tener que escribir el nombre completo cada vez.</p>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              13. PREGUNTAS FRECUENTES (FAQ)
             =================================================================== */}
          {(seccionActiva === 'faq' || busqueda) && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C6A96A]/30 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E3DCCE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-yellow-100 text-yellow-800 flex items-center justify-center font-black">
                    <HelpCircle className="w-5 h-5 text-yellow-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-['Playfair_Display']">
                      13. Preguntas Frecuentes (FAQ)
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Respuestas rápidas a las situaciones más comunes del día a día.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: '¿Cómo cargo una seña cobrada a un cliente?',
                    a: 'Usá el botón "+ Gasto / Ingreso" o hacelo desde la pestaña Caja. Seleccioná Tipo: "Ingreso", Origen: "Seña", elegí la Caja donde entró la plata (ej: Mercado Pago o Efectivo), y vinculá el Evento correspondiente en el desplegable. Al guardarlo, impactará automáticamente en la ficha económica del evento.'
                  },
                  {
                    q: '¿Qué hago si me equivoqué en el monto o concepto de un gasto?',
                    a: 'Si tenés la caja desbloqueada con PIN, buscá el movimiento en la lista de Caja y hacé clic en el botón de edición (ícono de lápiz). Podés corregir cualquier campo o eliminarlo si fue un duplicado.'
                  },
                  {
                    q: '¿Cómo anoto un retiro personal de Jesica o Leandro sin que arruine los costos del salón?',
                    a: 'Al cargar el egreso, elegí la Categoría "Retiros personales" y la subcategoría "Retiro Jesica" o "Retiro Leandro". El sistema lo registrará en la caja real pero lo mantendrá aislado del costo de los eventos y del margen del salón.'
                  },
                  {
                    q: '¿Por qué un evento aparece en amarillo en el calendario con la nota "A definir"?',
                    a: 'Son fechas que fueron precargadas desde la planilla de gerencia de Noviembre y Diciembre 2026. Para completarlas, hacé clic en el evento, seleccioná "Editar", elegí si es 15 años, casamiento o egresados, y colocá la cantidad de invitados estimada.'
                  },
                  {
                    q: '¿Qué significa el cartel "Pedir próximo tramo al prestamista"?',
                    a: 'Significa que los fondos disponibles en las cajas operativas cubren solo 1 evento futuro (o menos). Para no tener tensiones de liquidez el fin de semana, se recomienda solicitar el siguiente desembolso del préstamo familiar ($ 20.000.000).'
                  },
                  {
                    q: '¿El sistema se guarda automáticamente o tengo que hacer algo?',
                    a: 'Se guarda todo en tiempo real en el servidor. Además, el sistema hace copias de seguridad automáticas diarias y cada 4 segundos sondea cambios para sincronizar todas las computadoras del salón.'
                  }
                ].map((item, idx) => {
                  const estaAbierto = Boolean(faqAbierto[idx]);
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-4 text-left font-bold text-xs flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer"
                      >
                        <span className="text-slate-900">{item.q}</span>
                        <ChevronDown className={`w-4 h-4 text-[#5A6B4A] transition-transform ${estaAbierto ? 'rotate-180' : ''}`} />
                      </button>
                      {estaAbierto && (
                        <div className="p-4 bg-white text-[11px] text-slate-700 leading-relaxed border-t border-slate-100">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
