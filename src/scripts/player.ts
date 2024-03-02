import { GameObject } from '@/scripts/game-objects'
import { getTypedObjectKeys } from '@/scripts/utils/get-typed-object-keys'

let player : GameObject | undefined = undefined

const moveState = {
    left: { active: false, key: 'A' },
    top: { active: false, key: 'W' },
    right: { active: false, key: 'D' },
    bottom: { active: false, key: 'S' }
}

window.addEventListener('keydown', event => {
    toggleDirectionMovement(event.code, true)
})
window.addEventListener('keyup', event => {
    toggleDirectionMovement(event.code, false)
})
window.addEventListener('blur', () => {
    getTypedObjectKeys(moveState).forEach(directionName => {
        moveState[directionName].active = false
    })
})
function toggleDirectionMovement(keyCode : string, active: boolean) {
    for (const directionName in moveState) {
        const direction = moveState[directionName as keyof typeof moveState]
        if(keyCode.toUpperCase() === 'KEY' + direction.key) {
            direction.active = active
        }
    }
}

export function initializePlayer() {
    player = new GameObject(52, 82, { x: 10, y: 10 }, { domElementClass: 'player-container' })

    player.domElement.insertAdjacentHTML('afterbegin', `
        <div class="player-sprite"></div>
    `)
    player.domElement.setAttribute('direction', 'bottom')
}

export function updatePlayerPosition() {
    if(!player) {
        return
    }

    const playerPosition = player.getPosition()
    const playerElement = player.domElement
    
    let movePixelsAmount = 6

    const activeDirections = Object.keys(moveState).filter(directionName =>
        moveState[directionName as keyof typeof moveState].active
    )

    if(activeDirections[0]) {
        playerElement.setAttribute('direction', activeDirections[0])
        playerElement.setAttribute('walking', '')
    }
    else {
        playerElement.removeAttribute('walking')
    }

    // slow down if moving diagonally
    if(activeDirections.length > 1) {
        movePixelsAmount = movePixelsAmount * 0.75
    }

    if(moveState.left.active) {
        player.setPosition({ x: playerPosition.x - movePixelsAmount })
    }

    if(moveState.top.active) {
        player.setPosition({ y: playerPosition.y - movePixelsAmount })
    }

    if(moveState.right.active) {
        player.setPosition({ x: playerPosition.x + movePixelsAmount })
    }

    if(moveState.bottom.active) {
        player.setPosition({ y: playerPosition.y + movePixelsAmount })
    }
}
