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
    boxBestScoreMissed: null,
    keyboardBestScore: null,
    keyboardBestScoreMissed: null,

    boxBestScoreMissedClicks: null,
    boxBestScoreMissedClicksClicks: null,
    keyboardBestScoreMissedClicks: null,
    keyboardBestScoreMissedClicksClicks: null,
    
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
    gameState.missedClicksTotal = 0;
    gameState.actualBestScore = null;
    gameState.actualWorstScore = null;
    gameState.actualAvgScore = null;
    gameState.lastChangeDate = null;
    gameState.actualGameTimeResults = [];
    

    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const settingsSection = document.getElementById('settings');

    document.getElementById('toGo').innerText = gameState.trysToGo;
    document.getElementById('missedBefore').innerText = gameState.missedClicksBeforeChange;
    document.getElementById('missedTotal').innerText = gameState.missedClicksTotal;

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
    if (!gameState.isRunning) return;
    if (!gameState.trysToGo || gameState.trysToGo <= 0) return finishGame();
    gameState.phase = 'waiting';
    gameState.lastChangeDate = null;
    gameState.missedClicksBeforeChange = 0;
    gameState.timeoutId = null;
    const box = document.getElementById('gameBox');
    box.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => showSignal(), Math.random() * 2000 + 1000);
}

function showSignal() {
    if (!gameState.isRunning) return;
    const now = new Date();
    gameState.phase = 'ready';
    gameState.timeoutId = now.getTime();
    const box = document.getElementById('gameBox');
    box.style.backgroundColor = '#FF0000';
    gameState.trysToGo--;
    document.getElementById('toGo').innerText = gameState.trysToGo;



}

function handleBoxClick() {
    if (!gameState.isRunning) return;
    if (gameState.gameMode !== 'gameBox') return;
    handleReaciton();
    
}
    


function handleKeyPress(event) {

}

function handleReaciton() {
    if (gameState.phase === 'waiting') {
        gameState.missedClicksBeforeChange++;
        gameState.missedClicksTotal++;
        document.getElementById('missedBefore').innerText = gameState.missedClicksBeforeChange;
        document.getElementById('missedTotal').innerText = gameState.missedClicksTotal;
    } else if (gameState.phase === 'ready') {
        const now = new Date();
        const reactionTime = now.getTime() - gameState.timeoutId; 
        gameState.actualGameTimeResults.push(reactionTime);
        updateStats(reactionTime);
        startRound();
    }
}

function updateStats(reactionTime) {
    const results = document.getElementById('results');
    results.classList.remove('hidden');
    if (gameState.actualBestScore === null || reactionTime < gameState.actualBestScore) {
            gameState.actualBestScore = reactionTime;
        }
    if (gameState.actualWorstScore === null || reactionTime > gameState.actualWorstScore) {
            gameState.actualWorstScore = reactionTime;
        }
    const sum = gameState.actualGameTimeResults.reduce((a, b) => a + b, 0);
    gameState.actualAvgScore = sum / gameState.actualGameTimeResults.length;

    renderActualStats();

}



function renderActualStats() {
    document.getElementById('bestScore').innerText = gameState.actualBestScore !== null ? gameState.actualBestScore : '-';
    document.getElementById('worstScore').innerText = gameState.actualWorstScore !== null ? gameState.actualWorstScore : '-';
    document.getElementById('avgScore').innerText = gameState.actualAvgScore !== null ? gameState.actualAvgScore.toFixed(2) : '-';
}

function renderStats() {
    renderActualStats();
    checkOverallStats();
    renderOverallStats();
    }

function checkOverallStats() {
    if (gameState.gameMode === 'gameBox') {
        if (gameState.boxBestScore === null || gameState.actualAvgScore < gameState.boxBestScore) {
            gameState.boxBestScore = gameState.actualAvgScore;
            gameState.boxBestScoreMissed = gameState.missedClicksTotal;
        }
        if (gameState.boxBestScoreMissedClicks === null || gameState.missedClicksTotal < gameState.boxBestScoreMissedClicksClicks || (gameState.missedClicksTotal === gameState.boxBestScoreMissedClicksClicks && gameState.actualAvgScore < gameState.boxBestScoreMissedClicks)) {
            gameState.boxBestScoreMissedClicks = gameState.actualAvgScore;
            gameState.boxBestScoreMissedClicksClicks = gameState.missedClicksTotal;
        }

    }
    if (gameState.gameMode === 'gameKeyboard') {
        if (gameState.keyboardBestScore === null || gameState.actualAvgScore < gameState.keyboardBestScore) {
            gameState.keyboardBestScore = gameState.actualAvgScore;
            gameState.keyboardBestScoreMissed = gameState.missedClicksTotal;
        }
        if (gameState.keyboardBestScoreMissedClicks === null || gameState.missedClicksTotal < gameState.keyboardBestScoreMissedClicksClicks || (gameState.missedClicksTotal === gameState.keyboardBestScoreMissedClicksClicks && gameState.actualAvgScore < gameState.keyboardBestScoreMissedClicks)) {
            gameState.keyboardBestScoreMissedClicks = gameState.actualAvgScore;
            gameState.keyboardBestScoreMissedClicksClicks = gameState.missedClicksTotal;
        }   
    }
}

function renderOverallStats() {
    document.getElementById('overallBox').innerText = gameState.boxBestScore !== null ? gameState.boxBestScore.toFixed(2) : '-';
    document.getElementById('overallBoxMissed').innerText = gameState.gameMode === 'gameBox' ? gameState.missedClicksTotal : '-';
    document.getElementById('overallKeyboard').innerText = gameState.keyboardBestScore !== null ? gameState.keyboardBestScore.toFixed(2) : '-';
    document.getElementById('overallKeyboardMissed').innerText = gameState.gameMode === 'gameKeyboard' ? gameState.missedClicksTotal : '-';
    document.getElementById('overallMissedBox').innerText = gameState.boxBestScoreMissedClicks !== null ? gameState.boxBestScoreMissedClicks.toFixed(2) : '-';
    document.getElementById('overallBoxMissedClicks').innerText = gameState.gameMode === 'gameBox' ? gameState.boxBestScoreMissedClicksClicks : '-';
    document.getElementById('overallMissedKeyboard').innerText = gameState.keyboardBestScoreMissedClicks !== null ? gameState.keyboardBestScoreMissedClicks.toFixed(2) : '-';
    document.getElementById('overallKeyboardMissedClicks').innerText = gameState.gameMode === 'gameKeyboard' ? gameState.keyboardBestScoreMissedClicksClicks : '-';
}

function finishGame() {
    stopGame();
}

function stopGame() {
    gameState.isRunning = false;
    gameState.phase = 'idle';

    //TODO: obliczanie wyników, aktualizacja statystyk, renderowanie wyników
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');

    startButton.classList.remove('hidden');
    stopButton.classList.add('hidden');

    if (gameState.countdownId) {
    clearInterval(gameState.countdownId);
    gameState.countdownId = null;
    }

    document.getElementById('countdownOverlay').classList.add('hidden');
    document.getElementById('settings').classList.remove('hidden');

    const kwadraty = document.querySelectorAll('.square');
    kwadraty.forEach(function(kwadrat) {
        kwadrat.style.backgroundColor = '#4CAF50';
    });

    renderStats();
    
}








