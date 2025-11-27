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
  Matrix,
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
let halfFlapAnim: AnimationGroup | null = null;  // Animation de course vers la cible
let angryFlapAnim: AnimationGroup | null = null; // Animation de poussée

let isActive = false;

// FSM de l'oie
let state: "idle" | "moving" | "pushing" = "idle";
let idleTimer = 0;

let walkPhase = 0;     // phase pour le "bobbing" pendant la marche

// Mouvement lissé en 2D (comme Desktop Goose!)
let startPos = new Vector3(0, 0, 0);
let targetPos = new Vector3(0, 0, 0);
let moveTime = 0;
let moveDuration = 2.0; // durée d'une marche (s)

// Comportement de poussée de balises
let targetElement: HTMLElement | null = null;
let pushStartTime = 0;
let pushDuration = 2.0; // durée de la poussée (s)
let timeSinceLastPush = 0;
const PUSH_COOLDOWN = 8; // temps minimum entre deux poussées (s)
const PUSH_CHANCE = 0.5; // 50% de chance de pousser après le cooldown

// Coordonnées écran cibles pour la poussée (pour vérifier que l'oie est au bon endroit)
let targetScreenX = 0;
let targetScreenY = 0;
let pushDirection = ""; // "LEFT", "RIGHT", "TOP", "BOTTOM"

// Paramètres de comportement Desktop Goose
const SPEED_BASE = 0.7;           // Vitesse de déplacement normal
const SPEED_RUN = 2.0;            // Vitesse de course (pour pousser!)
const SHORT_IDLE_MIN = 0.3;       // Pause courte minimale
const SHORT_IDLE_MAX = 1.0;       // Pause courte maximale
const LONG_IDLE_MIN = 1.5;        // Pause longue minimale
const LONG_IDLE_MAX = 3.0;        // Pause longue maximale
const MARGIN_WORLD = 0.5;         // Marge aux bords
const BOBBING_AMPLITUDE = 0.03;   // Amplitude du "bobbing" pendant la marche
const BOBBING_FREQUENCY = 6.0;    // Fréquence du bobbing
const BOBBING_FREQUENCY_RUN = 12.0; // Fréquence du bobbing en courant
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
  canvas.style.pointerEvents = "none"; // Permettre les interactions avec les éléments en dessous
  canvas.style.zIndex = "999999";      // Z-index TRÈS élevé pour être au-dessus de TOUT
  canvas.style.display = "none";       // caché par défaut, montré selon la route
  canvas.style.cursor = "default";     // curseur normal
  document.body.appendChild(canvas);

  console.log("🦢 Canvas de l'oie créé et ajouté au DOM");

  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  engine = new Engine(canvas, true, {
    preserveDrawingBuffer: false,  // Désactiver pour de meilleures performances
    stencil: false,                // Pas nécessaire ici
    antialias: false,               // Désactiver l'antialiasing pour éviter les ralentissements
  });

  // Rendu optimisé - limiter le DPR pour éviter la surcharge
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
      if (!meshes || meshes.length === 0) {
        console.error("❌ Aucun mesh trouvé dans goose.glb");
        return;
      }
      goose = meshes[0];
      
      console.log("✅ Modèle goose.glb chargé avec succès !", meshes.length, "meshes");
      console.log("🦢 Mesh principal:", goose.name);
      console.log("🦢 Position initiale:", goose.position.x, goose.position.y, goose.position.z);

      // TAILLE DU MODÈLE (légèrement plus grande pour mieux la voir)
      goose.scaling.scaleInPlace(0.35);
      console.log("🦢 Scaling appliqué:", goose.scaling.x);

      // --- SPAWN ALÉATOIRE EN 2D ---
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

        // Noms utilises
        const WALK_NAME = "fancywalk";
        const IDLE_NAMES = ["gooseidle", "goose_idle_proud", "gooseSneakIdle"];
        const HALF_FLAP_NAME = "gooseHalfFlap";
        const ANGRY_FLAP_NAME = "angryflapping";

        walkAnim =
          animationGroups.find((g) => g.name === WALK_NAME) ?? null;
        
        halfFlapAnim = 
          animationGroups.find((g) => g.name === HALF_FLAP_NAME) ?? null;
        
        angryFlapAnim = 
          animationGroups.find((g) => g.name === ANGRY_FLAP_NAME) ?? null;

        idleAnims = animationGroups.filter((g) =>
          IDLE_NAMES.includes(g.name)
        );

        console.log("walkAnim sélectionnée :", walkAnim?.name);
        console.log("halfFlapAnim sélectionnée :", halfFlapAnim?.name);
        console.log("angryFlapAnim sélectionnée :", angryFlapAnim?.name);
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
    }
  );

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

  // Vue plus large pour que l'oie puisse se balader partout
  const worldHeight = 8;  // Hauteur du monde visible
  const worldWidth = worldHeight * aspect;

  camera.orthoLeft = -worldWidth / 2;
  camera.orthoRight = worldWidth / 2;
  camera.orthoBottom = -worldHeight / 2;
  camera.orthoTop = worldHeight / 2;
}

// Fonctions d'easing pour des mouvements plus naturels
// Easing plus doux pour la marche normale
function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

// Fonction pour lisser la rotation de l'oie
function lerpAngle(from: number, to: number, t: number): number {
  // Normaliser les angles entre -PI et PI
  let diff = to - from;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return from + diff * t;
}

// --- Gestion des animations ---

// Fonction pour vérifier si un élément a une bordure/encadrement visible
function hasVisibleBorder(el: HTMLElement): boolean {
  const style = window.getComputedStyle(el);
  
  // Vérifier les bordures
  const borderTopWidth = parseFloat(style.borderTopWidth) || 0;
  const borderRightWidth = parseFloat(style.borderRightWidth) || 0;
  const borderBottomWidth = parseFloat(style.borderBottomWidth) || 0;
  const borderLeftWidth = parseFloat(style.borderLeftWidth) || 0;
  const hasBorder = (borderTopWidth + borderRightWidth + borderBottomWidth + borderLeftWidth) > 0;
  
  // Vérifier l'outline
  const outlineWidth = parseFloat(style.outlineWidth) || 0;
  const hasOutline = outlineWidth > 0;
  
  // Vérifier le box-shadow (souvent utilisé pour créer des "cartes")
  const boxShadow = style.boxShadow;
  const hasBoxShadow = Boolean(boxShadow && boxShadow !== 'none');
  
  // Vérifier si l'élément a un background différent (peut indiquer une carte/box)
  const bgColor = style.backgroundColor;
  const hasBackground = Boolean(bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent');
  
  // Vérifier le border-radius (souvent présent sur les éléments stylisés)
  const borderRadius = parseFloat(style.borderRadius) || 0;
  
  // Un élément est considéré comme "encadré" s'il a une bordure, outline, box-shadow,
  // ou un background avec border-radius
  return hasBorder || hasOutline || hasBoxShadow || (hasBackground && borderRadius > 0);
}

// Fonction pour obtenir toutes les balises avec encadrement de la page
function getInteractiveElements(): HTMLElement[] {
  const selectors = [
    'button', 'a', 'input', 'select', 'textarea', 
    '.card', '.box', '[role="button"]', 
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
    'img', '.btn', 'p', 'div',
    'nav', 'header', 'footer', 'section',
    'label', 'span', '[class*="button"]',
    '[class*="btn"]', '[id*="button"]',
    '[class*="card"]', '[class*="box"]'
  ];
  
  const elements: HTMLElement[] = [];
  const checkedElements = new Set<HTMLElement>();
  
  selectors.forEach(selector => {
    try {
      const found = document.querySelectorAll(selector);
      found.forEach(el => {
        if (el instanceof HTMLElement && 
            !checkedElements.has(el) && 
            isElementVisible(el) &&
            hasVisibleBorder(el) &&  // NOUVEAU: vérifier qu'il a un encadrement
            el.id !== 'goose3d-canvas') { // Ne pas cibler le canvas de l'oie!
          elements.push(el);
          checkedElements.add(el);
        }
      });
    } catch (e) {
      // Ignorer les sélecteurs invalides
    }
  });
  
  console.log(`🦢 Éléments avec bordure détectés: ${elements.length}`);
  return elements;
}

// Vérifier si un élément est visible
function isElementVisible(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);
  
  return rect.width > 20 && rect.height > 20 && // Taille minimale raisonnable
         rect.top < window.innerHeight && rect.bottom > 0 &&
         rect.left < window.innerWidth && rect.right > 0 &&
         style.display !== 'none' &&
         style.visibility !== 'hidden' &&
         style.opacity !== '0';
}

// Convertir une position d'écran en coordonnées du monde 3D
// Utilise le ray picking de Babylon.js pour une conversion précise
function screenToWorld(screenX: number, screenY: number): Vector3 {
  if (!scene || !camera) return new Vector3(0, 0, 0);
  
  // Créer un ray depuis la position écran
  const ray = scene.createPickingRay(
    screenX * (window.devicePixelRatio || 1),
    screenY * (window.devicePixelRatio || 1),
    null,
    camera
  );
  
  // Trouver l'intersection avec le plan Y=0 (le sol)
  // Le ray part de la caméra avec une direction
  // On cherche le point où ray.origin + t * ray.direction a Y = 0
  
  if (Math.abs(ray.direction.y) < 0.0001) {
    // Ray parallèle au sol, utiliser la méthode simple
    const left = camera.orthoLeft ?? -5;
    const right = camera.orthoRight ?? 5;
    const bottom = camera.orthoBottom ?? -3;
    const top = camera.orthoTop ?? 3;
    
    const normX = screenX / window.innerWidth;
    const normY = screenY / window.innerHeight;
    
    return new Vector3(
      left + (right - left) * normX,
      0,
      top - (top - bottom) * normY
    );
  }
  
  // Calculer t pour Y = 0
  const t = -ray.origin.y / ray.direction.y;
  
  // Point d'intersection
  const worldX = ray.origin.x + t * ray.direction.x;
  const worldZ = ray.origin.z + t * ray.direction.z;
  
  console.log(`🦢 screenToWorld: écran(${screenX.toFixed(0)}, ${screenY.toFixed(0)}) → monde(${worldX.toFixed(2)}, ${worldZ.toFixed(2)})`);
  
  return new Vector3(worldX, 0, worldZ);
}

// Convertir une position du monde 3D en coordonnées écran
function worldToScreen(worldPos: Vector3): { x: number, y: number } {
  if (!scene || !camera || !engine) return { x: 0, y: 0 };
  
  // Utiliser la fonction de projection de Babylon.js
  const screenPos = Vector3.Project(
    worldPos,
    Matrix.Identity(),
    scene.getTransformMatrix(),
    camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
  );
  
  return {
    x: screenPos.x / (window.devicePixelRatio || 1),
    y: screenPos.y / (window.devicePixelRatio || 1)
  };
}

// Pousser un élément hors de l'écran avec effet spectaculaire
function pushElementOffScreen(element: HTMLElement) {
  console.log(`🦢 💥 Tentative de poussée de:`, element.tagName, element.className);
  
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  console.log(`🦢 📐 Position de l'élément: center=(${centerX.toFixed(0)}, ${centerY.toFixed(0)}), size=(${rect.width.toFixed(0)}x${rect.height.toFixed(0)})`);
  
  // Déterminer la direction de poussée (vers le bord le plus proche)
  const distToLeft = centerX;
  const distToRight = window.innerWidth - centerX;
  const distToTop = centerY;
  const distToBottom = window.innerHeight - centerY;
  
  const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
  
  let pushX = 0;
  let pushY = 0;
  let direction = "";
  
  // Pousser l'élément COMPLÈTEMENT hors de l'écran
  if (minDist === distToLeft) {
    pushX = -(rect.width + centerX + 200);
    direction = "GAUCHE";
  } else if (minDist === distToRight) {
    pushX = window.innerWidth - rect.left + 200;
    direction = "DROITE";
  } else if (minDist === distToTop) {
    pushY = -(rect.height + centerY + 200);
    direction = "HAUT";
  } else {
    pushY = window.innerHeight - rect.top + 200;
    direction = "BAS";
  }
  
  console.log(`🦢 🎯 Direction: ${direction}, Translation: (${pushX.toFixed(0)}px, ${pushY.toFixed(0)}px)`);
  
  // Sauvegarder l'état original
  const originalTransform = element.style.transform || "";
  const originalPosition = element.style.position || "";
  const originalZIndex = element.style.zIndex || "";
  const originalTransition = element.style.transition || "";
  
  // Forcer le positionnement relatif si nécessaire
  const computedPosition = window.getComputedStyle(element).position;
  if (computedPosition === "static") {
    element.style.position = "relative";
  }
  
  // Mettre un z-index élevé pour voir l'élément bouger
  element.style.zIndex = "999998";
  
  // Animation de poussée avec rotation
  const rotation = (Math.random() - 0.5) * 40; // -20° à +20°
  
  // Appliquer la transition
  element.style.transition = `transform ${pushDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
  
  // Forcer un reflow pour que la transition fonctionne
  void element.offsetWidth;
  
  // Appliquer la transformation
  element.style.transform = `translate(${pushX}px, ${pushY}px) rotate(${rotation}deg)`;
  
  console.log(`🦢 ✅ Transform appliqué: translate(${pushX}px, ${pushY}px) rotate(${rotation}deg)`);
  
  // Ramener l'élément après un délai
  setTimeout(() => {
    console.log(`🦢 🔄 Retour de l'élément...`);
    element.style.transition = "transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)";
    
    // Forcer un reflow
    void element.offsetWidth;
    
    element.style.transform = originalTransform;
    
    setTimeout(() => {
      element.style.position = originalPosition;
      element.style.transition = originalTransition;
      element.style.zIndex = originalZIndex;
      console.log(`🦢 ✅ Élément restauré`);
    }, 1000);
  }, (pushDuration + 2) * 1000);
}

// --- Gestion des animations ---

function stopAllAnimations() {
  // Arrêter TOUTES les animations du modèle pour éviter le blending
  if (scene) {
    scene.animationGroups.forEach(anim => {
      anim.stop();
      anim.reset();
    });
  }
}

function playIdleAnimation() {
  stopAllAnimations();
  if (idleAnims.length === 0) return;
  
  const next = idleAnims[Math.floor(Math.random() * idleAnims.length)];
  
  next.start(true, 1.0, next.from, next.to, false);
  next.setWeightForAllAnimatables(1.0);
  console.log(`🦢 Animation idle: ${next.name}`);
}

function playWalkAnimation() {
  stopAllAnimations();
  if (!walkAnim) return;
  
  walkAnim.start(true, 0.5, walkAnim.from, walkAnim.to, false);
  walkAnim.setWeightForAllAnimatables(1.0);
  console.log(`🦢 Animation de marche normale`);
}

// Animation de course vers la cible (gooseHalfFlap)
function playRunAnimation() {
  stopAllAnimations();
  
  if (halfFlapAnim) {
    halfFlapAnim.start(true, 1.5, halfFlapAnim.from, halfFlapAnim.to, false);
    halfFlapAnim.setWeightForAllAnimatables(1.0);
    console.log(`🦢 🏃 Animation de COURSE (gooseHalfFlap)`);
  } else if (walkAnim) {
    walkAnim.start(true, 1.2, walkAnim.from, walkAnim.to, false);
    walkAnim.setWeightForAllAnimatables(1.0);
    console.log(`🦢 🏃 Animation de course (fallback walk rapide)`);
  }
}

// Animation de poussée (angryflapping)
function playPushAnimation() {
  stopAllAnimations();
  
  if (angryFlapAnim) {
    angryFlapAnim.start(true, 1.0, angryFlapAnim.from, angryFlapAnim.to, false);
    angryFlapAnim.setWeightForAllAnimatables(1.0);
    console.log(`🦢 😤 Animation de POUSSÉE (angryflapping)`);
  } else {
    console.log(`🦢 ⚠️ Animation angryflapping non trouvée`);
  }
}

// --- Update principal ---

function clampPositionToCamera(pos: Vector3): Vector3 {
  if (!camera) return pos;
  
  const left = camera.orthoLeft ?? -5;
  const right = camera.orthoRight ?? 5;
  const bottom = camera.orthoBottom ?? -3;
  const top = camera.orthoTop ?? 3;
  
  const margin = 0.8; // Marge pour garder l'oie visible
  
  const clampedPos = new Vector3(
    Math.max(left + margin, Math.min(right - margin, pos.x)),
    pos.y,
    Math.max(bottom + margin, Math.min(top - margin, pos.z))
  );
  
  return clampedPos;
}

function updateGoose() {
  if (!engine || !camera || !goose) return;

  const dt = engine.getDeltaTime() / 1000; // en secondes

  if (!isActive) {
    return;
  }

  // --- ÉTAT : IDLE ---
  if (state === "idle") {
    idleTimer -= dt;
    timeSinceLastPush += dt;

    // en idle : on laisse juste l'anim idle faire le boulot
    // Léger bobbing même en idle pour plus de vie
    const idleBob = Math.sin(Date.now() * 0.001) * 0.01;
    goose.position.y = idleBob;

    if (idleTimer <= 0) {
      // Décider si on pousse une balise ou si on se déplace normalement
      const shouldPush = timeSinceLastPush > PUSH_COOLDOWN && 
                        Math.random() < PUSH_CHANCE;
      
      console.log(`🦢 Temps depuis dernière poussée: ${timeSinceLastPush.toFixed(1)}s (cooldown: ${PUSH_COOLDOWN}s)`);
      console.log(`🦢 Devrait pousser? ${shouldPush} (chance: ${PUSH_CHANCE * 100}%)`);
      
      if (shouldPush) {
        // Essayer de pousser une balise
        const elements = getInteractiveElements();
        console.log(`🦢 Éléments trouvés: ${elements.length}`);
        
        if (elements.length > 0) {
          // Choisir un élément aléatoire parmi ceux qui sont assez grands
          const validElements = elements.filter(el => {
            const r = el.getBoundingClientRect();
            return r.width > 40 && r.height > 20; // Éléments assez visibles
          });
          
          if (validElements.length > 0) {
            targetElement = validElements[Math.floor(Math.random() * validElements.length)];
          } else {
            targetElement = elements[Math.floor(Math.random() * elements.length)];
          }
          
          console.log(`🦢 ═══════════════════════════════════════`);
          console.log(`🦢 🎯 CIBLE SÉLECTIONNÉE:`, targetElement.tagName, targetElement.className || targetElement.id);
          console.log(`🦢 Texte:`, targetElement.textContent?.substring(0, 30));
          
          const rect = targetElement.getBoundingClientRect();
          
          // Déterminer de quel côté l'oie doit se placer pour pousser
          // L'oie se place du côté opposé au bord le plus proche
          const distToLeft = rect.left;
          const distToRight = window.innerWidth - rect.right;
          const distToTop = rect.top;
          const distToBottom = window.innerHeight - rect.bottom;
          
          const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
          
          // Se placer du côté opposé au bord le plus proche (pour pousser vers ce bord)
          // L'oie doit être JUSTE à côté de l'élément (à ~50px du bord)
          if (minDist === distToLeft) {
            // Pousser vers la gauche → se placer à droite de l'élément
            targetScreenX = rect.right + 50;
            targetScreenY = rect.top + rect.height / 2;
            pushDirection = "LEFT";
          } else if (minDist === distToRight) {
            // Pousser vers la droite → se placer à gauche de l'élément
            targetScreenX = rect.left - 50;
            targetScreenY = rect.top + rect.height / 2;
            pushDirection = "RIGHT";
          } else if (minDist === distToTop) {
            // Pousser vers le haut → se placer en bas de l'élément
            targetScreenX = rect.left + rect.width / 2;
            targetScreenY = rect.bottom + 50;
            pushDirection = "TOP";
          } else {
            // Pousser vers le bas → se placer en haut de l'élément
            targetScreenX = rect.left + rect.width / 2;
            targetScreenY = rect.top - 50;
            pushDirection = "BOTTOM";
          }
          
          console.log(`🦢 Position cible ÉCRAN: x=${targetScreenX.toFixed(0)}px, y=${targetScreenY.toFixed(0)}px`);
          console.log(`🦢 Direction de poussée: ${pushDirection}`);
          
          // Position cible dans le monde 3D
          const worldPos = screenToWorld(targetScreenX, targetScreenY);
          console.log(`🦢 Position CIBLE (monde): x=${worldPos.x.toFixed(2)}, z=${worldPos.z.toFixed(2)}`);
          
          startPos.copyFrom(goose.position);
          targetPos.copyFrom(worldPos);
          
          // Distance et durée - PLUS RAPIDE car elle court!
          const distance = Vector3.Distance(startPos, targetPos);
          moveDuration = Math.max(0.8, distance / SPEED_RUN); // Course rapide!
          
          console.log(`🦢 🏃 Distance: ${distance.toFixed(2)} unités`);
          console.log(`🦢 🏃 Durée de course: ${moveDuration.toFixed(2)}s`);
          
          // Orientation vers l'élément (regarder l'élément, pas la destination)
          const elementWorldPos = screenToWorld(rect.left + rect.width / 2, rect.top + rect.height / 2);
          const direction = elementWorldPos.subtract(goose.position);
          const angle = Math.atan2(-direction.x, -direction.z);
          goose.rotationQuaternion = null;
          goose.rotation.y = angle;
          
          state = "pushing";
          moveTime = 0;
          walkPhase = 0;
          pushStartTime = 0;
          timeSinceLastPush = 0;
          
          // Animation de course (gooseHalfFlap)
          playRunAnimation();
          console.log("🦢 🎯 ✨ L'OIE PART EN COURANT POUSSER LA BALISE! ✨");
          console.log(`🦢 ═══════════════════════════════════════`);
          return;
        } else {
          console.log("🦢 ❌ Aucun élément trouvé pour pousser");
        }
      }
      
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

      // Orientation vers la destination (rotation sur Y)
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

    // Interpolation lissée avec easing sinusoïdal (plus naturel)
    const eased = easeInOutSine(t);
    const newPos = Vector3.Lerp(startPos, targetPos, eased);
    
    // IMPORTANT: Contraindre la position pour ne jamais sortir
    const clampedPos = clampPositionToCamera(newPos);
    goose.position.x = clampedPos.x;
    goose.position.z = clampedPos.z;

    // Rotation progressive vers la direction de mouvement
    const direction = targetPos.subtract(startPos);
    if (direction.length() > 0.01) {
      const targetAngle = Math.atan2(-direction.x, -direction.z);
      goose.rotationQuaternion = null;
      // Rotation plus fluide au début du mouvement
      const rotationT = Math.min(t * 3, 1); // Atteint l'angle final à 33% du trajet
      goose.rotation.y = lerpAngle(goose.rotation.y, targetAngle, rotationT * 0.1 + 0.05);
    }

    // Bobbing pendant la marche (léger balancement)
    walkPhase += dt * BOBBING_FREQUENCY;
    const bobbing = Math.sin(walkPhase) * BOBBING_AMPLITUDE;
    goose.position.y = bobbing;

    if (t >= 1) {
      const finalPos = clampPositionToCamera(targetPos);
      goose.position.copyFrom(finalPos);
      goose.position.y = 0;
      state = "idle";

      // prochaine pause (parfois longue)
      idleTimer = pickIdleDuration(true);

      // anim idle immobile
      playIdleAnimation();
    }
  }

  // --- ÉTAT : PUSHING ---
  if (state === "pushing") {
    moveTime += dt;
    
    // Vérifier si l'élément cible existe toujours
    if (!targetElement || !document.body.contains(targetElement)) {
      console.log("🦢 ⚠️ Élément cible perdu, retour en idle");
      state = "idle";
      idleTimer = pickIdleDuration(false);
      targetElement = null;
      playIdleAnimation();
      return;
    }
    
    // Obtenir la position actuelle de l'oie à l'écran
    const gooseScreenPos = worldToScreen(goose.position);
    
    // Obtenir la position actuelle de l'élément (peut avoir changé)
    const rect = targetElement.getBoundingClientRect();
    
    // Recalculer la position cible en fonction de la direction de poussée
    if (pushDirection === "LEFT") {
      targetScreenX = rect.right + 40;
      targetScreenY = rect.top + rect.height / 2;
    } else if (pushDirection === "RIGHT") {
      targetScreenX = rect.left - 40;
      targetScreenY = rect.top + rect.height / 2;
    } else if (pushDirection === "TOP") {
      targetScreenX = rect.left + rect.width / 2;
      targetScreenY = rect.bottom + 40;
    } else {
      targetScreenX = rect.left + rect.width / 2;
      targetScreenY = rect.top - 40;
    }
    
    // Calculer la distance à l'écran entre l'oie et la cible
    const screenDistX = targetScreenX - gooseScreenPos.x;
    const screenDistY = targetScreenY - gooseScreenPos.y;
    const screenDist = Math.sqrt(screenDistX * screenDistX + screenDistY * screenDistY);
    
    // Si l'oie n'est pas encore arrivée (distance > 50px à l'écran)
    if (pushStartTime === 0 && screenDist > 50) {
      // Continuer à se déplacer vers la cible
      const newTargetWorld = screenToWorld(targetScreenX, targetScreenY);
      targetPos.copyFrom(newTargetWorld);
      
      // Déplacer l'oie vers la cible avec accélération progressive
      const dirToTarget = targetPos.subtract(goose.position);
      const distToTarget = dirToTarget.length();
      
      if (distToTarget > 0.05) {
        dirToTarget.normalize();
        
        // Vitesse variable : accélère au début, ralentit à l'approche
        const speedFactor = Math.min(1, distToTarget / 2); // Ralentit quand proche
        const moveSpeed = SPEED_RUN * dt * (0.5 + speedFactor * 0.5);
        
        goose.position.x += dirToTarget.x * moveSpeed;
        goose.position.z += dirToTarget.z * moveSpeed;
        
        // Contraindre la position
        const clampedPos = clampPositionToCamera(goose.position);
        goose.position.x = clampedPos.x;
        goose.position.z = clampedPos.z;
        
        // Rotation progressive vers la cible
        const targetAngle = Math.atan2(-dirToTarget.x, -dirToTarget.z);
        goose.rotationQuaternion = null;
        goose.rotation.y = lerpAngle(goose.rotation.y, targetAngle, 0.15);
      }

      // Bobbing RAPIDE pendant la course
      walkPhase += dt * BOBBING_FREQUENCY_RUN;
      const bobbing = Math.sin(walkPhase) * BOBBING_AMPLITUDE * 1.2;
      goose.position.y = bobbing;
      
    } else if (pushStartTime === 0) {
      // L'oie est arrivée à côté de l'élément! Commencer la poussée
      pushStartTime = moveTime;
      
      console.log(`🦢 📍 Oie arrivée! Position écran: (${gooseScreenPos.x.toFixed(0)}, ${gooseScreenPos.y.toFixed(0)})`);
      console.log(`🦢 📍 Cible était: (${targetScreenX.toFixed(0)}, ${targetScreenY.toFixed(0)})`);
      console.log(`🦢 📍 Distance finale: ${screenDist.toFixed(0)}px`);
      
      // Orienter l'oie vers l'élément pour la poussée
      const elementWorldPos = screenToWorld(rect.left + rect.width / 2, rect.top + rect.height / 2);
      const pushDir = elementWorldPos.subtract(goose.position);
      const pushAngle = Math.atan2(-pushDir.x, -pushDir.z);
      goose.rotationQuaternion = null;
      goose.rotation.y = pushAngle;
      
      // Animation de poussée (angryflapping)
      playPushAnimation();
      
      // Pousser l'élément!
      pushElementOffScreen(targetElement);
      console.log("🦢 🔊 HONK HONK! L'oie pousse l'élément avec rage!");
      
    } else {
      // En train de pousser, attendre la fin
      // Petit bobbing pendant la poussée
      walkPhase += dt * BOBBING_FREQUENCY;
      const bobbing = Math.sin(walkPhase) * BOBBING_AMPLITUDE * 0.5;
      goose.position.y = bobbing;
      
      // Attendre que la poussée soit terminée
      if (moveTime - pushStartTime >= pushDuration) {
        goose.position.y = 0;
        state = "idle";
        idleTimer = pickIdleDuration(true);
        targetElement = null;
        pushDirection = "";
        playIdleAnimation();
        console.log("🦢 ✅ Mission accomplie! L'oie est satisfaite.");
      }
    }
  }
}


export function setGoose3DActive(active: boolean) {
  isActive = active;

  console.log(`🦢 Oie 3D ${active ? 'ACTIVÉE' : 'DÉSACTIVÉE'}`);

  if (canvas) {
    canvas.style.display = active ? "block" : "none";
    console.log(`🦢 Canvas display: ${canvas.style.display}`);
    console.log(`🦢 Canvas z-index: ${canvas.style.zIndex}`);
    console.log(`🦢 Canvas dans le DOM: ${document.body.contains(canvas)}`);
    
    if (active && goose) {
      console.log(`🦢 Position de l'oie: x=${goose.position.x.toFixed(2)}, y=${goose.position.y.toFixed(2)}, z=${goose.position.z.toFixed(2)}`);
      console.log(`🦢 Scaling de l'oie: ${goose.scaling.x.toFixed(2)}`);
    }
  }

  // Quand on revient sur la Home, si on est en idle et sans timer,
  // on prévoit une pause tranquille.
  if (active && state === "idle" && idleTimer <= 0) {
    idleTimer = pickIdleDuration(false);
  }
}

// Fonction de test pour forcer l'oie à pousser une balise
export function forcePushElement() {
  if (!isActive || !goose) {
    console.log("🦢 ❌ L'oie n'est pas active");
    return;
  }
  
  console.log("🦢 🧪 FORCE PUSH TEST");
  
  const elements = getInteractiveElements();
  console.log(`🦢 Éléments trouvés: ${elements.length}`);
  
  if (elements.length === 0) {
    console.log("🦢 ❌ Aucun élément à pousser");
    return;
  }
  
  // Forcer l'état à idle pour permettre la transition
  state = "idle";
  idleTimer = 0;
  timeSinceLastPush = PUSH_COOLDOWN + 1; // S'assurer que le cooldown est passé
  
  console.log("🦢 ✅ Conditions forcées pour le prochain cycle");
}

// Fonction pour obtenir les stats de l'oie (debug)
export function getGooseStats() {
  console.log("🦢 === STATS DE L'OIE ===");
  console.log(`État actuel: ${state}`);
  console.log(`Active: ${isActive}`);
  console.log(`Temps depuis dernière poussée: ${timeSinceLastPush.toFixed(1)}s`);
  console.log(`Cooldown: ${PUSH_COOLDOWN}s`);
  console.log(`Chance de pousser: ${PUSH_CHANCE * 100}%`);
  console.log(`Timer idle: ${idleTimer.toFixed(1)}s`);
  if (goose) {
    console.log(`Position: x=${goose.position.x.toFixed(2)}, z=${goose.position.z.toFixed(2)}`);
  }
  
  const elements = getInteractiveElements();
  console.log(`Éléments disponibles: ${elements.length}`);
  
  return {
    state,
    isActive,
    timeSinceLastPush,
    cooldown: PUSH_COOLDOWN,
    chance: PUSH_CHANCE,
    idleTimer,
    elementsCount: elements.length
  };
}

// Fonction de test pour pousser directement le premier élément trouvé
export function testPushFirstElement() {
  const elements = getInteractiveElements();
  if (elements.length > 0) {
    console.log("🦢 🧪 Test de poussée directe sur:", elements[0].tagName, elements[0].className);
    pushElementOffScreen(elements[0]);
  } else {
    console.log("🦢 ❌ Aucun élément trouvé");
  }
}

// Fonction de test pour voir où l'oie irait pour un élément
export function testScreenToWorld(screenX: number, screenY: number) {
  const worldPos = screenToWorld(screenX, screenY);
  console.log(`🦢 Test screenToWorld: écran(${screenX}, ${screenY}) → monde(${worldPos.x.toFixed(2)}, ${worldPos.z.toFixed(2)})`);
  return worldPos;
}

// Exposer les fonctions globalement pour la console
if (typeof window !== 'undefined') {
  (window as any).gooseDebug = {
    forcePush: forcePushElement,
    stats: getGooseStats,
    listElements: getInteractiveElements,
    testPush: testPushFirstElement,
    testCoords: testScreenToWorld
  };
  console.log("🦢 Fonctions de debug disponibles :");
  console.log("  - gooseDebug.stats() : Voir les stats de l'oie");
  console.log("  - gooseDebug.forcePush() : Forcer une poussée");
  console.log("  - gooseDebug.listElements() : Liste des éléments détectés");
  console.log("  - gooseDebug.testPush() : Tester la poussée sur le 1er élément");
  console.log("  - gooseDebug.testCoords(x, y) : Tester la conversion écran→monde");
}