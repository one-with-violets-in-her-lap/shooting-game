import '@/styles/main.css'

import { GameObject, objects } from '@/scripts/game-objects'
import { initializePlayer, updatePlayerPosition } from '@/scripts/player'

const titleScreen = document.querySelector('#titleScreen')

const startGameButton = document.querySelector('#startGameButton')
startGameButton?.addEventListener('click', () => {
  initializeGame()
})

const restartButton = document.querySelector('#restartButton')
restartButton?.addEventListener('click', () => {
    resetGame()
})

let currentUpdateFrameId : number | undefined = undefined
function initializeGame() {
    document.querySelector('#globalContainer')?.insertAdjacentHTML('beforeend', `
        <div id="stage" class="relative h-full overflow-hidden"></div>
    `)

    initializePlayer()

    const chest = new GameObject(64, 64, { x: 300, y: 200 }, {
        domElementClass: 'chest',
        doOnCollision(collidedObject) {
            // collidedObject.setPosition({ x: 500, y: 200 })
        },
    })

    currentUpdateFrameId = requestAnimationFrame(update)
    function update() {
        updatePlayerPosition()
        objects.forEach(gameObject => gameObject.update())

        currentUpdateFrameId = requestAnimationFrame(update)
    }

    titleScreen?.classList.add('-translate-y-full')
}

function resetGame() {
    const currentObjects = [...objects]
    currentObjects.forEach(object => object.destroy())
    
    if(currentUpdateFrameId) {
        cancelAnimationFrame(currentUpdateFrameId)
    }

    document.querySelector('#stage')?.remove()

    initializeGame()
}
