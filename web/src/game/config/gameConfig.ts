/**
 * Configuration centralisée du jeu Pong
 * Toutes les dimensions et paramètres physiques du jeu
 */

// Configuration des règles de jeu
export const GAME_RULES = {
    WIN_SCORE: 1,           // Score pour gagner
    START_DELAY_MS: 3000    // Délai avant début match
} as const;

// Dimensions du terrain
export const FIELD_CONFIG = {
    WIDTH: 12,
    HEIGHT: 8,
    WALL_THICKNESS: 0.2,
    WALL_HEIGHT: 1
} as const;

// Dimensions des objets de jeu
export const GAME_OBJECTS = {
    // Paddles
    PADDLE_WIDTH: 0.5,
    PADDLE_HEIGHT: 0.5,
    PADDLE_DEPTH: 2,
    
    // Balle
    BALL_DIAMETER: 0.75,
    BALL_RADIUS: 0.375, // BALL_DIAMETER / 2
    
    // Ligne centrale
    CENTER_LINE_WIDTH: 0.1,
    CENTER_LINE_HEIGHT: 0.1
} as const;

// Paramètres physiques
export const PHYSICS_CONFIG = {
    // Vitesse de base
    BASE_BALL_SPEED: 0.006,
    PADDLE_SPEED: 0.01,
    
    // Effets de collision
    SPIN_INTENSITY: 1.2,
    SPEED_BOOST: 1.05,
    MAX_VERTICAL_SPEED_MULTIPLIER: 1.5,
    MAX_HORIZONTAL_SPEED_MULTIPLIER: 2.0,
    
    // Timing
    RESET_DELAY_MS: 1500,
    MAX_ANGLE_VARIATION: 0.3
};

// Positions des éléments
export const POSITIONS = {
    PADDLE1_X: 6,  // Droite
    PADDLE2_X: -6, // Gauche
    CENTER_X: 0,
    CENTER_Y: 0,
    CENTER_Z: 0
} as const;

// Couleurs
export const COLORS = {
    PADDLE1: "#FF0000",      // Rouge
    PADDLE2: "#0000FF",      // Bleu
    BALL: "#FFFFFF",         // Blanc
    GROUND: "#0A0A15",       // Gris foncé
    WALLS: "#333333",        // Gris
    CENTER_LINE: "#444444"   // Gris moyen
} as const;

// Configuration visuelle
export const VISUAL_CONFIG = {
    GLOW_INTENSITY: 0.5,
    BALL_GLOW_INTENSITY: 0.2,
    GROUND_SPECULAR_INTENSITY: 0.3
} as const;