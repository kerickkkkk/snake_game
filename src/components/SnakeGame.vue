<template>
  <canvas
    id="game"
    ref="gameArea"
    width="400"
    height="400"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// canvas 定位
const gameArea = ref('null')
let ctx = null

// 跑的速度
const speed = 7
// 畫面要切分多大網格
const totalSlice = 20

// 蛇相關
let snakeParts = []

// 以 tailSize 等於 畫布長寬 對應要切幾塊
let tailSize = null

let headX = totalSlice / 2
let headY = totalSlice / 2

// 初始蛇的長度
let tailLength = 2

let xDirection = 0
let yDirection = 0

// 蘋果座標
let appleX = 5
let appleY = 5

let score = 0
let timer = null

// 工具類
const drawWord = (color, fontSize, word, x, y) => {
  ctx.fillStyle = color
  ctx.font = `${fontSize}px Roboto`
  ctx.fillText(word, x, y)
}

const drawRect = (color, x, y, width, height) => {
  ctx.fillStyle = color
  ctx.fillRect(x, y, width, height)
}

const clearScreen = () => {
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, gameArea.value.clientWidth, gameArea.value.clientHeight)
}

const changePosition = () => {
  headX += xDirection
  headY += yDirection
}
const randomAppleCoordinate = () => {
  appleX = Math.floor(Math.random() * totalSlice)
  appleY = Math.floor(Math.random() * totalSlice)
}

// 判斷類
const snakeEatApple = () => {
  if (headX === appleX && headY === appleY) {
    randomAppleCoordinate()
    // // 範圍到邊界 20 會有問題 因為 有 -2 會導致蘋果消失
    // appleX = Math.floor(Math.random() * totalSlice )
    // appleY = Math.floor(Math.random() * totalSlice )
    tailLength++
    score++
  }
}
const checkGameOver = () => {
  // 開始不檢查 不然就會炸掉
  if (xDirection === 0 && yDirection === 0) return false

  let result = false
  // 碰到牆壁
  if (headX < 0 || headY < 0 || headX >= totalSlice || headY >= totalSlice) {
    result = true
  }
  // 碰到身體
  for (let i = 0; i < snakeParts.length; i++) {
    const part = snakeParts[i]
    if (part.x === headX && part.y === headY) {
      result = true
      break
    }
  }

  // 遊戲結束處理
  if (result) {
    document.body.removeEventListener('keyup', directionHandler)

    drawRect('rgba(0,0,0,0.7)', 0, 0, gameArea.value.clientWidth, gameArea.value.clientHeight)
    drawWord('white', 40, 'Game over !', gameArea.value.clientWidth / 4, gameArea.value.clientHeight / 2)
    timer = setTimeout(() => {
      document.body.addEventListener('keyup', restartHandler)
      drawWord('yellow', 20, '按任意鍵重啟', gameArea.value.clientWidth / 2 - 20 * 6 / 2, gameArea.value.clientHeight / 2 + 45)
    }, 1000)
  }

  return result
}

// 畫面
const drawSnake = () => {
  // console.log('drawSnake')
  snakeParts.length > 0 && snakeParts.forEach(({ x, y }) => {
    drawRect('green', x * totalSlice, y * totalSlice, tailSize, tailSize)
  })

  snakeParts.push({
    x: headX,
    y: headY
  })
  if (snakeParts.length > tailLength) {
    snakeParts.shift()
  }
  drawRect('orange', headX * totalSlice, headY * totalSlice, tailSize, tailSize)
}

const drawApple = () => {
  drawRect('red', appleX * totalSlice, appleY * totalSlice, tailSize, tailSize)
}

const drawScore = () => {
  drawWord('white', 20, `得分: ${score} `, gameArea.value.clientWidth - 100, 40)
  // apple 座標 debug 用
  drawWord('white', 20, `appleX: ${appleX}, appleY: ${appleY} `, gameArea.value.clientWidth - 200, gameArea.value.clientHeight - 30)
}

const drawStarting = () => {
  const snakeX = gameArea.value.clientWidth / 2 - 90

  const startX = gameArea.value.clientWidth / 2 - 80
  const startY = gameArea.value.clientHeight / 2 + 20

  const enterX = gameArea.value.clientWidth * 0.75 - 80
  const enterY = gameArea.value.clientHeight / 2 + 50

  drawWord('green', 60, '貪食蛇', snakeX, 90)
  drawWord('white', 40, '開始遊戲', startX, startY)
  drawWord('yellow', 20, '按 Enter 開始', enterX, enterY)

  document.body.addEventListener('keyup', enterHandler)
}

// 流程控制
const directionHandler = (e) => {
  const { keyCode } = e
  // console.log(keyCode)
  // 37左 38上 39右 40下
  if (keyCode === 37) {
    if (xDirection === 1) return false
    xDirection = -1
    yDirection = 0
  } else if (keyCode === 39) {
    if (xDirection === -1) return false
    xDirection = 1
    yDirection = 0
  } else if (keyCode === 38) {
    if (yDirection === 1) return false
    xDirection = 0
    yDirection = -1
  } else if (keyCode === 40) {
    if (yDirection === -1) return false
    xDirection = 0
    yDirection = 1
  }
}
const restartHandler = () => {
  snakeParts = []
  headX = totalSlice / 2
  headY = totalSlice / 2

  tailLength = 2

  xDirection = 0
  yDirection = 0

  // 蘋果
  appleX = 5
  appleY = 5

  score = 0
  clearTimeout(timer)
  init()
}
const enterHandler = (e) => {
  // enter 13
  console.log(e.keyCode === 13)
  if (e.keyCode === 13) {
    init()
  } else {
    alert('請按 enter !!!')
  }
}

const drawGame = () => {
  clearTimeout(timer)
  // 重要一定要先移動 不然檢測會過不了
  changePosition()

  const gameResult = checkGameOver()
  if (gameResult) return false

  // 之後要移除 檢測用
  // if(headY > totalSlice) { headY = 10}

  clearScreen()
  // 如果 未開始 寫上請按 上下左右 開始
  if (xDirection === 0 && yDirection === 0) {
    drawWord('rgba(100,100,100,.8)', 30, '按上下左右鍵出發', gameArea.value.clientWidth / 2 - 30 * 8 / 2, gameArea.value.clientHeight / 2 + tailSize + 10)
  }
  drawSnake()
  snakeEatApple()
  drawScore()

  if (xDirection !== 0 || yDirection !== 0) drawApple()

  timer = setTimeout(() => {
    drawGame()
  }, 1000 / speed)
}
const init = () => {
  document.body.removeEventListener('keyup', restartHandler)
  document.body.removeEventListener('keyup', enterHandler)
  document.body.addEventListener('keyup', directionHandler)
  clearScreen()
  randomAppleCoordinate()
  drawGame()
  // drawApple()
}

onMounted(() => {
  ctx = gameArea.value.getContext('2d')
  tailSize = gameArea.value.clientWidth / totalSlice - 2 // 有一點偏差會出現邊界
  headX = tailSize / 2
  headY = tailSize / 2
  drawStarting()
})

onUnmounted(() => {
  document.body.removeEventListener('keyup', directionHandler)
  clearTimeout(timer)
})
</script>

<style lang="scss" scoped>
#game {
  border: 1px solid #000;
  box-shadow: 2px 10px 30px gray;
}
</style>
