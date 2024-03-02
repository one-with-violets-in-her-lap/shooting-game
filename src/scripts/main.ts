import '@/styles/main.css'

import { GameObject, objects } from '@/scripts/game-objects'
import { initializePlayer, updatePlayerPosition } from '@/scripts/player'

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

    requestAnimationFrame(update)
    function update() {
        updatePlayerPosition()
        objects.forEach(gameObject => gameObject.update())

        requestAnimationFrame(update)
    }
}

initializeGame()
