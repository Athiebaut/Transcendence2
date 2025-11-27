/**
 * Types de modes de jeu disponibles
 */
export type GameMode = 'pvp1v1' | 'pvp2v2' | 'vsai' | 'tournament';

/**
 * Configuration d'un mode de jeu
 */
export interface GameModeConfig {
    mode: GameMode;
    playerCount: number;
    hasAI: boolean;
    isTournament: boolean;
    description: string;
    // winScore supprimé → maintenant dans GAME_RULES
}

export const GAME_MODES: Record<GameMode, GameModeConfig> = {
    'pvp1v1': {
        mode: 'pvp1v1',
        playerCount: 2,
        hasAI: false,
        isTournament: false,
        description: '1 vs 1 - Player vs Player'
    },
    'pvp2v2': {
        mode: 'pvp2v2',
        playerCount: 4,
        hasAI: false,
        isTournament: false,
        description: '2 vs 2 - Team vs Team'
    },
    'vsai': {
        mode: 'vsai',
        playerCount: 2,
        hasAI: true,
        isTournament: false,
        description: '1 vs 1 - Player vs AI'
    },
    'tournament': {
        mode: 'tournament',
        playerCount: 2,
        hasAI: false,
        isTournament: true,
        description: 'Tournament Mode'
    }
};