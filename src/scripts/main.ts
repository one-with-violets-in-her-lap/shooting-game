import '@/styles/main.css'

import { GameObject, objects } from '@/scripts/game-objects'
import { initializePlayer, updatePlayerPosition } from '@/scripts/player'
import { getRandomInteger } from '@/scripts/utils/get-random-integer'

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
    const stage = document.querySelector('#stage') as HTMLDivElement

    initializePlayer()
    addRocks()

    setTimeout(() => {
        currentUpdateFrameId = requestAnimationFrame(update)
        function update() {
            updatePlayerPosition()
            objects.forEach(gameObject => gameObject.update())

            currentUpdateFrameId = requestAnimationFrame(update)
        }
    }, 200)

    document.querySelector('#titleScreen')?.classList.add('-translate-y-full')
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

function addRocks() {
    for (let rockCount = 0; rockCount < 13; rockCount++) {
        try {
            const rock = new GameObject(56, 120, { x: getRandomInteger(66, window.innerWidth - 66), y: getRandomInteger(130, window.innerHeight - 130) }, {
                domElementClass: 'rock',
            })
        }
        catch(error) {}
    }
    
    console.log(objects)
}
