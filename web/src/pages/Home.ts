export default function Home(): string {
  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden">
      <!-- Halo de lumière / ambiance -->
      <div class="pointer-events-none absolute inset-0 opacity-60">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      <!-- HEADER : logo + navigation (équivalent barre du haut Wolfy) -->
      <header class="z-20 px-6 py-4 flex items-center justify-between">
        <a href="/" data-nav class="flex items-center gap-2">
          <span class="text-2xl">🦢</span>
          <span class="font-semibold tracking-tight">Honk Village</span>
        </a>

        <nav class="flex items-center gap-4 text-sm">
          <a href="#roles" class="hover:text-white/80 transition-colors">Rôles</a>
          <a href="#ladder" class="hover:text-white/80 transition-colors">Classement</a>
          <a href="#customize" class="hover:text-white/80 transition-colors">Personnalisation</a>

          <div class="hidden sm:flex items-center gap-2 ml-4">
            <a
              href="/login"
              data-nav
              class="px-4 py-2 rounded-full border border-white/20 bg-black/30 text-xs font-medium hover:bg-white/10 transition-colors"
            >
              Se connecter
            </a>
            <a
              href="/register"
              data-nav
              class="wood-sign-btn text-sm px-5 py-2"
            >
              ✨ S'inscrire
            </a>
          </div>
        </nav>
      </header>

      <!-- MAIN -->
      <main class="flex-1 flex flex-col gap-24 px-6 pb-20 pt-4">

        <!-- SECTION HERO : gros titre + CTA + “mise en scène” à droite -->
        <section
          class="max-w-6xl mx-auto grid gap-10 items-center lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] mt-4"
        >
          <!-- Texte principal -->
          <div class="space-y-6 max-w-xl">
            <p
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.65rem] sm:text-xs font-medium bg-black/40 border border-white/10 backdrop-blur"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Etang toujours éveillé
            </p>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              ft_nique_ta_mere,
              <span class="block text-glow mt-1">
                LE Pong social au milieu d'un village d'oies
              </span>
            </h1>

            <p class="text-base sm:text-lg text-slate-200/80">
              Défends ton terrain, honke sur tes adversaires et grimpe le
              classement sans jamais quitter le village. Chaque partie est
              l'occasion de faire honker quelqu'un de nouveau.
            </p>

            <div class="flex flex-wrap gap-3">
              <a
                href="/play"
                data-nav
                class="wood-sign-btn px-6 py-3 text-base font-semibold"
              >
                🎮 Jouer maintenant
              </a>
            </div>

            <!-- Mini stats comme sur Wolfy : rôles / joueurs / parties -->
            <dl class="grid grid-cols-3 gap-4 text-[0.7rem] sm:text-xs text-slate-300/80">
              <div>
                <dt class="font-semibold text-white">8 rôles</dt>
                <dd class="text-slate-400">duo, solo, chaos</dd>
              </div>
              <div>
                <dt class="font-semibold text-white">Parties rapides</dt>
                <dd class="text-slate-400">moins de 5 min</dd>
              </div>
              <div>
                <dt class="font-semibold text-white">Village vivant</dt>
                <dd class="text-slate-400">chat & emotes oies</dd>
              </div>
            </dl>
          </div>

          <!-- Carte de “partie” à droite, comme la scène de Wolfy -->
          <div class="relative h-72 sm:h-80 lg:h-96">
            <div
              class="glass-panel card-shadow absolute inset-0 flex flex-col justify-between p-5"
            >
              <div class="flex items-center justify-between text-xs text-slate-300">
                <span class="inline-flex items-center gap-1">
                  <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Partie classée
                </span>
                <span class="text-slate-400">Village #248</span>
              </div>

              <ul class="mt-4 space-y-3 text-sm">
                <li class="flex items-start gap-2">
                  <span class="mt-0.5">🦢</span>
                  <p>
                    <span class="font-medium">HonkMaster</span>
                    a volé le curseur de
                    <span class="text-amber-300">@Noob42</span>.
                  </p>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-0.5">🎯</span>
                  <p>
                    <span class="font-medium">GooseBot</span>
                    vient de marquer un
                    <span class="text-emerald-300 font-semibold">but parfait</span>.
                  </p>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-0.5">💬</span>
                  <p>
                    <span class="font-medium">Villageoise_42</span>
                    : “Je jure que c'est l'oie qui a bougé ma raquette !”
                  </p>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-0.5">❌</span>
                  <p>
                    <span class="font-medium text-rose-300">Noob42</span>
                    s'est fait expulser du terrain…
                  </p>
                </li>
              </ul>

              <button
                class="mt-5 self-end px-4 py-2 rounded-full bg-emerald-500/90 text-slate-950 font-semibold text-xs sm:text-sm hover:bg-emerald-400 transition-colors"
              >
                Rejouer une partie
              </button>
            </div>
          </div>
        </section>

        <!-- SECTION RÔLES (équivalent “Play one of the roles”) -->
        <section id="roles" class="max-w-5xl mx-auto">
          <div class="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 class="text-2xl sm:text-3xl font-bold">
                Joue un des rôles du village
              </h2>
              <p class="text-slate-300/80 text-sm sm:text-base">
                Chaque partie te donne un rôle différent pour perturber le Pong
                classique : protège ton camp, trahis tes amis ou fais honker
                tout le serveur.
              </p>
            </div>
            <span
              class="text-[0.6rem] sm:text-xs uppercase tracking-[0.25em] text-slate-500 hidden sm:inline"
            >
              RÔLES
            </span>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article class="glass-panel border border-white/5 p-4 flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="text-xl">🛡️</span>
                <h3 class="font-semibold text-lg">Gardienne de l'Étang</h3>
              </div>
              <p class="text-sm text-slate-300/90">
                Défends ton côté de la rivière. Plus tu bloques de balles,
                plus ton équipe gagne de “plumes d'honneur”.
              </p>
              <p class="text-xs text-emerald-300/90 mt-auto">
                Rôle défensif • idéal débutant
              </p>
            </article>

            <article class="glass-panel border border-white/5 p-4 flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="text-xl">🎯</span>
                <h3 class="font-semibold text-lg">Sniper des Joncs</h3>
              </div>
              <p class="text-sm text-slate-300/90">
                Charge un tir précis qui accélère la balle de façon
                imprévisible. À utiliser au bon moment pour faire paniquer
                le village.
              </p>
              <p class="text-xs text-amber-300/90 mt-auto">
                Rôle offensif • coups décisifs
              </p>
            </article>

            <article class="glass-panel border border-white/5 p-4 flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="text-xl">🌀</span>
                <h3 class="font-semibold text-lg">Oie Chaotique</h3>
              </div>
              <p class="text-sm text-slate-300/90">
                Inverse les contrôles, fait trembler les raquettes et sème
                le doute dans les esprits. Personne ne sait vraiment pour qui
                tu joues.
              </p>
              <p class="text-xs text-rose-300/90 mt-auto">
                Rôle chaos • idéal trolls bienveillants
              </p>
            </article>

            <article class="glass-panel border border-white/5 p-4 flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="text-xl">📡</span>
                <h3 class="font-semibold text-lg">Observatrice de la Mare</h3>
              </div>
              <p class="text-sm text-slate-300/90">
                Vois les statistiques de tout le monde : précision, vitesse,
                temps de réaction. Utilise-les pour dénoncer les imposteurs.
              </p>
              <p class="text-xs text-sky-300/90 mt-auto">
                Rôle information • méta-joueuse
              </p>
            </article>

            <article class="glass-panel border border-white/5 p-4 flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="text-xl">💣</span>
                <h3 class="font-semibold text-lg">Poseuse d'Oeufs Piégés</h3>
              </div>
              <p class="text-sm text-slate-300/90">
                Fais apparaître des “oeufs” sur le terrain : certains
                ralentissent, d'autres explosent la vitesse de la balle.
              </p>
              <p class="text-xs text-violet-300/90 mt-auto">
                Rôle contrôle de zone
              </p>
            </article>

            <article class="glass-panel border border-white/5 p-4 flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="text-xl">👑</span>
                <h3 class="font-semibold text-lg">Reine du Ponton</h3>
              </div>
              <p class="text-sm text-slate-300/90">
                Si tu quittes la partie en tête, tout ton groupe gagne un
                bonus de classement. La pression est sur toi.
              </p>
              <p class="text-xs text-fuchsia-300/90 mt-auto">
                Rôle leader • haute pression
              </p>
            </article>
          </div>
        </section>

        <!-- SECTION CLASSEMENT (équivalent “Progress in the ranking”) -->
        <section id="ladder" class="max-w-5xl mx-auto">
          <div class="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 class="text-2xl sm:text-3xl font-bold">
                Progresse dans le classement
              </h2>
              <p class="text-slate-300/80 text-sm sm:text-base">
                Montre que tu es l'oie la plus bruyante du village avant la
                prochaine pleine lune. Gagne des plumes, grimpe de ligue et
                débloque des cosmétiques.
              </p>
            </div>
          </div>

          <div class="glass-panel card-shadow overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead
                  class="text-slate-400 uppercase text-[0.65rem] tracking-wide bg-white/5"
                >
                  <tr>
                    <th class="px-4 py-3 text-left">Rang</th>
                    <th class="px-4 py-3 text-left">Joueuse</th>
                    <th class="px-4 py-3 text-right">Plumes</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5 text-slate-200">
                  <tr>
                    <td class="px-4 py-3">1</td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                        <span
                          class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/80 text-slate-950 text-xs font-bold"
                        >
                          HM
                        </span>
                        <span>HonkMaster</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-right text-amber-300 font-semibold">
                      1245
                    </td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3">2</td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                        <span
                          class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/80 text-slate-950 text-xs font-bold"
                        >
                          GV
                        </span>
                        <span>GooseValkyrie</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-right text-amber-200 font-semibold">
                      1139
                    </td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3">3</td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                        <span
                          class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/80 text-slate-950 text-xs font-bold"
                        >
                          LG
                        </span>
                        <span>LittleGoose</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-right text-amber-200 font-semibold">
                      997
                    </td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3">4</td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                        <span
                          class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/80 text-slate-950 text-xs font-bold"
                        >
                          OB
                        </span>
                        <span>OieBourrue</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-right text-amber-100 font-semibold">
                      836
                    </td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3">5</td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                        <span
                          class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/80 text-slate-950 text-xs font-bold"
                        >
                          NM
                        </span>
                        <span>NoisyMallard</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-right text-amber-100 font-semibold">
                      824
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- SECTION PERSONNALISATION (équivalent “Customize your avatar”) -->
        <section
          id="customize"
          class="max-w-5xl mx-auto grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] items-center"
        >
          <div class="space-y-4">
            <h2 class="text-2xl sm:text-3xl font-bold">
              Personnalise ton oie au fil des parties
            </h2>
            <p class="text-slate-300/80 text-sm sm:text-base">
              Gagne des plumes, des chapeaux ridicules et des effets de
              traînée pour ta raquette. Plus tu joues, plus ton oie devient
              reconnaissable au premier honk.
            </p>

            <ul class="space-y-2 text-sm text-slate-300/90">
              <li class="flex items-start gap-2">
                <span class="mt-0.5">🎩</span>
                <span>Skins d'oies : chapeaux, lunettes, bouées et plus encore.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-0.5">🌈</span>
                <span>Effets de balle : traînées colorées, fumée, éclats de plumes.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-0.5">📜</span>
                <span>Bannières de profil : affiche ton meilleur score ou ton mood du jour.</span>
              </li>
            </ul>

            <p class="text-xs text-slate-400">
              Tout est cosmétique : le skill ne s'achète pas, il se gagne sur le ponton.
            </p>
          </div>

          <div class="relative h-64 sm:h-72">
            <div
              class="glass-panel card-shadow absolute inset-0 p-4 flex flex-col gap-3"
            >
              <div class="flex items-center justify-between text-xs text-slate-300">
                <span>Vestiaire du village</span>
                <span class="text-slate-500">Profil de HonkMaster</span>
              </div>

              <div class="flex-1 grid grid-cols-[auto,1fr] gap-4 items-center">
                <div
                  class="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-rose-400 flex items-center justify-center text-3xl shadow-lg"
                >
                  🦢
                </div>
                <div class="space-y-2 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="font-semibold">HonkMaster</span>
                    <span class="text-amber-300 font-semibold">Niveau 24</span>
                  </div>
                  <div class="bg-white/5 rounded-full h-2 overflow-hidden">
                    <div class="h-full bg-emerald-400/90 w-3/4"></div>
                  </div>
                  <p class="text-slate-300/80">
                    “A déjà volé 12 curseurs et 248 balles.”
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-4 gap-2 text-[0.6rem] sm:text-xs">
                <div class="glass-panel border border-white/10 p-2 text-center">
                  <div class="text-lg mb-1">🎩</div>
                  <p>Chapeaux</p>
                  <p class="text-amber-200 mt-0.5">8/20</p>
                </div>
                <div class="glass-panel border border-white/10 p-2 text-center">
                  <div class="text-lg mb-1">🕶️</div>
                  <p>Accessoires</p>
                  <p class="text-amber-200 mt-0.5">5/15</p>
                </div>
                <div class="glass-panel border border-white/10 p-2 text-center">
                  <div class="text-lg mb-1">🌈</div>
                  <p>Effets</p>
                  <p class="text-amber-200 mt-0.5">6/18</p>
                </div>
                <div class="glass-panel border border-white/10 p-2 text-center">
                  <div class="text-lg mb-1">📜</div>
                  <p>Bannières</p>
                  <p class="text-amber-200 mt-0.5">3/10</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- FOOTER (équivalent footer Wolfy) -->
      <footer
        class="border-t border-white/10 mt-auto py-6 px-6 text-xs sm:text-sm text-slate-400 bg-black/40"
      >
        <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="text-lg">🦢</span>
            <span class="font-semibold">Honk Village</span>
            <span class="text-slate-600 hidden sm:inline">•</span>
            <span class="text-slate-500 hidden sm:inline">
              ft_transcendence — Projet 42
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <a
              href="/help"
              class="hover:text-slate-200 transition-colors"
            >
              Centre d'aide
            </a>
            <span class="text-slate-600">•</span>
            <span>© ${new Date().getFullYear()} — Toutes oies réservées</span>
          </div>
        </div>
      </footer>
    </div>
  `;
}
