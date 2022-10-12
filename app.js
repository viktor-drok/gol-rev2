const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const color = 'cornsilk';
const rowCount = 40;
const colCount = 40;
let cellSize = 0;
let stepsPerSecond = document.getElementById('speed');
let chanceForNewNeighbor = document.getElementById('chance');
const state = buildState();
const stopBtn = document.querySelector('.stop-start');
const options = document.querySelector('.options');
const explanation = document.querySelector('.explanation');
const rules = document.querySelector('.rules');
const pattern = document.querySelector('.pattern');
const optionsModal = document.querySelector('.options-modal');
const rulesModal = document.querySelector('.rules-modal');
const explanationModal = document.querySelector('.explanation-modal');
const patternModal = document.querySelector('.pattern-modal');
const patternModalList = document.querySelector('.pattern-modal-list');
// const closeModalBtn = document.querySelector('.close');
const buttons = document.querySelectorAll('button');
const cleaarBtn = document.querySelector('.cleaarBtn');
const generation = document.querySelector('.generation');
const population = document.querySelector('.population');
let populationCount = [];

const patternsStatic = [
    {
        name: 'block',
        src: '/images/block.png'
    },
    {
        name: 'bee-hive',
        src: '/images/beehive.png'
    },
    {
        name: 'loaf',
        src: '/images/loaf.png'
    },
    {
        name: 'boat',
        src: '/images/boat.png'
    },
    {
        name: 'tub',
        src: '/images/flower.png'
    }
];

const patternsOscillators = [
    {
        name: 'Blinker',
        src: '/images/blinker.gif'
    },
    {
        name: 'Toad',
        src: '/images/toad.gif'
    },
    {
        name: 'Beacon',
        src: '/images/beacon.gif'
    },
    {
        name: 'Pulsar',
        src: '/images/pulsar.gif'
    },
    {
        name: 'Penta-decathlon',
        src: '/images/penta.gif'
    }
];

const patternsSpaceships = [
    {
        name: 'Heavy-weight spaceship',
        src: '/images/Hwss.gif'
    },
    {
        name: 'Glider',
        src: '/images/glider.gif'
    },
    {
        name: 'Light-weight spaceship',
        src: '/images/LWSS.gif'
    },
    {
        name: 'Middle-weight spaceship',
        src: '/images/Mwss.gif'
    }
];

let timerId;

console.log(state);

document.body.append(canvas);

preventDefaultBtns();

renderPatterns();

resize();
render();

runSimulation();


onresize = () => {
    resize();
    render();
};

canvas.onclick = e => {
    const { offsetX: x, offsetY: y } = e;

    toggleCell(x, y);
    render();
};

function stopStart(e) {
    if (e.key === ' ' || e.target == stopBtn) {
        if (timerId) {
            stopSimulation();
        } else {
            runSimulation();
        }
    }
}

stopBtn.addEventListener('click', stopStart);
stopBtn.addEventListener('click', replaceStartBtnText);
document.addEventListener('keydown', stopStart);
document.addEventListener('keydown', replaceStartBtnText);
options.addEventListener('click', showOptionsModal);
explanation.addEventListener('click', showExplanationModal);
pattern.addEventListener('click', showPatternModal);
rules.addEventListener('click', showRulesModal);
cleaarBtn.addEventListener('click', clearBtn);
// closeModalBtn.addEventListener('click', () => {
//     optionsModal.removeAttribute('data-hidden');
// });

// onkeydown = (e) => {
//     if (e.key === ' ') {
//         if (timerId) {
//             stopSimulation();
//         } else {
//             runSimulation();
//         }
//     }
// };

// onclick = (e) => {
//     if (e.target == stopBtn) {
//         if (timerId) {
//             stopSimulation();
//         } else {
//             runSimulation();
//         }
//     }
// };

function resize() {
    const viewMin = Math.min(innerWidth, innerHeight);

    canvas.width = canvas.height = viewMin;
    cellSize = viewMin / colCount;
}

function buildState() {
    return Array(colCount).fill(null)
        .map(() => Array(rowCount).fill(null)
            .map(() => Math.round(Math.random() - 0.45)));
}

function render() {
    clear();
    ctx.fillStyle = color;

    state.forEach((row, i) => row.forEach((alive, j) => {
        if (alive) {
            const x = j * cellSize;
            const y = i * cellSize;
            ctx.fillRect(x, y, cellSize, cellSize);
        }
    }));
}

function clear() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#333e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function toggleCell(x, y) {
    const row = state[Math.floor(y / cellSize)];
    const cellIndex = Math.floor(x / cellSize);

    row[cellIndex] = +!row[cellIndex];
}

// function runSimulation() {
//     timerId = setInterval(() => {
//         proceed();
//         render();
//     }, 1000 / stepsPerSecond);
// }

function runSimulation() {
    timerId = setTimeout(() => {
        proceed();
        render();
        showGeneration(timerId);
        showPopulation(state);
        runSimulation();
    }, 1000 / (stepsPerSecond.value / 10));
}

function proceed() {
    const nextState = [];

    for (let i = 0; i < rowCount; i++) {
        const row = [];

        for (let j = 0; j < colCount; j++) {
            const neighbourhood = getNeighbourhood(i, j);

            row.push(calcNextCellState(neighbourhood));
        }

        nextState.push(row);
    }

    state.splice(0, rowCount, ...nextState);
}

function getNeighbourhood(rowIndex, colIndex) {
    const neighbourhood = [];

    for (let i = -1; i < 2; i++) {
        const row = [];

        for (let j = -1; j < 2; j++) {
            row.push(state.at((rowIndex + i) % rowCount).at((colIndex + j) % colCount));
        }

        neighbourhood.push(row);
    }

    return neighbourhood;
}

function calcNextCellState(neighborhood) {
    neighborhood = neighborhood.flat();

    const [cellState] = neighborhood.splice(4, 1);
    const neighbourCount = neighborhood.filter(Boolean).length;

    return cellState
        ? +(neighbourCount === 2 || neighbourCount === 3)
        : +(neighbourCount === 3 || neighbourCount === 2 && Math.random() < chanceForNewNeighbor.value / 100);
}
// function calcNextCellState(neighbourhood) {
//     neighbourhood = neighbourhood.flat();

//     const [cellState] = neighbourhood.splice(4, 1);
//     const neighbourCount = neighbourhood.filter(Boolean).length;

//     return cellState
//         ? +(neighbourCount === 2 || neighbourCount === 3)
//         : +(neighbourCount === 3);
// }

function stopSimulation() {
    clearInterval(timerId);
    timerId = null;
}

// work with DOM elements

function showOptionsModal() {
    optionsModal.toggleAttribute('data-hidden');
    explanationModal.removeAttribute('data-hidden');
    rulesModal.removeAttribute('data-hidden');
    patternModal.removeAttribute('data-hidden');
}

function showExplanationModal() {
    explanationModal.toggleAttribute('data-hidden');
    optionsModal.removeAttribute('data-hidden');
    rulesModal.removeAttribute('data-hidden');
    patternModal.removeAttribute('data-hidden');
}

function showRulesModal() {
    rulesModal.toggleAttribute('data-hidden');
    explanationModal.removeAttribute('data-hidden');
    optionsModal.removeAttribute('data-hidden');
    patternModal.removeAttribute('data-hidden');
}

function showPatternModal() {
    patternModal.toggleAttribute('data-hidden');
    rulesModal.removeAttribute('data-hidden');
    explanationModal.removeAttribute('data-hidden');
    optionsModal.removeAttribute('data-hidden');
}

function preventDefaultBtns() {
    buttons.forEach(element => element.addEventListener('click', (e) => e.preventDefault()));
};

function clearBtn() {
    stopSimulation();
    clearCanvas();
    state.forEach(arr => arr.fill(0));
    render();
}

function clearCanvas() {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    replaceStartBtnText();
};

function replaceStartBtnText() {
    stopBtn.innerHTML = (stopBtn.innerHTML == '<i class="fa-solid fa-pause"></i>Pause')
        ? (stopBtn.innerHTML = '<i class="fa-solid fa-play"></i>Play')
        : (stopBtn.innerHTML = '<i class="fa-solid fa-pause"></i>Pause');
}

function renderPatterns() {

    patternsStatic.forEach((e) => {
        patternModalList.innerHTML += `<li ><p>${e.name}</p><img src="${e.src}" alt=""/></li>`;
    });

    patternsOscillators.forEach((e) => {
        patternModalList.innerHTML += `<li ><p>${e.name}</p><img src="${e.src}" alt=""/></li>`;
    });

    patternsSpaceships.forEach((e) => {
        patternModalList.innerHTML += `<li ><p>${e.name}</p><img src="${e.src}" alt=""/></li>`;
    });
}

function showGeneration(timerId) {
    generation.innerText = `Generation: ${timerId}`;
}

function showPopulation(state) {
    populationCount = state.flat().reduce((a, b) => a + b);

    population.innerText = `Population: ${populationCount}`;
}