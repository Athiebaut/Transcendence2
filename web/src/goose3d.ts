// web/src/goose3d.ts

import {
  Engine,
  Scene,
  Vector3,
  Color4,
  HemisphericLight,
  ArcRotateCamera,
  Camera,
  SceneLoader,
  AbstractMesh,
  AnimationGroup,
} from "@babylonjs/core";
import "@babylonjs/loaders";

let engine: Engine | null = null;
let scene: Scene | null = null;
let canvas: HTMLCanvasElement | null = null;
let camera: ArcRotateCamera | null = null;
let goose: AbstractMesh | null = null;

// Animations
let walkAnim: AnimationGroup | null = null;
let idleAnims: AnimationGroup[] = [];
let currentIdleAnim: AnimationGroup | null = null;

let isActive = false;

// FSM de l'oie
let state: "idle" | "moving" = "idle";
let idleTimer = 0;

let walkPhase = 0;     // phase pour le "bobbing" pendant la marche

// Mouvement lissé en 2D (comme Desktop Goose!)
let startPos = new Vector3(0, 0, 0);
let targetPos = new Vector3(0, 0, 0);
let moveTime = 0;
let moveDuration = 2.0; // durée d'une marche (s)

// Paramètres de comportement Desktop Goose
const SPEED_BASE = 0.7;           // Vitesse de déplacement
const SHORT_IDLE_MIN = 0.3;       // Pause courte minimale
const SHORT_IDLE_MAX = 1.0;       // Pause courte maximale
const LONG_IDLE_MIN = 1.5;        // Pause longue minimale
const LONG_IDLE_MAX = 3.0;        // Pause longue maximale
const MARGIN_WORLD = 0.5;         // Marge aux bords
const BOBBING_AMPLITUDE = 0.03;   // Amplitude du "bobbing" pendant la marche
const BOBBING_FREQUENCY = 6.0;    // Fréquence du bobbing
const MIN_MOVE_DISTANCE = 1.0;    // Distance minimale de déplacement
const MAX_MOVE_DISTANCE = 4.0;    // Distance maximale de déplacement

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// Durée de pause : parfois courte, parfois longue
function pickIdleDuration(afterMove: boolean): number {
  const longChance = afterMove ? 0.7 : 0.3; // plus de chances d'une grosse pause après avoir marché
  if (Math.random() < longChance) {
    return rand(LONG_IDLE_MIN, LONG_IDLE_MAX);
  }
  return rand(SHORT_IDLE_MIN, SHORT_IDLE_MAX);
}

export function initGoose3D() {
  if (engine) return; // déjà fait

  // Canvas plein écran transparent par-dessus le reste
  canvas = document.createElement("canvas");
  canvas.id = "goose3d-canvas";
  canvas.style.position = "fixed";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none"; // Permettre les interactions
  canvas.style.zIndex = "60";
  canvas.style.display = "none";       // montré seulement sur la Home
  canvas.style.cursor = "default";     // curseur normal
  document.body.appendChild(canvas);

  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  engine = new Engine(canvas, true, {
    preserveDrawingBuffer: false,  // Désactiver pour de meilleures performances
    stencil: false,                // Pas nécessaire ici
    antialias: false,               // Désactiver l'antialiasing pour éviter les ralentissements
  });

  // 👉 Rendu optimisé - limiter le DPR pour éviter la surcharge
  const effectiveDpr = Math.min(dpr, 2); // Limiter à 2x max
  engine.setHardwareScalingLevel(1 / effectiveDpr);

  scene = new Scene(engine);
  scene.clearColor = new Color4(0, 0, 0, 0); // fond transparent

  // Caméra vue de dessus/isométrique pour voir l'oie se balader partout
  camera = new ArcRotateCamera(
    "gooseCamera",
    Math.PI / 2,        // alpha (rotation horizontale)
    Math.PI / 3,        // beta (angle de vue - plus bas = plus de dessus)
    12,                 // radius (zoom)
    new Vector3(0, 0, 0),
    scene
  );
  camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
  updateCameraOrtho();

  new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Chargement du modèle 3D + animations
  SceneLoader.ImportMesh(
    "",
    "/models/",
    "goose.glb",
    scene,
    (
      meshes,
      _ps,
      _skeletons,
      animationGroups?: AnimationGroup[]
    ) => {
      if (!meshes || meshes.length === 0) return;
      goose = meshes[0];

      // 👉 TAILLE DU MODÈLE (légèrement plus grande pour mieux la voir)
      goose.scaling.scaleInPlace(0.35);

      // --- SPAWN ALÉATOIRE EN 2D (comme Desktop Goose!) ---
      const left = camera?.orthoLeft ?? -5;
      const right = camera?.orthoRight ?? 5;
      const bottom = camera?.orthoBottom ?? -3;
      const top = camera?.orthoTop ?? 3;
      
      const minX = left + MARGIN_WORLD;
      const maxX = right - MARGIN_WORLD;
      const minZ = bottom + MARGIN_WORLD;
      const maxZ = top - MARGIN_WORLD;
      
      const spawnX = rand(minX, maxX);
      const spawnZ = rand(minZ, maxZ);

      goose.position = new Vector3(spawnX, 0, spawnZ);
      
      // Sauvegarder la position de départ
      startPos.copyFrom(goose.position);
      targetPos.copyFrom(goose.position);

      // --- Sélection des animations ---
      if (animationGroups && animationGroups.length > 0) {
        console.log(
          "Animations disponibles sur goose.glb :",
          animationGroups.map((g) => g.name)
        );

        // Noms que tu veux utiliser
        const WALK_NAME = "fancywalk";
        const IDLE_NAMES = ["gooseidle", "goose_idle_proud", "gooseSneakIdle"];

        walkAnim =
          animationGroups.find((g) => g.name === WALK_NAME) ?? null;

        idleAnims = animationGroups.filter((g) =>
          IDLE_NAMES.includes(g.name)
        );

        console.log("walkAnim sélectionnée :", walkAnim?.name);
        console.log(
          "idleAnims sélectionnées :",
          idleAnims.map((g) => g.name)
        );

        // On commence en idle, avec une anim idle aléatoire
        state = "idle";
        idleTimer = pickIdleDuration(false);
        playIdleAnimation();
      } else {
        console.log("Aucune AnimationGroup trouvée sur goose.glb");
      }
      
      // 👉 Rendre l'oie cliquable
      goose.isPickable = true;
    }
  );

  // 👉 Gestion du clic sur l'oie
  scene.onPointerDown = (_evt, pickResult) => {
    if (pickResult.hit && pickResult.pickedMesh && goose) {
      // Vérifier si on a cliqué sur l'oie ou un de ses enfants
      let mesh = pickResult.pickedMesh;
      while (mesh) {
        if (mesh === goose) {
          onGooseClick();
          break;
        }
        mesh = mesh.parent as AbstractMesh;
      }
    }
  };

  // Limiter le framerate à 30 fps pour éviter la surcharge
  let lastRenderTime = 0;
  const targetFrameTime = 1000 / 30; // 30 fps
  
  engine.runRenderLoop(() => {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastRenderTime;
    
    // Skip frame si on est en dessous du temps cible
    if (deltaTime < targetFrameTime) {
      return;
    }
    
    lastRenderTime = currentTime;
    
    if (!scene || !engine || !camera) return;
    updateGoose();
    scene.render();
  });

  window.addEventListener("resize", () => {
    if (!engine || !camera || !canvas) return;

    const newDpr = Math.min(window.devicePixelRatio || 1, 2); // Limiter à 2x max
    canvas.width = window.innerWidth * newDpr;
    canvas.height = window.innerHeight * newDpr;

    engine.setHardwareScalingLevel(1 / newDpr);
    engine.resize();
    updateCameraOrtho();
  });
}

function updateCameraOrtho() {
  if (!engine || !camera) return;

  const width = engine.getRenderWidth();
  const height = engine.getRenderHeight() || 1;
  const aspect = width / height;

  // 👉 Vue plus large pour que l'oie puisse se balader partout
  const worldHeight = 8;  // Hauteur du monde visible
  const worldWidth = worldHeight * aspect;

  camera.orthoLeft = -worldWidth / 2;
  camera.orthoRight = worldWidth / 2;
  camera.orthoBottom = -worldHeight / 2;
  camera.orthoTop = worldHeight / 2;
}

// Easing pour que le mouvement soit moins "robotique"
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// --- Gestion des animations ---

function stopCurrentIdle() {
  if (currentIdleAnim) {
    currentIdleAnim.stop();
    currentIdleAnim = null;
  }
}

function playIdleAnimation() {
  if (walkAnim) walkAnim.stop();
  stopCurrentIdle();
  if (idleAnims.length === 0) return;
  const next =
    idleAnims[Math.floor(Math.random() * idleAnims.length)];
  currentIdleAnim = next;
  next.reset();
  next.start(true, 1.0); // loop
}

function playWalkAnimation() {
  stopCurrentIdle();
  if (walkAnim) {
    walkAnim.reset();
    // 👉 Vitesse d'animation ajustée pour un meilleur rendu
    walkAnim.start(true, 0.5); // loop, vitesse réduite pour plus de fluidité
  }
}

// --- Interaction avec l'oie ---

function onGooseClick() {
  if (!goose || !camera) return;
  
  console.log("🦢 HONK! L'oie a été cliquée!");
  
  // Faire "sauter" l'oie
  const jumpHeight = 0.8;
  const jumpDuration = 0.5;
  let jumpTime = 0;
  const startY = goose.position.y;
  
  // L'oie peut aussi tourner légèrement pendant le saut
  const startRotation = goose.rotation.y;
  const spinAmount = (Math.random() - 0.5) * Math.PI / 4; // Rotation aléatoire ±45°
  
  // Animation de saut
  const jumpInterval = setInterval(() => {
    if (!goose) {
      clearInterval(jumpInterval);
      return;
    }
    
    jumpTime += 0.016; // ~60fps
    const progress = jumpTime / jumpDuration;
    
    if (progress >= 1) {
      goose.position.y = 0;
      goose.rotation.y = startRotation + spinAmount;
      clearInterval(jumpInterval);
      
      // Changer d'animation idle après le saut
      playIdleAnimation();
      
      // L'oie va vouloir bouger plus vite maintenant !
      if (state === "idle") {
        idleTimer = Math.min(idleTimer, 0.3);
      }
      return;
    }
    
    // Trajectoire parabolique avec rotation
    const jumpProgress = Math.sin(progress * Math.PI);
    goose.position.y = startY + jumpProgress * jumpHeight;
    goose.rotation.y = startRotation + spinAmount * progress;
  }, 16);
  
  // Réduire le timer d'idle pour qu'elle bouge plus vite après le clic
  if (state === "idle") {
    idleTimer = Math.min(idleTimer, 0.5);
  }
}

// --- Update principal ---

function updateGoose() {
  if (!engine || !camera || !goose) return;

  const dt = engine.getDeltaTime() / 1000; // en secondes

  if (!isActive) {
    return;
  }

  // --- ÉTAT : IDLE ---
  if (state === "idle") {
    idleTimer -= dt;

    // en idle : on laisse juste l'anim idle faire le boulot
    // Léger bobbing même en idle pour plus de vie
    const idleBob = Math.sin(Date.now() * 0.001) * 0.01;
    goose.position.y = idleBob;

    if (idleTimer <= 0) {
      // 👉 Choix d'une nouvelle destination aléatoire EN 2D (comme Desktop Goose!)
      const left = camera.orthoLeft ?? -5;
      const right = camera.orthoRight ?? 5;
      const bottom = camera.orthoBottom ?? -3;
      const top = camera.orthoTop ?? 3;
      
      const minX = left + MARGIN_WORLD;
      const maxX = right - MARGIN_WORLD;
      const minZ = bottom + MARGIN_WORLD;
      const maxZ = top - MARGIN_WORLD;

      // Nouvelle position aléatoire
      const newX = rand(minX, maxX);
      const newZ = rand(minZ, maxZ);

      startPos.copyFrom(goose.position);
      targetPos.set(newX, 0, newZ);

      // Distance et durée
      const distance = Vector3.Distance(startPos, targetPos);
      // S'assurer d'une distance minimale pour éviter les micro-mouvements
      if (distance < MIN_MOVE_DISTANCE) {
        // Trop proche, on cherche plus loin
        const angle = Math.random() * Math.PI * 2;
        const dist = rand(MIN_MOVE_DISTANCE, MAX_MOVE_DISTANCE);
        targetPos.x = goose.position.x + Math.cos(angle) * dist;
        targetPos.z = goose.position.z + Math.sin(angle) * dist;
        
        // Clamp dans les limites
        targetPos.x = Math.max(minX, Math.min(maxX, targetPos.x));
        targetPos.z = Math.max(minZ, Math.min(maxZ, targetPos.z));
      }

      const finalDistance = Vector3.Distance(startPos, targetPos);
      moveDuration = Math.max(1.5, finalDistance / SPEED_BASE);

      // 👉 Orientation vers la destination (rotation sur Y)
      const direction = targetPos.subtract(startPos);
      // Correction: inverser les paramètres pour orienter l'oie dans la bonne direction
      const angle = Math.atan2(-direction.x, -direction.z);
      goose.rotationQuaternion = null;
      goose.rotation.y = angle;

      state = "moving";
      moveTime = 0;
      walkPhase = 0;

      // On lance l'animation de marche
      playWalkAnimation();
    }

    return;
  }

  // --- ÉTAT : MOVING ---
  if (state === "moving") {
    moveTime += dt;
    const t = Math.min(moveTime / moveDuration, 1);

    // interpolation lissée en 2D (X et Z)
    const eased = easeInOutQuad(t);
    const newPos = Vector3.Lerp(startPos, targetPos, eased);
    goose.position.x = newPos.x;
    goose.position.z = newPos.z;

    // 👉 Bobbing pendant la marche
    walkPhase += dt * BOBBING_FREQUENCY;
    const bobbing = Math.sin(walkPhase) * BOBBING_AMPLITUDE;
    goose.position.y = bobbing;

    if (t >= 1) {
      goose.position.copyFrom(targetPos);
      goose.position.y = 0;
      state = "idle";

      // prochaine pause (parfois longue)
      idleTimer = pickIdleDuration(true);

      // anim idle immobile
      playIdleAnimation();
    }
  }
}


export function setGoose3DActive(active: boolean) {
  isActive = active;

  if (canvas) {
    canvas.style.display = active ? "block" : "none";
  }

  // Quand on revient sur la Home, si on est en idle et sans timer,
  // on prévoit une pause tranquille.
  if (active && state === "idle" && idleTimer <= 0) {
    idleTimer = pickIdleDuration(false);
  }
}