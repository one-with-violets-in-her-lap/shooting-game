import { Enemy } from '@/scripts/enemy'
import { GameObject, objects } from '@/scripts/game-objects'
import { initializePlayer } from '@/scripts/player/player'
import { getRandomInteger } from '@/scripts/utils/get-random-integer'

let currentUpdateFrameId : number | undefined = undefined

export function initializeGame() {
    document.querySelector('#globalContainer')?.insertAdjacentHTML('beforeend', `
        <div id="stage" class="relative h-full overflow-hidden"></div>
    `)

    initializePlayer()
    addEnvironmentObjects()

    // delay fixes immediate player walking when restarting the game 
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

function addEnvironmentObjects() {
    const stage = document.querySelector('#stage') as HTMLDivElement

    const MAX_ROCKS = 13
    const ROCKS_X_BOUNDS = { min: 66, max: stage.clientWidth - 66 }
    const ROCKS_Y_BOUNDS = { min: 100, max: stage.clientHeight - 100 }
    const ROCK_SIZE = { width: 56, height: 120 }
    
    for(let rockCount = 0; rockCount < MAX_ROCKS; rockCount++) {
        try {
            new GameObject(56, 120, {
                x: getRandomInteger(
                    ROCKS_X_BOUNDS.min + ROCK_SIZE.width,
                    ROCKS_X_BOUNDS.max - ROCK_SIZE.width
                ),
                y: getRandomInteger(
                    ROCKS_Y_BOUNDS.min + ROCK_SIZE.height,
                    ROCKS_Y_BOUNDS.max - ROCK_SIZE.height
                ),
            }, {
                domElementClasses: ['rock'],
            })
        }
        catch(error) {}
    }

    setInterval(() => {
        const enemyCount = objects.filter(object => object instanceof Enemy).length
        const MAX_ENEMY_COUNT = 2

        try {
            for (let newEnemyCount = 0; newEnemyCount < MAX_ENEMY_COUNT - enemyCount; newEnemyCount++) {
                new Enemy({
                    x: getRandomInteger(62, window.innerWidth - 62),
                    y: getRandomInteger(92, window.innerHeight - 92)
                })
            }
        }
        catch(error) {}
    }, 1000)
}
