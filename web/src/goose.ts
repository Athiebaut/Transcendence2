// web/src/goose.ts

let layer: HTMLDivElement | null = null;
let wrapper: HTMLDivElement | null = null;
let sprite: HTMLDivElement | null = null;

let initialized = false;
let active = false;

let currentX = 0;
let currentY = 0;

const MOVE_DURATION = 3000;     // durée d'une marche (ms)
const IDLE_MIN = 800;           // pause min entre deux marches
const IDLE_MAX = 2500;          // pause max
const MARGIN = 20;

export function initGoose() {
  if (initialized) return;
  initialized = true;

  // Couche plein écran transparente
  layer = document.createElement("div");
  layer.id = "goose-layer";
  layer.style.position = "fixed";
  layer.style.left = "0";
  layer.style.top = "0";
  layer.style.width = "100%";
  layer.style.height = "100%";
  layer.style.pointerEvents = "none"; // laisse passer les clics
  layer.style.zIndex = "50";
  layer.style.display = "block";      // 👉 visible par défaut

  // Wrapper qui bouge (translate + scaleX)
  wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.transition = `transform ${MOVE_DURATION}ms linear`;

  // Sprite de l'oie (emoji pour l'instant)
  sprite = document.createElement("div");
  sprite.textContent = "🦆";
  sprite.style.display = "inline-block";
  sprite.style.fontSize = "40px";
  sprite.style.filter = "drop-shadow(0 0 6px rgba(0, 0, 0, 0.6))";

  wrapper.appendChild(sprite);
  layer.appendChild(wrapper);
  document.body.appendChild(layer);

  // Position de départ : vers le bas de l'écran
  const vh = window.innerHeight || 800;
  currentX = 50;
  currentY = vh - 120;
  applyTransform(currentX, currentY, 1);

  // 👉 on active l’oie tout de suite
  active = true;
  scheduleNextMove();

  window.addEventListener("resize", () => {
    const vh2 = window.innerHeight || 800;
    currentY = vh2 - 120;
    applyTransform(currentX, currentY, 1);
  });
}

function applyTransform(x: number, y: number, direction: 1 | -1) {
  if (!wrapper) return;
  wrapper.style.transform = `translate(${x}px, ${y}px) scaleX(${direction})`;
}

function scheduleNextMove() {
  if (!active) return;
  const delay = IDLE_MIN + Math.random() * (IDLE_MAX - IDLE_MIN);
  window.setTimeout(() => {
    if (!active) return;
    moveOnce();
  }, delay);
}

function moveOnce() {
  if (!wrapper || !sprite) return;

  const vw = window.innerWidth || 1024;
  const vh = window.innerHeight || 800;

  const groundY = vh - 120;
  const targetX = Math.random() * (vw - MARGIN * 2) + MARGIN;
  const targetY = groundY;

  const goingLeft = targetX < currentX;
  const direction: 1 | -1 = goingLeft ? -1 : 1;

  // petite animation de marche si tu ajoutes la classe dans ton CSS
  sprite.classList.add("goose-walking");

  // Lance le déplacement
  requestAnimationFrame(() => {
    applyTransform(targetX, targetY, direction);
  });

  // Fin de la marche → on arrête de "piétiner", on planifie la prochaine
  window.setTimeout(() => {
    sprite && sprite.classList.remove("goose-walking");
    currentX = targetX;
    currentY = targetY;
    scheduleNextMove();
  }, MOVE_DURATION);
}

// Optionnel : tu peux quand même l'utiliser plus tard pour cacher l'oie
export function setGooseActive(value: boolean) {
  active = value;

  if (!layer) return;

  if (value) {
    layer.style.display = "block";
    scheduleNextMove();
  } else {
    layer.style.display = "none";
  }
}
