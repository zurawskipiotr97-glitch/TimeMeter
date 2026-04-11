const gameState = {
    isRunning: false,
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


//REPAIR !!!!!!
function switchMode() {
    const selectedMode = document.getElementById('gameMode').value;
    gameState.gameMode = selectedMode
    const showMode = document.getElementById(selectedMode)
    showMode.style.display = "block";
}

function updateLimit() {
    const tryLimitInput = document.getElementById('tryLimit');

    const val = parseInt(tryLimitInput.value);
    
    gameState.limit = isNaN(val) ? 0 : val;
    gameState.trysToGo = gameState.limit;

    const scoreElement = document.getElementById('toGo');
    if (scoreElement) {
        scoreElement.innerText = gameState.trysToGo;
    }
}


