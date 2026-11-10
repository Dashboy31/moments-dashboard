import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import {
  MOVIMIENTOS_SEED,
  EVENTOS_SEED,
  CHECKLIST_INICIAL,
  ACTIVIDADES_SEMANA_SEED,
  USUARIOS
} from '../src/utils/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3060;

// PIN de Caja: de Gerencia (Jesica y Leandro).
// Acepta siempre '1234' por defecto y también el valor configurado en process.env.CAJA_PIN.
function esPinCorrecto(pin) {
  const p = String(pin || '').trim();
  if (!p) return false;
  if (p === '1234') return true;
  const envPin = String(process.env.CAJA_PIN || '').trim();
  if (envPin && p === envPin) return true;
  return false;
}

// Carpeta donde vive la base de datos.
// En Render apunta al Disco Persistente (DATA_DIR=/var/data) para que NO se borre
// al reiniciar o al subir una versión nueva. En la PC local usa server/data.
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'moments_db.json');
const BACKUP_DIR = path.join(DATA_DIR, 'respaldos');

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// ---------------------------------------------------------------------------
// Base de datos (archivo JSON en disco persistente, escrituras atómicas)
// ---------------------------------------------------------------------------
const COLECCIONES = [
  'eventos',
  'checklist',
  'movimientos',
  'actividades_semana',
  'eventos_finanzas',
  'prestamos_tramos',
  'proveedores_datos'
];

export const CONFIGURACION_DEFAULT = {
  eventoMinimo: 4000000,
  eventoBasePersonas: 85,
  eventoBaseCosto: 7000000,
  costoPromedioPlanificacion: 10000000,
  tarifaAdultoVigente: 127000,
  fijosReferenciaMes: 5000000,
  margenVerdeMin: 20,
  margenAmarilloMin: 0,
  tramoPrestamoSugerido: 20000000,
  colchonSeguridadEventos: 1,
  responsablesSugeridos: {
    fijos: 'Gabriela',
    variables: 'Paulina',
    ingresos: 'Jesica'
  },
  plantillaCostosFijos: [
    { id: 'pf-1', concepto: 'Impuestos y Tasas Municipales', subcategoria: 'Impuestos', montoEstimado: 350000, diaVencimiento: 10, responsable: 'Gabriela' },
    { id: 'pf-2', concepto: 'Servicio Eléctrico (Luz / Edemsa)', subcategoria: 'Luz', montoEstimado: 420000, diaVencimiento: 15, responsable: 'Gabriela' },
    { id: 'pf-3', concepto: 'Servicio de Gas (Ecogas)', subcategoria: 'Gas', montoEstimado: 180000, diaVencimiento: 18, responsable: 'Gabriela' },
    { id: 'pf-4', concepto: 'Servicio de Agua potable y riego', subcategoria: 'Agua', montoEstimado: 90000, diaVencimiento: 12, responsable: 'Gabriela' },
    { id: 'pf-5', concepto: 'Honorarios Estudio Contable', subcategoria: 'Contador', montoEstimado: 220000, diaVencimiento: 5, responsable: 'Gabriela' },
    { id: 'pf-6', concepto: 'Mantenimiento Parque y Jardinero mensual', subcategoria: 'Jardinero', montoEstimado: 280000, diaVencimiento: 8, responsable: 'Pablo' },
    { id: 'pf-7', concepto: 'Servicio Seguridad Alarma y Monitoreo', subcategoria: 'Seguridad permanente', montoEstimado: 210000, diaVencimiento: 10, responsable: 'Gabriela' },
    { id: 'pf-8', concepto: 'Administración del Salón', subcategoria: 'Administración', montoEstimado: 500000, diaVencimiento: 1, responsable: 'Gabriela' },
    { id: 'pf-9', concepto: 'Honorarios Socios Operativos', subcategoria: 'Socios', montoEstimado: 2750000, diaVencimiento: 1, responsable: 'Jesica' }
  ],
  mapeosExcel: {}
};

function dbInicial() {
  return {
    version: 1,
    actualizado: new Date().toISOString(),
    eventos: EVENTOS_SEED,
    checklist: CHECKLIST_INICIAL,
    movimientos: MOVIMIENTOS_SEED,
    actividades_semana: ACTIVIDADES_SEMANA_SEED,
    eventos_finanzas: [],
    prestamos_tramos: [],
    proveedores_datos: [],
    configuracion: { ...CONFIGURACION_DEFAULT }
  };
}

function cargarDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  // 1. Respaldo preventivo antes de cualquier migración (moments_db.pre-migracion-<fecha>.json)
  const hoyFecha = new Date().toISOString().slice(0, 10);
  const preMigracionFile = path.join(DATA_DIR, `moments_db.pre-migracion-${hoyFecha}.json`);
  if (fs.existsSync(DATA_FILE) && !fs.existsSync(preMigracionFile)) {
    try {
      fs.copyFileSync(DATA_FILE, preMigracionFile);
      console.log('✅ Respaldo pre-migración creado en:', preMigracionFile);
    } catch (e) {
      console.warn('⚠️ No se pudo crear copia pre-migración:', e.message);
    }
  }

  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      for (const c of COLECCIONES) if (!Array.isArray(data[c])) data[c] = [];
      if (!Array.isArray(data.actividades_semana) || data.actividades_semana.length === 0) {
        data.actividades_semana = ACTIVIDADES_SEMANA_SEED;
      }

      // Configuración editable
      if (!data.configuracion || typeof data.configuracion !== 'object') {
        data.configuracion = { ...CONFIGURACION_DEFAULT };
      } else {
        data.configuracion = { ...CONFIGURACION_DEFAULT, ...data.configuracion };
      }

      // Normalizar campos en movimientos
      if (Array.isArray(data.movimientos)) {
        data.movimientos.forEach(m => {
          if (!m.caja) {
            if (m.metodoPago === 'Efectivo') m.caja = 'efectivo';
            else if (m.metodoPago === 'Tarjeta') m.caja = 'naranja';
            else if (String(m.concepto || '').toLowerCase().includes('mercado') || String(m.concepto || '').toLowerCase().includes('mp')) m.caja = 'mercado_pago';
            else m.caja = 'banco_nacion';
          }
          if (m.eventoId === undefined) m.eventoId = null;
          if (m.origen === undefined) m.origen = null;
          if (m.proveedor === undefined) m.proveedor = null;
          if (!m.cargadoPor) m.cargadoPor = m.cargo || 'Jesica';
        });
      }

      // Precarga de eventos de Noviembre y Diciembre 2026 (SOLO fechas sin evento previo)
      const fechasNoviembre = ['2026-11-06', '2026-11-07', '2026-11-13', '2026-11-14', '2026-11-20', '2026-11-21', '2026-11-22', '2026-11-27'];
      const fechasDiciembre = ['2026-12-06', '2026-12-07', '2026-12-11', '2026-12-12', '2026-12-13', '2026-12-17', '2026-12-18', '2026-12-19'];
      const fechasPrecarga = [...fechasNoviembre, ...fechasDiciembre];

      fechasPrecarga.forEach(f => {
        const yaExiste = data.eventos.some(e => e.fecha === f);
        if (!yaExiste) {
          data.eventos.push({
            id: `ev-precarga-${f}`,
            titulo: 'Evento por confirmar',
            tipo: 'a_definir',
            fecha: f,
            horaInicio: '21:00',
            horaFin: '05:00',
            cliente: 'A definir',
            invitadosCena: 0,
            invitadosBrindis: 0,
            responsable: 'Jesica',
            estado: 'Tentativo',
            notas: 'Precargado desde planilla de gerencia – completar tipo y personas'
          });
        }
      });

      // Asegurar eventos_finanzas
      if (!Array.isArray(data.eventos_finanzas)) data.eventos_finanzas = [];
      data.eventos.forEach(ev => {
        if (ev.tipo !== 'mantenimiento') {
          const existeFin = data.eventos_finanzas.find(ef => ef.eventoId === ev.id);
          if (!existeFin) {
            const personasCena = Number(ev.invitadosCena) || 0;
            const personasBase = personasCena > 0 ? personasCena : 85;
            data.eventos_finanzas.push({
              id: `efin-${ev.id}`,
              eventoId: ev.id,
              ingresoPactado: personasBase * (data.configuracion?.tarifaAdultoVigente || 127000),
              notasFinancieras: personasCena > 0 ? 'Calculado base por invitados cena' : 'Presupuesto de referencia base'
            });
          }
        }
      });

      if (typeof data.version !== 'number') data.version = 1;
      return data;
    } catch (e) {
      console.error('⚠️  Base dañada, se guarda copia y se reinicia:', e.message);
      fs.copyFileSync(DATA_FILE, `${DATA_FILE}.danada-${Date.now()}`);
    }
  }
  const nueva = dbInicial();
  guardarDbEnDisco(nueva);
  return nueva;
}

function guardarDbEnDisco(data) {
  // Escribe primero en un archivo temporal y luego lo renombra:
  // si se corta la luz a mitad de camino, la base anterior queda intacta.
  const tmp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, DATA_FILE);
}

let db = cargarDb();

function guardar() {
  db.version += 1;
  db.actualizado = new Date().toISOString();
  guardarDbEnDisco(db);
  respaldoDiario();
}

// Un respaldo automático por día dentro del disco (se conservan los últimos 30).
function respaldoDiario() {
  try {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const hoy = new Date().toISOString().slice(0, 10);
    const archivo = path.join(BACKUP_DIR, `moments_${hoy}.json`);
    if (!fs.existsSync(archivo)) {
      fs.writeFileSync(archivo, JSON.stringify(db, null, 2), 'utf8');
      const viejos = fs.readdirSync(BACKUP_DIR).sort().slice(0, -30);
      viejos.forEach(f => fs.unlinkSync(path.join(BACKUP_DIR, f)));
    }
  } catch (e) {
    console.error('No se pudo generar respaldo diario:', e.message);
  }
}

// ---------------------------------------------------------------------------
// Seguridad de Caja
// ---------------------------------------------------------------------------
function pinValido(req) {
  return esPinCorrecto(req.get('x-caja-pin'));
}

function requierePin(req, res, next) {
  if (!pinValido(req)) return res.status(401).json({ error: 'PIN de Caja inválido' });
  next();
}

function datosPublicos() {
  return {
    version: db.version,
    actualizado: db.actualizado,
    eventos: db.eventos,
    checklist: db.checklist,
    actividades_semana: db.actividades_semana || []
  };
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

// Login de usuario con perfil + contraseña
app.post('/api/auth/login', (req, res) => {
  const { usuarioId, password } = req.body || {};
  const usuario = USUARIOS.find(u => u.id === usuarioId);
  if (!usuario) {
    return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
  }
  if (String(password || '').trim() !== String(usuario.password || '123').trim()) {
    return res.status(401).json({ ok: false, error: 'Contraseña incorrecta' });
  }
  return res.json({
    ok: true,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
      badge: usuario.badge,
      color: usuario.color,
      avatar_color: usuario.avatar_color
    }
  });
});

// Lista pública de usuarios para la pantalla de inicio de sesión
app.get('/api/usuarios', (req, res) => {
  res.json(USUARIOS.map(u => ({
    id: u.id,
    nombre: u.nombre,
    rol: u.rol,
    badge: u.badge,
    color: u.color,
    avatar_color: u.avatar_color
  })));
});

// Estado del servidor (sirve para verificar que el disco persistente está bien conectado)
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    version: db.version,
    actualizado: db.actualizado,
    carpetaDatos: DATA_DIR,
    discoPersistente: Boolean(process.env.DATA_DIR),
    eventos: db.eventos.length,
    checklist: db.checklist.length
  });
});

// Versión actual: los dispositivos la consultan cada pocos segundos para enterarse de cambios
app.get('/api/version', (req, res) => {
  res.json({ version: db.version });
});

// Datos visibles para todo el equipo (sin Caja)
app.get('/api/data', (req, res) => {
  res.json(datosPublicos());
});

// Validar PIN de Caja
app.post('/api/caja/login', (req, res) => {
  if (esPinCorrecto(req.body?.pin)) return res.json({ ok: true });
  return res.status(401).json({ ok: false, error: 'PIN incorrecto' });
});

// Movimientos de Caja (solo con PIN)
app.get('/api/movimientos', requierePin, (req, res) => {
  res.json({ version: db.version, movimientos: db.movimientos });
});

// Alta / modificación de un registro individual (nadie pisa lo que cargó otro)
function rutasColeccion(nombre, protegida = false) {
  const guardias = protegida ? [requierePin] : [];

  app.put(`/api/${nombre}/:id`, ...guardias, (req, res) => {
    const item = { ...req.body, id: req.params.id };
    const idx = db[nombre].findIndex(x => String(x.id) === String(req.params.id));
    if (idx >= 0) db[nombre][idx] = { ...db[nombre][idx], ...item };
    else db[nombre].push(item);
    guardar();
    res.json({ ok: true, version: db.version, item: idx >= 0 ? db[nombre][idx] : item });
  });

  app.delete(`/api/${nombre}/:id`, ...guardias, (req, res) => {
    db[nombre] = db[nombre].filter(x => String(x.id) !== String(req.params.id));
    guardar();
    res.json({ ok: true, version: db.version });
  });
}

rutasColeccion('eventos');
rutasColeccion('checklist');
rutasColeccion('actividades_semana');
rutasColeccion('movimientos', true);
rutasColeccion('eventos_finanzas', true);
rutasColeccion('prestamos_tramos', true);
rutasColeccion('proveedores_datos', true);

// ---------------------------------------------------------------------------
// Carga Rápida de Gastos e Ingresos (abierta a todo el personal, sin ver montos)
// ---------------------------------------------------------------------------
app.post('/api/movimientos/rapido', (req, res) => {
  const {
    fecha,
    tipo = 'egreso',
    categoria,
    subcategoria,
    monto,
    caja = 'efectivo',
    concepto,
    eventoId,
    proveedor,
    notas,
    usuarioNombre = 'Equipo Moments'
  } = req.body || {};

  const numMonto = Number(monto);
  if (!numMonto || isNaN(numMonto) || numMonto <= 0) {
    return res.status(400).json({ ok: false, error: 'Monto inválido' });
  }

  const ahora = new Date();
  const fechaStr = fecha || ahora.toISOString().slice(0, 10);
  const horaStr = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
  const cargadoPor = `${usuarioNombre} · ${ahora.toLocaleDateString('es-AR')} ${horaStr}`;

  const nuevoMovimiento = {
    id: `mov-rap-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    fecha: fechaStr,
    concepto: concepto ? String(concepto).trim() : `[Carga Rápida] ${subcategoria || categoria || 'Operación'}`,
    tipo: tipo === 'ingreso' ? 'ingreso' : 'egreso',
    categoria: categoria || 'Variables – Otros',
    subcategoria: subcategoria || 'Proveedores de evento',
    monto: numMonto,
    caja: caja || 'efectivo',
    metodoPago: caja === 'naranja' ? 'Tarjeta Naranja' : (caja === 'banco_nacion' ? 'Transferencia BNA' : (caja === 'mercado_pago' ? 'Mercado Pago' : 'Efectivo')),
    cargo: usuarioNombre,
    cargadoPor,
    eventoId: eventoId || null,
    proveedor: proveedor ? String(proveedor).trim() : null,
    origen: tipo === 'ingreso' ? (req.body?.origen || 'Otro') : null,
    notas: notas ? String(notas).trim() : ''
  };

  if (!Array.isArray(db.movimientos)) db.movimientos = [];
  db.movimientos.unshift(nuevoMovimiento);
  guardar();

  // Devuelve únicamente { ok: true } para proteger la privacidad económica
  return res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// Fichas Financieras de Eventos (Solo Gerencia con PIN)
// ---------------------------------------------------------------------------
app.get('/api/eventos_finanzas', requierePin, (req, res) => {
  res.json({ version: db.version, eventos_finanzas: db.eventos_finanzas || [] });
});

// ---------------------------------------------------------------------------
// Configuración del Salón (Solo Gerencia con PIN)
// ---------------------------------------------------------------------------
app.get('/api/configuracion', requierePin, (req, res) => {
  res.json({ version: db.version, configuracion: db.configuracion || CONFIGURACION_DEFAULT });
});

app.put('/api/configuracion', requierePin, (req, res) => {
  db.configuracion = { ...(db.configuracion || CONFIGURACION_DEFAULT), ...req.body };
  guardar();
  res.json({ ok: true, version: db.version, configuracion: db.configuracion });
});

// ---------------------------------------------------------------------------
// Registro de Tramos de Préstamo Familiar (Solo Gerencia con PIN)
// ---------------------------------------------------------------------------
app.get('/api/prestamos_tramos', requierePin, (req, res) => {
  res.json({ version: db.version, prestamos_tramos: db.prestamos_tramos || [] });
});

app.post('/api/prestamos_tramos', requierePin, (req, res) => {
  const { fecha, monto, entregadoPor, cajaDestino = 'banco_nacion', notas } = req.body || {};
  const numMonto = Number(monto);
  if (!numMonto || numMonto <= 0) return res.status(400).json({ error: 'Monto inválido' });

  const tramoId = `tramo-${Date.now()}`;
  const movId = `mov-tramo-${Date.now()}`;
  const fechaStr = fecha || new Date().toISOString().slice(0, 10);
  const aportante = entregadoPor || 'Préstamo Familiar';

  // 1. Crear movimiento de ingreso en la caja seleccionada
  const movIngreso = {
    id: movId,
    fecha: fechaStr,
    concepto: `[Financiamiento] Tramo recibido de préstamo familiar (${aportante})`,
    tipo: 'ingreso',
    categoria: 'Financiamiento',
    subcategoria: 'Préstamo familiar',
    monto: numMonto,
    caja: cajaDestino,
    metodoPago: cajaDestino === 'efectivo' ? 'Efectivo' : 'Transferencia',
    cargo: aportante,
    cargadoPor: `Gerencia · ${fechaStr}`,
    notas: notas || 'Ingreso de fondos por tramo de préstamo familiar'
  };

  if (!Array.isArray(db.movimientos)) db.movimientos = [];
  db.movimientos.unshift(movIngreso);

  // 2. Registrar en prestamos_tramos
  const nuevoTramo = {
    id: tramoId,
    fecha: fechaStr,
    monto: numMonto,
    entregadoPor: aportante,
    cajaDestino,
    notas: notas || '',
    movimientoId: movId
  };

  if (!Array.isArray(db.prestamos_tramos)) db.prestamos_tramos = [];
  db.prestamos_tramos.unshift(nuevoTramo);

  guardar();
  res.json({ ok: true, version: db.version, tramo: nuevoTramo, movimiento: movIngreso });
});

// ---------------------------------------------------------------------------
// Directorio de Proveedores (Solo Gerencia con PIN)
// ---------------------------------------------------------------------------
app.get('/api/proveedores_datos', requierePin, (req, res) => {
  res.json({ version: db.version, proveedores_datos: db.proveedores_datos || [] });
});

// Confirmar asistencia a reunión
app.post('/api/actividades_semana/:id/confirmar', (req, res) => {
  const { usuarioId, confirmada = true } = req.body || {};
  const actividad = (db.actividades_semana || []).find(a => String(a.id) === String(req.params.id));
  if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });

  if (!Array.isArray(actividad.participantes)) actividad.participantes = [];
  const ahora = new Date();
  const fechaHoraStr = `${ahora.toISOString().slice(0, 10)} ${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;

  const pIdx = actividad.participantes.findIndex(p => p.usuarioId === usuarioId);
  if (pIdx >= 0) {
    actividad.participantes[pIdx].confirmada = Boolean(confirmada);
    actividad.participantes[pIdx].fechaConfirmacion = confirmada ? fechaHoraStr : null;
  } else {
    const u = USUARIOS.find(usr => usr.id === usuarioId);
    actividad.participantes.push({
      usuarioId,
      nombre: u ? u.nombre : usuarioId,
      rol: u ? u.rol : '',
      confirmada: Boolean(confirmada),
      fechaConfirmacion: confirmada ? fechaHoraStr : null
    });
  }

  guardar();
  res.json({ ok: true, version: db.version, actividad });
});

// Pagar a proveedor (impacto automático en Caja Variable)
app.post('/api/actividades_semana/:id/pagar', (req, res) => {
  const { pagado, responsable } = req.body || {};
  const actividad = (db.actividades_semana || []).find(a => String(a.id) === String(req.params.id));
  if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });

  const nuevoEstado = Boolean(pagado);
  actividad.pagado = nuevoEstado;
  if (responsable) actividad.responsablePago = responsable;

  const movId = actividad.movimientoCajaId || `mov-prov-${actividad.id}`;

  if (nuevoEstado) {
    // Impacta automáticamente en la Caja Variable
    actividad.movimientoCajaId = movId;
    if (!Array.isArray(db.movimientos)) db.movimientos = [];
    const idxMov = db.movimientos.findIndex(m => String(m.id) === String(movId));
    const movData = {
      id: movId,
      fecha: actividad.fecha || new Date().toISOString().slice(0, 10),
      concepto: `[Pago Proveedor] ${actividad.titulo}`,
      tipo: 'egreso',
      categoria: 'Variables',
      subcategoria: 'Proveedores de evento',
      monto: Number(actividad.monto) || 0,
      caja: req.body?.caja || actividad.caja || 'banco_nacion',
      metodoPago: req.body?.metodoPago || 'Transferencia',
      cargo: responsable || actividad.responsablePago || actividad.creadorNombre || 'Administración',
      notas: `Pago automático registrado desde Semana & Acciones (${actividad.proveedor || 'Proveedor'})`
    };
    if (idxMov >= 0) db.movimientos[idxMov] = movData;
    else db.movimientos.unshift(movData);
  } else {
    // Si se desmarca, se retira de la caja
    if (actividad.movimientoCajaId) {
      db.movimientos = (db.movimientos || []).filter(m => String(m.id) !== String(actividad.movimientoCajaId));
      actividad.movimientoCajaId = null;
    }
  }

  guardar();
  res.json({
    ok: true,
    version: db.version,
    actividad,
    movimientos: db.movimientos
  });
});

// Descargar respaldo completo (incluye Caja, por eso pide PIN)
app.get('/api/respaldo', (req, res) => {
  if (!esPinCorrecto(req.query.pin) && !pinValido(req)) {
    return res.status(401).send('PIN de Caja inválido');
  }
  const fecha = new Date().toISOString().slice(0, 10);
  res.setHeader('Content-Disposition', `attachment; filename="moments_respaldo_${fecha}.json"`);
  res.json(db);
});

// ---------------------------------------------------------------------------
// Frontend compilado
// ---------------------------------------------------------------------------
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return 'localhost';
}

app.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIp();
  console.log('===================================================================');
  console.log('  MOMENTS · SALÓN DE EVENTOS FAMILIAR');
  console.log('  San Rafael, Mendoza — Panel Operativo Central');
  console.log('===================================================================');
  console.log(`  Acceso Local (esta PC):     http://localhost:${PORT}`);
  console.log(`  Acceso Celular / Tablet:    http://${ip}:${PORT}`);
  console.log(`  Carpeta de datos:           ${DATA_DIR}`);
  console.log(`  Disco persistente:          ${process.env.DATA_DIR ? 'SÍ' : 'NO (modo local)'}`);
  console.log('===================================================================');
});
