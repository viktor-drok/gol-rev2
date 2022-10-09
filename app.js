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
const optionsModal = document.querySelector('.options-modal');
const closeModalBtn = document.querySelector('.close');

let timerId;

console.log(state);

document.body.append(canvas);

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

document.addEventListener('click', stopStart);
document.addEventListener('keydown', stopStart);

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

options.addEventListener('click', showOptionsModal);

function showOptionsModal() {
    optionsModal.toggleAttribute('data-hidden');
}
