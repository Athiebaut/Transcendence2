import { Vector3 } from "@babylonjs/core";
import { FIELD_CONFIG, GAME_OBJECTS } from "../config/gameConfig";

// ✅ Constantes pour la clarté
const VELOCITY_THRESHOLD = 0.001;
const MAX_BOUNCES = 10;
const PREDICTION_ERROR_RANGE = 1.8;

/**
 * IA simple pour le mode vsAI
 * Respecte les contraintes :
 * - Rafraîchit sa vision 1 fois par seconde
 * - Simule des inputs clavier
 * - Anticipe les rebonds
 */
export function createAI() {
    let lastUpdate = 0;
    let targetZ = 0;
    let currentDeadZone = 0.3;
    let isOvercorrecting = false;
    let overcorrectionOffset = 0;
    let lastDecision = { moveUp: false, moveDown: false };
    let timeSinceLastChange = 0;
    const UPDATE_FREQUENCY = 1000;
    const MIN_STABILITY_TIME = 200; // ✅ 200ms minimum entre deux changements

    /**
     * Génère une dead zone aléatoire pour simuler l'imprécision humaine
     */
    function generateRandomDeadZone(): number {
        return 0.5 + Math.random() * 1.5;
    }
    
    /**
     * Vérifie si la balle se dirige vers le paddle
     */
    function isBallMovingTowardsPaddle(ballVel: Vector3, paddleX: number): boolean {
        const isMovingRight = ballVel.x > 0;
        const paddleIsOnRight = paddleX > 0;
        return isMovingRight === paddleIsOnRight;
    }
    
    /**
     * Prédit où la balle va arriver en simulant sa trajectoire
     */
    function predictBallPosition(ballPos: Vector3, ballVel: Vector3, paddleX: number): number {
        if (Math.abs(ballVel.x) < VELOCITY_THRESHOLD) {
            return 0;
        }
        
        if (!isBallMovingTowardsPaddle(ballVel, paddleX)) {
            return 0;
        }
        
        const distanceX = Math.abs(paddleX - ballPos.x);
        const timeToReachPaddle = distanceX / Math.abs(ballVel.x);
        
        let simZ = ballPos.z;
        let velZ = ballVel.z;
        let timeRemaining = timeToReachPaddle;
        
        const wallLimit = FIELD_CONFIG.HEIGHT / 2 - FIELD_CONFIG.WALL_THICKNESS / 2;
        const ballRadius = GAME_OBJECTS.BALL_RADIUS;
        
        let bounceCount = 0;
        
        while (timeRemaining > 0 && bounceCount < MAX_BOUNCES) {
            let distanceToWall;
            if (velZ > 0) {
                distanceToWall = wallLimit - ballRadius - simZ;
            } else {
                distanceToWall = simZ + wallLimit - ballRadius;
            }
            
            let timeToWall;
            if (Math.abs(velZ) > VELOCITY_THRESHOLD) {
                timeToWall = Math.abs(distanceToWall / velZ);
            } else {
                timeToWall = Infinity;
            }
            
            const timeToNextEvent = Math.min(timeRemaining, timeToWall);
            
            simZ += velZ * timeToNextEvent;
            timeRemaining -= timeToNextEvent;
            
            if (timeToNextEvent === timeToWall && timeRemaining > 0) {
                velZ *= -1;
                bounceCount++;
            }
        }
        
        const predictionError = (Math.random() - 0.5) * PREDICTION_ERROR_RANGE;
        
        return simZ + predictionError;
    }
    
    /**
     * Met à jour la vision de l'IA (1 fois par seconde)
     */
    function updateVision(ballPos: Vector3, ballVel: Vector3, paddleX: number, currentTime: number): boolean {
        if (currentTime - lastUpdate >= UPDATE_FREQUENCY) {
            lastUpdate = currentTime;
            targetZ = predictBallPosition(ballPos, ballVel, paddleX);
            currentDeadZone = generateRandomDeadZone();
            
            if (Math.random() < 0.3) {
                isOvercorrecting = true;
                overcorrectionOffset = (Math.random() - 0.5) * 1.5;
            } else {
                isOvercorrecting = false;
                overcorrectionOffset = 0;
            }
            
            return true;
        }
        return false;
    }
    
    /**
     * Prend une décision (simule des inputs clavier)
     */
    function makeDecision(currentPaddleZ: number, deltaTime: number): { moveUp: boolean; moveDown: boolean } {
        const effectiveTarget = targetZ + overcorrectionOffset;
        const diff = effectiveTarget - currentPaddleZ;
        
        if (isOvercorrecting && Math.abs(diff) < currentDeadZone * 0.5) {
            isOvercorrecting = false;
            overcorrectionOffset = 0;
        }
        
        let tempDeadZone = currentDeadZone;
        if (Math.random() < 0.2) {
            const modifier = Math.random() < 0.5 ? 1.8 : 0.3;
            tempDeadZone = currentDeadZone * modifier;
        }
        
        const wantsToMoveUp = diff < -tempDeadZone;
        const wantsToMoveDown = diff > tempDeadZone;
        const wantsToStop = !wantsToMoveUp && !wantsToMoveDown;
        
        const isChangingDirection = 
            (lastDecision.moveUp && wantsToMoveDown) ||
            (lastDecision.moveDown && wantsToMoveUp) ||
            ((lastDecision.moveUp || lastDecision.moveDown) && wantsToStop);
        
        // ✅ Si on veut changer de direction, vérifier le temps accumulé
        if (isChangingDirection) {
            if (timeSinceLastChange < MIN_STABILITY_TIME) {
                timeSinceLastChange += deltaTime;
                return lastDecision;
            }
            // Autoriser le changement et réinitialiser
            timeSinceLastChange = 0;
        } else {
            // Même direction, réinitialiser
            timeSinceLastChange = 0;
        }
        
        const newDecision = {
            moveUp: wantsToMoveUp,
            moveDown: wantsToMoveDown
        };
        
        lastDecision = newDecision;
        return newDecision;
    }
    
    return {
        updateVision,
        makeDecision
    };
}