import { Scene, Vector3, Mesh } from "@babylonjs/core";
import { GAME_RULES, PHYSICS_CONFIG } from "../../config/gameConfig";

/**
 * Interface pour le système de mouvement de la balle
 * Gère la position, la vitesse et les réinitialisations
 */
export interface BallMovementSystem {
    // Mise à jour physique
    update(deltaTime: number): void;
    
    // Contrôle de position
    resetPosition(): void;
    resetPosition(direction?: "left" | "right"): void;
    resetWithDelay(delayMs?: number, direction?: "left" | "right"): void;
    setPosition(position: Vector3): void;
    getPosition(): Vector3;
    
    // Contrôle de vitesse
    setVelocity(velocity: Vector3): void;
    getVelocity(): Vector3;
    setBallSpeed(speed: number): void;
    
    // État
    pauseBall(): void;
    isMoving(): boolean;
}

/**
 * Crée le système de mouvement de la balle
 */
export function createBallMovement(scene: Scene): BallMovementSystem {
    // État privé du système
    let ball: Mesh | null = null;
    let ballVelocity = new Vector3(0, 0, 0);
    let ballSpeed = PHYSICS_CONFIG.BASE_BALL_SPEED;
    let isWaitingToReset = false;
    
    /**
     * Initialise le système et trouve la balle dans la scène
     */
    function initialize(): void {
        ball = scene.getMeshByName("ball") as Mesh;
        if (!ball) {
            console.error("Ball mesh not found in scene");
            return;
        }
        ball.metadata = ball.metadata ?? {};
        
        ball.position = new Vector3(0, 0, 0);
        ballVelocity = new Vector3(0, 0, 0);
        ball.metadata.physicsVelocity = ballVelocity.clone();
        
        resetWithDelay(GAME_RULES.START_DELAY_MS);
    }
    
    /**
     * Met à jour la position de la balle selon sa vitesse
     */
    function update(deltaTime: number): void {
        if (!ball || isWaitingToReset) return;
        
        ball.metadata = ball.metadata ?? {};
        
        ball.position.x += ballVelocity.x * deltaTime;
        ball.position.z += ballVelocity.z * deltaTime;

        ball.metadata.physicsVelocity = ballVelocity.clone();
    }
    
    /**
     * Remet la balle au centre avec une direction spécifiée ou aléatoire
     * @param direction - "left" (vers joueur 2) ou "right" (vers joueur 1), ou undefined pour aléatoire
     */
    function resetPosition(direction?: "left" | "right"): void {
        if (!ball) return;
        
        ball.metadata = ball.metadata ?? {};
        
        // Position initiale
        ball.position = new Vector3(0, 0, 0);
        
        // Direction basée sur le paramètre ou aléatoire si non spécifié
        let directionValue: number;
        if (direction === "left") {
            directionValue = -1; // Vers la gauche (joueur 2)
        } else if (direction === "right") {
            directionValue = 1;  // Vers la droite (joueur 1)
        } else {
            // Direction aléatoire (pour le premier lancement)
            directionValue = Math.random() > 0.5 ? 1 : -1;
        }
        
        const angle = (Math.random() - 0.5) * PHYSICS_CONFIG.MAX_ANGLE_VARIATION;
        
        ballVelocity = new Vector3(
            directionValue * ballSpeed,
            0,
            angle * ballSpeed
        );
        
        ball.metadata.physicsVelocity = ballVelocity.clone();
        isWaitingToReset = false;
    }
    
    /**
     * Remet la balle au centre après un délai avec une direction spécifiée
     * @param delayMs - Délai en millisecondes
     * @param direction - Direction vers laquelle envoyer la balle
     */
    function resetWithDelay(delayMs = PHYSICS_CONFIG.RESET_DELAY_MS, direction?: "left" | "right"): void {  
        if (!ball) return;
        
        ball.metadata = ball.metadata ?? {};
        
        // Arrêt immédiat
        ballVelocity = new Vector3(0, 0, 0);
        isWaitingToReset = true;
        ball.position = new Vector3(0, 0, 0);

        ball.metadata.physicsVelocity = ballVelocity.clone();
        
        // Redémarrage différé avec direction
        setTimeout(() => {
            resetPosition(direction);
        }, delayMs);
    }
    
    // Initialisation immédiate
    initialize();
    
    // Interface publique
    return {
        // Physique
        update,
        
        // Position
        resetPosition,
        resetWithDelay,
        setPosition(position: Vector3) { 
            if (ball) ball.position = position; 
        },
        getPosition() { 
            return ball?.position.clone() || new Vector3(0, 0, 0); 
        },
        
        // Vitesse
        setVelocity(velocity: Vector3) { 
            ballVelocity = velocity; 
        },
        getVelocity() { 
            return ballVelocity.clone(); 
        },
        setBallSpeed(speed: number) { 
            ballSpeed = speed; 
        },
        
        // État
        pauseBall() { 
            ballVelocity = new Vector3(0, 0, 0); 
        },
        isMoving() { 
            return ballVelocity.length() > 0; 
        }
    };
}