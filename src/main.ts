import '@/styles/main.css'

import { updatePlayerPosition } from '@/player'
import { GameObject, objects } from '@/game-objects'

const stage = document.querySelector('#stage') as HTMLDivElement
const chest = new GameObject(64, 64, { x: 300, y: 200 }, {
    domElementClass: 'chest',
    doOnCollision(collidedObject) {
        // collidedObject.setPosition({ x: 500, y: 200 })
    },
})

requestAnimationFrame(update)
function update() {
    updatePlayerPosition(stage)
    objects.forEach(gameObject => gameObject.update())

    requestAnimationFrame(update)
}
