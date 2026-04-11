const gameState = {
    keyValue: '-',
    isRunning: false,
    gameMode: null,
    limit: 5,
    trysToGo: 5,

    phase: 'idle',
    timeoutId: null,
    delayTimeout: null,

    missedClicksBeforeChange: 0,
    missedClicksTotal: 0,
    wrongClicks: 0,

    actualGameTimeResults: [],
    actualBestScore: null,
    actualWorstScore: null,
    actualAvgScore: null,

    // BEST AVG TIME
    boxBestScore: null,
    boxBestScoreMissed: null,

    keyboardBestScore: null,
    keyboardBestScoreMissed: null,

    // NAJMNIEJ KLIKNIĘĆ
    boxBestScoreMissedClicks: null,
    boxBestScoreMissedClicksClicks: null,

    keyboardBestScoreMissedClicks: null,
    keyboardBestScoreMissedClicksClicks: null,

    lastChangeDate: null
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// SETTINGS

function updateLimit() {
    const input = document.getElementById('tryLimit');
    const value = Math.max(1, parseInt(input.value) || 1);

    gameState.limit = value;
    gameState.trysToGo = value;

    document.getElementById('toGo').innerText = value;

    gameState.missedClicksBeforeChange = 0;
    gameState.missedClicksTotal = 0;
    document.getElementById('missedBefore').innerText = gameState.missedClicksBeforeChange;
    document.getElementById('missedTotal').innerText = gameState.missedClicksTotal;
}

function fixLimit() {
    const input = document.getElementById('tryLimit');
    const value = Math.max(1, parseInt(input.value) || 1);

    input.value = value;
    updateLimit();
}

function switchMode() {
    const selected = document.getElementById('gameMode').value;
    gameState.gameMode = selected;

    const isBox = selected === 'gameBox';

    document.getElementById('gameBox').classList.toggle('hidden', !isBox);
    document.getElementById('gameKeyboard').classList.toggle('hidden', isBox);

    document.getElementById('modeTitle').innerText =
        isBox ? 'Mode: Box clicking' : 'Mode: Keyboard';
    
    document.getElementById('wrongTries').classList.toggle('hidden', isBox);
    
    updateLimit();
}

// GAME

function startGame() {
    const limit = parseInt(document.getElementById('tryLimit').value);

    gameState.keyValue = '-';
    gameState.isRunning = true;
    gameState.limit = limit;
    gameState.trysToGo = limit;

    gameState.missedClicksBeforeChange = 0;
    gameState.missedClicksTotal = 0;
    gameState.wrongClicks = 0;

    gameState.actualGameTimeResults = [];
    gameState.actualBestScore = null;
    gameState.actualWorstScore = null;
    gameState.actualAvgScore = null;

    document.getElementById('toGo').innerText = limit;
    document.getElementById('missedBefore').innerText = 0;
    document.getElementById('missedTotal').innerText = 0;
    document.getElementById('wrongKey').innerText = 0;
    document.getElementById('keyValue').innerText = '-';

    document.getElementById('startButton').classList.add('hidden');
    document.getElementById('stopButton').classList.remove('hidden');
    document.getElementById('settings').classList.add('hidden');

    switchMode();
    startCountdown();
}

function startCountdown() {
    const overlay = document.getElementById('countdownOverlay');
    const number = document.getElementById('countdownNumber');

    let count = 3;
    gameState.phase = 'countdown';

    overlay.classList.remove('hidden');
    number.innerText = count;

    gameState.countdownId = setInterval(() => {
        if (!gameState.isRunning) return;

        count--;

        if (count > 0) {
            number.innerText = count;
        } else {
            clearInterval(gameState.countdownId);
            overlay.classList.add('hidden');
            startRound();
        }
    }, 1000);
}

function startRound() {
    if (!gameState.isRunning) return;
    if (gameState.trysToGo <= 0) return finishGame();

    gameState.phase = 'waiting';
    gameState.missedClicksBeforeChange = 0;

    document.querySelectorAll('.square').forEach(el => {
        el.style.backgroundColor = '#4CAF50';
    });

    gameState.delayTimeout = setTimeout(showSignal, Math.random() * 2000 + 1000);
}

function showSignal() {
    if (!gameState.isRunning) return;

    gameState.phase = 'ready';
    
    document.querySelectorAll('.square').forEach(el => {
        el.style.backgroundColor = '#FF0000';
    });

    if (gameState.gameMode === 'gameKeyboard') {
        gameState.keyValue = alphabet[Math.floor(Math.random() * alphabet.length)];
        document.getElementById('keyValue').innerText = gameState.keyValue;
    }

    gameState.trysToGo--;
    document.getElementById('toGo').innerText = gameState.trysToGo;
    gameState.timeoutId = Date.now(); 
}

// INPUT

function handleBoxClick() {
    if (!gameState.isRunning || gameState.gameMode !== 'gameBox') return;
    handleReaction();
}

document.addEventListener('keydown', (e) => {
    if (!gameState.isRunning || gameState.gameMode !== 'gameKeyboard') return;
    if (gameState.phase === 'waiting') {
        handleReaction();
    };
    if (e.key.toLowerCase() === gameState.keyValue.toLowerCase() && gameState.phase === 'ready') {
        handleReaction();
    } else if (gameState.phase === 'ready') {
        gameState.wrongClicks++;
        gameState.missedClicksTotal++;
        document.getElementById('wrongKey').innerText = gameState.wrongClicks;
        document.getElementById('missedTotal').innerText = gameState.missedClicksTotal;
    }
});

// CORE

function handleReaction() {
    if (gameState.phase === 'waiting') {
        gameState.missedClicksBeforeChange++;
        gameState.missedClicksTotal++;

        document.getElementById('missedBefore').innerText = gameState.missedClicksBeforeChange;
        document.getElementById('missedTotal').innerText = gameState.missedClicksTotal;

    } else if (gameState.phase === 'ready') {
        const reactionTime = Date.now() - gameState.timeoutId;

        gameState.actualGameTimeResults.push(reactionTime);
        updateStats(reactionTime);

        startRound();
    }
}

// STATS 

function updateStats(reactionTime) {
    document.getElementById('results').classList.remove('hidden');

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
    document.getElementById('bestScore').innerText = gameState.actualBestScore ?? '-';
    document.getElementById('worstScore').innerText = gameState.actualWorstScore ?? '-';
    document.getElementById('avgScore').innerText =
        gameState.actualAvgScore ? gameState.actualAvgScore.toFixed(2) : '-';
}

// LOGIKA STATYSTYK OGÓLNYCH

function checkOverallStats() {

    const avg = gameState.actualAvgScore;
    const missed = gameState.missedClicksTotal;

    if (gameState.gameMode === 'gameBox') {

        // BEST TIME
        if (gameState.boxBestScore === null || avg < gameState.boxBestScore) {
            gameState.boxBestScore = avg;
            gameState.boxBestScoreMissed = missed;
        }

        // BEST CLICKS
        if (
            gameState.boxBestScoreMissedClicksClicks === null ||
            missed < gameState.boxBestScoreMissedClicksClicks ||
            (missed === gameState.boxBestScoreMissedClicksClicks &&
                avg < gameState.boxBestScoreMissedClicks)
        ) {
            gameState.boxBestScoreMissedClicksClicks = missed;
            gameState.boxBestScoreMissedClicks = avg;
        }
    }

    if (gameState.gameMode === 'gameKeyboard') {

        if (gameState.keyboardBestScore === null || avg < gameState.keyboardBestScore) {
            gameState.keyboardBestScore = avg;
            gameState.keyboardBestScoreMissed = missed;
        }

        if (
            gameState.keyboardBestScoreMissedClicksClicks === null ||
            missed < gameState.keyboardBestScoreMissedClicksClicks ||
            (missed === gameState.keyboardBestScoreMissedClicksClicks &&
                avg < gameState.keyboardBestScoreMissedClicks)
        ) {
            gameState.keyboardBestScoreMissedClicksClicks = missed;
            gameState.keyboardBestScoreMissedClicks = avg;
        }
    }
}

function renderOverallStats() {

    document.getElementById('overallBox').innerText =
        gameState.boxBestScore?.toFixed(2) ?? '-';

    document.getElementById('overallBoxMissed').innerText =
        gameState.boxBestScoreMissed ?? '-';

    document.getElementById('overallKeyboard').innerText =
        gameState.keyboardBestScore?.toFixed(2) ?? '-';

    document.getElementById('overallKeyboardMissed').innerText =
        gameState.keyboardBestScoreMissed ?? '-';

    document.getElementById('overallMissedBox').innerText =
        gameState.boxBestScoreMissedClicks?.toFixed(2) ?? '-';

    document.getElementById('overallBoxMissedClicks').innerText =
        gameState.boxBestScoreMissedClicksClicks ?? '-';

    document.getElementById('overallMissedKeyboard').innerText =
        gameState.keyboardBestScoreMissedClicks?.toFixed(2) ?? '-';

    document.getElementById('overallKeyboardMissedClicks').innerText =
        gameState.keyboardBestScoreMissedClicksClicks ?? '-';
}

// STOP 

function finishGame() {
    stopGame();
}

function stopGame() {
    gameState.isRunning = false;
    gameState.phase = 'idle';

    clearTimeout(gameState.delayTimeout);
    clearInterval(gameState.countdownId);

    checkOverallStats();
    renderOverallStats();

    document.getElementById('startButton').classList.remove('hidden');
    document.getElementById('stopButton').classList.add('hidden');
    document.getElementById('settings').classList.remove('hidden');

    document.getElementById('countdownOverlay').classList.add('hidden');

    document.querySelectorAll('.square').forEach(el => {
        el.style.backgroundColor = '#4CAF50';
    });
}