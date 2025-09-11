// Router minimal SPA (sans framework)
const routes: Record<string, () => HTMLElement> = {
  '/': Home,
  '/tournament': Tournament,
  '/game': Game,
};

function Home() {
  const el = document.createElement('section');
  el.innerHTML = `<h1>Transcendence</h1><p>Bienvenue. Test API: <code id="ping">pending...</code></p>`;
  fetch('https://transcendence.localhost/health')
    .then(r => r.json())
    .then(d => { el.querySelector('#ping')!.textContent = JSON.stringify(d); })
    .catch(() => { el.querySelector('#ping')!.textContent = 'offline'; });
  return el;
}

function Tournament() {
  const el = document.createElement('section');
  el.innerHTML = `<h2>Tournament</h2><p>Alias registration & matchmaking à venir.</p>`;
  return el;
}

function Game() {
  const el = document.createElement('section');
  el.innerHTML = `<h2>Pong</h2><canvas id="pong" width="640" height="360"></canvas>`;
  // Placeholder: on branchera la logique du jeu ensuite
  const ctx = (el.querySelector('#pong') as HTMLCanvasElement).getContext('2d')!;
  ctx.fillRect(310, 170, 20, 20);
  return el;
}

function render() {
  const hash = location.hash.replace('#', '') || '/';
  const view = document.getElementById('view')!;
  view.innerHTML = '';
  view.appendChild((routes[hash] || Home)());
}

window.addEventListener('hashchange', render);
render();