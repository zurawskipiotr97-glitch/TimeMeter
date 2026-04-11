const gameState = {
    isRunning: false,
    gameMode: null,
    limit: 5,

    trysToGo: 5,
    missedClicksBeforeChange: 0,
    actualGameTimeResults: [],
    actualBestScore: null,
    actualWorstScore: null,
    actualAvgScore: null,

    boxBestScore: null,
    keyboardBestScore: null,

    lastChangeDate: null
    
}

function updateLimit() {
    const tryLimitInput = document.getElementById('tryLimit');

    const value = parseInt(tryLimitInput.value);
    
    gameState.limit = isNaN(value) ? 0 : value;
    gameState.trysToGo = gameState.limit;

    const scoreElement = document.getElementById('toGo');
    if (scoreElement) {
        scoreElement.innerText = gameState.trysToGo;
    }
}

function switchMode() {
    const selectedMode = document.getElementById('gameMode').value;
    gameState.gameMode = selectedMode;

    const modes = ['gameBox', 'gameKeyboard'];

    modes.forEach(id => {
        const el = document.getElementById(id);

        if (id === selectedMode) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });
}



function startGame() {
    const tryLimit = document.getElementById('tryLimit')
    const gameMode = document.getElementById('gameMode')

    gameState.gameMode = gameMode.value;
    gameState.limit = parseInt(tryLimit.value);
    gameState.trysToGo = parseInt(tryLimit.value);
    gameState.isRunning = true;

    const startButton = document.getElementById('startButton');
    startButton.style.display = 'none';

    const stopButton = document.getElementById('stopButton');
    stopButton.style.display ='block';

    // renderUI();
    //TODO
}

// function renderUI() {
//     const sections = ['settings', 'gameBox', 'gameKeyboard'];

//     sections.forEach(id => {
//         const el = document.getElementById(id);
//         if (el) {
//             if (gameState.currentScreens.includes(id)) {
//                 el.style.display = 'block';
//             } else {
//                 el.style.display = 'none';
//             }
//         }
//     });

//     if (gameState.resultsOnScreen) {
//         const res = document.getElementById(results)
//         res.style.display = 'block';
//     }
// }

function stopGame() {
    gameState.isRunning = false;
    gameState.currentScreens = ['settings', gameState.gameMode, 'results']
    // renderUI();
}

function getTrysToGo() {
    return gameState.trysToGo;
}

function handleBoxClick() {
    const backgroundBox = document.getElementById(cliccker);
    backgroundBox.style.backgroundColor = 'red'
}





