let pingpongActive = false
let pingpongReq

let pingCanvas, pingCtx
let paddleWidth = 10
let paddleHeight = 80
let paddle1Y = 0
let paddle2Y = 0
let ballX = 0
let ballY = 0
let ballRadius = 9
let ballSpeedX = 50
let ballSpeedY = 50

let tileSize = 20
let snake = [{x:10,y:10}]
let snakeFrameCount = 0
let snakeMoveInterval = 1

function setupPingPong() {
  pingCanvas = document.getElementById('gameCanvas')
  pingCtx = pingCanvas.getContext('2d')
  resizeCanvasPing()
  resetPositionsPing()
  window.addEventListener('resize', resizeCanvasPing)
}

function startPingPong() {
  if (!pingpongActive) {
    pingpongActive = true
    updatePingPong()
  }
}

function stopPingPong() {
  pingpongActive = false
  cancelAnimationFrame(pingpongReq)
}

function resizeCanvasPing() {
  pingCanvas.width = pingCanvas.offsetWidth
  pingCanvas.height = pingCanvas.offsetHeight
}

function resetPositionsPing() {
  if (!pingCanvas) return
  ballX = pingCanvas.width / 2
  ballY = pingCanvas.height / 2
  ballSpeedX = Math.random() < 0.5 ? 15 : -15
  ballSpeedY = Math.random() < 0.5 ? 20 : -20
}

function updatePingPong() {
  if (!pingpongActive) return
  moveBall()
  moveAIPaddles()
  snakeFrameCount++
  if (snakeFrameCount >= snakeMoveInterval) {
    moveSnake()
    snakeFrameCount = 0
  }
  drawEverything()
  pingpongReq = requestAnimationFrame(updatePingPong)
}

function moveBall() {
  ballX += ballSpeedX
  ballY += ballSpeedY
  if (ballY - ballRadius < 0 && ballSpeedY < 0) ballSpeedY = -ballSpeedY
  if (ballY + ballRadius > pingCanvas.height && ballSpeedY > 0) ballSpeedY = -ballSpeedY
  if (ballX - ballRadius <= paddleWidth) {
    if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
      handlePaddleCollision(paddle1Y)
      ballX = paddleWidth + ballRadius
    }
  }
  if (ballX + ballRadius >= pingCanvas.width - paddleWidth) {
    if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
      handlePaddleCollision(paddle2Y)
      ballX = pingCanvas.width - paddleWidth - ballRadius
    }
  }
  if (ballX + ballRadius < 0) resetPositionsPing()
  if (ballX - ballRadius > pingCanvas.width) resetPositionsPing()
}

function handlePaddleCollision(paddleY) {
  let center = paddleY + paddleHeight / 2
  let dist = ballY - center
  ballSpeedY = dist * 0.15 + (Math.random() - 0.5) * 0.7
  ballSpeedX = -ballSpeedX * 1.01
}

function moveAIPaddles() {
  let targetY1 = predictBallY(0) - paddleHeight / 2
  if (targetY1 < 0) targetY1 = 0
  if (targetY1 > pingCanvas.height - paddleHeight) targetY1 = pingCanvas.height - paddleHeight
  paddle1Y += (targetY1 - paddle1Y) * 0.06

  let targetY2 = predictBallY(pingCanvas.width) - paddleHeight / 2
  if (targetY2 < 0) targetY2 = 0
  if (targetY2 > pingCanvas.height - paddleHeight) targetY2 = pingCanvas.height - paddleHeight
  paddle2Y += (targetY2 - paddle2Y) * 0.06
}

function predictBallY(px) {
  let sx = ballX
  let sy = ballY
  let svx = ballSpeedX
  let svy = ballSpeedY
  let tx = px < pingCanvas.width / 2 ? paddleWidth : pingCanvas.width - paddleWidth
  let c = 0
  while(true) {
    sx += svx
    sy += svy
    if (sy - ballRadius < 0 && svy < 0) svy = -svy
    if (sy + ballRadius > pingCanvas.height && svy > 0) svy = -svy
    if (sx - ballRadius < 0) break
    if (sx + ballRadius > pingCanvas.width) break
    if (px < pingCanvas.width / 2 && sx - ballRadius < tx) return sy
    if (px > pingCanvas.width / 2 && sx + ballRadius > tx) return sy
    c++
    if (c > 5000) break
  }
  return pingCanvas.height / 2
}

function moveSnake() {
  let gridW = Math.floor(pingCanvas.width / tileSize)
  let gridH = Math.floor(pingCanvas.height / tileSize)
  let head = snake[0]
  let bx = Math.floor(ballX / tileSize)
  let by = Math.floor(ballY / tileSize)
  let nextCell = getNextCellBFS(head.x, head.y, bx, by, gridW, gridH)
  if (nextCell) {
    snake.unshift(nextCell)
    if (nextCell.x === bx && nextCell.y === by) {
      resetPositionsPing()
    } else {
      snake.pop()
    }
  }
}

function getNextCellBFS(sx, sy, tx, ty, gw, gh) {
  let visited = []
  for (let i = 0; i < gh; i++) {
    visited[i] = []
    for (let j = 0; j < gw; j++) {
      visited[i][j] = false
    }
  }
  let bodyPositions = new Set()
  for (let s of snake) {
    bodyPositions.add(s.x + ',' + s.y)
  }
  let q = [[sx, sy, null]]
  visited[sy][sx] = true
  let parent = {}
  parent[sy + ',' + sx] = null

  while (q.length) {
    let [cx, cy] = q.shift()
    if (cx === tx && cy === ty) break
    let dirs = [[1,0],[-1,0],[0,1],[0,-1]]
    for (let d of dirs) {
      let nx = cx + d[0]
      let ny = cy + d[1]
      if (
        nx >= 0 && nx < gw &&
        ny >= 0 && ny < gh &&
        !visited[ny][nx] &&
        !bodyPositions.has(nx + ',' + ny)
      ) {
        visited[ny][nx] = true
        parent[ny + ',' + nx] = [cx, cy]
        q.push([nx, ny])
      }
    }
  }

  if (!visited[ty] || !visited[ty][tx]) return null
  let path = []
  let cur = [tx, ty]
  while (cur) {
    path.push(cur)
    let p = parent[cur[1] + ',' + cur[0]]
    if (!p) break
    cur = p
  }
  path.reverse()
  if (path.length < 2) return null
  return { x: path[1][0], y: path[1][1] }
}

function drawEverything() {
  pingCtx.clearRect(0,0,pingCanvas.width,pingCanvas.height)
  pingCtx.fillStyle='#fff'
  pingCtx.fillRect(0,paddle1Y,paddleWidth,paddleHeight)
  pingCtx.fillRect(pingCanvas.width - paddleWidth,paddle2Y,paddleWidth,paddleHeight)
  pingCtx.beginPath()
  pingCtx.arc(ballX,ballY,ballRadius,0,Math.PI*2,true)
  pingCtx.fill()
  for(let i=0;i<snake.length;i++){
    pingCtx.fillRect(snake[i].x*tileSize,snake[i].y*tileSize,tileSize,tileSize)
  }
}
