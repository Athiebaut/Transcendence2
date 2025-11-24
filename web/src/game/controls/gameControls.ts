import { Scene, Engine, Vector3 } from "@babylonjs/core";
import type { GameMode } from "../config/gameModeConfig";
import { GAME_MODES } from "../config/gameModeConfig";
import { PHYSICS_CONFIG, FIELD_CONFIG, GAME_OBJECTS } from "../config/gameConfig";
import { createAI } from "./ai.ts";

interface KeyState {
    [key: string]: boolean;
}

function createKeyboardHandler(keys: string[]): KeyState {
    const state: KeyState = {};
    
    keys.forEach(key => {
        state[key] = false;
    });
    
    window.addEventListener("keydown", (ev) => {
        if (keys.includes(ev.code)) {
            state[ev.code] = true;
        }
    });
    
    window.addEventListener("keyup", (ev) => {
        if (keys.includes(ev.code)) {
            state[ev.code] = false;
        }
    });
    
    return state;
}

function updatePaddlePosition(
    paddle: any,
    isUp: boolean,
    isDown: boolean,
    moveSpeed: number,
    minZ: number,
    maxZ: number
): void {
    if (!paddle) return;
    
    if (isUp && paddle.position.z > minZ) {
        paddle.position.z -= moveSpeed;
    }
    if (isDown && paddle.position.z < maxZ) {
        paddle.position.z += moveSpeed;
    }
}

export function setupControls(scene: Scene, engine: Engine, mode: GameMode = 'pvp1v1'): void {
    const config = GAME_MODES[mode];
    
    setupDebugControls(scene);
    setupResizeHandler(engine);
    
    if (config.hasAI) {
        setupPlayerVsAI(scene);
    } else if (config.playerCount === 4) {
        setupTeamControls(scene);
    } else if (config.isTournament) {
        setupTournamentControls(scene);
    } else {
        setupPvPControls(scene);
    }
    
    const canvas = engine.getRenderingCanvas();
    if (canvas) {
        canvas.focus();
    }
}

function setupDebugControls(scene: Scene): void {
    window.addEventListener("keydown", (ev) => {
        if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.code === "KeyI") {
            if (scene.debugLayer.isVisible()) {
                scene.debugLayer.hide();
            } else {
                scene.debugLayer.show();
            }
        }
    });
}

function setupPvPControls(scene: Scene): void {
    const keys = createKeyboardHandler(["KeyW", "KeyS", "ArrowUp", "ArrowDown"]);
    
    scene.registerBeforeRender(() => {
        const leftPaddle = scene.getMeshByName("leftPaddle");
        const rightPaddle = scene.getMeshByName("rightPaddle");
        
        const paddleSpeed = PHYSICS_CONFIG.PADDLE_SPEED;
        const moveSpeed = paddleSpeed * scene.deltaTime;
        
        const paddleHalfDepth = GAME_OBJECTS.PADDLE_DEPTH / 2;
        const wallThickness = FIELD_CONFIG.WALL_THICKNESS;
        const fieldLimit = FIELD_CONFIG.HEIGHT / 2;
        
        const maxZ = fieldLimit - wallThickness/2 - paddleHalfDepth;
        const minZ = -fieldLimit + wallThickness/2 + paddleHalfDepth;
        
        updatePaddlePosition(leftPaddle, keys["KeyW"], keys["KeyS"], moveSpeed, minZ, maxZ);
        updatePaddlePosition(rightPaddle, keys["ArrowUp"], keys["ArrowDown"], moveSpeed, minZ, maxZ);
    });
}

function setupPlayerVsAI(scene: Scene): void {
    const keys = createKeyboardHandler(["KeyW", "KeyS"]);
    const ai = createAI();
    
    scene.registerBeforeRender(() => {
        const leftPaddle = scene.getMeshByName("leftPaddle");
        const rightPaddle = scene.getMeshByName("rightPaddle");
        const ball = scene.getMeshByName("ball");
        
        if (!leftPaddle || !rightPaddle || !ball) return;

        const deltaTime = scene.deltaTime;
        
        const paddleSpeed = PHYSICS_CONFIG.PADDLE_SPEED;
        const moveSpeed = paddleSpeed * deltaTime;
        
        const paddleHalfDepth = GAME_OBJECTS.PADDLE_DEPTH / 2;
        const wallThickness = FIELD_CONFIG.WALL_THICKNESS;
        const fieldLimit = FIELD_CONFIG.HEIGHT / 2;
        
        const maxZ = fieldLimit - wallThickness/2 - paddleHalfDepth;
        const minZ = -fieldLimit + wallThickness/2 + paddleHalfDepth;
        
        // Joueur 1 (contrôles manuels)
        updatePaddlePosition(leftPaddle, keys["KeyW"], keys["KeyS"], moveSpeed, minZ, maxZ);
        
        // IA pour le paddle de droite
        const currentTime = performance.now();
        const ballVelocity = ball.metadata?.physicsVelocity || new Vector3(0.006, 0, 0);

        ai.updateVision(ball.position, ballVelocity, rightPaddle.position.x, currentTime);

        const decision = ai.makeDecision(rightPaddle.position.z, scene.deltaTime);
        updatePaddlePosition(rightPaddle, decision.moveUp, decision.moveDown, moveSpeed * 0.8, minZ, maxZ);
    });
}

function setupTeamControls(scene: Scene): void {
    const keys = createKeyboardHandler([
        "KeyW", "KeyS",      // Joueur 1
        "KeyT", "KeyG",      // Joueur 2
        "ArrowUp", "ArrowDown", // Joueur 3
        "KeyI", "KeyK"       // Joueur 4
    ]);
    
    scene.registerBeforeRender(() => {
        const leftPaddle1 = scene.getMeshByName("leftPaddle1");
        const leftPaddle2 = scene.getMeshByName("leftPaddle2");
        const rightPaddle1 = scene.getMeshByName("rightPaddle1");
        const rightPaddle2 = scene.getMeshByName("rightPaddle2");
        
        const paddleSpeed = PHYSICS_CONFIG.PADDLE_SPEED;
        const moveSpeed = paddleSpeed * scene.deltaTime;
        
        const paddleHalfDepth = GAME_OBJECTS.PADDLE_DEPTH / 2;
        const wallThickness = FIELD_CONFIG.WALL_THICKNESS;
        const fieldLimit = FIELD_CONFIG.HEIGHT / 2;
        
        // ✅ Calcul des limites pour chaque moitié de terrain
        // Moitié supérieure (z positif) : de 0 à fieldLimit
        const upperHalfMaxZ = fieldLimit - wallThickness/2 - paddleHalfDepth;
        const upperHalfMinZ = 0 + paddleHalfDepth; // Ligne centrale
        
        // Moitié inférieure (z négatif) : de -fieldLimit à 0
        const lowerHalfMaxZ = 0 - paddleHalfDepth; // Ligne centrale
        const lowerHalfMinZ = -fieldLimit + wallThickness/2 + paddleHalfDepth;
        
        // Paddles de la moitié supérieure (leftPaddle1 et rightPaddle1)
        updatePaddlePosition(leftPaddle1, keys["KeyW"], keys["KeyS"], moveSpeed, upperHalfMinZ, upperHalfMaxZ);
        updatePaddlePosition(rightPaddle1, keys["ArrowUp"], keys["ArrowDown"], moveSpeed, upperHalfMinZ, upperHalfMaxZ);
        
        // Paddles de la moitié inférieure (leftPaddle2 et rightPaddle2)
        updatePaddlePosition(leftPaddle2, keys["KeyT"], keys["KeyG"], moveSpeed, lowerHalfMinZ, lowerHalfMaxZ);
        updatePaddlePosition(rightPaddle2, keys["KeyI"], keys["KeyK"], moveSpeed, lowerHalfMinZ, lowerHalfMaxZ);
    });
}

function setupTournamentControls(scene: Scene): void {
    setupPvPControls(scene);
}

function setupResizeHandler(engine: Engine): void {
    window.addEventListener("resize", () => {
        engine.resize();
    });
}