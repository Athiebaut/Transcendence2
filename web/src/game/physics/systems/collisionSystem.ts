import { Vector3, Mesh } from "@babylonjs/core";
import { FIELD_CONFIG, GAME_OBJECTS, PHYSICS_CONFIG } from "../../config/gameConfig";
import type { GameMode } from "../../config/gameModeConfig";

/**
 * Résultat d'une vérification de collision
 */
interface CollisionResult {
    newVelocity: Vector3;
    newPosition: Vector3;
    hitPaddle?: Mesh;
}

/**
 * Interface pour le système de collision du jeu Pong
 * Gère les collisions avec les murs et les paddles
 */
export interface CollisionSystem {
    checkCollisions(ballPosition: Vector3, ballVelocity: Vector3): CollisionResult;
}

/**
 * Crée le système de collision pour le jeu Pong
 */
export function createCollisionSystem(scene: any, mode: GameMode = 'pvp1v1'): CollisionSystem {
    // Références aux paddles
    const leftPaddles: Mesh[] = [];
    const rightPaddles: Mesh[] = [];
    
    /**
     * Initialise le système en trouvant les paddles dans la scène
     */
    function initialize(): void {
        if (mode === 'pvp2v2') {
            // Mode 4 joueurs - 2 paddles par côté
            const lp1 = scene.getMeshByName("leftPaddle1") as Mesh;
            const lp2 = scene.getMeshByName("leftPaddle2") as Mesh;
            const rp1 = scene.getMeshByName("rightPaddle1") as Mesh;
            const rp2 = scene.getMeshByName("rightPaddle2") as Mesh;
            
            if (lp1) leftPaddles.push(lp1);
            if (lp2) leftPaddles.push(lp2);
            if (rp1) rightPaddles.push(rp1);
            if (rp2) rightPaddles.push(rp2);
        }
        else {
            // Mode 2 joueurs (PvP, vs AI, Tournament)
            const lp = scene.getMeshByName("leftPaddle") as Mesh;
            const rp = scene.getMeshByName("rightPaddle") as Mesh;
            
            if (lp) leftPaddles.push(lp);
            if (rp) rightPaddles.push(rp);
        }
        
        if (leftPaddles.length === 0 || rightPaddles.length === 0) {
            console.error("Paddles not found in scene");
        }
    }
    
    /**
     * Vérifie et résout les collisions avec les murs
     */
    function checkWallCollisions(position: Vector3, velocity: Vector3): Vector3 {
        const newVelocity = velocity.clone();
        const wallLimit = FIELD_CONFIG.HEIGHT / 2 - FIELD_CONFIG.WALL_THICKNESS / 2;
        
        // Collision avec le mur du haut
        if (position.z >= wallLimit - GAME_OBJECTS.BALL_RADIUS && velocity.z > 0) {
            newVelocity.z *= -1;
        }
        
        // Collision avec le mur du bas
        if (position.z <= -wallLimit + GAME_OBJECTS.BALL_RADIUS && velocity.z < 0) {
            newVelocity.z *= -1;
        }
        
        return newVelocity;
    }
    
    /**
     * Vérifie la collision avec une paddle spécifique
     */
    function checkPaddleCollision(
        paddle: Mesh, 
        side: "left" | "right",
        ballPosition: Vector3, 
        ballVelocity: Vector3
    ): { velocity: Vector3; hit: boolean } {
        const ballX = ballPosition.x;
        const ballZ = ballPosition.z;
        const paddleX = paddle.position.x;
        const paddleZ = paddle.position.z;
        
        // Calcul des limites de la paddle
        const paddleLeft = paddleX - GAME_OBJECTS.PADDLE_WIDTH / 2;
        const paddleRight = paddleX + GAME_OBJECTS.PADDLE_WIDTH / 2;
        const paddleTop = paddleZ + GAME_OBJECTS.PADDLE_DEPTH / 2;
        const paddleBottom = paddleZ - GAME_OBJECTS.PADDLE_DEPTH / 2;
        
        // Vérification de collision verticale
        const isInVerticalRange = ballZ >= paddleBottom - GAME_OBJECTS.BALL_RADIUS && 
                                ballZ <= paddleTop + GAME_OBJECTS.BALL_RADIUS;
        
        if (!isInVerticalRange) {
            return { velocity: ballVelocity, hit: false };
        }
        
        // Vérification de collision horizontale selon le côté
        const isCollision = (
            (side === "right" && 
             ballX >= paddleLeft - GAME_OBJECTS.BALL_RADIUS && 
             ballX <= paddleRight + GAME_OBJECTS.BALL_RADIUS && 
             ballVelocity.x > 0) ||
            (side === "left" && 
             ballX <= paddleRight + GAME_OBJECTS.BALL_RADIUS && 
             ballX >= paddleLeft - GAME_OBJECTS.BALL_RADIUS && 
             ballVelocity.x < 0)
        );
        
        if (isCollision) {
            return { velocity: applyPaddleEffect(paddle, ballZ, ballVelocity), hit: true };
        }
        
        return { velocity: ballVelocity, hit: false };
    }
    
    /**
     * Applique l'effet de spin et d'accélération lors d'une collision avec paddle
     */
    function applyPaddleEffect(paddle: Mesh, ballZ: number, ballVelocity: Vector3): Vector3 {
        const newVelocity = ballVelocity.clone();
        newVelocity.x *= -1; // Inversion horizontale
        
        // Calcul de l'effet de spin basé sur la position de contact
        const hitPosition = (ballZ - paddle.position.z) / (GAME_OBJECTS.PADDLE_DEPTH / 2);
        const nonLinearSpin = Math.sign(hitPosition) * Math.pow(Math.abs(hitPosition), 0.7);
        
        // Application des effets
        newVelocity.z += nonLinearSpin * PHYSICS_CONFIG.BASE_BALL_SPEED * PHYSICS_CONFIG.SPIN_INTENSITY;
        newVelocity.x *= PHYSICS_CONFIG.SPEED_BOOST;
        
        // Limitation des vitesses
        const maxVerticalSpeed = PHYSICS_CONFIG.BASE_BALL_SPEED * PHYSICS_CONFIG.MAX_VERTICAL_SPEED_MULTIPLIER;
        const maxHorizontalSpeed = PHYSICS_CONFIG.BASE_BALL_SPEED * PHYSICS_CONFIG.MAX_HORIZONTAL_SPEED_MULTIPLIER;
        
        newVelocity.z = Math.max(-maxVerticalSpeed, Math.min(maxVerticalSpeed, newVelocity.z));
        newVelocity.x = Math.max(-maxHorizontalSpeed, Math.min(maxHorizontalSpeed, newVelocity.x));
        
        return newVelocity;
    }
    
    // Initialisation immédiate
    initialize();
    
    // Interface publique
    return {
        /**
         * Vérifie toutes les collisions et retourne le nouvel état de la balle
         */
        checkCollisions(ballPosition: Vector3, ballVelocity: Vector3): CollisionResult {
            let newVelocity = ballVelocity.clone();
            let newPosition = ballPosition.clone();
            let hitPaddle: Mesh | undefined;
            
            // Phase 1: Vérification des collisions avec les murs
            newVelocity = checkWallCollisions(ballPosition, newVelocity);
            
            // Phase 2: Vérification des collisions avec les paddles de gauche
            for (const paddle of leftPaddles) {
                const result = checkPaddleCollision(paddle, "right", ballPosition, newVelocity);
                if (result.hit) {
                    newVelocity = result.velocity;
                    hitPaddle = paddle;
                    newPosition.x = paddle.position.x - GAME_OBJECTS.PADDLE_WIDTH / 2 - GAME_OBJECTS.BALL_RADIUS;
                    break; // Une seule collision à la fois
                }
            }
            
            // Phase 3: Vérification des collisions avec les paddles de droite (si pas déjà touché)
            if (!hitPaddle) {
                for (const paddle of rightPaddles) {
                    const result = checkPaddleCollision(paddle, "left", ballPosition, newVelocity);
                    if (result.hit) {
                        newVelocity = result.velocity;
                        hitPaddle = paddle;
                        newPosition.x = paddle.position.x + GAME_OBJECTS.PADDLE_WIDTH / 2 + GAME_OBJECTS.BALL_RADIUS;
                        break; // Une seule collision à la fois
                    }
                }
            }
            
            // Phase 4: Ajustement de position pour les murs
            const wallLimit = FIELD_CONFIG.HEIGHT / 2 - FIELD_CONFIG.WALL_THICKNESS / 2;
            newPosition.z = Math.max(
                -wallLimit + GAME_OBJECTS.BALL_RADIUS,
                Math.min(wallLimit - GAME_OBJECTS.BALL_RADIUS, newPosition.z)
            );
            
            return { newVelocity, newPosition, hitPaddle };
        }
    };
}