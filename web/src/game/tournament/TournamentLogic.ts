export interface Match {
    id: number;
    round: number;
    player1: string | null;
    player2: string | null;
    winner: string | null;
    score: { player1: number; player2: number } | null;
}

export interface Tournament {
    players: string[];
    matches: Match[];
    currentMatchIndex: number;
    isFinished: boolean;
    champion: string | null;
}

/**
 * Mélange un tableau de façon aléatoire (Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Crée un nouveau tournoi avec les joueurs inscrits (ordre aléatoire)
 */
export function createTournament(players: string[]): Tournament {
    const shuffledPlayers = shuffleArray(players);
    const matches = generateBracket(shuffledPlayers);
    
    return {
        players: shuffledPlayers,
        matches,
        currentMatchIndex: 0,
        isFinished: false,
        champion: null
    };
}

/**
 * Génère le bracket (arbre des matchs)
 */
function generateBracket(players: string[]): Match[] {
    const matches: Match[] = [];
    const totalPlayers = players.length;
    const totalRounds = Math.log2(totalPlayers);
    
    let matchId = 0;
    
    // Round 1 : tous les joueurs s'affrontent
    for (let i = 0; i < totalPlayers; i += 2) {
        matches.push({
            id: matchId++,
            round: 1,
            player1: players[i],
            player2: players[i + 1],
            winner: null,
            score: null
        });
    }
    
    // Rounds suivants : matchs vides (remplis après chaque victoire)
    let matchesInRound = totalPlayers / 4;
    for (let round = 2; round <= totalRounds; round++) {
        for (let i = 0; i < matchesInRound; i++) {
            matches.push({
                id: matchId++,
                round,
                player1: null,
                player2: null,
                winner: null,
                score: null
            });
        }
        matchesInRound /= 2;
    }
    
    return matches;
}

/**
 * Retourne le match en cours
 */
export function getCurrentMatch(tournament: Tournament): Match | null {
    if (tournament.isFinished) return null;
    
    // Trouver le prochain match non joué avec 2 joueurs
    const match = tournament.matches.find(m => !m.winner && m.player1 && m.player2);
    if (match) {
        tournament.currentMatchIndex = tournament.matches.indexOf(match);
    }
    return match || null;
}

/**
 * Enregistre le résultat d'un match et avance
 */
export function recordMatchResult(
    tournament: Tournament,
    winner: 1 | 2,
    score: { player1: number; player2: number }
): Tournament {
    const currentMatch = getCurrentMatch(tournament);
    if (!currentMatch) return tournament;
    
    // Déterminer le gagnant
    const winnerName = winner === 1 ? currentMatch.player1 : currentMatch.player2;
    currentMatch.winner = winnerName;
    currentMatch.score = score;
    
    // Placer le gagnant dans le prochain match
    const nextMatchIndex = getNextMatchIndex(tournament, currentMatch);
    if (nextMatchIndex !== null) {
        const nextMatch = tournament.matches[nextMatchIndex];
        if (!nextMatch.player1) {
            nextMatch.player1 = winnerName;
        } else {
            nextMatch.player2 = winnerName;
        }
    } else {
        // Pas de prochain match = finale terminée
        tournament.isFinished = true;
        tournament.champion = winnerName;
    }
    
    return tournament;
}

/**
 * Trouve l'index du prochain match pour le gagnant
 */
function getNextMatchIndex(tournament: Tournament, currentMatch: Match): number | null {
    const currentRound = currentMatch.round;
    const nextRoundMatches = tournament.matches.filter(m => m.round === currentRound + 1);
    
    if (nextRoundMatches.length === 0) return null;
    
    // Trouver la position du match actuel dans son round
    const matchesInCurrentRound = tournament.matches.filter(m => m.round === currentRound);
    const positionInRound = matchesInCurrentRound.findIndex(m => m.id === currentMatch.id);
    const nextMatchPosition = Math.floor(positionInRound / 2);
    
    const nextMatch = nextRoundMatches[nextMatchPosition];
    return tournament.matches.findIndex(m => m.id === nextMatch.id);
}

/**
 * Retourne le nom du round actuel
 */
export function getRoundName(tournament: Tournament): string {
    const match = getCurrentMatch(tournament);
    if (!match) return "Terminé";
    
    const totalRounds = Math.log2(tournament.players.length);
    const roundsFromEnd = totalRounds - match.round + 1;
    
    if (roundsFromEnd === 1) return "🏆 Finale";
    if (roundsFromEnd === 2) return "⚔️ Demi-finales";
    if (roundsFromEnd === 3) return "🎯 Quarts de finale";
    return `Round ${match.round}`;
}

/**
 * Sauvegarde le tournoi dans sessionStorage
 */
export function saveTournament(tournament: Tournament): void {
    sessionStorage.setItem('currentTournament', JSON.stringify(tournament));
}

/**
 * Charge le tournoi depuis sessionStorage
 */
export function loadTournament(): Tournament | null {
    const data = sessionStorage.getItem('currentTournament');
    if (!data) return null;
    return JSON.parse(data) as Tournament;
}

/**
 * Supprime le tournoi
 */
export function clearTournament(): void {
    sessionStorage.removeItem('currentTournament');
    sessionStorage.removeItem('tournamentAliases');
}