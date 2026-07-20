/**
 * auth.js — Configuración MSAL para Clínica Dental Anáhuac
 * Edita CLIENT_ID y TENANT_ID con los valores de tu registro en Azure.
 */

const AZURE_CLIENT_ID = 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'; // App (client) ID
const AZURE_TENANT_ID = 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'; // Directory (tenant) ID

const msalConfig = {
  auth: {
    clientId: AZURE_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/' + AZURE_TENANT_ID,
    redirectUri: window.location.origin + window.location.pathname,
    postLogoutRedirectUri: window.location.origin + '/control-clinica-dental.html',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
};

const loginRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read'],
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

/**
 * Intenta recuperar cuenta en caché; si no hay, lanza popup de login.
 * Devuelve { nombre, email, account }
 */
async function getOrLoginAccount() {
  await msalInstance.initialize();

  // Manejar redirect de vuelta si aplica
  try { await msalInstance.handleRedirectPromise(); } catch(e) {}

  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    const account = accounts[0];
    return {
      nombre: account.name || account.username,
      email:  account.username,
      account,
    };
  }

  // Sin sesión → popup de login
  try {
    const result = await msalInstance.loginPopup(loginRequest);
    return {
      nombre: result.account.name || result.account.username,
      email:  result.account.username,
      account: result.account,
    };
  } catch(e) {
    return null;
  }
}

/** Cierra sesión de Azure */
async function azureLogout(account) {
  await msalInstance.initialize();
  await msalInstance.logoutPopup({ account });
}

/**
 * Determina el rol del usuario comparando su email/nombre con
 * los registros de coordinadores y maestros en localStorage.
 * Roles: 'coordinador' | 'maestro' | 'alumno'
 */
function getRol(email, nombre) {
  const emailL  = (email  || '').toLowerCase().trim();
  const nombreL = (nombre || '').toLowerCase().trim();

  // Coordinadores (lista manual de emails)
  try {
    const coords = JSON.parse(localStorage.getItem('clinica_coordinadores_v1') || '[]');
    if (coords.some(c => c.email?.toLowerCase() === emailL || c.nombre?.toLowerCase() === nombreL))
      return 'coordinador';
  } catch(e) {}

  // Maestros
  try {
    const d = JSON.parse(localStorage.getItem('clinica_maestros_v1') || '{}');
    const maestros = d.maestros || [];
    if (maestros.some(m =>
      (m.email || '').toLowerCase() === emailL ||
      (m.nombre || '').toLowerCase() === nombreL
    )) return 'maestro';
  } catch(e) {}

  return 'alumno';
}
