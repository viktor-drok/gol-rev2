const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const color = 'cornsilk';
const rowCount = 120;
const colCount = 120;
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
const buttons = document.querySelectorAll('button');
const cleaarBtn = document.querySelector('.cleaarBtn');
const generationOutput = document.querySelector('.generation');
let generation = 0;
const populationOutput = document.querySelector('.population');
let populationCount = [];

const patterns = [
    {
        name: 'block',
        src: '/images/block.png',
        state: [
            [1, 1],
            [1, 1],
        ]
    },
    {
        name: 'bee-hive',
        src: '/images/beehive.png',
        state: [
            [0, 1, 1, 0],
            [1, 0, 0, 1],
            [1, 0, 0, 1],
            [0, 1, 1, 0],
        ]
    },
    {
        name: 'loaf',
        src: '/images/loaf.png',
        state: [
            [0, 1, 1, 0],
            [1, 0, 0, 1],
            [0, 1, 0, 1],
            [0, 0, 1, 0],
        ]
    },
    {
        name: 'boat',
        src: '/images/boat.png',
        state: [
            [1, 1, 0],
            [1, 0, 1],
            [0, 1, 0]
        ]
    },
    {
        name: 'tub',
        src: '/images/flower.png',
        state: [
            [0, 1, 0],
            [1, 0, 1],
            [0, 1, 0]
        ]
    },
    {
        name: 'Blinker',
        src: '/images/blinker.gif',
        state: [
            [1, 1, 1]
        ]
    },
    {
        name: 'Toad',
        src: '/images/toad.gif',
        state: [
            [0, 1, 1, 1],
            [1, 1, 1, 0]
        ]
    },
    {
        name: 'Beacon',
        src: '/images/beacon.gif',
        state: [
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 0, 1, 1],
            [0, 0, 1, 1],
        ]
    },
    {
        name: 'Pulsar',
        src: '/images/pulsar.gif',
        state: [
            [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
            [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
        ]
    },
    {
        name: 'Penta-decathlon',
        src: '/images/penta.gif',
        state: [
            [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
            [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
            [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
        ]
    },
    {
        name: 'Heavy-weight spaceship',
        src: '/images/Hwss.gif',
        state: [
            [0, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0],
            [0, 0, 1, 1, 0, 0, 0],
        ]
    },
    {
        name: 'Glider',
        src: '/images/glider.gif',
        state: [
            [1, 0, 0],
            [0, 1, 1],
            [1, 1, 0],
        ]
    },
    {
        name: 'Light-weight spaceship',
        src: '/images/LWSS.gif',
        state: [
            [0, 1, 1, 0, 0],
            [1, 1, 1, 1, 0],
            [1, 1, 0, 1, 1],
            [0, 0, 1, 1, 0]
        ]
    },
    {
        name: 'Middle-weight spaceship',
        src: '/images/Mwss.gif',
        state: [
            [0, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 0],
        ]
    }
];

let timerId;

console.log(state);

document.body.append(canvas);

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
    if ((e.key === ' ') + (e.target == stopBtn) == 1) {
        replaceStartBtnText();

        if (timerId) {
            stopSimulation();
        } else {
            runSimulation();
        }
    }
}

stopBtn.addEventListener('click', stopStart);
document.addEventListener('keydown', stopStart);
options.addEventListener('click', showOptionsModal);
explanation.addEventListener('click', showExplanationModal);
pattern.addEventListener('click', showPatternModal);
rules.addEventListener('click', showRulesModal);
cleaarBtn.addEventListener('click', clearBtn);
patternModalList.addEventListener('click', (e) => {
    clearBtn();

    const li = e.target.closest('li');
    if (!li) return;
    const img = li.querySelector('img');
    const pattern = patterns.find(p => img.src.endsWith(p.src));

    for (let l = 0; l < pattern.state.length; l++) {
        for (let k = 0; k < pattern.state[l].length; k++) {
            state[l + Math.floor(state.length / 2)][k + Math.floor(state.length / 2)] = pattern.state[l][k];
            console.log(state[l][k]);
        }
    }

    render();
    stopSimulation();
});

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

function runSimulation() {
    timerId = setTimeout(() => {
        proceed();
        render();
        showGeneration();
        showPopulation(state);
        runSimulation();
    }, 1000 / (stepsPerSecond.value / 2));
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
    generation++;
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

    patterns.forEach((pattern) => {
        patternModalList.innerHTML += `<li ><p>${pattern.name}</p><img src="${pattern.src}" alt=""/></li>`;
    });
}

function showGeneration() {
    generationOutput.innerText = `Generation: ${generation}`;
}

function showPopulation(state) {
    populationCount = state.flat().reduce((a, b) => a + b);

    populationOutput.innerText = `Population: ${populationCount}`;
}
