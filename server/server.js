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

// PIN de Caja: se configura en Render como variable de entorno CAJA_PIN.
// Nunca viaja al navegador: el servidor es el único que lo valida.
const CAJA_PIN = String(process.env.CAJA_PIN || '1234');

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
const COLECCIONES = ['eventos', 'checklist', 'movimientos', 'actividades_semana'];

function dbInicial() {
  return {
    version: 1,
    actualizado: new Date().toISOString(),
    eventos: EVENTOS_SEED,
    checklist: CHECKLIST_INICIAL,
    movimientos: MOVIMIENTOS_SEED,
    actividades_semana: ACTIVIDADES_SEMANA_SEED
  };
}

function cargarDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      for (const c of COLECCIONES) if (!Array.isArray(data[c])) data[c] = [];
      if (!Array.isArray(data.actividades_semana) || data.actividades_semana.length === 0) {
        data.actividades_semana = ACTIVIDADES_SEMANA_SEED;
      }
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
  return String(req.get('x-caja-pin') || '') === CAJA_PIN;
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
  if (String(req.body?.pin || '') === CAJA_PIN) return res.json({ ok: true });
  return res.status(401).json({ ok: false });
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
      metodoPago: 'Transferencia',
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
  if (String(req.query.pin || '') !== CAJA_PIN && !pinValido(req)) {
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
