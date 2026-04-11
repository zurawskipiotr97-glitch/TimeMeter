const gameState = {
    isRunning: false,
    currentScreens: ['settings'],
    gameMode: 'normal',
    limit: 0,
    trysToGo: 0,
    score: 0,
    lastTime: 0
}

function startGame() {
    const tryLimit = document.getElementById('tryLimit')
    const gameMode = document.getElementById('gameMode')

    gameState.gameMode = gameMode.value;
    gameState.limit = parseInt(tryLimit.value);
    gameState.trysToGo = parseInt(tryLimit.value);
    gameState.isRunning = true;
    gameState.currentScreens = [gameState.gameMode, 'results']

    const scoreElement = document.getElementById('toGo');
    scoreElement.innerText = gameState.trysToGo;

    console.log(`Start: Tryb ${gameState.gameMode}, Limit: ${gameState.limit}`);
    renderUI();
    //TODO
}

function renderUI() {
    const sections = ['settings', 'gameBox', 'gameKeyboard', 'results'];

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (gameState.currentScreens.includes(id)) {
                el.style.display = 'block';
            } else {
                el.style.display = 'none';
            }
        }
    });
}

function stopGame() {
    gameState.isRunning = false;
    gameState.currentScreens = ['settings', 'results']
    renderUI();
}

function getTrysToGo() {
    return gameState.trysToGo;

}
