// web/src/pages/Login.ts

export default function Login(): string {
  return `
    <div class="min-h-screen flex items-center justify-center relative overflow-hidden">
      <!-- Fond ambiance village / halos de lumière -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-32 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 w-full max-w-5xl mx-auto px-4 py-10">
        <!-- Bouton Home en haut à gauche -->
        <div class="mb-6">
          <a
            href="/"
            data-nav
            class="inline-flex items-center gap-2 text-slate-200 hover:text-white transition-colors text-sm"
          >
            <span class="text-lg">🦢</span>
            <span class="font-semibold tracking-tight">Retour au village</span>
          </a>
        </div>

        <div class="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          
          <!-- Colonne gauche : texte “accroche connexion” -->
          <div class="space-y-6">
            <p
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.7rem] font-medium bg-black/40 border border-white/10 backdrop-blur"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Retourne au village
            </p>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Content de te revoir
              <span class="block text-glow mt-1">
                les oies t'ont laissé quelques balles à renvoyer
              </span>
            </h1>

            <p class="text-sm sm:text-base text-slate-200/80 max-w-xl">
              Reprends ta place dans le classement, retrouve ton oie personnalisée
              et vois qui a osé te dépasser pendant ton absence.
            </p>

            <ul class="space-y-2 text-sm text-slate-200/80">
              <li class="flex items-start gap-2">
                <span class="mt-0.5">📊</span>
                <span>Consulte ton historique de parties et ta progression.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-0.5">💬</span>
                <span>Rejoins tes amis directement dans les villages en cours.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-0.5">🦢</span>
                <span>Montre à tout le monde que ton honk résonne encore plus fort qu'avant.</span>
              </li>
            </ul>
          </div>

          <!-- Colonne droite : panneau de connexion -->
          <div class="cabin-panel glass-panel card-shadow w-full p-6 sm:p-7 space-y-6">
            <!-- Onglets “Connexion / Inscription” -->
            <div class="flex items-center justify-between mb-2 text-xs text-slate-300/80">
              <span>Connexion au village</span>
              <span class="text-slate-500">Rattrape le temps perdu</span>
            </div>

            <div class="flex text-xs sm:text-sm rounded-full bg-slate-950/70 border border-slate-800 overflow-hidden">
              <div
                class="flex-1 px-4 py-2 text-center bg-emerald-500/90 text-slate-950 font-semibold"
              >
                Se connecter
              </div>
              <a
                href="/register"
                data-nav
                class="flex-1 px-4 py-2 text-center hover:bg-slate-900/80 transition-colors"
              >
                S'inscrire
              </a>
            </div>

            <!-- Bouton Google -->
            <button
              type="button"
              id="google-login-btn"
              onclick="window.location.href='/api/auth/google';"
              class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-600 bg-slate-950/60 hover:bg-slate-900/80 transition-colors text-sm font-medium text-slate-100"
            >
              <span
                class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-[0.65rem] font-bold text-slate-900"
              >
                G
              </span>
              <span>Continuer avec Google</span>
            </button>

            <!-- Séparateur -->
            <div class="flex items-center gap-3 text-[0.7rem] text-slate-500">
              <div class="flex-1 h-px bg-slate-700/70"></div>
              <span>ou</span>
              <div class="flex-1 h-px bg-slate-700/70"></div>
            </div>

            <!-- Formulaire de connexion -->
            <form id="login-form" class="space-y-5">
              <div class="space-y-1 text-sm">
                <label for="identifier" class="flex items-center gap-2 text-slate-100">
                  <span>🪪</span>
                  <span>Pseudo ou e-mail</span>
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autocomplete="username"
                  required
                  class="w-full px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  placeholder="Petit_Honk_42 ou toi@village-des-oies.fr"
                />
              </div>

              <div class="space-y-1 text-sm">
                <label for="password" class="flex items-center gap-2 text-slate-100">
                  <span>🔒</span>
                  <span>Mot de passe</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="w-full px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                class="wood-sign-btn w-full py-3 mt-2 text-sm sm:text-base font-semibold"
              >
                🔑 Se connecter
              </button>

              <p class="text-[0.7rem] text-slate-400 leading-snug">
                Si tu as oublié ton mot de passe, demande à l'oie…
                ou à l'admin du village. L'oie est moins fiable.
              </p>
            </form>

            <!-- Lien vers l'inscription -->
            <div class="text-center text-xs sm:text-sm text-slate-300">
              <span>Pas encore de compte ?</span>
              <a
                href="/register"
                data-nav
                class="text-emerald-300 hover:text-emerald-200 font-semibold ml-1"
              >
                S'inscrire
              </a>
            </div>

            <!-- Petit message fun -->
            <div class="text-center">
              <p class="text-[0.7rem] text-slate-500 italic">
                🦢 L'oie surveille les tentatives de connexion suspectes (mais elle se laisse soudoyer avec du pain).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
