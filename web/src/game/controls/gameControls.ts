import { Scene, Engine } from "@babylonjs/core";
import { PHYSICS_CONFIG, FIELD_CONFIG, GAME_OBJECTS } from "../config/gameConfig";

export function setupControls(scene: Scene, engine: Engine): void {
    setupDebugControls(scene);
    setupResizeHandler(engine);
    setupSmoothMovementControls(scene);
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

function setupSmoothMovementControls(scene: Scene): void {
    // États des touches pour les deux joueurs
    let player1Up = false;
    let player1Down = false;
    let player2Up = false;
    let player2Down = false;

    window.addEventListener("keydown", (ev) => {
        switch (ev.code) {
            case "KeyW":
                player1Up = true;
                break;
            case "KeyS":
                player1Down = true;
                break;
            case "ArrowUp":
                player2Up = true;
                break;
            case "ArrowDown":
                player2Down = true;
                break;
        }
    });
    
    window.addEventListener("keyup", (ev) => {
        switch (ev.code) {
            case "KeyW":
                player1Up = false;
                break;
            case "KeyS":
                player1Down = false;
                break;
            case "ArrowUp":
                player2Up = false;
                break;
            case "ArrowDown":
                player2Down = false;
                break;
        }
    });
    
    scene.registerBeforeRender(() => {
        const paddle1 = scene.getMeshByName("paddle1");
        const paddle2 = scene.getMeshByName("paddle2");
        
        // Vitesse en unités par seconde, ajustée avec deltaTime
        const paddleSpeed = PHYSICS_CONFIG.PADDLE_SPEED;
        const moveSpeed = paddleSpeed * scene.deltaTime;
        
        // Limites du terrain ajustées pour les bords des paddles ET l'épaisseur des murs
        const paddleHalfDepth = GAME_OBJECTS.PADDLE_DEPTH / 2;
        const wallThickness = FIELD_CONFIG.WALL_THICKNESS;
        const fieldLimit = FIELD_CONFIG.HEIGHT / 2;
        
        const maxZ = fieldLimit - wallThickness/2 - paddleHalfDepth; // Face intérieure du mur
        const minZ = -fieldLimit + wallThickness/2 + paddleHalfDepth; // Face intérieure du mur
        
        if (paddle1) {
            if (player1Up && paddle1.position.z > minZ) {
                paddle1.position.z -= moveSpeed;
            }
            if (player1Down && paddle1.position.z < maxZ) {
                paddle1.position.z += moveSpeed;
            }
        }
        
        if (paddle2) {
            if (player2Up && paddle2.position.z > minZ) {
                paddle2.position.z -= moveSpeed;
            }
            if (player2Down && paddle2.position.z < maxZ) {
                paddle2.position.z += moveSpeed;
            }
        }
    });
}

function setupResizeHandler(engine: Engine): void {
    window.addEventListener("resize", () => {
        engine.resize();
    });
}
