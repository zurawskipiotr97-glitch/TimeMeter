const gameState = {
    isRunning: false,
    currentScreens: ['settings'],
    resultsOnScreen: false,
    gameMode: null,
    limit: 5,
    trysToGo: 5,
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
    const sections = ['settings', 'gameBox', 'gameKeyboard'];

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

    if (gameState.resultsOnScreen) {
        const res = document.getElementById(results)
        res.style.display = 'block';
    }
}

function stopGame() {
    gameState.isRunning = false;
    gameState.currentScreens = ['settings', gameState.gameMode, 'results']
    renderUI();
}

function getTrysToGo() {
    return gameState.trysToGo;
}

function click() {
    const backgroundBox = document.getElementById(cliccker);
    backgroundBox.style.backgroundColor = 'red'
}

function switchMode() {
    const selectedMode = document.getElementById('gameMode').value;
    gameState.gameMode = selectedMode
    gameState.currentScreens = ['settings', selectedMode, 'results'];
    renderUI();
}
