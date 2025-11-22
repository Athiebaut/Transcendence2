export default function Play(): string {
  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden bg-slate-950 text-slate-100">
      <!-- Halos de lumière / ambiance -->
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
            Choix du mode
          </span>
          <span class="text-slate-400">
            Sélectionne comment tu veux honker tes adversaires
          </span>
        </div>
      </header>

      <!-- CONTENU -->
      <main class="relative z-10 flex-1 px-4 sm:px-6 pb-10 pt-6">
        <div class="max-w-5xl mx-auto space-y-8">
          <section class="text-center space-y-3">
            <h1 class="text-2xl sm:text-3xl font-bold">
              Choisis ton mode de jeu
            </h1>
            <p class="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              Que tu veuilles une partie chill entre oies ou grimper le classement
              jusqu'à la pleine lune, commence par choisir l'ambiance de ton terrain.
            </p>
          </section>

          <!-- Cartes de modes -->
          <section class="grid gap-5 sm:grid-cols-2">
            <!-- Mode rapide -->
            <a
              href="/pong?mode=quick"
              data-nav
              class="glass-panel card-shadow group relative flex flex-col gap-3 p-5 sm:p-6 border border-emerald-500/30 hover:border-emerald-300/70 hover:bg-emerald-500/5 transition-colors"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-amber-300 flex items-center justify-center shadow-lg"
                  >
                    <span class="text-xl">⚡</span>
                  </div>
                  <div class="text-left">
                    <h2 class="font-semibold text-lg">Partie rapide</h2>
                    <p class="text-xs text-slate-400">
                      Lancer et jouer en quelques secondes.
                    </p>
                  </div>
                </div>
                <span class="text-[0.65rem] uppercase tracking-[0.2em] text-emerald-300">
                  Recommandé
                </span>
              </div>

              <p class="text-sm text-slate-200 mt-1">
                Un duel classique entre deux oies, sans pression. Idéal pour
                s'échauffer le bec et les réflexes.
              </p>

              <p class="mt-2 text-[0.7rem] text-slate-400">
                Règles : premier à 10 points • terrain normal • pas de bonus.
              </p>

              <span
                class="mt-3 inline-flex items-center gap-1 text-[0.75rem] text-emerald-300 group-hover:translate-x-0.5 transition-transform"
              >
                Lancer ce mode
                <span>→</span>
              </span>
            </a>

            <!-- Mode classé -->
            <a
              href="/pong?mode=ranked"
              data-nav
              class="glass-panel card-shadow group relative flex flex-col gap-3 p-5 sm:p-6 border border-amber-500/30 hover:border-amber-300/70 hover:bg-amber-500/5 transition-colors"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-rose-400 flex items-center justify-center shadow-lg"
                  >
                    <span class="text-xl">🏅</span>
                  </div>
                  <div class="text-left">
                    <h2 class="font-semibold text-lg">Partie classée</h2>
                    <p class="text-xs text-slate-400">
                      Chaque honk compte pour ton rang.
                    </p>
                  </div>
                </div>
                <span class="text-[0.65rem] uppercase tracking-[0.2em] text-amber-300">
                  Compétitif
                </span>
              </div>

              <p class="text-sm text-slate-200 mt-1">
                Mode sérieux : ta performance impacte ton classement dans le
                village. Viens prouver que tu es l'oie la plus bruyante.
              </p>

              <p class="mt-2 text-[0.7rem] text-slate-400">
                Règles : matchmaking par niveau • impact sur le ladder • stats détaillées.
              </p>

              <span
                class="mt-3 inline-flex items-center gap-1 text-[0.75rem] text-amber-300 group-hover:translate-x-0.5 transition-transform"
              >
                Lancer ce mode
                <span>→</span>
              </span>
            </a>

            <!-- Mode privé -->
            <a
              href="/pong?mode=private"
              data-nav
              class="glass-panel card-shadow group relative flex flex-col gap-3 p-5 sm:p-6 border border-sky-500/30 hover:border-sky-300/70 hover:bg-sky-500/5 transition-colors"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-violet-300 flex items-center justify-center shadow-lg"
                  >
                    <span class="text-xl">🤝</span>
                  </div>
                  <div class="text-left">
                    <h2 class="font-semibold text-lg">Partie privée</h2>
                    <p class="text-xs text-slate-400">
                      Invites tes amis dans ton étang.
                    </p>
                  </div>
                </div>
                <span class="text-[0.65rem] uppercase tracking-[0.2em] text-sky-300">
                  Social
                </span>
              </div>

              <p class="text-sm text-slate-200 mt-1">
                Crée un lobby et partage un code de village pour honker seulement
                avec les gens que tu connais.
              </p>

              <p class="mt-2 text-[0.7rem] text-slate-400">
                Règles : pas d'impact sur le classement • parfait pour les soirées LAN.
              </p>

              <span
                class="mt-3 inline-flex items-center gap-1 text-[0.75rem] text-sky-300 group-hover:translate-x-0.5 transition-transform"
              >
                Créer / rejoindre un lobby
                <span>→</span>
              </span>
            </a>

            <!-- Mode chaos -->
            <a
              href="/pong?mode=chaos"
              data-nav
              class="glass-panel card-shadow group relative flex flex-col gap-3 p-5 sm:p-6 border border-rose-500/30 hover:border-rose-300/70 hover:bg-rose-500/5 transition-colors"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-fuchsia-400 flex items-center justify-center shadow-lg"
                  >
                    <span class="text-xl">🌀</span>
                  </div>
                  <div class="text-left">
                    <h2 class="font-semibold text-lg">Mode chaos</h2>
                    <p class="text-xs text-slate-400">
                      L'oie a trouvé les réglages avancés.
                    </p>
                  </div>
                </div>
                <span class="text-[0.65rem] uppercase tracking-[0.2em] text-rose-300">
                  Fun
                </span>
              </div>

              <p class="text-sm text-slate-200 mt-1">
                Bonus aléatoires, balles qui accélèrent, raquettes qui tremblent :
                ce mode est fait pour les oies qui n'ont peur de rien.
              </p>

              <p class="mt-2 text-[0.7rem] text-slate-400">
                Règles : paramètres expérimentaux • fou rire garanti.
              </p>

              <span
                class="mt-3 inline-flex items-center gap-1 text-[0.75rem] text-rose-300 group-hover:translate-x-0.5 transition-transform"
              >
                Lancer ce mode
                <span>→</span>
              </span>
            </a>
          </section>

          <p class="text-[0.7rem] text-slate-500 text-center mt-2">
            Certains modes peuvent encore être en cours de construction dans la grange du village.
            Si rien ne se passe, c'est que l'oie n'a pas encore fini de câbler les fils.
          </p>
        </div>
      </main>
    </div>
  `;
}
