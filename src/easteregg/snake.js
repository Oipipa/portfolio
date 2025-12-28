const DEFAULT_TILE = 22;
const STEP_MS = 110;

export function startBackgroundSnake(canvasId = 'bg-snake') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const state = {
    canvas,
    ctx,
    tile: DEFAULT_TILE,
    gridW: 0,
    gridH: 0,
    obstacle: null,
    snake: [],
    food: null,
    direction: { x: 1, y: 0 },
    timer: null
  };

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    state.gridW = Math.max(20, Math.floor(width / state.tile));
    state.gridH = Math.max(16, Math.floor(height / state.tile));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    computeObstacle();
    if (!state.snake.length || isBlocked(state.snake[0])) {
      reset();
    } else if (state.food && (isBlocked(state.food) || !shortestPath(state.snake[0], state.food))) {
      placeFood();
    }
  }

  function reset() {
    const start = findOpenCell();
    const baseX = start.x;
    const baseY = start.y;
    state.snake = [
      { x: baseX, y: baseY },
      { x: baseX - 1, y: baseY },
      { x: baseX - 2, y: baseY },
      { x: baseX - 3, y: baseY }
    ];
    state.direction = { x: 1, y: 0 };
    placeFood();
  }

  function key(x, y) {
    return `${x},${y}`;
  }

  function inBounds(p) {
    return p.x >= 0 && p.x < state.gridW && p.y >= 0 && p.y < state.gridH;
  }

  function computeObstacle() {
    const win = document.querySelector('.window');
    if (!win) {
      state.obstacle = null;
      return;
    }
    const rect = win.getBoundingClientRect();
    const margin = 12;
    const x0 = Math.floor((rect.left - margin) / state.tile);
    const y0 = Math.floor((rect.top - margin) / state.tile);
    const x1 = Math.ceil((rect.right + margin) / state.tile);
    const y1 = Math.ceil((rect.bottom + margin) / state.tile);
    if (x0 >= state.gridW || y0 >= state.gridH || x1 <= 0 || y1 <= 0) {
      state.obstacle = null;
      return;
    }
    state.obstacle = {
      x0: Math.max(0, x0),
      y0: Math.max(0, y0),
      x1: Math.min(state.gridW, x1),
      y1: Math.min(state.gridH, y1)
    };
  }

  function isBlocked(pos) {
    if (!state.obstacle) return false;
    return pos.x >= state.obstacle.x0 && pos.x < state.obstacle.x1 && pos.y >= state.obstacle.y0 && pos.y < state.obstacle.y1;
  }

  function placeFood() {
    const occupied = new Set(state.snake.map((p) => key(p.x, p.y)));
    const head = state.snake[0];
    let attempts = 0;

    while (attempts < 400) {
      const fx = Math.floor(Math.random() * state.gridW);
      const fy = Math.floor(Math.random() * state.gridH);
      const candidate = { x: fx, y: fy };
      if (occupied.has(key(fx, fy)) || isBlocked(candidate)) {
        attempts += 1;
        continue;
      }
      if (shortestPath(head, candidate)) {
        state.food = candidate;
        return;
      }
      attempts += 1;
    }

    // Deterministic fallback scan.
    for (let y = 0; y < state.gridH; y += 1) {
      for (let x = 0; x < state.gridW; x += 1) {
        const candidate = { x, y };
        if (occupied.has(key(x, y)) || isBlocked(candidate)) continue;
        if (shortestPath(head, candidate)) {
          state.food = candidate;
          return;
        }
      }
    }

    state.food = { x: 2, y: 2 };
  }

  function neighbors(node) {
    return [
      { x: node.x + 1, y: node.y },
      { x: node.x - 1, y: node.y },
      { x: node.x, y: node.y + 1 },
      { x: node.x, y: node.y - 1 }
    ].filter((p) => inBounds(p) && !isBlocked(p));
  }

  function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  function shortestPath(start, goal) {
    if (!goal) return null;
    const blocked = new Set(state.snake.slice(0, -1).map((p) => key(p.x, p.y)));
    const queue = [start];
    const cameFrom = new Map();
    const seen = new Set([key(start.x, start.y)]);

    while (queue.length) {
      const current = queue.shift();
      if (current.x === goal.x && current.y === goal.y) {
        const path = [current];
        let currKey = key(current.x, current.y);
        while (cameFrom.has(currKey)) {
          const prev = cameFrom.get(currKey);
          path.unshift(prev);
          currKey = key(prev.x, prev.y);
        }
        return path;
      }

      neighbors(current).forEach((neighbor) => {
        const nKey = key(neighbor.x, neighbor.y);
        if (seen.has(nKey)) return;
        if (blocked.has(nKey)) return;
        seen.add(nKey);
        cameFrom.set(nKey, current);
        queue.push(neighbor);
      });
    }
    return null;
  }

  function computeDirection() {
    const head = state.snake[0];
    const path = shortestPath(head, state.food);
    if (path && path.length > 1) {
      const next = path[1];
      return { x: next.x - head.x, y: next.y - head.y };
    }

    // No clear path: keep moving safely until food repositioned next step.
    const fallback = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 }
    ];
    return fallback.find((dir) => {
      const nextPos = { x: head.x + dir.x, y: head.y + dir.y };
      return inBounds(nextPos) && !isOccupied(nextPos, true);
    }) || state.direction;
  }

  function isOccupied(pos, ignoreTail = false) {
    const length = state.snake.length - (ignoreTail ? 1 : 0);
    for (let i = 0; i < length; i += 1) {
      const part = state.snake[i];
      if (part.x === pos.x && part.y === pos.y) return true;
    }
    return false;
  }

  function step() {
    computeObstacle();
    state.direction = computeDirection();
    const head = state.snake[0];
    const next = { x: head.x + state.direction.x, y: head.y + state.direction.y };

    if (!inBounds(next) || isBlocked(next) || isOccupied(next, false)) {
      reset();
      draw();
      return;
    }

    state.snake.unshift(next);
    if (state.food && next.x === state.food.x && next.y === state.food.y) {
      placeFood();
    } else {
      state.snake.pop();
    }
    draw();
  }

  function findOpenCell() {
    const startX = Math.floor(state.gridW / 2);
    const startY = Math.floor(state.gridH / 2);

    function fits(x, y) {
      if (x - 3 < 0) return false;
      const cells = [
        { x, y },
        { x: x - 1, y },
        { x: x - 2, y },
        { x: x - 3, y }
      ];
      return cells.every((c) => inBounds(c) && !isBlocked(c));
    }

    if (fits(startX, startY)) return { x: startX, y: startY };

    for (let y = 0; y < state.gridH; y += 1) {
      for (let x = 3; x < state.gridW; x += 1) {
        if (fits(x, y)) return { x, y };
      }
    }

    return { x: 3, y: 0 };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#dfe8ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawSquare = (pos, color) => {
      if (isBlocked(pos)) return;
      ctx.fillStyle = color;
      ctx.fillRect(pos.x * state.tile, pos.y * state.tile, state.tile - 1, state.tile - 1);
    };

    if (state.food) {
      drawSquare(state.food, '#0000ff');
    }

    state.snake.forEach((segment, idx) => {
      const headColor = '#ff0000';
      const bodyColor = '#ff0000';
      drawSquare(segment, idx === 0 ? headColor : bodyColor);
    });
  }

  resize();
  reset();
  draw();

  if (state.timer) clearInterval(state.timer);
  state.timer = setInterval(step, STEP_MS);
  window.addEventListener('resize', () => {
    resize();
    draw();
  });
}
