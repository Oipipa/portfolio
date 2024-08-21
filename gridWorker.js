// gridWorker.js
self.onmessage = function(e) {
    const { grid, rows, cols, mode } = e.data;

    function createGrid(rows, cols) {
        const arr = new Array(rows);
        for (let i = 0; i < rows; i++) {
            arr[i] = new Array(cols).fill(0);
        }
        return arr;
    }

    function countAliveNeighbors(grid, x, y, rows, cols) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const row = (x + i + rows) % rows;
                const col = (y + j + cols) % cols;
                count += grid[row][col] === 1 ? 1 : 0;
            }
        }
        return count;
    }

    function updateGameOfLife(grid, nextGrid, rows, cols) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let aliveNeighbors = countAliveNeighbors(grid, i, j, rows, cols);

                if (grid[i][j] === 1 && (aliveNeighbors < 2 || aliveNeighbors > 3)) {
                    nextGrid[i][j] = 0;
                } else if (grid[i][j] === 0 && aliveNeighbors === 3) {
                    nextGrid[i][j] = 1;
                } else {
                    nextGrid[i][j] = grid[i][j];
                }
            }
        }
        return nextGrid;
    }

    function updateBriansBrain(grid, nextGrid, rows, cols) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let aliveNeighbors = countAliveNeighbors(grid, i, j, rows, cols);

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
        return nextGrid;
    }

    let nextGrid = createGrid(rows, cols);

    if (mode === 'gameOfLife') {
        nextGrid = updateGameOfLife(grid, nextGrid, rows, cols);
    } else if (mode === 'briansBrain') {
        nextGrid = updateBriansBrain(grid, nextGrid, rows, cols);
    }

    self.postMessage(nextGrid);
};
