import { createTournament, saveTournament } from './TournamentLogic';
import { getConnectedUserName } from '../ui/displayPlayerNames';
import { showFirstMatchScreen } from './MatchEnd';

export function renderTournamentSetup(): string {
  return `
    <div id="tournament-setup" class="absolute inset-0 z-50 flex items-center justify-center bg-slate-950">
      <div class="max-w-lg w-full mx-4 space-y-6 my-auto">
        
        <div class="text-center space-y-2">
          <h1 class="text-3xl font-bold text-white">🏆 Inscription Tournoi</h1>
          <p class="text-slate-400 text-sm">Entrez l'alias de chaque joueur</p>
        </div>
        
        <div class="glass-panel card-shadow p-6 space-y-5">
          
          <div>
            <label class="block text-sm font-medium mb-2 text-slate-300">Nombre de joueurs</label>
            <select id="player-count" class="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-amber-500 focus:outline-none">
              <option value="4" selected>4 joueurs</option>
              <option value="8">8 joueurs</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-3 text-slate-300">Alias des joueurs</label>
            <div id="alias-inputs" class="space-y-3"></div>
          </div>
          
          <div id="error-message" class="hidden text-red-400 text-sm text-center"></div>
          
          <button id="start-tournament-btn" class="wood-sign-btn w-full py-3 font-semibold">
            🎮 Commencer le tournoi
          </button>
          
        </div>
        
        <div class="text-center">
          <a href="/play" data-nav class="text-slate-500 hover:text-white text-sm">
            ← Retour aux modes de jeu
          </a>
        </div>
        
      </div>
    </div>
  `;
}

export function initTournamentSetup(onStart: (aliases: string[]) => void): void {
  const container = document.getElementById('alias-inputs');
  const countSelect = document.getElementById('player-count') as HTMLSelectElement;
  const startBtn = document.getElementById('start-tournament-btn');
  const errorMsg = document.getElementById('error-message');

  // Générer les inputs
function generateInputs(count: number): void {
    if (!container) return;
    
    container.innerHTML = '';
    
    // Vérifier si un utilisateur est connecté
    const connectedUser = getConnectedUserName(); // fonction a faire
    let startIndex = 0;
    
    // Joueur 1 connecté : afficher son nom
    if (connectedUser) {
        container.innerHTML += `
            <div class="w-full px-4 py-2 rounded-lg bg-slate-800 border border-emerald-500/50 text-emerald-400 flex items-center gap-2">
                <span>👤</span>
                <span>${connectedUser}</span>
                <span class="text-xs text-slate-500 ml-auto">(connecté)</span>
                <input type="hidden" id="alias-0" value="${connectedUser}" />
            </div>
        `;
        startIndex = 1;
    }
    
    // Autres joueurs : inputs
    for (let i = startIndex; i < count; i++) {
        container.innerHTML += `
            <input type="text" id="alias-${i}" placeholder="Joueur ${i + 1}" maxlength="15"
                class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none" />
        `;
    }
}

  // Valider et démarrer
  function validateAndStart(): void {
    const count = parseInt(countSelect?.value || '4');
    const aliases: string[] = [];

    for (let i = 0; i < count; i++) {
      const input = document.getElementById(`alias-${i}`) as HTMLInputElement;
      const alias = input?.value.trim();
      
      if (!alias) {
        showError(`Le joueur ${i + 1} doit avoir un alias`);
        return;
      }
      
      if (aliases.includes(alias)) {
        showError(`L'alias "${alias}" est déjà utilisé`);
        return;
      }
      
      aliases.push(alias);
    }

    const tournament = createTournament(aliases);
    saveTournament(tournament);

    // Tout est valide, on démarre
    hideSetup();
    showFirstMatchScreen(() => {
      onStart(aliases);
    });
  }

  function showError(message: string): void {
    if (errorMsg) {
      errorMsg.textContent = message;
      errorMsg.classList.remove('hidden');
    }
  }

  function hideSetup(): void {
    const setup = document.getElementById('tournament-setup');
    if (setup) setup.remove();
  }

  countSelect?.addEventListener('change', () => {
    generateInputs(parseInt(countSelect.value));
    if (errorMsg) errorMsg.classList.add('hidden');
  });

  startBtn?.addEventListener('click', validateAndStart);

  generateInputs(4);
}