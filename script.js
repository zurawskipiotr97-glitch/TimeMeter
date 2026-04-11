const gameState = {
    isRunning: false,
    gameMode: null,
    limit: 5,
    trysToGo: 5,

    phase: 'idle', //'idle' | 'countdown' | 'waiting' | 'ready' | 'finished'
    timeoutId: null,
    missedClicksBeforeChange: 0,
    missedClicksTotal: 0,
    actualGameTimeResults: [],
    actualBestScore: null,
    actualWorstScore: null,
    actualAvgScore: null,

    boxBestScore: null,
    keyboardBestScore: null,

    lastChangeDate: null
    
}

//SETTINGS
function updateLimit() {
    const tryLimitInput = document.getElementById('tryLimit');

    const value = parseInt(tryLimitInput.value);
    const fixedValue = Math.max(1, value || 0);
    gameState.limit = fixedValue;
    gameState.trysToGo = fixedValue;

    document.getElementById('toGo').innerText = fixedValue;
}

function fixLimit() {
    const input = document.getElementById('tryLimit');
    const value = parseInt(input.value);
    const fixed = Math.max(1, value || 0);

    input.value = fixed;
    gameState.limit = fixed;
    gameState.trysToGo = fixed;

    document.getElementById('toGo').innerText = fixed;
}

function switchMode() {
    const selectedMode = document.getElementById('gameMode').value;
    gameState.gameMode = selectedMode;

    const gameBox = document.getElementById('gameBox');
    const gameKeyboard = document.getElementById('gameKeyboard');
    const title = document.getElementById('modeTitle');

    const isBox = selectedMode === 'gameBox';

    gameBox.classList.toggle('hidden', !isBox);
    gameKeyboard.classList.toggle('hidden', isBox);

    title.innerText = isBox
        ? 'Mode: Box clicking'
        : 'Mode: Keyboard';
}


//GAME LOGIC
function startGame() {
    const tryLimit = document.getElementById('tryLimit')
    const gameMode = document.getElementById('gameMode')
    const limit = parseInt(tryLimit.value);

    gameState.isRunning = true;
    gameState.gameMode = gameMode.value;
    gameState.limit = limit;
    gameState.trysToGo = limit;
    gameState.missedClicksBeforeChange = 0;
    gameState.actualBestScore = null;
    gameState.actualWorstScore = null;
    gameState.actualAvgScore = null;
    gameState.lastChangeDate = null;
    gameState.actualGameTimeResults = [];
    

    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const settingsSection = document.getElementById('settings');

    startButton.classList.add('hidden');
    stopButton.classList.remove('hidden');
    settingsSection.classList.add('hidden');

    switchMode();
    startCountdown();


    //TODO
}

function startCountdown() {
    const overlay = document.getElementById('countdownOverlay');
    const number = document.getElementById('countdownNumber');

    let count = 3;

    gameState.phase = 'countdown';

    overlay.classList.remove('hidden');
    number.innerText = count;

    gameState.countdownId = setInterval(() => {
        if (!gameState.isRunning) {
            clearInterval(gameState.countdownId);
            gameState.countdownId = null;
            overlay.classList.add('hidden');
            return;
        }

        count--;

        if (count > 0) {
            number.innerText = count;
        } else {
            clearInterval(gameState.countdownId);
            gameState.countdownId = null;

            overlay.classList.add('hidden');

            if (gameState.isRunning) {
                startRound();
            }
        }
    }, 1000);
}

function startRound() {
    console.log('start rundy');
}



function stopGame() {
    gameState.isRunning = false;

    //TODO: obliczanie wyników, aktualizacja statystyk, renderowanie wyników
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');

    startButton.classList.remove('hidden');
    stopButton.classList.add('hidden');

    if (gameState.countdownId) {
    clearInterval(gameState.countdownId);
    gameState.countdownId = null;

    document.getElementById('countdownOverlay').classList.add('hidden');
}
}

function getTrysToGo() {
    return gameState.trysToGo;
}

function handleBoxClick() {
    document.getElementById('gameBox')
    backgroundBox.style.backgroundColor = 'red'
}





