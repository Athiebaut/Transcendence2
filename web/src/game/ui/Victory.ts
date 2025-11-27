import type { GameMode } from '../config/gameModeConfig';
import { getPlayerName } from './displayPlayerNames';



/**
 * Génère le HTML de l'écran de victoire
 */
export function renderVictoryScreen(winner: number, score: { player1: number; player2: number }, mode: GameMode): string {
    const winnerName = getPlayerName(winner, mode);
    const player1Name = getPlayerName(1, mode);
    const player2Name = getPlayerName(2, mode);
    const winnerColor = winner === 1 ? "text-emerald-400" : "text-sky-400";
    
    // Texte spécifique au mode
    const modeText = mode === 'pvp2v2' ? "L'équipe" : "";
    
    return `
        <div id="victory-screen" class="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
            <div class="text-center space-y-6 p-8">
                
                <!-- Trophée animé -->
                <div class="text-6xl sm:text-8xl animate-bounce">🏆</div>
                
                <!-- Message de victoire -->
                <div class="space-y-2">
                    <h1 class="text-2xl sm:text-4xl font-bold text-white">Victoire !</h1>
                    <p class="text-xl sm:text-2xl ${winnerColor} font-semibold">
                        ${modeText} ${winnerName} a gagné
                    </p>
                </div>
                
                <!-- Score final -->
                <div class="glass-panel card-shadow inline-block px-8 py-4">
                    <p class="text-sm text-slate-400 uppercase tracking-wide mb-2">Score final</p>
                    <div class="flex items-center justify-center gap-6">
                        <div class="text-center">
                            <p class="text-xs text-slate-400 mb-1">${player1Name}</p>
                            <span class="text-3xl sm:text-4xl font-bold text-emerald-400">${score.player1}</span>
                        </div>
                        <span class="text-2xl text-slate-500">-</span>
                        <div class="text-center">
                            <p class="text-xs text-slate-400 mb-1">${player2Name}</p>
                            <span class="text-3xl sm:text-4xl font-bold text-sky-400">${score.player2}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Boutons -->
                <div class="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <button id="play-again-btn" class="wood-sign-btn px-6 py-3 font-semibold">
                        🔄 Rejouer
                    </button>
                    <a href="/play" data-nav class="px-6 py-3 border border-slate-600 bg-black/40 text-white hover:bg-white/10 transition-colors text-center">
                        🚪 Retour aux modes
                    </a>
                </div>
                
            </div>
        </div>
    `;
}

/**
 * Affiche l'écran de victoire
 */
export function showVictoryScreen(winner: number, score: { player1: number; player2: number }, mode: GameMode, onPlayAgain: () => void): void {
    const container = document.getElementById('pong-container');
    if (!container) return;
    
    container.insertAdjacentHTML('beforeend', renderVictoryScreen(winner, score, mode));
    
    document.getElementById('play-again-btn')?.addEventListener('click', () => {
        hideVictoryScreen();
        onPlayAgain();
    });
}

/**
 * Cache l'écran de victoire
 */
export function hideVictoryScreen(): void {
    document.getElementById('victory-screen')?.remove();
}