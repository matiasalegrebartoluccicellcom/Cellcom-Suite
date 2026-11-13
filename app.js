const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const ORDEN_APARTADOS = ['Nuestra Web', 'Lista Equipos', 'Reparaciones', 'Venta iPhone',
  'Suite Vendedores', 'Suite Supervisores', 'Suite Gerencia'];
const NOMBRE_ROL = { vendedor: 'Vendedor', supervisor: 'Supervisor', gerencia: 'Gerencia', admin: 'Admin' };

let estado = { userId: null, perfil: null, apartados: [], notif: [], actual: 0 };

/* ============ SESIÓN ============ */

sb.auth.onAuthStateChange((evento, session) => {
  // setTimeout evita bloquear el cliente de Supabase dentro del callback
  setTimeout(() => {
    if (!session) return mostrar('vLogin');
    if (session.user.id === estado.userId) return; // ya cargado (ej: refresco de token)
    estado.userId = session.user.id;
    cargarApp(session.user);
  }, 0);
});

// El vendedor escribe solo su usuario ("juan"); Supabase recibe "juan@cellcom.local".
function usuarioAEmail(u) {
  u = u.trim().toLowerCase();
  return u.includes('@') ? u : `${u}@${DOMINIO_USUARIOS}`;
}

async function login(e) {
  e.preventDefault();
  const btn = document.getElementById('lBtn');
  const err = document.getElementById('lError');
  err.classList.add('oculto');
  btn.disabled = true; btn.textContent = 'Ingresando…';

  const { error } = await sb.auth.signInWithPassword({
    email: usuarioAEmail(document.getElementById('lUsuario').value),
    password: document.getElementById('lPass').value
  });

  btn.disabled = false; btn.textContent = 'Ingresar';
  if (error) {
    err.textContent = error.message.includes('Invalid login')
      ? 'Usuario o contraseña incorrectos'
      : 'No se pudo ingresar: ' + error.message;
    err.classList.remove('oculto');
    return;
  }
  document.getElementById('lPass').value = '';
}

async function logout() {
  await sb.auth.signOut();
  estado.userId = null;
  mostrar('vLogin');
}

/* ============ CARGA ============ */

async function cargarApp(user) {
  mostrar('cargando');

  const { data: perfil, error } = await sb.from('perfiles').select('*').eq('id', user.id).single();
  if (error || !perfil || perfil.rol === 'pendiente' || !perfil.activo) {
    document.getElementById('pEmail').textContent = user.email.split('@')[0];
    return mostrar('vPendiente');
  }
  estado.perfil = perfil;

  const [mods, notifs, leidas] = await Promise.all([
    sb.from('modulos').select('*').order('orden').order('id'),
    sb.from('notificaciones').select('*').order('creado_en', { ascending: false }).limit(30),
    sb.from('notificaciones_leidas').select('notificacion_id')
  ]);

  estado.apartados = armarMenu(mods.data || []);
  const setLeidas = new Set((leidas.data || []).map(l => l.notificacion_id));
  estado.notif = (notifs.data || []).map(n => ({ ...n, leida: setLeidas.has(n.id) }));

  document.getElementById('uNombre').textContent = perfil.nombre || perfil.usuario;
  document.getElementById('uRol').textContent = NOMBRE_ROL[perfil.rol] || perfil.rol;

  mostrar('vApp');
  pintarNav(); pintarApartado(); pintarNotif();
}

function armarMenu(filas) {
  const map = {};
  filas.forEach(f => {
    const A = map[f.apartado] ||= { nombre: f.apartado, secciones: [], _s: {} };
    const S = A._s[f.seccion] ||= (A.secciones.push({ nombre: f.seccion, url: '', items: [] }), A.secciones.at(-1));
    if (f.subseccion) S.items.push({ nombre: f.subseccion, url: f.url || '' });
    else S.url = f.url || '';
  });
  return Object.values(map).sort((a, b) => idx(a.nombre) - idx(b.nombre));
  function idx(n) { const i = ORDEN_APARTADOS.indexOf(n); return i === -1 ? 99 : i; }
}

/* ============ PINTAR ============ */

function pintarNav() {
  document.getElementById('nav').innerHTML = estado.apartados.map((a, i) =>
    `<button class="${i === estado.actual ? 'on' : ''}" onclick="ir(${i})">${esc(a.nombre)}</button>`).join('');
}

function ir(i) { estado.actual = i; pintarNav(); pintarApartado(); scrollTo(0, 0); }

function pintarApartado() {
  const main = document.getElementById('main');
  const a = estado.apartados[estado.actual];
  if (!a) { main.innerHTML = '<div class="vacio">No tenés módulos asignados.</div>'; return; }

  main.innerHTML = `<h2>${esc(a.nombre)}</h2><div class="grid">${a.secciones.map(s => {
    const titulo = s.url
      ? `${esc(s.nombre)} <a class="abrir" href="${escAttr(s.url)}" target="_blank" rel="noopener">Abrir →</a>`
      : `${esc(s.nombre)}${s.items.length ? '' : ' <span class="tag">Próximamente</span>'}`;
    const items = s.items.map(it => it.url
      ? `<a class="item" href="${escAttr(it.url)}" target="_blank" rel="noopener">${esc(it.nombre)}</a>`
      : `<span class="item off">${esc(it.nombre)} <span class="tag">Próximamente</span></span>`).join('');
    return `<div class="card ${s.nombre === 'Abrir Ticket' ? 'ticket' : ''}"><h3>${titulo}</h3>${items}</div>`;
  }).join('')}</div>`;
}

function pintarNotif() {
  const nuevas = estado.notif.filter(n => !n.leida).length;
  const b = document.getElementById('badge');
  b.textContent = nuevas; b.classList.toggle('oculto', !nuevas);
  document.getElementById('panel').innerHTML = estado.notif.length
    ? estado.notif.map(n => `<div class="n ${n.leida ? '' : 'nueva'}" onclick="abrirNotif(${n.id})">
        <b>${esc(n.titulo)}</b>${n.mensaje ? `<p>${esc(n.mensaje)}</p>` : ''}
        <small>${new Date(n.creado_en).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</small></div>`).join('')
    : '<div class="vacio">Sin notificaciones</div>';
}

function togglePanel() { document.getElementById('panel').classList.toggle('show'); }

async function abrirNotif(id) {
  const n = estado.notif.find(x => x.id === id);
  if (!n.leida) {
    n.leida = true; pintarNotif();
    await sb.from('notificaciones_leidas').insert({ notificacion_id: id });
  }
  if (n.link) window.open(n.link, '_blank', 'noopener');
}

document.addEventListener('click', e => {
  if (!e.target.closest('#panel') && !e.target.closest('.bell'))
    document.getElementById('panel').classList.remove('show');
});

/* ============ UTILIDADES ============ */

function mostrar(id) {
  ['vLogin', 'vPendiente', 'vApp', 'cargando'].forEach(v =>
    document.getElementById(v).classList.toggle('oculto', v !== id));
}
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function escAttr(u) { return /^https?:\/\/|^\.?\//.test(u) ? esc(u) : '#'; }

/* ============ INSTALABLE (PWA) ============ */
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
