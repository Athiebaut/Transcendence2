import { Vector3 } from "@babylonjs/core";
import { FIELD_CONFIG, GAME_RULES } from "../../config/gameConfig";

/**
 * Résultat d'une vérification de but
 */
interface GoalResult {
    isGoal: boolean;
    scorer?: number;
    newScore?: { player1: number; player2: number };
    isGameOver?: boolean;
    winner?: number;
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
    onGameOver: ((winner: number) => void) | null;
}

/**
 * Crée le système de score pour le jeu Pong
 * Le winScore est récupéré automatiquement depuis GAME_RULES
 */
export function createScoringSystem(): ScoringSystem {
    // État privé du score
    let score = { player1: 0, player2: 0 };
    let onScoreUpdate: ((player1: number, player2: number) => void) | null = null;
    let onGoal: ((player: number) => void) | null = null;
    let onGameOver: ((winner: number) => void) | null = null;
    
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
            return buildResult(1);
        }
        
        // But du joueur 2 (balle sort à droite)
        if (ballX > goalLimit) {
            score.player2++;
            notifyGoal(2);
            return buildResult(2);
        }
        
        return { isGoal: false };
    }
    
    /**
     * Construit le résultat du but et vérifie la victoire
     */
    function buildResult(scorer: number): GoalResult {
        const result: GoalResult = { 
            isGoal: true, 
            scorer, 
            newScore: { ...score },
            isGameOver: false
        };
        
        // Vérifier si un joueur a gagné
        if (score.player1 >= GAME_RULES.WIN_SCORE) {
            result.isGameOver = true;
            result.winner = 1;
            onGameOver?.(1);
        } else if (score.player2 >= GAME_RULES.WIN_SCORE) {
            result.isGameOver = true;
            result.winner = 2;
            onGameOver?.(2);
        }
        
        return result;
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
        },
        get onGameOver() {
            return onGameOver;
        },
        set onGameOver(callback: ((winner: number) => void) | null) {
            onGameOver = callback;
        }
    };
}