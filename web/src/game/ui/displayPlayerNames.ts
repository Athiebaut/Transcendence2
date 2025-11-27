import { loadTournament, getCurrentMatch } from '../tournament/TournamentLogic';
import type { GameMode } from '../config/gameModeConfig';


/**
 * Récupère le nom du joueur connecté (si disponible)
 */
export function getConnectedUserName(): string | null {
    // a faire plus tard
    return "Billy";
}

/**
 * Récupère le nom du joueur selon le mode et la position
 */
export function getPlayerName(playerNumber: number, mode: GameMode): string {
    
    const connectedUser = getConnectedUserName();
    
    // 2v2 : noms d'équipes
    if (mode === 'pvp2v2') {
        if (playerNumber === 1 && connectedUser) {
            return `Équipe de ${connectedUser}`;
        }
        return playerNumber === 1 ? "Équipe 1" : "Équipe 2";
    }

    // Joueur 1 connecté
    if (playerNumber === 1) {
        if (connectedUser) {
            return connectedUser;
        }
    }
    
    // Par défaut
    return playerNumber === 1 ? "Oie de gauche" : "Oie de droite";
}

/**
 * Met à jour les noms des joueurs dans le HUD
 */
export function updatePlayerNames(mode: GameMode): void {
    const player1Name = document.querySelector('#player1-info h3');
    const player2Name = document.querySelector('#player2-info h3');
    
    if (!player1Name || !player2Name) return;
    
    if (mode === 'tournament') {
        const tournament = loadTournament();
        if (!tournament) return;
        
        const currentMatch = getCurrentMatch(tournament);
        if (!currentMatch) return;
        
        player1Name.textContent = currentMatch.player1 || 'Joueur 1';
        player2Name.textContent = currentMatch.player2 || 'Joueur 2';
    } else {
        // Mode normal
        player1Name.textContent = getPlayerName(1, mode);
        player2Name.textContent = getPlayerName(2, mode);
    }
}

/**
 * Réinitialise les noms par défaut
 */
export function resetPlayerNames(): void {
    const player1Name = document.querySelector('#player1-info h3');
    const player2Name = document.querySelector('#player2-info h3');
    
    if (player1Name) player1Name.textContent = 'Oie de gauche';
    if (player2Name) player2Name.textContent = 'Oie de droite';
}