/**
 * Gestionnaire de rotation aléatoire des images de fond
 * Utilise les nouvelles images du village avec l'oie
 */

// Liste de toutes les images de fond disponibles
const backgroundImages = [
  '/images/bg-christmas-garden.png',  // Jardin de Noël
  '/images/bg-backyard.png',          // Jardin avec piscine  
  '/images/bg-market.png',            // Marché du village
  '/images/bg-garden.png',            // Jardin potager
  '/images/bg-park.png',              // Parc avec banc
  '/images/bg-shed.png',              // Cabane de jardin
  '/images/bg-forest.png'             // Forêt avec sentier
];

// Clé pour le localStorage
const STORAGE_KEY = 'goose-game-bg-index';
const LAST_CHANGE_KEY = 'goose-game-bg-last-change';

/**
 * Obtenir un index aléatoire différent du précédent
 */
function getRandomBackgroundIndex(): number {
  const lastIndex = localStorage.getItem(STORAGE_KEY);
  const lastIndexNum = lastIndex ? parseInt(lastIndex, 10) : -1;
  
  let newIndex: number;
  do {
    newIndex = Math.floor(Math.random() * backgroundImages.length);
  } while (newIndex === lastIndexNum && backgroundImages.length > 1);
  
  return newIndex;
}

/**
 * Obtenir l'image de fond selon la stratégie définie
 */
function getBackgroundImage(strategy: 'random' | 'daily' | 'session' = 'random'): string {
  let index: number;
  
  switch (strategy) {
    case 'daily':
      // Change une fois par jour
      const today = new Date().toDateString();
      const lastChange = localStorage.getItem(LAST_CHANGE_KEY);
      
      if (lastChange !== today) {
        index = getRandomBackgroundIndex();
        localStorage.setItem(STORAGE_KEY, index.toString());
        localStorage.setItem(LAST_CHANGE_KEY, today);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        index = stored ? parseInt(stored, 10) : getRandomBackgroundIndex();
      }
      break;
      
    case 'session':
      // Garde la même image pendant toute la session
      const sessionIndex = sessionStorage.getItem(STORAGE_KEY);
      if (sessionIndex) {
        index = parseInt(sessionIndex, 10);
      } else {
        index = getRandomBackgroundIndex();
        sessionStorage.setItem(STORAGE_KEY, index.toString());
      }
      break;
      
    case 'random':
    default:
      // Change à chaque chargement de page
      index = getRandomBackgroundIndex();
      localStorage.setItem(STORAGE_KEY, index.toString());
      break;
  }
  
  return backgroundImages[index] || backgroundImages[0];
}

/**
 * Appliquer l'image de fond au body
 */
export function applyRandomBackground(strategy: 'random' | 'daily' | 'session' = 'random'): void {
  const backgroundImage = getBackgroundImage(strategy);
  
  // Appliquer le style au body
  document.body.style.backgroundImage = `url("${backgroundImage}")`;
  
  // Ajouter une classe pour identifier quelle image est utilisée
  const imageName = backgroundImage.split('/').pop()?.replace('.png', '') || 'default';
  document.body.classList.add(`bg-${imageName}`);
  
  console.log(`🦢 Fond appliqué: ${backgroundImage}`);
}

/**
 * Précharger toutes les images pour éviter les flashs
 */
export function preloadBackgrounds(): Promise<void[]> {
  const promises = backgroundImages.map(src => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load ${src}`));
      img.src = src;
    });
  });
  
  return Promise.all(promises);
}

/**
 * Forcer le changement de fond (utile pour un bouton "Changer le décor")
 */
export function forceBackgroundChange(): void {
  const newIndex = getRandomBackgroundIndex();
  localStorage.setItem(STORAGE_KEY, newIndex.toString());
  const backgroundImage = backgroundImages[newIndex];
  
  // Transition douce
  document.body.style.transition = 'opacity 0.5s ease';
  document.body.style.opacity = '0';
  
  setTimeout(() => {
    document.body.style.backgroundImage = `url("${backgroundImage}")`;
    document.body.style.opacity = '1';
    
    // Nettoyer après la transition
    setTimeout(() => {
      document.body.style.transition = '';
    }, 500);
  }, 500);
}

/**
 * Obtenir des informations sur le fond actuel
 */
export function getCurrentBackgroundInfo(): { 
  name: string; 
  path: string; 
  index: number;
  total: number;
} {
  const currentBg = document.body.style.backgroundImage;
  const match = currentBg.match(/url\("(.+)"\)/);
  const path = match ? match[1] : backgroundImages[0];
  const index = backgroundImages.indexOf(path);
  
  return {
    name: path.split('/').pop()?.replace('.png', '') || 'unknown',
    path,
    index: index >= 0 ? index : 0,
    total: backgroundImages.length
  };
}

/**
 * Initialiser le système de rotation au chargement du DOM
 */
export function initBackgroundRotator(strategy: 'random' | 'daily' | 'session' = 'random'): void {
  // S'assurer que le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyRandomBackground(strategy);
    });
  } else {
    applyRandomBackground(strategy);
  }
  
  // Précharger les autres images en arrière-plan
  setTimeout(() => {
    preloadBackgrounds().catch(err => {
      console.warn('Certaines images n\'ont pas pu être préchargées:', err);
    });
  }, 1000);
}
