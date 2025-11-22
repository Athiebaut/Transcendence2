export default function Register(): string {
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
          
          <!-- Colonne gauche : texte “marketing” façon Wolfy -->
          <div class="space-y-6">
            <p
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.7rem] font-medium bg-black/40 border border-white/10 backdrop-blur"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Rejoins le village d'oies en ligne
            </p>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Crée ton compte
              <span class="block text-glow mt-1">
                et viens honker sur le Pong du village
              </span>
            </h1>

            <p class="text-sm sm:text-base text-slate-200/80 max-w-xl">
              Un seul compte pour tout : parties classées, classement, cosmétiques,
              et bien sûr les bêtises de l'oie qui vole ton curseur quand tu t'y attends le moins.
            </p>

            <ul class="space-y-2 text-sm text-slate-200/80">
              <li class="flex items-start gap-2">
                <span class="mt-0.5">🎮</span>
                <span>Affronte d'autres joueuses et joueurs en temps réel sur un Pong revisité.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-0.5">📈</span>
                <span>Progresse dans le classement du village et débloque des récompenses.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-0.5">🦢</span>
                <span>Personnalise ton oie avec des chapeaux, accessoires et effets de balle.</span>
              </li>
            </ul>
          </div>

          <!-- Colonne droite : panneau d'inscription façon carte Wolfy -->
          <div class="cabin-panel glass-panel card-shadow w-full p-6 sm:p-7 space-y-6">
            <!-- Onglets “Connexion / Inscription” -->
            <div class="flex items-center justify-between mb-2 text-xs text-slate-300/80">
              <span>Bienvenue au village</span>
              <span class="text-slate-500">Étape 1 : créer un compte</span>
            </div>

            <div class="flex text-xs sm:text-sm rounded-full bg-slate-950/70 border border-slate-800 overflow-hidden">
              <a
                href="/login"
                data-nav
                class="flex-1 px-4 py-2 text-center hover:bg-slate-900/80 transition-colors"
              >
                Se connecter
              </a>
              <div
                class="flex-1 px-4 py-2 text-center bg-emerald-500/90 text-slate-950 font-semibold"
              >
                S'inscrire
              </div>
            </div>

            <!-- Bouton Google -->
            <button
              type="button"
              id="google-register-btn"
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

            <!-- Formulaire d'inscription -->
            <form id="register-form" class="space-y-5">
              <div class="space-y-1 text-sm">
                <label for="username" class="flex items-center gap-2 text-slate-100">
                  <span>🪪</span>
                  <span>Pseudo</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autocomplete="username"
                  required
                  class="w-full px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  placeholder="Petit_Honk_42"
                />
              </div>

              <div class="space-y-1 text-sm">
                <label for="email" class="flex items-center gap-2 text-slate-100">
                  <span>📧</span>
                  <span>Adresse e-mail</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="w-full px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  placeholder="toi@village-des-oies.fr"
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
                  autocomplete="new-password"
                  required
                  class="w-full px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  placeholder="••••••••"
                />
              </div>

              <div class="space-y-1 text-sm">
                <label for="password-confirm" class="flex items-center gap-2 text-slate-100">
                  <span>✅</span>
                  <span>Confirme ton mot de passe</span>
                </label>
                <input
                  id="password-confirm"
                  name="passwordConfirm"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="w-full px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                class="wood-sign-btn w-full py-3 mt-2 text-sm sm:text-base font-semibold"
              >
                ✨ Créer mon compte
              </button>

              <p class="text-[0.7rem] text-slate-400 leading-snug">
                En créant un compte, tu acceptes que l'oie vienne parfois
                voler ton curseur au pire moment possible. C'est le jeu.
              </p>
            </form>

            <!-- Lien vers la connexion -->
            <div class="text-center text-xs sm:text-sm text-slate-300">
              <span>Déjà un compte ?</span>
              <a
                href="/login"
                data-nav
                class="text-emerald-300 hover:text-emerald-200 font-semibold ml-1"
              >
                Se connecter
              </a>
            </div>

            <!-- Petit message fun -->
            <div class="text-center">
              <p class="text-[0.7rem] text-slate-500 italic">
                🦢 L'oie vérifie que tu n'es pas un renard déguisé.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
