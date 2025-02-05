let pendulumActive = false
let pendulumReq
let penCanvas, penCtx

let g = 9.81
let dt = 0.2

let m1 = 10, m2 = 10, m3 = 10
let l1 = 100, l2 = 100, l3 = 100
let a1 = Math.PI / 2, a2 = Math.PI / 2, a3 = Math.PI / 2
let a1_v = 0, a2_v = 0, a3_v = 0

let pendulumFrameCount = 0
let logEntries = []

function setupPendulum() {
  penCanvas = document.getElementById('pendulumCanvas')
  penCtx = penCanvas.getContext('2d')
  resizeCanvasPendulum()
  window.addEventListener('resize', resizeCanvasPendulum)
}

function startPendulum() {
  if (!pendulumActive) {
    pendulumActive = true
    updatePendulum()
  }
}

function stopPendulum() {
  pendulumActive = false
  cancelAnimationFrame(pendulumReq)
}

function resizeCanvasPendulum() {
  if (!penCanvas) return
  penCanvas.width = penCanvas.offsetWidth
  penCanvas.height = penCanvas.offsetHeight
}

function updatePendulum() {
  if (!pendulumActive) return
  stepTriplePendulum()
  drawTriplePendulum()
  pendulumReq = requestAnimationFrame(updatePendulum)
}

function derivatives(state) {
  let t1 = state[0], t2 = state[1], t3 = state[2]
  let t1_v = state[3], t2_v = state[4], t3_v = state[5]

  let M11 = (m1 + m2 + m3) * l1 * l1
  let M12 = (m2 + m3) * l1 * l2 * Math.cos(t1 - t2)
  let M13 = m3 * l1 * l3 * Math.cos(t1 - t3)
  let M21 = M12
  let M22 = (m2 + m3) * l2 * l2
  let M23 = m3 * l2 * l3 * Math.cos(t2 - t3)
  let M31 = M13
  let M32 = M23
  let M33 = m3 * l3 * l3

  let C1 = (m2 + m3) * l1 * l2 * t2_v * t2_v * Math.sin(t1 - t2)
          + m3 * l1 * l3 * t3_v * t3_v * Math.sin(t1 - t3)
          + (m1 + m2 + m3) * g * l1 * Math.sin(t1)
  let C2 = - (m2 + m3) * l1 * l2 * t1_v * t1_v * Math.sin(t1 - t2)
          + m3 * l2 * l3 * t3_v * t3_v * Math.sin(t2 - t3)
          + (m2 + m3) * g * l2 * Math.sin(t2)
  let C3 = - m3 * l1 * l3 * t1_v * t1_v * Math.sin(t1 - t3)
          - m3 * l2 * l3 * t2_v * t2_v * Math.sin(t2 - t3)
          + m3 * g * l3 * Math.sin(t3)

  let det = M11 * (M22 * M33 - M23 * M32)
          - M12 * (M21 * M33 - M23 * M31)
          + M13 * (M21 * M32 - M22 * M31)

  let inv11 = (M22 * M33 - M23 * M32) / det
  let inv12 = - (M12 * M33 - M13 * M32) / det
  let inv13 = (M12 * M23 - M13 * M22) / det
  let inv21 = - (M21 * M33 - M23 * M31) / det
  let inv22 = (M11 * M33 - M13 * M31) / det
  let inv23 = - (M11 * M23 - M13 * M21) / det
  let inv31 = (M21 * M32 - M22 * M31) / det
  let inv32 = - (M11 * M32 - M12 * M31) / det
  let inv33 = (M11 * M22 - M12 * M21) / det

  let a1_a = - (inv11 * C1 + inv12 * C2 + inv13 * C3)
  let a2_a = - (inv21 * C1 + inv22 * C2 + inv23 * C3)
  let a3_a = - (inv31 * C1 + inv32 * C2 + inv33 * C3)

  return [t1_v, t2_v, t3_v, a1_a, a2_a, a3_a]
}

function rk4Step(state, dt) {
  let k1 = derivatives(state)
  let state2 = state.map((s, i) => s + k1[i] * dt / 2)
  let k2 = derivatives(state2)
  let state3 = state.map((s, i) => s + k2[i] * dt / 2)
  let k3 = derivatives(state3)
  let state4 = state.map((s, i) => s + k3[i] * dt)
  let k4 = derivatives(state4)
  return state.map((s, i) => s + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]))
}

function stepTriplePendulum() {
  pendulumFrameCount++
  let state = [a1, a2, a3, a1_v, a2_v, a3_v]
  let newState = rk4Step(state, dt)
  a1 = newState[0]
  a2 = newState[1]
  a3 = newState[2]
  a1_v = newState[3]
  a2_v = newState[4]
  a3_v = newState[5]

  // Append log entry (limit to a certain number of lines)
  let logLine = `Step ${pendulumFrameCount}: a1=${a1.toFixed(2)} a2=${a2.toFixed(2)} a3=${a3.toFixed(2)} | v1=${a1_v.toFixed(2)} v2=${a2_v.toFixed(2)} v3=${a3_v.toFixed(2)}`
  logEntries.push(logLine)
  if (logEntries.length > 20) {
    logEntries.shift()
  }
  let pendulumLog = document.getElementById('pendulumLog')
  if (pendulumLog) {
    pendulumLog.innerText = logEntries.join('\n')
  }
}

function drawTriplePendulum() {
  penCtx.clearRect(0, 0, penCanvas.width, penCanvas.height)
  let originX = penCanvas.width / 2
  let originY = penCanvas.height / 4
  let x1 = originX + l1 * Math.sin(a1)
  let y1 = originY + l1 * Math.cos(a1)
  let x2 = x1 + l2 * Math.sin(a2)
  let y2 = y1 + l2 * Math.cos(a2)
  let x3 = x2 + l3 * Math.sin(a3)
  let y3 = y2 + l3 * Math.cos(a3)

  penCtx.strokeStyle = '#fff'
  penCtx.lineWidth = 2
  penCtx.beginPath()
  penCtx.moveTo(originX, originY)
  penCtx.lineTo(x1, y1)
  penCtx.stroke()

  penCtx.beginPath()
  penCtx.moveTo(x1, y1)
  penCtx.lineTo(x2, y2)
  penCtx.stroke()

  penCtx.beginPath()
  penCtx.moveTo(x2, y2)
  penCtx.lineTo(x3, y3)
  penCtx.stroke()

  penCtx.fillStyle = '#fff'
  penCtx.beginPath()
  penCtx.arc(originX, originY, 8, 0, Math.PI * 2)
  penCtx.fill()
  penCtx.beginPath()
  penCtx.arc(x1, y1, 8, 0, Math.PI * 2)
  penCtx.fill()
  penCtx.beginPath()
  penCtx.arc(x2, y2, 8, 0, Math.PI * 2)
  penCtx.fill()
  penCtx.beginPath()
  penCtx.arc(x3, y3, 8, 0, Math.PI * 2)
  penCtx.fill()
}
