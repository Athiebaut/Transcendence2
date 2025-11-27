import { 
    loadTournament, 
    saveTournament, 
    recordMatchResult, 
    getCurrentMatch, 
    getRoundName,
    clearTournament,
    type Tournament 
} from './TournamentLogic';

import { renderFirstMatchHTML, renderNextMatchHTML, renderChampionHTML } from './MatchEndHtml';
import { disposePongGame, initPongGame } from '../pongGame';
import { initTournamentSetup, renderTournamentSetup } from './TournamentSetup';
import { resetPlayerNames, updatePlayerNames } from '../ui/displayPlayerNames';

/**
 * Affiche l'écran de fin de match en tournoi
 */
export function showTournamentMatchEnd(
    winner: number, 
    score: { player1: number; player2: number },
    onNextMatch: () => void
): void {
    const tournament = loadTournament();
    if (!tournament) {
        console.error('Aucun tournoi en cours');
        return;
    }
    
    const currentMatch = getCurrentMatch(tournament);
    if (!currentMatch) return;
    
    const winnerName = winner === 1 ? currentMatch.player1 : currentMatch.player2;
    const loserName = winner === 1 ? currentMatch.player2 : currentMatch.player1;
    
    const updatedTournament = recordMatchResult(tournament, winner as 1 | 2, score);
    saveTournament(updatedTournament);
    
    if (updatedTournament.isFinished) {
        showChampionScreen(updatedTournament);
    } else {
        showNextMatchScreen(updatedTournament, winnerName!, loserName!, score, onNextMatch);
    }
}

/**
 * Affiche l'écran du premier match
 */
export function showFirstMatchScreen(onStart: () => void): void {
    const tournament = loadTournament();
    if (!tournament) return;
    
    const container = document.getElementById('pong-container');
    if (!container) return;
    
    const firstMatch = getCurrentMatch(tournament);
    if (!firstMatch) return;
    
    const roundName = getRoundName(tournament);
    container.insertAdjacentHTML('beforeend', renderFirstMatchHTML(tournament, roundName, firstMatch));
    
    document.getElementById('next-match-btn')?.addEventListener('click', () => {
        hideTournamentMatchEnd();
        updatePlayerNames('tournament');
        onStart();
    });
}


export function hideTournamentMatchEnd(): void {
    document.getElementById('tournament-match-end')?.remove();
}

function setupNextMatchButton(onNext: () => void): void {
    document.getElementById('next-match-btn')?.addEventListener('click', () => {
        hideTournamentMatchEnd();
        updatePlayerNames('tournament');
        onNext();
    });
}

function setupQuitButton(): void {
    document.getElementById('quit-tournament-btn')?.addEventListener('click', () => {
        clearTournament();
        resetPlayerNames();
        hideTournamentMatchEnd();
        window.location.href = '/play';
    });
}

function setupNewTournamentButton(): void {
    document.getElementById('new-tournament-btn')?.addEventListener('click', () => {
        clearTournament();
        hideTournamentMatchEnd();
        resetPlayerNames();
        disposePongGame();
        startNewTournament();
    });
}

function showNextMatchScreen(
    tournament: Tournament,
    winnerName: string,
    loserName: string,
    score: { player1: number; player2: number },
    onNextMatch: () => void
): void {
    const container = document.getElementById('pong-container');
    if (!container) return;
    
    const nextMatch = getCurrentMatch(tournament);
    const roundName = getRoundName(tournament);
    
    container.insertAdjacentHTML('beforeend', renderNextMatchHTML(tournament, roundName, winnerName, loserName, score, nextMatch));
    
    setupNextMatchButton(onNextMatch);
    setupQuitButton();
}

function showChampionScreen(tournament: Tournament): void {
    const container = document.getElementById('pong-container');
    if (!container) return;
    
    container.insertAdjacentHTML('beforeend', renderChampionHTML(tournament));
    
    setupNewTournamentButton();
    setupQuitButton();
}

function startNewTournament(): void {
    const container = document.getElementById('pong-container');
    if (!container) return;
    
    container.insertAdjacentHTML('beforeend', renderTournamentSetup());
    
    initTournamentSetup(() => {
        initPongGame('tournament');
    });
}