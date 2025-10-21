import { Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Mesh, GlowLayer } from "@babylonjs/core";
import { FIELD_CONFIG, GAME_OBJECTS, POSITIONS, COLORS, VISUAL_CONFIG } from "../config/gameConfig";


export function setupScene(scene: Scene): void {
    setupCamera(scene);
    setupLights(scene);
    
    // Créer le terrain et l'environnement
    createField(scene);
    createWalls(scene);
    
    // Créer les éléments de jeu
    const paddle1 = createPaddle(scene, "paddle1", new Vector3(POSITIONS.PADDLE1_X, 0, 0), COLORS.PADDLE1);
    const paddle2 = createPaddle(scene, "paddle2", new Vector3(POSITIONS.PADDLE2_X, 0, 0), COLORS.PADDLE2);
    const ball = createBall(scene, "ball", new Vector3(POSITIONS.CENTER_X, POSITIONS.CENTER_Y, POSITIONS.CENTER_Z), COLORS.BALL);
    
    // Effets visuels
    setupGlowEffect(scene, paddle1);
    setupGlowEffect(scene, paddle2);
    setupGlowEffect(scene, ball, VISUAL_CONFIG.BALL_GLOW_INTENSITY);
}

function setupCamera(scene: Scene): void {
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, 0, 10, Vector3.Zero(), scene);
    camera.attachControl(scene.getEngine().getRenderingCanvas()!, true);
    
    // Désactiver SEULEMENT les contrôles clavier, garder la souris
    camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
}

function setupLights(scene: Scene): void {
    new HemisphericLight("light1", new Vector3(0, 10, 0), scene);
}

function createPaddle(scene: Scene, name: string, position: Vector3, color: string): Mesh {
    const box = MeshBuilder.CreateBox(name, { 
		size: 1,
		width: GAME_OBJECTS.PADDLE_WIDTH,
		height: GAME_OBJECTS.PADDLE_HEIGHT,
		depth: GAME_OBJECTS.PADDLE_DEPTH
	}, scene);

	box.position = position;

	setColor(box, color, scene);

    return box;
}

function createBall(scene: Scene, name: string, position: Vector3, color: string): Mesh {
    const sphere = MeshBuilder.CreateSphere(name, { diameter: GAME_OBJECTS.BALL_DIAMETER }, scene);
    sphere.position = position;

    setColor(sphere, color, scene);
    return sphere;
}

function createField(scene: Scene): void {
    // Sol du terrain
    const ground = MeshBuilder.CreateGround("ground", { 
        width: FIELD_CONFIG.WIDTH + 3, 
        height: FIELD_CONFIG.HEIGHT + 1 
    }, scene);
    const groundMaterial = new StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = Color3.FromHexString(COLORS.GROUND);
    groundMaterial.specularColor = new Color3(VISUAL_CONFIG.GROUND_SPECULAR_INTENSITY, VISUAL_CONFIG.GROUND_SPECULAR_INTENSITY, VISUAL_CONFIG.GROUND_SPECULAR_INTENSITY);
    ground.material = groundMaterial;
    ground.position.y = -0.5;
    
    // Ligne centrale (correspond à la hauteur du terrain)
    const centerLine = MeshBuilder.CreateBox("centerLine", { 
        width: GAME_OBJECTS.CENTER_LINE_WIDTH, 
        height: GAME_OBJECTS.CENTER_LINE_HEIGHT, 
        depth: FIELD_CONFIG.HEIGHT 
    }, scene);
    centerLine.position = new Vector3(POSITIONS.CENTER_X, POSITIONS.CENTER_Y, POSITIONS.CENTER_Z);
    setColor(centerLine, COLORS.CENTER_LINE, scene);
    setupGlowEffect(scene, centerLine);
}

function createWalls(scene: Scene): void {
    // Mur du haut (aligné au bord du sol)
    const topWall = MeshBuilder.CreateBox("topWall", { 
        width: FIELD_CONFIG.WIDTH + 2, 
        height: FIELD_CONFIG.WALL_HEIGHT, 
        depth: FIELD_CONFIG.WALL_THICKNESS 
    }, scene);
    topWall.position = new Vector3(0, 0.5, FIELD_CONFIG.HEIGHT/2);
    setColor(topWall, COLORS.WALLS, scene);
    setupGlowEffect(scene, topWall);
    
    // Mur du bas (aligné au bord du sol)
    const bottomWall = MeshBuilder.CreateBox("bottomWall", { 
        width: FIELD_CONFIG.WIDTH + 2, 
        height: FIELD_CONFIG.WALL_HEIGHT, 
        depth: FIELD_CONFIG.WALL_THICKNESS 
    }, scene);
    bottomWall.position = new Vector3(0, 0.5, -FIELD_CONFIG.HEIGHT/2);
    setColor(bottomWall, COLORS.WALLS, scene);
    setupGlowEffect(scene, bottomWall);
}

function setColor(mesh: Mesh, color: string, scene: Scene): void {
    const material = new StandardMaterial(`material_${mesh.name}`, scene);
    material.diffuseColor = Color3.FromHexString(color);
    
    mesh.material = material;
}

function setupGlowEffect(scene: Scene, mesh: Mesh, intensity: number = VISUAL_CONFIG.GLOW_INTENSITY): void {
    // Créer le glow layer
    const glowLayer = new GlowLayer("glow", scene);
    
    // Configurer l'intensité et la taille de la lueur
    glowLayer.intensity = intensity;
    
    // Ajouter le mesh au glow layer
    glowLayer.addIncludedOnlyMesh(mesh);
    
    // Personnaliser la couleur du glow basée sur la couleur du mesh
    glowLayer.customEmissiveColorSelector = function(_mesh, _subMesh, material, result) {
        if (material && material instanceof StandardMaterial && material.diffuseColor) {
            // Utiliser la couleur diffuse du matériau pour le glow
            const color = material.diffuseColor;
            result.set(color.r, color.g, color.b, 1);
        } else {
            // Couleur par défaut si pas de matériau StandardMaterial
            result.set(1, 1, 1, 1); // Blanc
        }
    };
}
