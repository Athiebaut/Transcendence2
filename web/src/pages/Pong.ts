export default function renderPong(): string {
    return `
    <div id="pong-container" class="flex h-full w-full bg-black">
        <!-- Joueur 1 (Gauche) -->
        <div id="player1-info" class="flex flex-col justify-center items-center w-1/6 text-white">
            <div class="bg-red-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span class="text-white font-bold text-lg">1</span>
            </div>
            <h3 class="text-lg font-bold mb-2">Joueur 1</h3>
            <div class="text-center">
                <p class="text-sm text-gray-400">Score</p>
                <p id="player1-score" class="text-3xl font-bold text-red-400">0</p>
            </div>
            <div class="mt-4 text-center">
                <p class="text-xs text-gray-500">Contrôles:</p>
                <p class="text-xs text-gray-400">Z / S</p>
            </div>
        </div>

        <!-- Zone de jeu centrale -->
        <div class="flex flex-col justify-center items-center flex-1">
            <canvas id="gameCanvas" style="border: 2px solid white; width: 70vw; height: 90vh; outline: none;"></canvas>
            <p id="game-status" class="text-white mt-4" style="display: none;">Loading Babylon.js game...</p>
        </div>

        <!-- Joueur 2 (Droite) -->
        <div id="player2-info" class="flex flex-col justify-center items-center w-1/6 text-white">
            <div class="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span class="text-white font-bold text-lg">2</span>
            </div>
            <h3 class="text-lg font-bold mb-2">Joueur 2</h3>
            <div class="text-center">
                <p class="text-sm text-gray-400">Score</p>
                <p id="player2-score" class="text-3xl font-bold text-blue-400">0</p>
            </div>
            <div class="mt-4 text-center">
                <p class="text-xs text-gray-500">Contrôles:</p>
                <p class="text-xs text-gray-400">↑ / ↓</p>
            </div>
        </div>
    </div>
    `;
}

export async function initPongGame() {
    try {
        const { initPongGame: init } = await import('../game/pongGame');
        
        const success = await init();
        
        // Mettre à jour le texte de statut
        const text = document.querySelector('#game-status') as HTMLElement;
        if (text) {
            if (success) {
                // Masquer le message quand ça fonctionne
                text.style.display = 'none';
            } else {
                // Afficher l'erreur quand ça ne fonctionne pas
                text.textContent = 'Error loading game';
                text.className = 'text-red-500 mt-4';
                text.style.display = 'block';
            }
        }
        
    } catch (error) {
        console.error('Error loading Pong game:', error);
        
        const text = document.querySelector('#game-status') as HTMLElement;
        if (text) {
            text.textContent = 'Error loading game';
            text.className = 'text-red-500 mt-4';
            text.style.display = 'block';
        }
    }
}

export async function disposePongGame() {
    try {
        const { disposePongGame } = await import('../game/pongGame');
        disposePongGame();
    } catch (error) {
        console.error('Error disposing Pong game:', error);
    }
}