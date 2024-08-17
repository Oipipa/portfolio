function startGameOfLife() {
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
    const rows = 80;
    const cols = 80;

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
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'; 

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (grid[i][j] === 1) {
                    ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                }
            }
        }
    }

    function gameLoop() {
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

document.getElementById("aboutBtn").addEventListener("click", function() {
    startGameOfLife();
});

document.getElementById("closeButton").addEventListener("click", function() {
stopGameOfLife();
});
