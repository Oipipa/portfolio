let gameOfLifeRunning = false;
let brianBrainRunning = false;

function stopAllSimulations() {
    stopGameOfLife();
    stopBriansBrain();
}

function startGameOfLife() {
    stopBriansBrain(); 

    if (gameOfLifeRunning) return;

    gameOfLifeRunning = true;

    const canvas = document.createElement('canvas');
    canvas.id = 'gameOfLifeCanvas';
    const container = document.getElementById('gameOfLifeCanvasContainer');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const cellSize = 10;
    const rows = Math.floor(height / cellSize);
    const cols = Math.floor(width / cellSize);

    let grid = createGrid(rows, cols);
    let nextGrid = createGrid(rows, cols);

    function createGrid(rows, cols) {
        const arr = new Array(rows);
        for (let i = 0; i < rows; i++) {
            arr[i] = new Array(cols).fill(0);
        }
        return arr;
    }

    function initializeGrid() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j] = Math.random() > 0.8 ? 1 : 0;
            }
        }
    }

    function updateGrid() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let aliveNeighbors = countAliveNeighbors(grid, i, j);

                if (grid[i][j] === 1 && (aliveNeighbors < 2 || aliveNeighbors > 3)) {
                    nextGrid[i][j] = 0;
                } else if (grid[i][j] === 0 && aliveNeighbors === 3) {
                    nextGrid[i][j] = 1;
                } else {
                    nextGrid[i][j] = grid[i][j];
                }
            }
        }
        [grid, nextGrid] = [nextGrid, grid];
    }

    function countAliveNeighbors(grid, x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const row = (x + i + rows) % rows;
                const col = (y + j + cols) % cols;
                count += grid[row][col];
            }
        }
        return count;
    }

    function renderGrid() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (grid[i][j] === 1) {
                    ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                }
            }
        }
    }

    function gameLoop() {
        if (!gameOfLifeRunning) return;
        updateGrid();
        renderGrid();
        requestAnimationFrame(gameLoop);
    }

    initializeGrid();
    gameLoop();
}

function stopGameOfLife() {
    gameOfLifeRunning = false;
    const canvas = document.getElementById('gameOfLifeCanvas');
    if (canvas) {
        canvas.remove();
    }
}

function startBriansBrain() {
    stopGameOfLife(); 

    if (brianBrainRunning) return;

    brianBrainRunning = true;

    const canvas = document.createElement('canvas');
    canvas.id = 'briansBrainCanvas';
    const container = document.getElementById('aboutCanvasContainer');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const cellSize = 5;
    const rows = Math.floor(height / cellSize);
    const cols = Math.floor(width / cellSize);

    let grid = createGrid(rows, cols);
    let nextGrid = createGrid(rows, cols);

    function createGrid(rows, cols) {
        const arr = new Array(rows);
        for (let i = 0; i < rows; i++) {
            arr[i] = new Array(cols).fill(0);
        }
        return arr;
    }

    function initializeGrid() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j] = Math.random() > 0.9 ? 1 : 0;
            }
        }
    }

    function updateGrid() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let aliveNeighbors = countAliveNeighbors(grid, i, j);

                if (grid[i][j] === 1) {
                    nextGrid[i][j] = 2;
                } else if (grid[i][j] === 2) {
                    nextGrid[i][j] = 0;
                } else if (grid[i][j] === 0 && aliveNeighbors === 2) {
                    nextGrid[i][j] = 1;
                } else {
                    nextGrid[i][j] = grid[i][j];
                }
            }
        }
        [grid, nextGrid] = [nextGrid, grid];
    }

    function countAliveNeighbors(grid, x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const row = (x + i + rows) % rows;
                const col = (y + j + cols) % cols;
                if (grid[row][col] === 1) count++;
            }
        }
        return count;
    }

    function renderGrid() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (grid[i][j] === 1) {
                    ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
                } else if (grid[i][j] === 2) {
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
                } else {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
                }
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    }

    function brianBrainLoop() {
        if (!brianBrainRunning) return;
        updateGrid();
        renderGrid();
        requestAnimationFrame(brianBrainLoop);
    }

    initializeGrid();
    brianBrainLoop();
}

function stopBriansBrain() {
    brianBrainRunning = false;
    const canvas = document.getElementById('briansBrainCanvas');
    if (canvas) {
        canvas.remove();
    }
}

document.getElementById("aboutBtn").addEventListener("click", function() {
    startGameOfLife();
});

document.getElementById("projectsBtn").addEventListener("click", function() {
    startBriansBrain();
});

document.getElementById("closeButton").addEventListener("click", function() {
    stopAllSimulations();
});