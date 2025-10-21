import { Vector3 } from "@babylonjs/core";
import { FIELD_CONFIG } from "../../config/gameConfig";

/**
 * Résultat d'une vérification de but
 */
interface GoalResult {
    isGoal: boolean;
    scorer?: number;
    newScore?: { player1: number; player2: number };
}

/**
 * Interface pour le système de score du jeu Pong
 * Gère la détection des buts et le suivi des points
 */
export interface ScoringSystem {
    // Détection des buts
    checkGoal(ballPosition: Vector3): GoalResult;
    
    // Gestion du score
    getScore(): { player1: number; player2: number };
    resetScore(): void;
    
    // Callbacks pour l'interface
    onScoreUpdate: ((player1: number, player2: number) => void) | null;
    onGoal: ((player: number) => void) | null;
}

/**
 * Crée le système de score pour le jeu Pong
 */
export function createScoringSystem(): ScoringSystem {
    // État privé du score
    let score = { player1: 0, player2: 0 };
    let onScoreUpdate: ((player1: number, player2: number) => void) | null = null;
    let onGoal: ((player: number) => void) | null = null;
    
    /**
     * Vérifie si la balle a franchi une ligne de but
     */
    function checkGoal(ballPosition: Vector3): GoalResult {
        const ballX = ballPosition.x;
        const goalLimit = FIELD_CONFIG.WIDTH / 2;
        
        // But du joueur 1 (balle sort à gauche)
        if (ballX < -goalLimit) {
            score.player1++;
            notifyGoal(1);
            return { 
                isGoal: true, 
                scorer: 1, 
                newScore: { ...score } 
            };
        }
        
        // But du joueur 2 (balle sort à droite)
        if (ballX > goalLimit) {
            score.player2++;
            notifyGoal(2);
            return { 
                isGoal: true, 
                scorer: 2, 
                newScore: { ...score } 
            };
        }
        
        return { isGoal: false };
    }
    
    /**
     * Notifie les callbacks qu'un but a été marqué
     */
    function notifyGoal(player: number): void {
        onGoal?.(player);
        onScoreUpdate?.(score.player1, score.player2);
    }
    
    // Interface publique
    return {
        // Détection des buts
        checkGoal,
        
        // Gestion du score
        getScore() { 
            return { ...score }; 
        },
        resetScore() {
            score = { player1: 0, player2: 0 };
            onScoreUpdate?.(score.player1, score.player2);
        },
        
        // Callbacks pour l'interface utilisateur
        get onScoreUpdate() { 
            return onScoreUpdate; 
        },
        set onScoreUpdate(callback: ((player1: number, player2: number) => void) | null) { 
            onScoreUpdate = callback; 
        },
        get onGoal() { 
            return onGoal; 
        },
        set onGoal(callback: ((player: number) => void) | null) { 
            onGoal = callback; 
        }
    };
}