const API = 'https://transcendence.localhost:8443';

// Helper fetch JSON avec cookies
async function req<T = unknown>(path: string, opts: RequestInit = {}) {
  const res = await fetch(API + path, {
    credentials: 'include',
    headers: { 'content-type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  const txt = await res.text();
  let data: any;
  try { data = txt ? JSON.parse(txt) : null; } catch { data = txt; }
  return { ok: res.ok, status: res.status, data: data as T };
}

function set(el: HTMLElement, value: unknown) {
  el.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
}

// Ping API
(async () => {
  const out = document.querySelector('#api-status') as HTMLElement;
  try {
    const r = await req('/health');
    out.textContent = r.ok ? 'UP' : `DOWN (${r.status})`;
    (out as HTMLElement).style.color = r.ok ? '#22d3ee' : '#f43f5e';
  } catch { out.textContent = 'DOWN'; (out as HTMLElement).style.color = '#f43f5e'; }
})();

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
