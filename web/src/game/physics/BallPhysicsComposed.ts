import { Scene } from "@babylonjs/core";
import { createBallMovement } from "./systems/ballMovement";
import { createCollisionSystem } from "./systems/collisionSystem";
import { createScoringSystem } from "./systems/scoringSystem";
import type { GameMode } from "../config/gameModeConfig";
import { GAME_RULES, PHYSICS_CONFIG } from "../config/gameConfig";

/**
 * Interface pour le système de physique composé du jeu Pong
 * Combine mouvement, collisions et score en une API unifiée
 */
export interface ComposedPhysicsSystem {
    // État du jeu
    score: { player1: number; player2: number };
    isGameOver: boolean;
    winner: number | null;
    
    // Contrôles du jeu
    resetGame(): void;
    setBallSpeed(speed: number): void;
    pauseBall(): void;
    isMoving(): boolean;
    
    // Callbacks pour l'interface
    onScoreUpdate: ((player1: number, player2: number) => void) | null;
    onGoal: ((player: number) => void) | null;
    onGameOver: ((winner: number) => void) | null;
}

/**
 * Crée le système de physique principal du jeu Pong
 * Compose les sous-systèmes de mouvement, collision et score
 */
export function createBallPhysics(scene: Scene, mode: GameMode = 'pvp1v1'): ComposedPhysicsSystem {
    // Initialisation des sous-systèmes
    const ballMovement = createBallMovement(scene);
    const collisionSystem = createCollisionSystem(scene, mode);
    const scoringSystem = createScoringSystem();

    let gameOver = false;
    let gameWinner: number | null = null;
    
    // Boucle de rendu principale - cycle de physique du jeu
    scene.registerBeforeRender(() => {
        const deltaTime = scene.deltaTime;
        
        // Phase 1: Mise à jour du mouvement
        ballMovement.update(deltaTime);
        
        // Phase 2: Détection et résolution des collisions
        const ballPosition = ballMovement.getPosition();
        const ballVelocity = ballMovement.getVelocity();
        const collisionResult = collisionSystem.checkCollisions(ballPosition, ballVelocity);
        
        // Phase 3: Application des nouveaux état physique
        ballMovement.setVelocity(collisionResult.newVelocity);
        ballMovement.setPosition(collisionResult.newPosition);
        
        // Phase 4: Vérification des conditions de victoire
        const goalResult = scoringSystem.checkGoal(ballPosition);
        if (goalResult.isGoal) {
            // Vérifier si la partie est terminée
            if (goalResult.isGameOver && goalResult.winner) {
                gameOver = true;
                gameWinner = goalResult.winner;
                ballMovement.resetPosition();
                ballMovement.pauseBall();
                // Le callback onGameOver est appelé dans scoringSystem.buildResult()
            } else {
                // Partie continue - envoyer la balle vers l'adversaire
                const direction = goalResult.scorer === 1 ? "left" : "right";
                ballMovement.resetWithDelay(PHYSICS_CONFIG.RESET_DELAY_MS, direction);
            }
        }
    });
    
    // Interface publique - API unifiée pour le jeu
    return {
        // État du jeu (lecture seule)
        get score() { 
            return scoringSystem.getScore(); 
        },
        
        get isGameOver() { 
            return gameOver; 
        },

        get winner() { 
            return gameWinner; 
        },
        
        // Contrôles du jeu
        resetGame() {
            scoringSystem.resetScore();
            ballMovement.resetWithDelay(GAME_RULES.START_DELAY_MS);
        },
        setBallSpeed(speed: number) {
            ballMovement.setBallSpeed(speed);
        },
        pauseBall() {
            ballMovement.pauseBall();
        },
        isMoving() {
            return ballMovement.isMoving();
        },
        
        // Callbacks pour l'interface utilisateur
        get onScoreUpdate() { 
            return scoringSystem.onScoreUpdate; 
        },
        set onScoreUpdate(callback: ((player1: number, player2: number) => void) | null) { 
            scoringSystem.onScoreUpdate = callback; 
        },
        get onGoal() { 
            return scoringSystem.onGoal; 
        },
        set onGoal(callback: ((player: number) => void) | null) { 
            scoringSystem.onGoal = callback; 
        },

        get onGameOver() { 
            return scoringSystem.onGameOver; 
        },

        set onGameOver(callback: ((winner: number) => void) | null) { 
            scoringSystem.onGameOver = callback; 
        }
    };
}