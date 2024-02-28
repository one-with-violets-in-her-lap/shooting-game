import { GameObject } from '@/game-objects'
import { getTypedObjectKeys } from '@/utils/get-typed-object-keys'

const player = new GameObject(128, 128, { x: 10, y: 10 }, { domElementClass: 'player' })
const playerElement = player.domElement
playerElement.setAttribute('direction', 'bottom')

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

export function updatePlayerPosition(globalContainer: HTMLDivElement) {
    const playerPosition = player.getPosition()
    
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
        player.setPosition({ x: playerPosition.x - movePixelsAmount }, 42)
        /* if(playerPosition.x - movePixelsAmount > 0) {
            playerPosition.x = playerPosition.x - movePixelsAmount
        }
        else if(playerPosition.x >= 0) {
            playerPosition.x = 0
        } */
    }

    if(moveState.top.active) {
        player.setPosition({ y: playerPosition.y - movePixelsAmount }, 42)
        
        /* if(playerPosition.y - movePixelsAmount > 0) {
            playerPosition.y = playerPosition.y - movePixelsAmount
        }
        else if(playerPosition.y >= 0) {
            playerPosition.y = 0
        } */
    }

    if(moveState.right.active) {
        player.setPosition({ x: playerPosition.x + movePixelsAmount }, 42)
        /* const xBound = globalContainer.clientWidth - playerElement.clientWidth
        if(xBound > playerPosition.x + movePixelsAmount) {
            playerPosition.x = playerPosition.x + movePixelsAmount
        }
        else if(xBound >= playerPosition.x) {
            playerPosition.x = playerPosition.x + Math.abs(xBound - playerPosition.x)
        } */
    }

    if(moveState.bottom.active) {
        player.setPosition({ y: playerPosition.y + movePixelsAmount }, 42)
        /* const yBound = globalContainer.clientHeight - playerElement.clientHeight
        if(yBound > playerPosition.y + movePixelsAmount) {
            playerPosition.y = playerPosition.y + movePixelsAmount
        }
        else if(yBound >= playerPosition.y) {
            playerPosition.y = playerPosition.y + Math.abs(yBound - playerPosition.y)
        } */
    }
}
