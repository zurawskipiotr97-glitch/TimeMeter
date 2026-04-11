const gameState = {
    isRunning: false,
    currentScreens: ['settings'],
    gameMode: 'normal',
    limit: 0,
    trysToGo: 0,
    missedClicksBeforeChange: 0,
    actualBestScore: null,
    actualWorstScore: null,
    actualAvgScore: null,
    boxBestScore: null,
    keyboardBestScore: null,
    lastChangeDate: null,
    actualGameTimeResults: []
}

function startGame() {
    const tryLimit = document.getElementById('tryLimit')
    const gameMode = document.getElementById('gameMode')

    gameState.gameMode = gameMode.value;
    gameState.limit = parseInt(tryLimit.value);
    gameState.trysToGo = parseInt(tryLimit.value);
    gameState.isRunning = true;
    gameState.currentScreens = [gameState.gameMode, 'results']

    const scoreElementBox = document.getElementById('toGoBox');
    scoreElementBox.innerText = gameState.trysToGo;

    const scoreElementKeyboard = document.getElementById('toGoKeyboard');
    scoreElementKeyboard.innerText = gameState.trysToGo;

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
 
