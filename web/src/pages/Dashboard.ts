// web/src/pages/Dashboard.ts

export default function Dashboard(): string {
  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden bg-slate-950 text-slate-100">
      <!-- Halo de lumière / ambiance -->
      <div class="pointer-events-none absolute inset-0 opacity-60">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      <!-- HEADER du dashboard -->
      <header class="z-20 px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <a href="/" data-nav class="flex items-center gap-2">
          <span class="text-2xl">🦢</span>
          <span class="font-semibold tracking-tight">Honk Village</span>
        </a>

        <nav class="flex items-center gap-3 text-xs sm:text-sm">
          <a href="/pong" data-nav class="px-3 py-1.5 rounded-full border border-white/10 bg-black/30 hover:bg-white/5 transition-colors">
            🎮 Jouer au Pong
          </a>
          <a href="/dashboard" data-nav class="hidden sm:inline text-emerald-300 font-semibold">
            Dashboard
          </a>
          <a href="/login" data-nav class="hidden sm:inline text-slate-300 hover:text-white transition-colors">
            Se déconnecter
          </a>
        </nav>
      </header>

      <!-- CONTENU PRINCIPAL -->
      <main class="relative z-10 flex-1 px-4 sm:px-6 pb-10 pt-6">
        <div class="max-w-6xl mx-auto space-y-8">
          <!-- Ligne 1 : profil + stats rapides -->
          <section class="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)] items-start">
            <!-- Carte profil / résumé -->
            <article class="glass-panel card-shadow p-5 sm:p-6 space-y-4">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-300 to-rose-400 flex items-center justify-center text-3xl shadow-lg">
                    🦢
                  </div>
                  <div>
                    <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Profil</p>
                    <h1 class="text-xl sm:text-2xl font-semibold" id="dashboard-username">
                      HonkMaster
                    </h1>
                    <p class="text-xs text-slate-400 mt-1">
                      Rang actuel : <span class="text-emerald-300 font-medium" id="dashboard-rank">Oie d'élite</span>
                    </p>
                  </div>
                </div>

                <div class="hidden sm:flex flex-col items-end text-xs text-slate-400">
                  <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    En ligne
                  </span>
                  <span class="mt-2">
                    Dernière partie : <span id="dashboard-last-match">il y a 2 h</span>
                  </span>
                </div>
              </div>

              <!-- Boutons d'actions rapides -->
              <div class="flex flex-wrap gap-3 mt-2">
                <a
                  href="/pong"
                  data-nav
                  class="wood-sign-btn text-sm sm:text-base px-6 py-3"
                >
                  🎮 Lancer une partie classée
                </a>
                <button
                  type="button"
                  class="px-4 py-2 rounded-full border border-slate-600 bg-black/40 text-xs sm:text-sm hover:bg-white/5 transition-colors"
                >
                  🤝 Créer un lobby privé
                </button>
                <button
                  type="button"
                  class="px-4 py-2 rounded-full border border-slate-700 bg-black/30 text-xs sm:text-sm hover:bg-white/5 transition-colors"
                >
                  ⚙️ Paramètres du profil
                </button>
              </div>
            </article>

            <!-- Carte stats rapides -->
            <article class="glass-panel card-shadow p-5 sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Statistiques</p>
                  <h2 class="text-lg sm:text-xl font-semibold">Résumé de tes performances</h2>
                </div>
                <span class="text-xs text-slate-500">7 derniers jours</span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                <div class="glass-panel border border-slate-700/70 p-3 rounded-xl">
                  <p class="text-slate-400 text-[0.7rem] uppercase tracking-wide mb-1">Parties jouées</p>
                  <p class="text-xl font-semibold" id="stat-games-played">24</p>
                  <p class="text-[0.7rem] text-emerald-300 mt-1">+8 vs semaine dernière</p>
                </div>
                <div class="glass-panel border border-slate-700/70 p-3 rounded-xl">
                  <p class="text-slate-400 text-[0.7rem] uppercase tracking-wide mb-1">Taux de victoire</p>
                  <p class="text-xl font-semibold" id="stat-winrate">63%</p>
                  <p class="text-[0.7rem] text-emerald-300 mt-1">Série : 3 victoires</p>
                </div>
                <div class="glass-panel border border-slate-700/70 p-3 rounded-xl">
                  <p class="text-slate-400 text-[0.7rem] uppercase tracking-wide mb-1">Buts moyens</p>
                  <p class="text-xl font-semibold" id="stat-goals">7.4</p>
                  <p class="text-[0.7rem] text-slate-400 mt-1">par partie</p>
                </div>
                <div class="glass-panel border border-slate-700/70 p-3 rounded-xl">
                  <p class="text-slate-400 text-[0.7rem] uppercase tracking-wide mb-1">Temps de jeu</p>
                  <p class="text-xl font-semibold" id="stat-playtime">3 h 18</p>
                  <p class="text-[0.7rem] text-slate-400 mt-1">cette semaine</p>
                </div>
              </div>
            </article>
          </section>

          <!-- Ligne 2 : matchs récents + amis / villages -->
          <section class="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)] items-start">
            <!-- Matchs récents -->
            <article class="glass-panel card-shadow p-5 sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Historique</p>
                  <h2 class="text-lg sm:text-xl font-semibold">Matchs récents</h2>
                </div>
                <button
                  type="button"
                  class="text-[0.7rem] sm:text-xs text-slate-400 hover:text-slate-200 underline-offset-2 hover:underline"
                >
                  Voir tout l'historique
                </button>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-xs sm:text-sm">
                  <thead class="text-slate-400 uppercase text-[0.65rem] tracking-wide bg-slate-900/70">
                    <tr>
                      <th class="px-3 py-2 text-left">Adversaire</th>
                      <th class="px-3 py-2 text-center">Score</th>
                      <th class="px-3 py-2 text-center">Mode</th>
                      <th class="px-3 py-2 text-right">Résultat</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800">
                    <tr>
                      <td class="px-3 py-2">
                        <div class="flex items-center gap-2">
                          <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/80 text-slate-950 text-[0.65rem] font-bold">
                            GV
                          </span>
                          <span>GooseValkyrie</span>
                        </div>
                      </td>
                      <td class="px-3 py-2 text-center">10 - 7</td>
                      <td class="px-3 py-2 text-center text-slate-400">Classée</td>
                      <td class="px-3 py-2 text-right">
                        <span class="inline-flex items-center px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[0.7rem]">
                          Victoire
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td class="px-3 py-2">
                        <div class="flex items-center gap-2">
                          <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/80 text-slate-950 text-[0.65rem] font-bold">
                            LG
                          </span>
                          <span>LittleGoose</span>
                        </div>
                      </td>
                      <td class="px-3 py-2 text-center">8 - 10</td>
                      <td class="px-3 py-2 text-center text-slate-400">Amicale</td>
                      <td class="px-3 py-2 text-right">
                        <span class="inline-flex items-center px-2 py-1 rounded-full bg-rose-500/15 text-rose-300 text-[0.7rem]">
                          Défaite
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td class="px-3 py-2">
                        <div class="flex items-center gap-2">
                          <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/80 text-slate-950 text-[0.65rem] font-bold">
                            OB
                          </span>
                          <span>OieBourrue</span>
                        </div>
                      </td>
                      <td class="px-3 py-2 text-center">9 - 9</td>
                      <td class="px-3 py-2 text-center text-slate-400">Chaos</td>
                      <td class="px-3 py-2 text-right">
                        <span class="inline-flex items-center px-2 py-1 rounded-full bg-slate-500/20 text-slate-200 text-[0.7rem]">
                          Égalité
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td class="px-3 py-2">
                        <div class="flex items-center gap-2">
                          <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-500/80 text-slate-950 text-[0.65rem] font-bold">
                            NM
                          </span>
                          <span>NoisyMallard</span>
                        </div>
                      </td>
                      <td class="px-3 py-2 text-center">10 - 4</td>
                      <td class="px-3 py-2 text-center text-slate-400">Classée</td>
                      <td class="px-3 py-2 text-right">
                        <span class="inline-flex items-center px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[0.7rem]">
                          Victoire
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            <!-- Amis connectés / villages -->
            <article class="glass-panel card-shadow p-5 sm:p-6 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Village</p>
                  <h2 class="text-lg sm:text-xl font-semibold">Amis & parties en cours</h2>
                </div>
                <span class="text-xs text-slate-500">En temps (presque) réel</span>
              </div>

              <!-- Liste amis -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/80 text-slate-950 text-xs font-bold">
                      GV
                    </span>
                    <div class="text-xs sm:text-sm">
                      <p class="font-medium">GooseValkyrie</p>
                      <p class="text-slate-400 text-[0.7rem]">En partie classée • Village #248</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/10 text-[0.7rem] sm:text-xs text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                  >
                    Rejoindre
                  </button>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/80 text-slate-950 text-xs font-bold">
                      LG
                    </span>
                    <div class="text-xs sm:text-sm">
                      <p class="font-medium">LittleGoose</p>
                      <p class="text-slate-400 text-[0.7rem]">Dans le lobby • Attente adversaire</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded-full border border-slate-600 bg-black/40 text-[0.7rem] sm:text-xs hover:bg-white/5 transition-colors"
                  >
                    Inviter
                  </button>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/80 text-slate-950 text-xs font-bold">
                      OB
                    </span>
                    <div class="text-xs sm:text-sm">
                      <p class="font-medium">OieBourrue</p>
                      <p class="text-slate-400 text-[0.7rem]">Hors ligne • Dernière connexion il y a 3 h</p>
                    </div>
                  </div>
                  <span class="text-[0.7rem] sm:text-xs text-slate-500">Zzz…</span>
                </div>
              </div>

              <!-- Petit message -->
              <p class="text-[0.7rem] text-slate-500 mt-4">
                Les infos affichées ici sont des exemples. Plus tard, cette carte pourra être alimentée avec les vraies données de ton backend (amis, parties en cours, invitations, etc.).
              </p>
            </article>
          </section>
        </div>
      </main>
    </div>
  `;
}
