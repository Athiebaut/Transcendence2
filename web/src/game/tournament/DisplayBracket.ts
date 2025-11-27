import { loadTournament, type Tournament, type Match } from './TournamentLogic';

/**
 * Génère le HTML du bracket du tournoi
 */
export function renderBracket(tournament: Tournament, highlightMatchId?: number): string {
    const totalRounds = Math.log2(tournament.players.length);
    
    let html = `
        <div class="bracket-container overflow-x-auto">
            <div class="bracket flex gap-8 p-4 min-w-max">
    `;
    
    // Pour chaque round
    for (let round = 1; round <= totalRounds; round++) {
        const roundMatches = tournament.matches.filter(m => m.round === round);
        const roundName = getRoundNameByNumber(round, totalRounds);
        
        html += `
            <div class="round flex flex-col justify-around">
                <div class="text-xs text-slate-400 text-center mb-3 uppercase tracking-wide">${roundName}</div>
                <div class="matches flex flex-col justify-around gap-4 h-full">
        `;
        
        for (const match of roundMatches) {
            const isHighlighted = match.id === highlightMatchId;
            
            html += renderMatch(match, isHighlighted);
        }
        
        html += `
                </div>
            </div>
        `;
    }
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

/**
 * Génère le HTML d'un match
 */
function renderMatch(match: Match, isHighlighted: boolean): string {
    // isHighlighted = match spécifiquement mis en avant (passé en paramètre)
    // isCurrent = prochain match à jouer
    
    const isNextMatch = isHighlighted;  // Le match surligné = celui qu'on va jouer
    
    const borderClass = isNextMatch 
        ? 'border-amber-500 bg-amber-500/10' 
        : 'border-slate-700 bg-slate-800/50';
    
    const activeRing = isNextMatch 
        ? 'ring-2 ring-amber-500/50 animate-pulse' 
        : '';
    
    const getPlayerStyle = (player: string | null): string => {
        if (!match.winner) return 'text-slate-300';
        if (match.winner === player) return 'text-emerald-400 font-semibold';
        return 'text-slate-500 line-through';
    };
    
    return `
        <div class="match border ${borderClass} rounded-lg p-2 min-w-[140px] ${activeRing}">
            <div class="flex justify-between items-center py-1 border-b border-slate-700/50">
                <span class="text-sm ${getPlayerStyle(match.player1)} truncate max-w-[100px]">${match.player1 || '???'}</span>
                <span class="text-xs text-slate-500">${match.score?.player1 ?? '-'}</span>
            </div>
            <div class="flex justify-between items-center py-1">
                <span class="text-sm ${getPlayerStyle(match.player2)} truncate max-w-[100px]">${match.player2 || '???'}</span>
                <span class="text-xs text-slate-500">${match.score?.player2 ?? '-'}</span>
            </div>
        </div>
    `;
}

/**
 * Retourne le nom du round par son numéro
 */
function getRoundNameByNumber(round: number, totalRounds: number): string {
    const roundsFromEnd = totalRounds - round + 1;
    
    if (roundsFromEnd === 1) return "🏆 Finale";
    if (roundsFromEnd === 2) return "Demi-finales";
    if (roundsFromEnd === 3) return "Quarts";
    return `Round ${round}`;
}

/**
 * Affiche le bracket en overlay
 */
export function showBracketOverlay(onClose?: () => void): void {
    const tournament = loadTournament();
    if (!tournament) return;
    
    const container = document.getElementById('pong-container');
    if (!container) return;
    
    const html = `
        <div id="bracket-overlay" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm">
            <div class="max-w-4xl w-full mx-4 space-y-4">
                
                <div class="text-center">
                    <h2 class="text-2xl font-bold text-white">🏆 Bracket du tournoi</h2>
                    <p class="text-slate-400 text-sm mt-1">${tournament.players.length} joueurs</p>
                </div>
                
                <div class="glass-panel card-shadow p-4">
                    ${renderBracket(tournament)}
                </div>
                
                <div class="text-center">
                    <button id="close-bracket-btn" class="wood-sign-btn px-6 py-2 font-semibold">
                        ✓ Fermer
                    </button>
                </div>
                
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', html);
    
    document.getElementById('close-bracket-btn')?.addEventListener('click', () => {
        hideBracketOverlay();
        onClose?.();
    });
}

/**
 * Cache le bracket overlay
 */
export function hideBracketOverlay(): void {
    document.getElementById('bracket-overlay')?.remove();
}