
// 1) Choix FIX du domaine
const API = 'https://api.127.0.0.1.nip.io:8443';

// 2) Bouton Google → href dynamique
const g = document.getElementById('btn-google') as HTMLAnchorElement | null;
if (g) g.href = API + '/auth/google?next=%2F';

// 3) Ping simple (sans headers/credentials) pour éviter un preflight
async function ping() {
  const out = document.querySelector('#api-status') as HTMLElement;
  try {
    const r = await fetch(API + '/health');
    out.textContent = r.ok ? 'UP' : `DOWN (${r.status})`;
    out.style.color = r.ok ? '#22d3ee' : '#f43f5e';
  } catch {
    out.textContent = 'DOWN';
    out.style.color = '#f43f5e';
  }
}
ping();

// Register
(document.querySelector('#form-register') as HTMLFormElement).addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.currentTarget as HTMLFormElement & {
    email: HTMLInputElement; username: HTMLInputElement; password: HTMLInputElement;
  };
  const payload = {
    email: f.email.value.trim(),
    username: f.username.value.trim(),
    password: f.password.value,
  };
  const r = await req('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  set(document.querySelector('#out-register') as HTMLElement, r.data || r.status);
});

// Login
(document.querySelector('#form-login') as HTMLFormElement).addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.currentTarget as HTMLFormElement & {
    emailOrUsername: HTMLInputElement; password: HTMLInputElement;
  };
  const payload = { emailOrUsername: f.emailOrUsername.value.trim(), password: f.password.value };
  const r = await req('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
  set(document.querySelector('#out-login') as HTMLElement, r.data || r.status);
});

// /auth/me
(document.querySelector('#btn-me') as HTMLButtonElement).addEventListener('click', async () => {
  const r = await req('/auth/me');
  set(document.querySelector('#out-me') as HTMLElement, r.data || r.status);
});

// logout
(document.querySelector('#btn-logout') as HTMLButtonElement).addEventListener('click', async () => {
  const r = await req('/auth/logout', { method: 'POST' });
  set(document.querySelector('#out-me') as HTMLElement, r.status === 204 ? 'Logged out' : r.data || r.status);
});
