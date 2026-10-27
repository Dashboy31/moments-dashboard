// Datos semilla iniciales para Moments - Salón de Eventos (San Rafael, Mendoza)

export const USUARIOS = [
  { id: 'alvaro', nombre: 'Álvaro', rol: 'Estratega Integrador', badge: 'Estrategia', color: 'bg-purple-100 text-purple-900 border-purple-300', avatar_color: '#7c3aed', password: '123' },
  { id: 'jesica', nombre: 'Jesica', rol: 'Gerencia General', badge: 'Gerencia', color: 'bg-amber-100 text-amber-900 border-amber-300', avatar_color: '#d97706', password: '123' },
  { id: 'leandro', nombre: 'Leandro', rol: 'Dueño', badge: 'Dueño', color: 'bg-indigo-100 text-indigo-900 border-indigo-300', avatar_color: '#3b82f6', password: '123' },
  { id: 'gabriela', nombre: 'Gabriela', rol: 'Administración', badge: 'Administración', color: 'bg-sky-100 text-sky-900 border-sky-300', avatar_color: '#0284c7', password: '123' },
  { id: 'pablo', nombre: 'Pablo', rol: 'Ventas y Mantenimiento', badge: 'Ventas / Mant.', color: 'bg-emerald-100 text-emerald-900 border-emerald-300', avatar_color: '#059669', password: '123' },
  { id: 'joaquina', nombre: 'Joaquina', rol: 'Ventas', badge: 'Ventas', color: 'bg-rose-100 text-rose-900 border-rose-300', avatar_color: '#e11d48', password: '123' },
  { id: 'paulina', nombre: 'Paulina', rol: 'Logística de Eventos', badge: 'Logística', color: 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300', avatar_color: '#a21caf', password: '123' }
];

export const CATEGORIAS_CAJA = {
  Variables: [
    'Proveedores de evento',
    'Personal eventual (Mozos/Barra/Seguridad)',
    'Mantenimiento de evento',
    'Música / DJ / Sonido',
    'Carnes y Alimentos',
    'Bebidas y Alcohol',
    'Marketing y Publicidad'
  ],
  Fijos: [
    'Impuestos y Servicios (Luz/Gas/Tasas)',
    'Seguridad permanente',
    'Administración',
    'Contador',
    'Jardinero mensual'
  ],
  'Retiros personales': [
    'Retiro Leandro',
    'Retiro Jesica',
    'Retiro Iris'
  ],
  'Otros / No recurrente': [
    'Mejoras edilicias / Inversión',
    'Reparaciones e imprevistos',
    'Varios'
  ]
};

export const MOVIMIENTOS_SEED = [
  {
    id: 'mov-1',
    fecha: '2026-10-15',
    concepto: 'Cobro cuota 3 - 15 de Martina Giménez',
    tipo: 'ingreso',
    categoria: 'Variables',
    subcategoria: 'Proveedores de evento',
    monto: 1450000,
    metodoPago: 'Transferencia',
    cargo: 'Gabriela',
    notas: 'Saldo acordado con la mamá'
  },
  {
    id: 'mov-2',
    fecha: '2026-10-14',
    concepto: 'Seña reserva Boda Valentina & Tomás (Marzo 2027)',
    tipo: 'ingreso',
    categoria: 'Variables',
    subcategoria: 'Proveedores de evento',
    monto: 2200000,
    metodoPago: 'Efectivo',
    cargo: 'Joaquina',
    notas: 'Reserva de fecha en parque + salón'
  },
  {
    id: 'mov-3',
    fecha: '2026-10-13',
    concepto: 'Pago mozos y personal de servicio evento del sábado',
    tipo: 'egreso',
    categoria: 'Variables',
    subcategoria: 'Personal eventual (Mozos/Barra/Seguridad)',
    monto: 480000,
    metodoPago: 'Efectivo',
    cargo: 'Jesica',
    notas: '8 mozos + 2 de barra + 2 seguridad'
  },
  {
    id: 'mov-4',
    fecha: '2026-10-12',
    concepto: 'DJ e iluminación robotizada - Anticipo evento',
    tipo: 'egreso',
    categoria: 'Variables',
    subcategoria: 'Música / DJ / Sonido',
    monto: 320000,
    metodoPago: 'Transferencia',
    cargo: 'Pablo',
    notas: 'Servicio DJ Cuyo Pro'
  },
  {
    id: 'mov-5',
    fecha: '2026-10-10',
    concepto: 'Retiro mensual Leandro',
    tipo: 'egreso',
    categoria: 'Retiros personales',
    subcategoria: 'Retiro Leandro',
    monto: 850000,
    metodoPago: 'Transferencia',
    cargo: 'Jesica',
    notas: 'Retiro de utilidades período Octubre'
  },
  {
    id: 'mov-6',
    fecha: '2026-10-10',
    concepto: 'Retiro mensual Jesica',
    tipo: 'egreso',
    categoria: 'Retiros personales',
    subcategoria: 'Retiro Jesica',
    monto: 850000,
    metodoPago: 'Transferencia',
    cargo: 'Jesica',
    notas: 'Retiro de utilidades período Octubre'
  },
  {
    id: 'mov-7',
    fecha: '2026-10-09',
    concepto: 'Retiro Iris',
    tipo: 'egreso',
    categoria: 'Retiros personales',
    subcategoria: 'Retiro Iris',
    monto: 450000,
    metodoPago: 'Efectivo',
    cargo: 'Jesica',
    notas: 'Retiro familiar'
  },
  {
    id: 'mov-8',
    fecha: '2026-10-08',
    concepto: 'Día de jardinero - Mantenimiento parque y rosales',
    tipo: 'egreso',
    categoria: 'Fijos',
    subcategoria: 'Jardinero mensual',
    monto: 160000,
    metodoPago: 'Efectivo',
    cargo: 'Pablo',
    notas: 'Poda, bordeado y puesta a punto rosales'
  },
  {
    id: 'mov-9',
    fecha: '2026-10-05',
    concepto: 'Servicio eléctrico Edemsa + Tasas Municipales San Rafael',
    tipo: 'egreso',
    categoria: 'Fijos',
    subcategoria: 'Impuestos y Servicios (Luz/Gas/Tasas)',
    monto: 310000,
    metodoPago: 'Transferencia',
    cargo: 'Gabriela',
    notas: 'Factura mensual luz y alumbrado'
  },
  {
    id: 'mov-10',
    fecha: '2026-10-03',
    concepto: 'Honorarios contables mensuales',
    tipo: 'egreso',
    categoria: 'Fijos',
    subcategoria: 'Contador',
    monto: 190000,
    metodoPago: 'Transferencia',
    cargo: 'Gabriela',
    notas: 'Estudio Contable Pérez & Asoc.'
  },
  {
    id: 'mov-11',
    fecha: '2026-10-02',
    concepto: 'Cobro total Casamiento Romina & Federico',
    tipo: 'ingreso',
    categoria: 'Variables',
    subcategoria: 'Proveedores de evento',
    monto: 3100000,
    metodoPago: 'Transferencia',
    cargo: 'Pablo',
    notas: 'Cancelación total 10 días antes del evento'
  },
  {
    id: 'mov-12',
    fecha: '2026-10-01',
    concepto: 'Campaña en redes sociales (Instagram / Facebook Ads)',
    tipo: 'egreso',
    categoria: 'Variables',
    subcategoria: 'Marketing y Publicidad',
    monto: 140000,
    metodoPago: 'Tarjeta',
    cargo: 'Joaquina',
    notas: 'Pauta promocional temporada egresados y bodas'
  }
];

export const EVENTOS_SEED = [
  {
    id: 'ev-1',
    titulo: '15 de Federica Gómez',
    tipo: '15_anos',
    fecha: '2026-10-17',
    horaInicio: '21:00',
    horaFin: '05:30',
    cliente: 'Gómez / Martínez',
    invitadosCena: 95,
    invitadosBrindis: 45,
    responsable: 'Paulina',
    estado: 'Confirmado',
    notas: 'La cumpleañera entra a las 23:00. Pide show de luces y video en pantalla grande.',
    esEventoDelDia: true
  },
  {
    id: 'ev-2',
    titulo: 'Boda Sofía & Lucas',
    tipo: 'casamiento',
    fecha: '2026-10-24',
    horaInicio: '19:30',
    horaFin: '05:00',
    cliente: 'Familia Rossi - Morales',
    invitadosCena: 120,
    invitadosBrindis: 30,
    responsable: 'Joaquina',
    estado: 'Confirmado',
    notas: 'Ceremonia civil previa en el parque a las 19:45 hs.'
  },
  {
    id: 'ev-3',
    titulo: 'Día de Jardinero y Poda de Parque',
    tipo: 'mantenimiento',
    fecha: '2026-10-21',
    horaInicio: '08:30',
    horaFin: '13:00',
    cliente: 'Operativa Interna',
    invitadosCena: 0,
    invitadosBrindis: 0,
    responsable: 'Pablo',
    estado: 'Confirmado',
    notas: 'Don Carlos jardinero: corte general de césped, fertilización y poda de cerco verde.'
  },
  {
    id: 'ev-4',
    titulo: '15 de Martina Giménez',
    tipo: '15_anos',
    fecha: '2026-10-31',
    horaInicio: '21:30',
    horaFin: '06:00',
    cliente: 'Familia Giménez',
    invitadosCena: 80,
    invitadosBrindis: 70,
    responsable: 'Pablo',
    estado: 'Confirmado',
    notas: 'Temática fluor para la tanda de baile. Solicitaron máquina de humo frío.'
  },
  {
    id: 'ev-5',
    titulo: 'Mantenimiento Preventivo Grupo Electrógeno y Climatización',
    tipo: 'mantenimiento',
    fecha: '2026-11-04',
    horaInicio: '09:00',
    horaFin: '12:00',
    cliente: 'Operativa Interna',
    invitadosCena: 0,
    invitadosBrindis: 0,
    responsable: 'Pablo',
    estado: 'Confirmado',
    notas: 'Service técnico oficial generador y cambio de filtros en aires centrales.'
  },
  {
    id: 'ev-6',
    titulo: 'Egresados Colegio Del Carmen (Promo 2026)',
    tipo: 'egresados',
    fecha: '2026-11-07',
    horaInicio: '21:00',
    horaFin: '05:30',
    cliente: 'Comisión de Padres Del Carmen',
    invitadosCena: 110,
    invitadosBrindis: 90,
    responsable: 'Joaquina',
    estado: 'Confirmado',
    notas: 'Doble seguridad en el portón y estacionamiento. Barra controlada.'
  },
  {
    id: 'ev-7',
    titulo: 'Cumpleaños 70 de Iris (Familiar)',
    tipo: 'aniversario',
    fecha: '2026-11-14',
    horaInicio: '13:00',
    horaFin: '20:00',
    cliente: 'Familia Moments',
    invitadosCena: 65,
    invitadosBrindis: 20,
    responsable: 'Jesica',
    estado: 'Confirmado',
    notas: 'Almuerzo de mediodía con asado y música acústica en el parque.'
  },
  {
    id: 'ev-8',
    titulo: 'Casamiento Camila & Julián',
    tipo: 'casamiento',
    fecha: '2026-11-21',
    horaInicio: '20:00',
    horaFin: '05:30',
    cliente: 'Camila Navarro',
    invitadosCena: 135,
    invitadosBrindis: 40,
    responsable: 'Gabriela',
    estado: 'Tentativo',
    notas: 'Falta confirmación de seña antes del 25/10.'
  }
];

export const CHECKLIST_INICIAL = [
  // 1. ANTES DEL EVENTO
  {
    id: 'chk-1',
    etapa: 'antes',
    titulo: 'Armado de mesas y sillas según plano del cliente',
    descripcion: 'Verificar cantidad de mesas de cena (10 personas) y mesas de jóvenes.',
    completado: true,
    hora: '17:15',
    responsable: 'Paulina',
    nota: '10 mesas adultas + 3 mesas jóvenes OK'
  },
  {
    id: 'chk-2',
    etapa: 'antes',
    titulo: 'Montaje de mantelería, vajilla y cristalería',
    descripcion: 'Revisar copas fajinadas, cubiertos sin marcas y servilleteros.',
    completado: true,
    hora: '18:00',
    responsable: 'Paulina',
    nota: 'Mantelería champagne y copas listas'
  },
  {
    id: 'chk-3',
    etapa: 'antes',
    titulo: 'Limpieza profunda de sanitarios e insumos completos',
    descripcion: 'Papel higiénico de repuesto, jabón líquido, toallitas descartables y fragancia.',
    completado: true,
    hora: '18:30',
    responsable: 'Paulina',
    nota: 'Baños de mujeres y varones impecables'
  },
  {
    id: 'chk-4',
    etapa: 'antes',
    titulo: 'Recepción de bebidas frías, vinos y 15 bolsas de hielo',
    descripcion: 'Cargar heladeras exhibidoras y batea de barra.',
    completado: true,
    hora: '19:10',
    responsable: 'Paulina',
    nota: 'Bebidas a 4°C y hielo estibado'
  },
  {
    id: 'chk-5',
    etapa: 'antes',
    titulo: 'Recepción de catering, carnes y torta de fiesta',
    descripcion: 'Control de frío en cámara frigorífica y mesa dulce protegida.',
    completado: true,
    hora: '19:40',
    responsable: 'Jesica',
    nota: 'Torta en cámara 2. Catering listo para horno'
  },
  {
    id: 'chk-6',
    etapa: 'antes',
    titulo: 'Prueba de sonido con DJ, micrófonos y pantalla gigante',
    descripcion: 'Comprobar micrófono inalámbrico para la familia y proyector de video.',
    completado: true,
    hora: '20:15',
    responsable: 'Pablo',
    nota: 'Sonido calibrado sin acoples'
  },
  {
    id: 'chk-7',
    etapa: 'antes',
    titulo: 'Grupo electrógeno con tanque lleno y llave de pase probada',
    descripcion: 'Verificar nivel de gasoil y disyuntores de emergencia.',
    completado: true,
    hora: '20:30',
    responsable: 'Pablo',
    nota: 'Generador probado 5 min en vacío OK'
  },
  {
    id: 'chk-8',
    etapa: 'antes',
    titulo: 'Climatización del salón encendida a 22°C',
    descripcion: 'Poner en marcha calefacción / aire 1 hora antes de que lleguen los invitados.',
    completado: true,
    hora: '20:40',
    responsable: 'Paulina',
    nota: 'Temperatura óptima alcanzada'
  },
  {
    id: 'chk-9',
    etapa: 'antes',
    titulo: 'Llegada y control de mozos, bartender y seguridad',
    descripcion: 'Uniforme correcto, aseo personal y asignación de sectores de mesas.',
    completado: true,
    hora: '20:50',
    responsable: 'Paulina',
    nota: 'Dotación completa (8 mozos + 2 barra)'
  },
  {
    id: 'chk-10',
    etapa: 'antes',
    titulo: 'Recepción de los homenajeados en la suite privada',
    descripcion: 'Darles la bienvenida, copa de agua/brindis, guardar vestidos y pertenencias.',
    completado: true,
    hora: '21:00',
    responsable: 'Jesica',
    nota: 'Familia instalada en la suite'
  },

  // 2. DURANTE EL EVENTO
  {
    id: 'chk-11',
    etapa: 'durante',
    titulo: 'Apertura de portón y bienvenida de invitados en el parque',
    descripcion: 'Música ambiental suave, recepción con bocaditos y copas de bienvenida.',
    completado: true,
    hora: '21:20',
    responsable: 'Paulina',
    nota: 'Ingreso fluido sin demoras en estacionamiento'
  },
  {
    id: 'chk-12',
    etapa: 'durante',
    titulo: 'Paso al salón principal y ubicación en mesas',
    descripcion: 'Mozos acompañan a las mesas designadas según el listado del cliente.',
    completado: true,
    hora: '22:15',
    responsable: 'Paulina',
    nota: 'Todos ubicados correctamente'
  },
  {
    id: 'chk-13',
    etapa: 'durante',
    titulo: 'Entrada formal de la homenajeada / novios con aplausos',
    descripcion: 'Coordinar con DJ tema musical de ingreso, luces bajas y cañón de seguimiento.',
    completado: true,
    hora: '22:45',
    responsable: 'Paulina',
    nota: 'Entrada muy emotiva, salió impecable'
  },
  {
    id: 'chk-14',
    etapa: 'durante',
    titulo: 'Servicio de plato principal / cena caliente',
    descripcion: 'Controlar que todas las mesas coman al mismo tiempo y mozos atentos a bebidas.',
    completado: true,
    hora: '23:30',
    responsable: 'Paulina',
    nota: 'Cena servida a punto'
  },
  {
    id: 'chk-15',
    etapa: 'durante',
    titulo: 'Ronda 1 de control y limpieza de baños (23:45 hs)',
    descripcion: 'Repasar lavamanos, espejos y reponer toallas de papel.',
    completado: true,
    hora: '23:50',
    responsable: 'Paulina',
    nota: 'Baños secos e higienizados'
  },
  {
    id: 'chk-16',
    etapa: 'durante',
    titulo: 'Momento vals familiar, video homenaje y brindis',
    descripcion: 'Atenuar luces, pantalla encendida, copas de champagne en todas las mesas.',
    completado: false,
    hora: null,
    responsable: 'Paulina',
    nota: 'Previsto para 00:30 hs'
  },
  {
    id: 'chk-17',
    etapa: 'durante',
    titulo: 'Apertura de pista de baile, DJ arriba y tanda de cotillón',
    descripcion: 'Barra libre habilitada al 100%, luces robóticas y show en pista.',
    completado: false,
    hora: null,
    responsable: 'Paulina',
    nota: 'Cotillón guardado tras la cabina'
  },
  {
    id: 'chk-18',
    etapa: 'durante',
    titulo: 'Ronda 2 de control y limpieza de baños (02:00 hs)',
    descripcion: 'Verificar higiene y evitar acumulación de papeles en el piso.',
    completado: false,
    hora: null,
    responsable: 'Paulina',
    nota: ''
  },
  {
    id: 'chk-19',
    etapa: 'durante',
    titulo: 'Monitoreo de seguridad exterior y decibeles hacia vecinos',
    descripcion: 'Recorrido perimetral del parque, portón cerrado y autos custodiados.',
    completado: false,
    hora: null,
    responsable: 'Pablo',
    nota: ''
  },
  {
    id: 'chk-20',
    etapa: 'durante',
    titulo: 'Mesa dulce, café y fin de fiesta con desayuno / medialunas',
    descripcion: 'Habilitar mesa dulce y reposición de café caliente para los invitados.',
    completado: false,
    hora: null,
    responsable: 'Paulina',
    nota: ''
  },

  // 3. DESPUÉS DEL EVENTO
  {
    id: 'chk-21',
    etapa: 'despues',
    titulo: 'Cierre paulatino de música y barra de tragos',
    descripcion: 'Encendido de luces tenues para indicar el final pacífico de la fiesta.',
    completado: false,
    hora: null,
    responsable: 'Paulina',
    nota: 'Previsto 05:30 hs'
  },
  {
    id: 'chk-22',
    etapa: 'despues',
    titulo: 'Salida ordenada de invitados y custodia en el estacionamiento',
    descripcion: 'Seguridad coordina salida ágil de vehículos hacia la calle.',
    completado: false,
    hora: null,
    responsable: 'Paulina',
    nota: ''
  },
  {
    id: 'chk-23',
    etapa: 'despues',
    titulo: 'Conteo de vajilla, copas y reporte de posibles roturas',
    descripcion: 'Anotar faltantes o roturas para conciliar con la garantía del cliente.',
    completado: false,
    hora: null,
    responsable: 'Paulina',
    nota: ''
  },
  {
    id: 'chk-24',
    etapa: 'despues',
    titulo: 'Entrega de regalos, torta sobrante y objetos personales a la familia',
    descripcion: 'Revisar la suite privada y confirmar que no quede ningún celular o abrigo.',
    completado: false,
    hora: null,
    responsable: 'Paulina',
    nota: ''
  },
  {
    id: 'chk-25',
    etapa: 'despues',
    titulo: 'Firma y liquidación horaria del personal eventual (mozos/seguridad)',
    descripcion: 'Registrar horas extras si las hubo para liquidar en planilla de caja.',
    completado: false,
    hora: null,
    responsable: 'Jesica',
    nota: ''
  },
  {
    id: 'chk-26',
    etapa: 'despues',
    titulo: 'Apagado general: equipos de sonido, aires, luces y cierre de gas',
    descripcion: 'Verificar freidoras apagadas, hornos desconectados y canillas cerradas.',
    completado: false,
    hora: null,
    responsable: 'Pablo',
    nota: ''
  },
  {
    id: 'chk-27',
    etapa: 'despues',
    titulo: 'Cierre con llave del predio y activación de alarma central',
    descripcion: 'Asegurar portón corredizo principal y puerta de acceso a cocina.',
    completado: false,
    hora: null,
    responsable: 'Paulina',
    nota: ''
  }
];

export const GUIONES_VENTAS = [
  {
    id: 'guion-15',
    tipo: 'Cumpleaños de 15',
    icono: 'Sparkles',
    color: 'from-pink-500 to-rose-600',
    descripcion: 'Enfoque emotivo para la quinceañera y tranquilidad absoluta para los padres.',
    puntosClave: [
      'Parque arbolado para sesión de fotos previa al atardecer',
      'Salón climatizado con pista de baile y luces robóticas de última generación',
      'Menú gourmet para adultos y menú especial pensado para los jóvenes',
      'Suite privada para la quinceañera con espejo camarín y baño exclusivo',
      'Seguridad privada permanente en estacionamiento y perímetro'
    ],
    textoWhatsApp: `¡Hola! 👋 ¡Muchas gracias por escribirnos a *Moments*! ✨

Sabemos lo especial que es planear la fiesta de 15 años y queremos que disfruten cada momento sin preocupaciones. En nuestro salón en San Rafael les ofrecemos:

🌸 *Parque exclusivo* para fotos inolvidables al atardecer.
🎉 *Salón integral* con tecnología de sonido envolvente, luces robóticas y pantalla gigante.
👑 *Suite privada de relax* para la quinceañera.
🍽️ *Propuesta gastronómica flexible* (menú adulto + menú jóvenes).
🛡️ *Estacionamiento privado* y seguridad en todo el predio.

¿Te gustaría que te pasemos la ficha técnica y coordinemos una visita al salón esta semana para que lo conozcan en persona? Contanos qué fecha tentativa tienen pensada y cuántos invitados estiman. ¡Un abrazo!`
  },
  {
    id: 'guion-boda',
    tipo: 'Casamientos y Bodas',
    icono: 'HeartHandshake',
    color: 'from-amber-500 to-orange-600',
    descripcion: 'Experiencia romántica, ceremonia civil al aire libre y banquete elegante.',
    puntosClave: [
      'Ceremonia civil en el parque con pérgola decorada y sillas vestidas',
      'Recepción al aire libre con copas de bienvenida y finger food',
      'Banquete en salón con mesas redondas vestidas y mantelería fina',
      'Grupo electrógeno propio y climatización asegurada',
      'Coordinación de logística durante toda la noche'
    ],
    textoWhatsApp: `¡Hola! 💍 ¡Felicitaciones por este gran paso! Muchas gracias por consultar en *Moments*.

Para bodas, brindamos una experiencia pensada para que ustedes y sus invitados vivan una noche mágica:

🌿 *Ceremonia en el parque*: pérgola romántica en nuestro jardín para el civil o intercambio de anillos.
🥂 *Recepción al atardecer* con coctelería y appetizers al aire libre.
✨ *Salón principal elegante*, con mantelería de primera, vajilla fina y acústica calibrada.
⚡ *Tranquilidad total*: grupo electrógeno propio, suite para los novios y coordinación paso a paso de los tiempos.

¿Tienen una fecha estimada para el casamiento y cantidad aproximada de invitados? Con gusto les enviamos nuestra propuesta y coordinamos un café en el salón para charlar los detalles.`
  },
  {
    id: 'guion-egresados',
    tipo: 'Fiestas de Egresados',
    icono: 'GraduationCap',
    color: 'from-indigo-500 to-blue-600',
    descripcion: 'Paquete completo para colegios, diversión para los chicos y orden para los padres.',
    puntosClave: [
      'Fiesta con DJ en vivo, robot LED y cotillón temático',
      'Barra de tragos y gaseosas con control estricto',
      'Mesa de comida y trasnoche con medialunas calientes',
      'Doble seguridad en accesos y estacionamiento privado',
      'Coordinador general durante todo el evento'
    ],
    textoWhatsApp: `¡Hola Comisión de Padres! 🎓 ¡Qué gran logro cerrar esta etapa! En *Moments* tenemos la propuesta ideal para su Fiesta de Egresados:

🔥 *Diversión asegurada*: Pista de baile con DJ Pro, cabina de fotos, robot LED y efectos especiales.
🍔 *Catering ágil*: Menú cena + trasnoche de pizzas y medialunas calientes.
🍹 *Barra controlada* con personal especializado.
🔒 *Seguridad ante todo*: Doble control en portón de ingreso, predio cerrado y personal de vigilancia permanente.
🚗 *Estacionamiento interno* para todos los vehículos de los padres.

¿Qué colegio o curso representan y cuántos chicos / familias calculan? Podemos fijar una reunión con la comisión para armarles un presupuesto escalonado a medida.`
  },
  {
    id: 'guion-aniversario',
    tipo: 'Cumpleaños y Aniversarios',
    icono: 'PartyPopper',
    color: 'from-emerald-500 to-teal-600',
    descripcion: 'Propuesta cálida y descontracturada para celebrar en familia o amigos.',
    puntosClave: [
      'Almuerzos de domingo o cenas de noche en formato relajado',
      'Sector de asadores propios y galerías abiertas',
      'Espacio verde amplio para que jueguen niños con seguridad',
      'Música ambiente o escenario para bandas acústicas',
      'Horarios flexibles'
    ],
    textoWhatsApp: `¡Hola! 🥂 ¡Qué lindo celebrar! En *Moments* nos encanta ser parte de los cumpleaños y aniversarios familiares.

Les ofrecemos:
🌳 *Parque arbolado y galerías* ideales tanto para almuerzos al sol como para cenas relajadas.
🍖 *Sector de asadores* o servicio de finger food / cazuelas.
🎶 *Espacio para música en vivo*, pantallas para fotos familiares y pista de baile.
🧸 *Predio seguro y cerrado*, para que tanto grandes como chicos disfruten sin preocupaciones.

¿Qué tipo de festejo están imaginando y para qué mes? ¡Les pasamos opciones de presupuestos enseguida!`
  }
];

export const CONSULTAS_PIPELINE_SEED = [
  {
    id: 'con-1',
    cliente: 'Familia Quiroga (15 de Sofía)',
    tipo: '15_anos',
    fechaTentativa: '2027-02-13',
    invitadosEstimados: 100,
    estado: 'Visita agendada',
    vendedor: 'Joaquina',
    contacto: '2604-558899',
    presupuestoEstimado: 4800000,
    notas: 'Vienen a conocer el salón el próximo martes a las 18:30 hs.'
  },
  {
    id: 'con-2',
    cliente: 'Boda Andrea & Marcos',
    tipo: 'casamiento',
    fechaTentativa: '2027-04-10',
    invitadosEstimados: 130,
    estado: 'Presupuesto enviado',
    vendedor: 'Pablo',
    contacto: '2604-112233',
    presupuestoEstimado: 6200000,
    notas: 'Consultaron por menú con asado a la llama en parque.'
  },
  {
    id: 'con-3',
    cliente: 'Promo Egresados Normal (2026)',
    tipo: 'egresados',
    fechaTentativa: '2026-12-05',
    invitadosEstimados: 120,
    estado: 'Señado / Confirmado',
    vendedor: 'Pablo',
    contacto: '2604-998877',
    presupuestoEstimado: 5100000,
    notas: 'Dejaron seña de reserva. Pendiente firmar contrato con la comisión.'
  },
  {
    id: 'con-4',
    cliente: 'Cumpleaños 50 de Rodolfo',
    tipo: 'aniversario',
    fechaTentativa: '2026-11-28',
    invitadosEstimados: 75,
    estado: 'Nueva consulta',
    vendedor: 'Joaquina',
    contacto: '2604-443322',
    presupuestoEstimado: 2900000,
    notas: 'Pidió cotización por WhatsApp hoy a la mañana.'
  }
];

export const MATERIALES_VENTAS = [
  {
    titulo: 'Galería Fotográfica Oficial en Alta Definición',
    tipo: 'Fotos / Drive',
    url: 'https://drive.google.com/drive/folders/moments-salon-fotos-oficiales',
    descripcion: 'Fotos profesionales del parque de día, recepción de tarde, salón iluminado y suite.',
    icono: 'Image'
  },
  {
    titulo: 'Plano de Distribución de Mesas y Capacidad',
    tipo: 'PDF / Plano',
    url: 'https://drive.google.com/file/d/plano-distribucion-moments-2026',
    descripcion: 'Distribución técnica para 80 a 200 personas con pista central y sector de barra.',
    icono: 'LayoutGrid'
  },
  {
    titulo: 'Tarifario y Paquetes Vigentes (Temporada 2026/2027)',
    tipo: 'Planilla / Precios',
    url: 'https://docs.google.com/spreadsheets/d/tarifario-actualizado-moments',
    descripcion: 'Precios sugeridos por persona, costo de alquiler de salón y adicionales.',
    icono: 'FileSpreadsheet'
  },
  {
    titulo: 'Guía de Servicios Incluidos para Clientes',
    tipo: 'Documento',
    url: 'https://docs.google.com/document/d/servicios-incluidos-moments',
    descripcion: 'Detalle de qué incluye el alquiler: grupo electrógeno, seguridad, limpieza final, etc.',
    icono: 'FileCheck'
  }
];

export const ACTIVIDADES_SEMANA_SEED = [
  {
    id: 'act-1',
    tipo: 'reunion',
    titulo: 'Reunión Estratégica Semanal con Marketing y Ventas',
    dia: 'Lunes',
    fecha: '2026-10-26',
    hora: '10:30',
    creadorId: 'alvaro',
    creadorNombre: 'Álvaro',
    creadorCargo: 'Estratega Integrador',
    lugar: 'Oficina / Sala de Reuniones Salón',
    descripcion: 'Revisión de embudo de consultas, tarifas 2027 y contenidos en Instagram para la temporada alta.',
    participantes: [
      { usuarioId: 'joaquina', nombre: 'Joaquina', rol: 'Ventas', confirmada: true, fechaConfirmacion: '2026-10-26 09:15' },
      { usuarioId: 'paulina', nombre: 'Paulina', rol: 'Logística de Eventos', confirmada: false, fechaConfirmacion: null },
      { usuarioId: 'pablo', nombre: 'Pablo', rol: 'Ventas y Mantenimiento', confirmada: true, fechaConfirmacion: '2026-10-26 09:40' },
      { usuarioId: 'jesica', nombre: 'Jesica', rol: 'Gerencia General', confirmada: false, fechaConfirmacion: null }
    ],
    proveedor: null,
    monto: null,
    pagado: false,
    responsablePago: null,
    movimientoCajaId: null,
    completada: false,
    responsableTarea: null
  },
  {
    id: 'act-2',
    tipo: 'pago_proveedor',
    titulo: 'Pago mantenimiento parque y rosales - Don Carlos',
    dia: 'Martes',
    fecha: '2026-10-27',
    hora: '11:00',
    creadorId: 'pablo',
    creadorNombre: 'Pablo',
    creadorCargo: 'Ventas y Mantenimiento',
    lugar: 'Parque Salón',
    descripcion: 'Poda, bordeado de canteros y puesta a punto de los rosales para el evento del sábado.',
    participantes: [],
    proveedor: 'Don Carlos (Jardinería y Riego)',
    monto: 160000,
    pagado: true,
    responsablePago: 'Pablo',
    movimientoCajaId: 'mov-8',
    completada: true,
    responsableTarea: null
  },
  {
    id: 'act-3',
    tipo: 'reunion',
    titulo: 'Coordinación Operativa Fiesta de 15 de Federica',
    dia: 'Miércoles',
    fecha: '2026-10-28',
    hora: '17:00',
    creadorId: 'paulina',
    creadorNombre: 'Paulina',
    creadorCargo: 'Logística de Eventos',
    lugar: 'Salón Principal y Pista',
    descripcion: 'Repaso de tiempos de tanda de baile, entrada de la quinceañera, mozos y chequeo de sonido con DJ.',
    participantes: [
      { usuarioId: 'paulina', nombre: 'Paulina', rol: 'Logística de Eventos', confirmada: true, fechaConfirmacion: '2026-10-27 11:20' },
      { usuarioId: 'pablo', nombre: 'Pablo', rol: 'Ventas y Mantenimiento', confirmada: false, fechaConfirmacion: null },
      { usuarioId: 'jesica', nombre: 'Jesica', rol: 'Gerencia General', confirmada: true, fechaConfirmacion: '2026-10-27 14:05' },
      { usuarioId: 'gabriela', nombre: 'Gabriela', rol: 'Administración', confirmada: false, fechaConfirmacion: null }
    ],
    proveedor: null,
    monto: null,
    pagado: false,
    responsablePago: null,
    movimientoCajaId: null,
    completada: false,
    responsableTarea: null
  },
  {
    id: 'act-4',
    tipo: 'pago_proveedor',
    titulo: 'Seña sonido e iluminación robotizada DJ Cuyo Pro',
    dia: 'Jueves',
    fecha: '2026-10-29',
    hora: '15:30',
    creadorId: 'jesica',
    creadorNombre: 'Jesica',
    creadorCargo: 'Gerencia General',
    lugar: 'Transferencia Bancaria',
    descripcion: 'Anticipo contractual para luces móviles y efectos especiales para los 15 del fin de semana.',
    participantes: [],
    proveedor: 'DJ Cuyo Pro (Sonido & Iluminación)',
    monto: 320000,
    pagado: false,
    responsablePago: 'Jesica',
    movimientoCajaId: null,
    completada: false,
    responsableTarea: null
  },
  {
    id: 'act-5',
    tipo: 'pago_proveedor',
    titulo: 'Carnicería y fiambres Don Pedro (Catering Sábado)',
    dia: 'Viernes',
    fecha: '2026-10-30',
    hora: '11:00',
    creadorId: 'gabriela',
    creadorNombre: 'Gabriela',
    creadorCargo: 'Administración',
    lugar: 'Pago en Salón / Repartidor',
    descripcion: 'Cortes para mesa de recepción y plato principal (160 personas confirmadas).',
    participantes: [],
    proveedor: 'Distribuidora Carnes Don Pedro',
    monto: 450000,
    pagado: false,
    responsablePago: 'Gabriela',
    movimientoCajaId: null,
    completada: false,
    responsableTarea: null
  },
  {
    id: 'act-6',
    tipo: 'tarea_operativa',
    titulo: 'Recepción de bebidas, vinos y 15 bolsas de hielo',
    dia: 'Viernes',
    fecha: '2026-10-30',
    hora: '18:00',
    creadorId: 'paulina',
    creadorNombre: 'Paulina',
    creadorCargo: 'Logística de Eventos',
    lugar: 'Cámara de frío y quincho',
    descripcion: 'Cargar heladeras y freezers del salón y quincho con gaseosas, hielo y espumantes.',
    participantes: [],
    proveedor: null,
    monto: null,
    pagado: false,
    responsablePago: null,
    movimientoCajaId: null,
    completada: false,
    responsableTarea: 'Paulina'
  },
  {
    id: 'act-7',
    tipo: 'reunion',
    titulo: 'Cierre de Caja y Balance Semanal',
    dia: 'Domingo',
    fecha: '2026-11-01',
    hora: '19:00',
    creadorId: 'jesica',
    creadorNombre: 'Jesica',
    creadorCargo: 'Gerencia General',
    lugar: 'Llamada Virtual / Oficina',
    descripcion: 'Revisión final de cobros de señas, balance neto del fin de semana y retiros planificados.',
    participantes: [
      { usuarioId: 'jesica', nombre: 'Jesica', rol: 'Gerencia General', confirmada: true, fechaConfirmacion: '2026-10-27 15:00' },
      { usuarioId: 'leandro', nombre: 'Leandro', rol: 'Dueño', confirmada: false, fechaConfirmacion: null },
      { usuarioId: 'alvaro', nombre: 'Álvaro', rol: 'Estratega Integrador', confirmada: true, fechaConfirmacion: '2026-10-27 15:10' }
    ],
    proveedor: null,
    monto: null,
    pagado: false,
    responsablePago: null,
    movimientoCajaId: null,
    completada: false,
    responsableTarea: null
  }
];

