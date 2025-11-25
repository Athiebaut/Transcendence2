export default function renderPong(): string {
  return `
  <div class="min-h-screen flex flex-col relative overflow-hidden text-slate-100">
      <!-- Halos de lumière / ambiance étang -->
      <div class="pointer-events-none absolute inset-0 opacity-60">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      <!-- HEADER -->
    <header
        class="relative z-10 px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 backdrop-blur"
      >
        <a
          href="/"
          data-nav
          class="inline-flex items-center gap-2 text-slate-200 hover:text-white transition-colors text-sm"
        >
          <span class="text-lg">🦢</span>
          <span class="font-semibold tracking-tight">Retour au village</span>
        </a>

        <div class="hidden sm:flex flex-col items-end text-xs">
          <span class="uppercase tracking-[0.25em] text-slate-500">
            Terrain de Pong
          </span>
          <span class="text-slate-400">
            Les oies se préparent à honker…
          </span>
        </div>
      </header>

      <!-- CONTENU PRINCIPAL -->
      <main class="relative z-10 flex-1 flex flex-col px-4 sm:px-6 pb-6 pt-4">
        <div class="max-w-6xl mx-auto flex-1 flex flex-col gap-4 lg:flex-row">
          <!-- Colonne gauche : Joueur 1 -->
          <aside
            id="player1-info"
            class="glass-panel card-shadow w-full lg:w-60 flex flex-col justify-between items-center p-4 sm:p-5 mb-3 lg:mb-0"
          >
            <div class="flex flex-col items-center gap-3">
              <div
                class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-400 to-amber-300 flex items-center justify-center shadow-lg"
              >
                <span class="text-2xl">🦢</span>
              </div>
              <div class="text-center">
                <h3 class="text-lg font-bold mb-1">Oie de gauche</h3>
                <p class="text-xs text-slate-400">
                  Gardienne de la rive gauche de l'étang
                </p>
              </div>
            </div>

            <div class="mt-4 w-full space-y-3">
              <div class="text-center">
                <p class="text-xs text-slate-400 uppercase tracking-wide">Score</p>
                <p
                  id="player1-score"
                  class="text-3xl font-extrabold text-emerald-300 drop-shadow"
                >
                  0
                </p>
              </div>

              <div class="text-center text-xs mt-3">
                <p class="text-slate-500 mb-1">Contrôles</p>
                <p class="text-slate-300">
                  <span class="inline-flex items-center justify-center px-2 py-1 rounded-md bg-black/40 border border-slate-700 mr-1">
                    Z
                  </span>
                  /
                  <span class="inline-flex items-center justify-center px-2 py-1 rounded-md bg-black/40 border border-slate-700 ml-1">
                    S
                  </span>
                </p>
                <p class="mt-2 text-[0.7rem] text-slate-500">
                  Fais remonter ou descendre ta petite oie-raquette.
                </p>
              </div>
            </div>
          </aside>

          <!-- Zone centrale : canvas du jeu -->
          <section
            class="flex-1 flex flex-col items-center justify-center gap-3 lg:gap-4"
          >
            <div
              class="glass-panel card-shadow w-full flex items-center justify-center aspect-[7/9] sm:aspect-[7/8] lg:aspect-[7/5] max-h-[80vh]"
            >
              <canvas
                id="gameCanvas"
                class="w-full h-full bg-slate-950/80 rounded-xl border border-emerald-400/40 shadow-inner"
                style="outline: none;"
              ></canvas>
            </div>

            <p
              id="game-status"
              class="text-xs sm:text-sm text-slate-300 mt-1"
              style="display: none;"
            >
              Loading Babylon.js game...
            </p>

            <div class="text-[0.7rem] sm:text-xs text-slate-500 text-center mt-1">
              <p>
                Conseil du village :
                <span class="text-slate-300">
                  ne regarde pas l'oie dans les yeux quand la balle va trop vite.
                </span>
              </p>
            </div>
          </section>

          <!-- Colonne droite : Joueur 2 -->
          <aside
            id="player2-info"
            class="glass-panel card-shadow w-full lg:w-60 flex flex-col justify-between items-center p-4 sm:p-5 mt-3 lg:mt-0"
          >
            <div class="flex flex-col items-center gap-3">
              <div
                class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-sky-400 to-violet-300 flex items-center justify-center shadow-lg"
              >
                <span class="text-2xl">🦢</span>
              </div>
              <div class="text-center">
                <h3 class="text-lg font-bold mb-1">Oie de droite</h3>
                <p class="text-xs text-slate-400">
                  Gardienne de la rive droite de l'étang
                </p>
              </div>
            </div>

            <div class="mt-4 w-full space-y-3">
              <div class="text-center">
                <p class="text-xs text-slate-400 uppercase tracking-wide">Score</p>
                <p
                  id="player2-score"
                  class="text-3xl font-extrabold text-sky-300 drop-shadow"
                >
                  0
                </p>
              </div>

              <div class="text-center text-xs mt-3">
                <p class="text-slate-500 mb-1">Contrôles</p>
                <p class="text-slate-300">
                  <span class="inline-flex items-center justify-center px-2 py-1 rounded-md bg-black/40 border border-slate-700 mr-1">
                    ↑
                  </span>
                  /
                  <span class="inline-flex items-center justify-center px-2 py-1 rounded-md bg-black/40 border border-slate-700 ml-1">
                    ↓
                  </span>
                </p>
                <p class="mt-2 text-[0.7rem] text-slate-500">
                  Essaie de ne pas tomber dans l'étang avec ta raquette.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  `;
}

export async function initPongGame() {
  try {
    const { initPongGame: init } = await import('../game/pongGame');

    const success = await init();

    // Mettre à jour le texte de statut
    const text = document.querySelector('#game-status') as HTMLElement;
    if (text) {
      if (success) {
        // Masquer le message quand ça fonctionne
        text.style.display = 'none';
      } else {
        // Afficher l'erreur quand ça ne fonctionne pas
        text.textContent = 'Error loading game';
        text.className = 'text-red-500 mt-4 text-sm';
        text.style.display = 'block';
      }
    }
  } catch (error) {
    console.error('Error loading Pong game:', error);

    const text = document.querySelector('#game-status') as HTMLElement;
    if (text) {
      text.textContent = 'Error loading game';
      text.className = 'text-red-500 mt-4 text-sm';
      text.style.display = 'block';
    }
  }
}

export async function disposePongGame() {
  try {
    const { disposePongGame } = await import('../game/pongGame');
    disposePongGame();
  } catch (error) {
    console.error('Error disposing Pong game:', error);
  }
}
