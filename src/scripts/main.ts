import '@/styles/main.css'

import { initializeGame, resetGame } from '@/scripts/game'

const startGameButton = document.querySelector('#startGameButton')
startGameButton?.addEventListener('click', () => {
  initializeGame()
})

const restartButton = document.querySelector('#restartButton')
restartButton?.addEventListener('click', () => {
    resetGame()
    initializeGame()
})
