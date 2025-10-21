import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Scene } from "@babylonjs/core";
import { setupScene } from "./scene/sceneSetup";
import { setupControls } from "./controls/gameControls";
import { createBallPhysics, type ComposedPhysicsSystem } from "./physics/BallPhysicsComposed";

/**
 * État global du jeu Pong
 * Utilise des variables de module pour éviter les fuites mémoire
 */
let engine: Engine | null = null;
let scene: Scene | null = null;
let ballPhysics: ComposedPhysicsSystem | null = null;

/**
 * Met à jour l'affichage du score dans l'interface utilisateur
 */
function updateScoreDisplay(player1Score: number, player2Score: number): void {
    const player1ScoreElement = document.getElementById("player1-score");
    const player2ScoreElement = document.getElementById("player2-score");
    
    if (player1ScoreElement) {
        player1ScoreElement.textContent = player1Score.toString();
    }
    
    if (player2ScoreElement) {
        player2ScoreElement.textContent = player2Score.toString();
    }
}

/**
 * Initialise le jeu Pong avec Babylon.js
 * @returns Promise<boolean> - true si l'initialisation réussit
 */
export async function initPongGame(): Promise<boolean> {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    
    if (!canvas) {
        console.error("Canvas with id 'gameCanvas' not found");
        return false;
    }

    // Nettoyage préventif de l'état précédent
    disposePongGame();

    try {
        // Initialisation du moteur 3D
        engine = new Engine(canvas, true);
        scene = new Scene(engine);

        // Configuration de la scène de jeu
        setupScene(scene);
        setupControls(scene, engine);
        
        // Initialisation du système de physique
        ballPhysics = createBallPhysics(scene);
        ballPhysics.onScoreUpdate = updateScoreDisplay;
        
        // Démarrage de la boucle de rendu
        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
            }
        });
        
        console.log("Babylon.js game initialized successfully");
        return true;
        
    } catch (error) {
        console.error("Error initializing game:", error);
        disposePongGame(); // Nettoyage en cas d'erreur
        return false;
    }
}

/**
 * Libère toutes les ressources du jeu pour éviter les fuites mémoire
 */
export function disposePongGame(): void {
    try {
        // Nettoyage dans l'ordre inverse de création
        ballPhysics = null;
        
        if (scene) {
            scene.dispose();
            scene = null;
        }
        
        if (engine) {
            engine.dispose();
            engine = null;
        }
        
        console.log("Pong game disposed successfully");
    } catch (error) {
        console.error("Error disposing game:", error);
    }
}

