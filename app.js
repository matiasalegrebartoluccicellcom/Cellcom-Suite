const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ============ CONFIGURACIÓN ============ */

// Páginas de la suite. "suite: true" = pide usuario y contraseña.
// El nombre tiene que ser igual a la columna "apartado" de la tabla modulos.
const APARTADOS = [
  { nombre: 'Nuestra Web',   icono: 'globe',      desc: 'Ecosistemas, audio y accesorios' },
  { nombre: 'Lista Equipos', icono: 'list',       desc: 'Precios y stock por marca' },
  { nombre: 'Reparaciones',  icono: 'wrench',     desc: 'Cotizador, taller y seguimiento' },
  { nombre: 'Venta iPhone',  icono: 'tag',        desc: 'Equipos, Plan Canje y conversor' },
  { nombre: 'Vendedores',    icono: 'user',       desc: 'Tu espacio, stock, pedidos y capacitaciones', suite: true },
  { nombre: 'Supervisión',   icono: 'store',      desc: 'Sucursales, equipo y acciones comerciales',   suite: true },
  { nombre: 'Gerencia',      icono: 'bars',       desc: 'Resultados, accesos y administración',        suite: true }
];

const NOMBRE_ROL = { vendedor: 'Vendedor', supervisor: 'Supervisor', gerencia: 'Gerencia', admin: 'Admin' };

// Íconos (trazos estilo "línea", 24x24). Para usar uno nuevo: agregarlo acá y ponerlo en modulos.icono
const ICONOS = {
  home: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.6 3-5.5 7-5.5s7 1.9 7 5.5M15.5 4.6a3.5 3.5 0 0 1 0 6.8M22 20c0-2.7-1.6-4.4-4.2-5.1"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="M8.6 13.9 7 22l5-3 5 3-1.6-8.1"/>',
  trending: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
  layers: '<path d="M12 3 2 8l10 5 10-5zM2 12.5l10 5 10-5M2 17l10 5 10-5"/>',
  box: '<path d="M21 7.5 12 3 3 7.5v9L12 21l9-4.5zM3 7.5 12 12l9-4.5M12 12v9"/>',
  boxes: '<path d="M7.5 3.5 3 6v5l4.5 2.5L12 11V6zM16.5 3.5 12 6v5l4.5 2.5L21 11V6zM12 11l-4.5 2.5V19L12 21.5l4.5-2.5v-5.5z"/>',
  calculator: '<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 6.5h8M8 11h.01M12 11h.01M16 11h.01M8 14.5h.01M12 14.5h.01M16 14.5h.01M8 18h.01M12 18h.01M16 18h.01"/>',
  graduation: '<path d="M2 9.5 12 5l10 4.5-10 4.5zM6 11.5v4.5c3.5 2.5 8.5 2.5 12 0v-4.5M21 10v5"/>',
  sparkle: '<path d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6-5.6-1.9 5.6-1.9z"/>',
  megaphone: '<path d="M3 10v4h3l8 5V5L6 10zM17.5 9a4 4 0 0 1 0 6M6 14l1.5 6h2.5l-1-5"/>',
  store: '<path d="M3.5 9 5 4h14l1.5 5M3.5 9v11h17V9M3.5 9a2.8 2.8 0 0 0 5.67 0 2.8 2.8 0 0 0 5.66 0 2.8 2.8 0 0 0 5.67 0M9.5 20v-5h5v5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  bars: '<path d="M5 20v-4M10 20v-8M15 20V8M20 20V4"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21a2 2 0 0 0 4 0"/>',
  file: '<path d="M14 3H6v18h12V7zM14 3v4h4M9 17v-3M12 17v-5M15 17v-2"/>',
  id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M5.8 16c.6-1.4 1.8-2 3.2-2s2.6.6 3.2 2M14.5 10h4M14.5 14h4"/>',
  percent: '<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.2"/><circle cx="17" cy="17" r="2.2"/>',
  truck: '<path d="M2 6h12v10H2zM14 9.5h4l3.5 3.5v3H14"/><circle cx="6" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>',
  cart: '<path d="M2.5 4h2.5l2.4 11h11.2L21 7H6"/><circle cx="9" cy="19.5" r="1.5"/><circle cx="17.5" cy="19.5" r="1.5"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 3.5V8h4.5M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20.5V16h-4.5"/>',
  phone: '<rect x="6.5" y="2" width="11" height="20" rx="2.5"/><path d="M11 18.5h2"/>',
  headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v6H4zM17 15h3v6h-3z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.2 3.2 3.2 14.8 0 18M12 3c-3.2 3.2-3.2 14.8 0 18"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.3 5.3L3 18l3 3 6.4-6.4a4 4 0 0 0 5.3-5.3l-2.6 2.6-2.4-.4-.4-2.4z"/>',
  tag: '<path d="M3 3h8l10 10-8 8L3 11z"/><circle cx="7.5" cy="7.5" r="1.3"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  arrow: '<path d="M4 12h16M14 6l6 6-6 6"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>'
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24">${ICONOS[n] || ICONOS.box}</svg>`;

/* ============ ESTADO ============ */

let estado = {
  userId: null,     // sesión (null = nadie logueado)
  perfil: null,     // perfil con acceso
  pendiente: null,  // logueado pero sin rol asignado
  mods: [],         // filas de "modulos" que RLS deja ver
  notif: [],
  irDespuesLogin: null
};

/* ============ SESIÓN ============ */

sb.auth.onAuthStateChange((evento, session) => {
  setTimeout(() => { // setTimeout evita bloquear el cliente de Supabase dentro del callback
    const id = session?.user.id || null;
    if (evento !== 'INITIAL_SESSION' && id === estado.userId) return; // ej: refresco de token
    estado.userId = id;
    cargar(session?.user || null);
  }, 0);
});

// El vendedor escribe solo "juan"; Supabase recibe "juan@cellcom.local".
function usuarioAEmail(u) {
  u = u.trim().toLowerCase();
  return u.includes('@') ? u : `${u}@${DOMINIO_USUARIOS}`;
}

function abrirLogin(destino) {
  estado.irDespuesLogin = destino || null;
  const a = destino && APARTADOS.find(x => slug(x.nombre) === destino.split('/')[1]);
  document.getElementById('mTexto').innerHTML = a ? `Ingresá para ver <b>${esc(a.nombre)}</b>` : 'Ingresá con tu usuario';
  document.getElementById('lError').classList.add('oculto');
  document.getElementById('modal').classList.remove('oculto');
  setTimeout(() => document.getElementById('lUsuario').focus(), 50);
}
function cerrarLogin() { document.getElementById('modal').classList.add('oculto'); }

async function login(e) {
  e.preventDefault();
  const btn = document.getElementById('lBtn'), err = document.getElementById('lError');
  err.classList.add('oculto');
  btn.disabled = true; btn.textContent = 'Ingresando…';
  const { error } = await sb.auth.signInWithPassword({
    email: usuarioAEmail(document.getElementById('lUsuario').value),
    password: document.getElementById('lPass').value
  });
  btn.disabled = false; btn.textContent = 'Ingresar';
  if (error) {
    err.textContent = error.message.includes('Invalid login') ? 'Usuario o contraseña incorrectos' : 'No se pudo ingresar: ' + error.message;
    err.classList.remove('oculto');
    return;
  }
  document.getElementById('lPass').value = '';
  cerrarLogin();
  if (estado.irDespuesLogin) location.hash = estado.irDespuesLogin;
}

async function logout() {
  await sb.auth.signOut();
  location.hash = '#/';
}

/* ============ CARGA ============ */

async function cargar(user) {
  estado.perfil = null; estado.pendiente = null; estado.notif = [];

  if (user) {
    const { data: perfil } = await sb.from('perfiles').select('*').eq('id', user.id).single();
    if (perfil && perfil.rol !== 'pendiente' && perfil.activo) estado.perfil = perfil;
    else estado.pendiente = user.email.split('@')[0];
  }

  // RLS decide qué filas vuelven: sin sesión solo las públicas; con sesión, públicas + las de tu rol.
  const { data: mods } = await sb.from('modulos').select('*').eq('activo', true).order('orden').order('id');
  estado.mods = mods || [];

  if (estado.perfil) {
    const [notifs, leidas] = await Promise.all([
      sb.from('notificaciones').select('*').order('creado_en', { ascending: false }).limit(30),
      sb.from('notificaciones_leidas').select('notificacion_id')
    ]);
    const setLeidas = new Set((leidas.data || []).map(l => l.notificacion_id));
    estado.notif = (notifs.data || []).map(n => ({ ...n, leida: setLeidas.has(n.id) }));
  }

  pintarHeader(); pintarNotif(); router();
}

// Arma el menú de un apartado: grupos (seccion) → ítems (subseccion)
function menuDe(apartado) {
  const filas = estado.mods.filter(m => m.apartado === apartado && m.subseccion);
  const grupos = [];
  let boton = null;
  filas.forEach(f => {
    if (f.seccion === 'Botón') { boton = f; return; }
    let g = grupos.find(x => x.nombre === f.seccion);
    if (!g) grupos.push(g = { nombre: f.seccion, items: [] });
    g.items.push({ nombre: f.subseccion, url: f.url || '', icono: f.icono, desc: f.descripcion || f.seccion, slug: slug(f.subseccion) });
  });
  return { grupos, boton };
}

/* ============ RUTAS (#/apartado/item) ============ */

window.addEventListener('hashchange', router);

function router() {
  if (!estado.mods) return;
  const [, ap = '', it = ''] = location.hash.replace(/^#/, '').split('/');
  const A = APARTADOS.find(a => slug(a.nombre) === ap);
  if (!A) return pintarInicio();

  if (A.suite && !estado.perfil) {
    pintarBloqueado(A);
    if (!estado.pendiente && document.getElementById('modal').classList.contains('oculto')) abrirLogin(location.hash);
    return;
  }
  const menu = menuDe(A.nombre);
  if (!menu.grupos.length && A.suite) return pintarSinAcceso(A);
  const item = menu.grupos.flatMap(g => g.items).find(i => i.slug === it);
  pintarApartado(A, menu, item);
  scrollTo(0, 0);
}

/* ============ PINTAR ============ */

function pintarHeader() {
  const bell = document.getElementById('bell');
  bell.classList.toggle('oculto', !estado.perfil);
  document.getElementById('divBell').classList.toggle('oculto', !estado.perfil);

  const p = document.getElementById('perfil');
  if (!estado.userId) {
    p.innerHTML = `<button onclick="abrirLogin()">${ic('user')}<span>Ingresar</span></button>`;
    return;
  }
  const nombre = estado.perfil ? (estado.perfil.nombre || estado.perfil.usuario) : estado.pendiente;
  const rol = estado.perfil ? (NOMBRE_ROL[estado.perfil.rol] || estado.perfil.rol) : 'Pendiente de alta';
  p.innerHTML = `<button onclick="toggleMenuPerfil(event)">${ic('user')}<span>Mi perfil</span>${ic('chev', 'chev')}</button>
    <div class="menuPerfil" id="menuPerfil">
      <div class="quien"><b>${esc(nombre)}</b><small>${esc(rol)}</small></div>
      <button onclick="logout()">Salir</button>
    </div>`;
}

function crumbs(partes) {
  return `<nav class="crumbs">${partes.map((p, i) => i === partes.length - 1
    ? `<span class="act">${esc(p[0])}</span>`
    : `<a href="${p[1]}">${esc(p[0])}</a><span class="sep">/</span>`).join('')}</nav>`;
}

function fila({ icono, titulo, sub, href, pill, pillCls = '', onclick }) {
  const tag = href || onclick ? 'a' : 'div';
  const attrs = href ? `href="${href}"` : onclick ? `href="javascript:void 0" onclick="${onclick}"` : '';
  return `<${tag} class="row" ${attrs}>${ic(icono)}<span class="barra"></span>
    <span class="tx"><b>${esc(titulo)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span>
    ${pill ? `<span class="pill ${pillCls}">${esc(pill)}</span>` : ''}
    ${tag === 'a' ? `<span class="flecha">${ic('arrow')}</span>` : ''}</${tag}>`;
}

function pintarInicio() {
  const logueado = !!estado.perfil;
  const lado = (lista, titulo) => `<div class="grupo"><h4>${titulo}</h4>${lista.map(a => {
    const bloq = a.suite && !logueado;
    return `<a class="it" href="#/${slug(a.nombre)}">${ic(a.icono)}${esc(a.nombre)}${bloq ? `<span class="lk">${ic('lock')}</span>` : ''}</a>`;
  }).join('')}</div>`;
  const publicos = APARTADOS.filter(a => !a.suite), suites = APARTADOS.filter(a => a.suite);

  const pillSuite = a => {
    if (!logueado) return { pill: 'Ingresar', pillCls: '' };
    return menuDe(a.nombre).grupos.length ? { pill: 'Entrar', pillCls: 'verde' } : { pill: 'Sin acceso', pillCls: 'gris' };
  };

  document.getElementById('main').innerHTML = crumbs([['Inicio']]) + `
    <div class="layout">
      <aside class="side"><h1>Inicio</h1>
        <div class="grupo"><a class="it on" href="#/">${ic('home')}Resumen</a></div>
        ${lado(publicos, 'Herramientas')}${lado(suites, 'Suites')}
      </aside>
      <section class="content">
        <div class="cabecera"><div><h2>${logueado ? 'Hola, ' + esc((estado.perfil.nombre || estado.perfil.usuario).split(' ')[0]) : 'Bienvenido'}</h2>
          <p>Herramientas de CELLCOM en un solo lugar</p></div>
          ${!estado.userId ? `<button class="btnAcc" onclick="abrirLogin()">Ingresar</button>` : ''}
        </div>
        <h3>Herramientas</h3>
        <div class="lista">${publicos.map(a => fila({ icono: a.icono, titulo: a.nombre, sub: a.desc, href: '#/' + slug(a.nombre) })).join('')}</div>
        <h3>Suites</h3>
        <div class="lista">${suites.map(a => fila({ icono: a.icono, titulo: a.nombre, sub: a.desc, href: '#/' + slug(a.nombre), ...pillSuite(a) })).join('')}</div>
      </section>
    </div>`;
}

function pintarApartado(A, menu, item) {
  const base = '#/' + slug(A.nombre);
  const side = `<aside class="side"><h1>${esc(A.nombre)}</h1>${menu.grupos.map((g, gi) => `
    <div class="grupo"><h4>${esc(g.nombre)}</h4>
      ${gi === 0 ? `<a class="it ${item ? '' : 'on'}" href="${base}">${ic('home')}Resumen</a>` : ''}
      ${g.items.map(i => `<a class="it ${item === i ? 'on' : ''}" href="${base}/${i.slug}">${ic(i.icono)}${esc(i.nombre)}</a>`).join('')}
    </div>`).join('')}</aside>`;

  let contenido;
  if (!item) {
    // RESUMEN: botón verde + cada grupo como lista de tarjetas
    const b = menu.boton;
    const boton = b ? (b.url
      ? `<a class="btnAcc" href="${escAttr(b.url)}" target="_blank" rel="noopener">${esc(b.subseccion)}</a>`
      : `<button class="btnAcc off" title="Próximamente">${esc(b.subseccion)}</button>`) : '';
    contenido = `<div class="cabecera"><h2>Resumen</h2>${boton}</div>` +
      menu.grupos.map(g => `<h3>${esc(g.nombre)}</h3><div class="lista">${g.items.map(i => fila({
        icono: i.icono, titulo: i.nombre, sub: i.desc, href: `${base}/${i.slug}`,
        ...(i.url ? {} : { pill: 'Próximamente', pillCls: 'gris' })
      })).join('')}</div>`).join('');
  } else if (item.url) {
    // HERRAMIENTA: se abre adentro de la suite
    contenido = `<div class="cabecera"><div><h2>${esc(item.nombre)}</h2><p>${esc(item.desc)}</p></div></div>
      <a class="externo" href="${escAttr(item.url)}" target="_blank" rel="noopener">Abrir en pestaña nueva ${ic('external')}</a>
      <div class="frame"><iframe src="${escAttr(item.url)}" loading="lazy" allow="clipboard-write; camera"></iframe></div>`;
  } else {
    contenido = `<div class="cabecera"><div><h2>${esc(item.nombre)}</h2><p>${esc(item.desc)}</p></div></div>
      <div class="vacio"><b>Próximamente</b>Este módulo todavía no está conectado.</div>`;
  }

  const partes = [['Inicio', '#/'], [A.nombre, base]];
  if (item) partes.push([item.nombre]); else partes[1] = [A.nombre];
  document.getElementById('main').innerHTML = crumbs(partes) +
    `<div class="layout">${side}<section class="content">${contenido}</section></div>`;
}

function pintarBloqueado(A) {
  const msg = estado.pendiente
    ? `<b>Tu usuario todavía no tiene acceso</b>Pedile a un administrador que te asigne un rol.`
    : `<b>${esc(A.nombre)} pide usuario</b>Ingresá con tu usuario y contraseña para ver esta suite.
       <br><button class="btnAcc" onclick="abrirLogin('${escAttrJs(location.hash)}')">Ingresar</button>`;
  pintarSoloMensaje(A, msg);
}
function pintarSinAcceso(A) {
  pintarSoloMensaje(A, `<b>Sin acceso</b>Tu usuario no tiene permiso para ver ${esc(A.nombre)}.`);
}
function pintarSoloMensaje(A, html) {
  document.getElementById('main').innerHTML = crumbs([['Inicio', '#/'], [A.nombre]]) +
    `<div class="layout"><aside class="side"><h1>${esc(A.nombre)}</h1>
      <div class="grupo"><a class="it" href="#/">${ic('home')}Volver al inicio</a></div></aside>
     <section class="content"><div class="cabecera"><h2>${esc(A.nombre)}</h2></div><div class="vacio">${html}</div></section></div>`;
}

/* ============ NOTIFICACIONES ============ */

function pintarNotif() {
  const nuevas = estado.notif.some(n => !n.leida);
  document.getElementById('bell').innerHTML = ic('bell') + (nuevas ? '<span class="dot"></span>' : '');
  document.getElementById('panel').innerHTML = estado.notif.length
    ? estado.notif.map(n => `<div class="n ${n.leida ? '' : 'nueva'}" onclick="abrirNotif(${n.id})">
        <b>${esc(n.titulo)}</b>${n.mensaje ? `<p>${esc(n.mensaje)}</p>` : ''}
        <small>${new Date(n.creado_en).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</small></div>`).join('')
    : '<div class="nada">Sin notificaciones</div>';
}
function togglePanel() { document.getElementById('panel').classList.toggle('show'); }
function toggleMenuPerfil(e) { e.stopPropagation(); document.getElementById('menuPerfil').classList.toggle('show'); }

async function abrirNotif(id) {
  const n = estado.notif.find(x => x.id === id);
  if (!n.leida) {
    n.leida = true; pintarNotif();
    await sb.from('notificaciones_leidas').insert({ notificacion_id: id });
  }
  if (n.link) window.open(n.link, '_blank', 'noopener');
}

document.addEventListener('click', e => {
  if (!e.target.closest('#panel') && !e.target.closest('.bell')) document.getElementById('panel').classList.remove('show');
  if (!e.target.closest('.perfil')) document.getElementById('menuPerfil')?.classList.remove('show');
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarLogin(); });

/* ============ UTILIDADES ============ */

function slug(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function escAttr(u) { return /^https?:\/\/|^\.?\//.test(u) ? esc(u) : '#'; }
function escAttrJs(s) { return esc(String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")); }
