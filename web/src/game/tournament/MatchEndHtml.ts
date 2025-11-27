import { renderBracket } from './DisplayBracket';
import type { Tournament, Match } from './TournamentLogic';

export function renderFirstMatchHTML(
    tournament: Tournament, 
    roundName: string, 
    firstMatch: Match
): string {
    return `
        <div id="tournament-match-end" class="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm overflow-y-auto py-8">
            <div class="text-center space-y-6 p-8 max-w-4xl my-auto">
                
                <div class="space-y-2">
                    <div class="text-5xl">🏆</div>
                    <h1 class="text-2xl font-bold text-white">Tournoi ${tournament.players.length} joueurs</h1>
                    <p class="text-slate-400">Que le meilleur gagne !</p>
                </div>
                
                <div class="glass-panel card-shadow p-4">
                    <p class="text-xs text-slate-400 uppercase tracking-wide mb-3">Bracket</p>
                    ${renderBracket(tournament, firstMatch.id)}
                </div>
                
                <div class="glass-panel card-shadow p-4 space-y-2">
                    <p class="text-xs text-slate-400 uppercase tracking-wide">${roundName}</p>
                    <p class="text-sm text-slate-300">Premier match :</p>
                    <p class="text-xl font-semibold text-white">
                        <span class="text-emerald-400">${firstMatch.player1}</span>
                        <span class="text-amber-400 mx-2">vs</span>
                        <span class="text-sky-400">${firstMatch.player2}</span>
                    </p>
                </div>
                
                <button id="next-match-btn" class="wood-sign-btn px-8 py-3 font-semibold text-lg">
                    ⚔️ Commencer le match
                </button>
                
            </div>
        </div>
    `;
}

export function renderNextMatchHTML(
    tournament: Tournament,
    roundName: string,
    winnerName: string,
    loserName: string,
    score: { player1: number; player2: number },
    nextMatch: Match | null
): string {
    return `
        <div id="tournament-match-end" class="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm overflow-y-auto">
            <div class="text-center space-y-6 p-8 max-w-4xl my-auto">
                
                <div class="space-y-2">
                    <div class="text-4xl">⚔️</div>
                    <h1 class="text-xl font-bold text-white">Match terminé !</h1>
                    <p class="text-lg text-emerald-400 font-semibold">${winnerName} gagne !</p>
                    <p class="text-slate-400">${score.player1} - ${score.player2}</p>
                    <p class="text-sm text-red-400/70">${loserName} est éliminé</p>
                </div>
                
                <div class="glass-panel card-shadow p-4">
                    <p class="text-xs text-slate-400 uppercase tracking-wide mb-3">Bracket</p>
                    ${renderBracket(tournament, nextMatch?.id)}
                </div>
                
                <div class="glass-panel card-shadow p-4 space-y-2">
                    <p class="text-xs text-slate-400 uppercase tracking-wide">${roundName}</p>
                    <p class="text-lg font-semibold text-white">
                        <span class="text-emerald-400">${nextMatch?.player1 || '???'}</span>
                        <span class="text-amber-400 mx-2">vs</span>
                        <span class="text-sky-400">${nextMatch?.player2 || '???'}</span>
                    </p>
                </div>
                
                <div class="flex flex-col gap-3">
                    <button id="next-match-btn" class="wood-sign-btn px-6 py-3 font-semibold">
                        ▶️ Match suivant
                    </button>
                    <button id="quit-tournament-btn" class="px-6 py-3 border border-slate-600 bg-black/40 text-white hover:bg-white/10 transition-colors">
                        🚪 Quitter le tournoi
                    </button>
                </div>
                
            </div>
        </div>
    `;
}

export function renderChampionHTML(tournament: Tournament): string {
    return `
        <div id="tournament-match-end" class="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
            <div class="text-center space-y-6 p-8">
                
                <div class="text-6xl sm:text-8xl animate-bounce">🏆</div>
                
                <div class="space-y-2">
                    <h1 class="text-3xl sm:text-4xl font-bold text-amber-400">Champion !</h1>
                    <p class="text-2xl text-white font-semibold">${tournament.champion}</p>
                    <p class="text-slate-400">remporte le tournoi !</p>
                </div>
                
                <div class="glass-panel card-shadow p-4 max-w-md mx-auto">
                    <p class="text-xs text-slate-400 uppercase tracking-wide mb-3">Résultats</p>
                    <div class="space-y-2 text-sm">
                        ${tournament.matches.map(m => `
                            <div class="grid grid-cols-[1fr_auto_1fr] gap-2 items-center text-slate-300 py-1 border-b border-slate-700/50">
                                <span class="text-right truncate ${m.winner === m.player1 ? 'text-emerald-400 font-semibold' : ''}">${m.player1}</span>
                                <span class="text-amber-400 text-xs px-2">${m.score?.player1} - ${m.score?.player2}</span>
                                <span class="text-left truncate ${m.winner === m.player2 ? 'text-emerald-400 font-semibold' : ''}">${m.player2}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <button id="new-tournament-btn" class="wood-sign-btn px-6 py-3 font-semibold">
                        🔄 Nouveau tournoi
                    </button>
                    <button id="quit-tournament-btn" class="px-6 py-3 border border-slate-600 bg-black/40 text-white hover:bg-white/10 transition-colors text-center">
                        🚪 Retour aux modes
                    </button>
                </div>
                
            </div>
        </div>
    `;
}