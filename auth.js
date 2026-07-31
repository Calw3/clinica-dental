/* ══════════════════════════════════════════════════════════════
   auth.js — Módulo de autenticación con Supabase
   Clínica Dental Universitaria Anáhuac Xalapa · 2026
   ══════════════════════════════════════════════════════════════
   
   USO:
   1. Incluir este archivo en TODAS las páginas del sistema
      (excepto login.html):
      <script src="auth.js"></script>
   
   2. Al final del <script> de cada página, llamar:
      initAuth().then(user => { ... arrancar módulo ... });
   
   3. Roles disponibles: coordinador, administrador, maestro, servicio_social, alumno
   
   ══════════════════════════════════════════════════════════════ */

// ─── CONFIGURACIÓN DE SUPABASE ───────────────────────────────
// Reemplaza estos valores con los de tu proyecto:
// Dashboard de Supabase → Settings → API
const SUPABASE_URL  = 'https://mkatcueeyxgetschqplm.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rYXRjdWVleXhnZXRzY2hxcGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjUyNTgsImV4cCI6MjEwMDQwMTI1OH0.YQgp2pYMKHyv21GpYLaO3u8VXOuPWMqWuUaYbgzcXwY';

// ─── CLIENTE SUPABASE (vía CDN, cargado en cada HTML) ────────
// Se espera que el HTML cargue el CDN antes de este archivo:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
let sbClient;

function getSupabase() {
  if (!sbClient) {
    sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  }
  return sbClient;
}

// ─── FUNCIONES PRINCIPALES ───────────────────────────────────

/**
 * Iniciar sesión con correo y contraseña.
 * @returns {object} { user, session } o lanza error
 */
async function loginWithEmail(email, password) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Registrar cuenta nueva con correo y contraseña.
 * Después de registrarse, el usuario debe confirmar su correo
 * (Supabase envía un email automáticamente).
 * @returns {object} { user, session }
 */
async function signUpWithEmail(email, password, metadata = {}) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: metadata }  // nombre, etc.
  });
  if (error) throw error;
  return data;
}

/**
 * Cerrar sesión.
 */
async function logout() {
  const sb = getSupabase();
  await sb.auth.signOut();
  window.location.href = 'login.html';
}

/**
 * Obtener la sesión actual (null si no hay).
 */
async function getSession() {
  const sb = getSupabase();
  const { data: { session } } = await sb.auth.getSession();
  return session;
}

/**
 * Obtener el perfil del usuario actual desde la tabla `profiles`.
 * Incluye: id, email, nombre, rol, created_at
 */
async function getProfile(userId) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Obtener el rol del usuario actual.
 * @returns {string} 'coordinador' | 'maestro' | 'alumno'
 */
async function getUserRole(userId) {
  const profile = await getProfile(userId);
  return profile?.rol || 'alumno';
}

/**
 * Enviar correo de restablecimiento de contraseña.
 * El enlace del correo redirige a reset-password.html
 */
async function sendPasswordReset(email) {
  const sb = getSupabase();
  const redirectTo = window.location.origin +
    window.location.pathname.replace(/[^/]*$/, '') + 'reset-password.html';
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}

/**
 * Actualizar la contraseña del usuario actual (usado en reset-password.html
 * después de que Supabase valida el enlace de recuperación).
 */
async function updatePassword(newPassword) {
  const sb = getSupabase();
  const { error } = await sb.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

// ─── GUARD: proteger páginas ─────────────────────────────────

/**
 * Llamar al inicio de cada página protegida.
 * Si no hay sesión, redirige a login.html.
 * Si hay sesión, devuelve { user, profile }.
 * 
 * @param {string[]} [allowedRoles] — roles permitidos (vacío = todos)
 * @returns {{ user, profile }}
 */
async function initAuth(allowedRoles = []) {
  const session = await getSession();

  if (!session) {
    window.location.href = 'login.html';
    return;
  }

  const user = session.user;
  let profile;

  try {
    profile = await getProfile(user.id);
  } catch (e) {
    // Si no tiene perfil aún, crear uno básico
    profile = { id: user.id, email: user.email, rol: 'alumno', nombre: '' };
  }

  // Verificar rol si se especificaron roles permitidos
  if (allowedRoles.length > 0 && !allowedRoles.includes(profile.rol)) {
    alert('No tienes permisos para acceder a este módulo.');
    window.location.href = 'index.html';
    return;
  }

  // Inyectar barra de usuario si existe el contenedor
  renderUserBar(profile);

  return { user, profile };
}

// ─── UI: barra de usuario ────────────────────────────────────

/**
 * Muestra el nombre del usuario y botón de cerrar sesión
 * en el header de cada página. Busca un elemento con
 * id="auth-bar" o lo inyecta al final del <header>.
 */
function renderUserBar(profile) {
  let bar = document.getElementById('auth-bar');
  
  if (!bar) {
    // Intentar inyectar dentro del header existente
    const header = document.querySelector('header');
    if (!header) return;
    
    bar = document.createElement('div');
    bar.id = 'auth-bar';
    header.appendChild(bar);
  }

  const rolBadge = {
    coordinador:     { bg: 'var(--teal-50, #FDEEE2)',  color: 'var(--teal-800, #8C3F09)',  label: 'Coordinador' },
    administrador:   { bg: 'var(--red-50, #FCEBEB)',   color: 'var(--red-600, #A32D2D)',   label: 'Administración' },
    maestro:         { bg: 'var(--blue-50, #E6F1FB)',   color: 'var(--blue-800, #0C447C)',  label: 'Maestro' },
    servicio_social: { bg: 'var(--amber-50, #FAEEDA)',  color: 'var(--amber-600, #854F0B)', label: 'Servicio Social' },
    alumno:          { bg: 'var(--green-50, #EAF3DE)',  color: 'var(--green-800, #27500A)', label: 'Alumno' },
  };

  const r = rolBadge[profile.rol] || rolBadge.alumno;
  const nombre = profile.nombre || profile.email;

  bar.style.cssText = `
    display:flex; align-items:center; gap:10px; margin-left:auto;
    font-size:13px; color:var(--text-secondary, #5F5E5A);
  `;

  bar.innerHTML = `
    <span style="
      font-size:11px; font-weight:700; padding:3px 8px; border-radius:6px;
      background:${r.bg}; color:${r.color}; text-transform:uppercase; letter-spacing:.03em;
    ">${r.label}</span>
    <span style="font-weight:500;">${nombre}</span>
    <button onclick="logout()" style="
      background:none; border:1px solid var(--border, #E3E1D8); border-radius:6px;
      padding:4px 10px; font-size:12px; cursor:pointer; color:var(--text-secondary, #5F5E5A);
      font-family:inherit;
    ">Cerrar sesión</button>
  `;
}

// ─── UTILIDADES DE ROL ───────────────────────────────────────

/**
 * Ocultar elementos según el rol.
 * Uso: en el HTML, agregar data-role="coordinador" o 
 *      data-role="coordinador,maestro" a cualquier elemento.
 * Los elementos cuyo rol no coincida se ocultan.
 */
function applyRoleVisibility(userRole) {
  document.querySelectorAll('[data-role]').forEach(el => {
    const allowed = el.dataset.role.split(',').map(r => r.trim());
    if (!allowed.includes(userRole)) {
      el.style.display = 'none';
    }
  });
}

/**
 * Llamar después de cualquier render dinámico (renderLista, etc.)
 * para ocultar de nuevo los elementos [data-role] recién insertados
 * al DOM, ya que innerHTML los vuelve a mostrar por defecto.
 */
function refreshRoleVisibility() {
  if (window.currentUserRole) {
    applyRoleVisibility(window.currentUserRole);
  }
}

// ─── AUTO-GUARD: protección automática al cargar ─────────────
// Si este script se carga en cualquier página que NO sea login.html,
// verifica la sesión. Si no hay sesión, redirige a login.html.
// Así no necesitas modificar el <script> de cada módulo.

(async function autoGuard() {
  // No proteger login.html ni reset-password.html (evita loop de redirección)
  if (window.location.pathname.endsWith('login.html')) return;
  if (window.location.pathname.endsWith('reset-password.html')) return;

  // Ocultar la página hasta confirmar autenticación (evita flash)
  document.documentElement.style.visibility = 'hidden';

  try {
    const session = await getSession();

    if (!session) {
      window.location.href = 'login.html';
      return;
    }

    // Sesión válida: mostrar la página
    document.documentElement.style.visibility = 'visible';

    // Cargar perfil y mostrar barra de usuario + roles
    try {
      const profile = await getProfile(session.user.id);
      window.currentUserRole = profile.rol;
      // Esperar a que el DOM esté listo para inyectar la barra
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          renderUserBar(profile);
          applyRoleVisibility(profile.rol);
        });
      } else {
        renderUserBar(profile);
        applyRoleVisibility(profile.rol);
      }
    } catch (e) {
      // Sin perfil aún — mostrar como alumno
      const fallback = { email: session.user.email, rol: 'alumno', nombre: '' };
      window.currentUserRole = fallback.rol;
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          renderUserBar(fallback);
          applyRoleVisibility(fallback.rol);
        });
      } else {
        renderUserBar(fallback);
        applyRoleVisibility(fallback.rol);
      }
    }

  } catch (e) {
    // Error de red / Supabase — redirigir a login por seguridad
    window.location.href = 'login.html';
  }
})();

