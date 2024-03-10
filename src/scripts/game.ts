import { Enemy } from '@/scripts/enemy'
import { GameObject, objects } from '@/scripts/game-objects'
import { initializePlayer } from '@/scripts/player'
import { getRandomInteger } from '@/scripts/utils/get-random-integer'

let currentUpdateFrameId : number | undefined = undefined

export function initializeGame() {
    document.querySelector('#globalContainer')?.insertAdjacentHTML('beforeend', `
        <div id="stage" class="relative h-full overflow-hidden"></div>
    `)
    const stage = document.querySelector('#stage') as HTMLDivElement

    initializePlayer()
    addRocks()

    setTimeout(() => {
        currentUpdateFrameId = requestAnimationFrame(update)
        function update() {
            objects.forEach(gameObject => gameObject.update())

            currentUpdateFrameId = requestAnimationFrame(update)
        }
    }, 200)

    document.querySelector('#titleScreen')?.classList.add('closed')
}

export function resetGame() {
    const currentObjects = [...objects]
    currentObjects.forEach(object => object.destroy())
    
    if(currentUpdateFrameId) {
        cancelAnimationFrame(currentUpdateFrameId)
    }

    document.querySelector('#stage')?.remove()
}

function addRocks() {
    for(let rockCount = 0; rockCount < 13; rockCount++) {
        try {
            const rock = new GameObject(56, 120, {
                x: getRandomInteger(66, window.innerWidth - 66),
                y: getRandomInteger(130, window.innerHeight - 130)
            }, {
                domElementClass: 'rock',
            })
        }
        catch(error) {}
    }

    setInterval(() => {
        const enemyCount = objects.filter(object => object instanceof Enemy).length
        const MAX_ENEMY_COUNT = 15

        try {
            for (let newEnemyCount = 0; newEnemyCount < MAX_ENEMY_COUNT - enemyCount; newEnemyCount++) {
                const enemy = new Enemy({
                    x: getRandomInteger(62, window.innerWidth - 62),
                    y: getRandomInteger(92, window.innerHeight - 92)
                })
            }
        }
        catch(error) {}
    }, 1000)
}
