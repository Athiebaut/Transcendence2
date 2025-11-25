export default function Register(): string {
  return `
    <div class="min-h-screen flex flex-col relative overflow-hidden">
      <!-- Fond ambiance village / halos de lumière -->
      <div class="absolute inset-0 pointer-events-none">
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

      <div class="relative z-10 w-full max-w-5xl mx-auto px-4 py-10">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          
          <!-- Colonne gauche : texte d'intro -->
          <div class="space-y-6">
            <p
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs sm:text-[0.7rem] font-medium bg-black/40 border border-white/10 backdrop-blur"
            >
              <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/60">
                <span class="text-[0.7rem]">✨</span>
              </span>
              <span class="text-slate-100">
                Rejoins le village d'oies en ligne.
              </span>
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

            <div class="space-y-3 text-sm">
              <p class="font-semibold text-slate-100 flex items-center gap-2">
                <span class="text-lg">🎮</span>
                <span>Ce que tu débloques en rejoignant le village :</span>
              </p>

              <ul class="space-y-2 text-sm text-slate-200/80">
                <li class="flex items-start gap-2">
                  <span class="mt-0.5">🏅</span>
                  <span>Un profil d'oie unique avec ton pseudo et ton apparence.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-0.5">🏆</span>
                  <span>Un classement global pour montrer qui honk le plus fort.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-0.5">🎨</span>
                  <span>Des cosmétiques à débloquer au fil des parties gagnées.</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Colonne droite : card d'inscription -->
          <div class="relative">
            <div
              class="relative bg-slate-950/85 border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden"
            >
              <!-- Liserés lumineux -->
              <div class="pointer-events-none absolute inset-0">
                <div class="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/15 blur-3xl"></div>
                <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-500/15 blur-3xl"></div>
              </div>

              <div class="relative p-6 sm:p-8 space-y-6">
                <div class="space-y-2 text-center sm:text-left">
                  <h2 class="text-xl sm:text-2xl font-semibold tracking-tight">
                    Inscription au village
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-300">
                    Crée ton compte pour rejoindre les oies en ligne.
                  </p>
                </div>

                <!-- Formulaire -->
                <form class="space-y-4">
                  <div class="space-y-1">
                    <label
                      for="pseudo"
                      class="block text-xs font-medium text-slate-200/90 tracking-wide"
                    >
                      Pseudo d'oie
                    </label>
                    <input
                      id="pseudo"
                      type="text"
                      name="pseudo"
                      autocomplete="nickname"
                      class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-400/80"
                      placeholder="HonkMaster3000"
                      required
                    />
                  </div>

                  <div class="space-y-1">
                    <label
                      for="email"
                      class="block text-xs font-medium text-slate-200/90 tracking-wide"
                    >
                      Adresse e-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      autocomplete="email"
                      class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-400/80"
                      placeholder="toi@village-honk.gg"
                      required
                    />
                  </div>

                  <div class="space-y-1">
                    <label
                      for="password"
                      class="block text-xs font-medium text-slate-200/90 tracking-wide"
                    >
                      Mot de passe
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      autocomplete="new-password"
                      class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-400/80"
                      placeholder="Un mot de passe bien solide"
                      required
                    />
                  </div>

                  <div class="space-y-1">
                    <label
                      for="password_confirm"
                      class="block text-xs font-medium text-slate-200/90 tracking-wide"
                    >
                      Confirmation du mot de passe
                    </label>
                    <input
                      id="password_confirm"
                      type="password"
                      name="password_confirm"
                      autocomplete="new-password"
                      class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-400/80"
                      placeholder="Répète ton mot de passe"
                      required
                    />
                  </div>

                  <div class="flex items-start gap-2 text-[0.7rem] text-slate-400">
                    <input
                      id="tos"
                      type="checkbox"
                      class="mt-0.5 h-3 w-3 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/60"
                      required
                    />
                    <label for="tos" class="cursor-pointer select-none">
                      J'accepte que mon oie apparaisse en public dans le village, et que son honk soit entendu de tous.
                    </label>
                  </div>

                  <button
                    type="submit"
                    class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 text-slate-950 text-sm font-semibold py-2.5 mt-2 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/25"
                  >
                    <span>Créer mon compte</span>
                    <span>🦢</span>
                  </button>
                </form>

                <!-- Séparateur -->
                <div class="flex items-center gap-3 text-[0.7rem] text-slate-500">
                  <div class="h-px flex-1 bg-slate-800"></div>
                  <span>ou</span>
                  <div class="h-px flex-1 bg-slate-800"></div>
                </div>

                <!-- Bouton Google -->
                <button
                  type="button"
                  class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900/70 border border-slate-700/80 text-xs sm:text-sm text-slate-100 py-2.5 hover:bg-slate-800 transition-colors"
                >
                  <span class="text-lg">🪙</span>
                  <span>Continuer avec Google</span>
                </button>

                <!-- Lien vers login -->
                <div class="text-center text-[0.75rem] text-slate-400">
                  <span>Tu as déjà une oie enregistrée ?</span>
                  <a
                    href="/login"
                    data-nav
                    class="font-medium text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline ml-1"
                  >
                    Connecte-toi
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
      </div>
    </div>
  `;
}

