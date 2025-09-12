// web/main.ts
var API = "https://transcendence.localhost:8443";
async function req(path, opts = {}) {
  const res = await fetch(API + path, {
    credentials: "include",
    headers: { "content-type": "application/json", ...opts.headers || {} },
    ...opts
  });
  const txt = await res.text();
  let data;
  try {
    data = txt ? JSON.parse(txt) : null;
  } catch {
    data = txt;
  }
  return { ok: res.ok, status: res.status, data };
}
function set(el, value) {
  el.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
}
(async () => {
  const out = document.querySelector("#api-status");
  try {
    const r = await req("/health");
    out.textContent = r.ok ? "UP" : `DOWN (${r.status})`;
    out.style.color = r.ok ? "#22d3ee" : "#f43f5e";
  } catch {
    out.textContent = "DOWN";
    out.style.color = "#f43f5e";
  }
})();
document.querySelector("#form-register").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  const payload = {
    email: f.email.value.trim(),
    username: f.username.value.trim(),
    password: f.password.value
  };
  const r = await req("/auth/register", { method: "POST", body: JSON.stringify(payload) });
  set(document.querySelector("#out-register"), r.data || r.status);
});
document.querySelector("#form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  const payload = { emailOrUsername: f.emailOrUsername.value.trim(), password: f.password.value };
  const r = await req("/auth/login", { method: "POST", body: JSON.stringify(payload) });
  set(document.querySelector("#out-login"), r.data || r.status);
});
document.querySelector("#btn-me").addEventListener("click", async () => {
  const r = await req("/auth/me");
  set(document.querySelector("#out-me"), r.data || r.status);
});
document.querySelector("#btn-logout").addEventListener("click", async () => {
  const r = await req("/auth/logout", { method: "POST" });
  set(document.querySelector("#out-me"), r.status === 204 ? "Logged out" : r.data || r.status);
});
