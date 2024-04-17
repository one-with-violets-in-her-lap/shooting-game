import { Entity } from '@/scripts/entity'
import { resetGame } from '@/scripts/game'
import { GameObject } from '@/scripts/game-objects'
import { getTypedObjectKeys } from '@/scripts/utils/get-typed-object-keys'

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

export class Player extends Entity {
    private static readonly MAX_HEALTH_POINTS = 5

    constructor() {
        super({ x: 10, y: 10 }, Player.MAX_HEALTH_POINTS, {
            doOnDeath() {
                const titleScreen = document.querySelector('#titleScreen') as HTMLElement
                const heading = titleScreen.querySelector('h1') as HTMLHeadingElement
                const startButton = titleScreen.querySelector('button') as HTMLButtonElement

                titleScreen?.classList.remove('closed')
                heading.textContent = 'imagine dying at this game'
                startButton.textContent = 'restart'
                startButton.style.pointerEvents = 'none'

                setTimeout(() => {
                    resetGame()
                    startButton.style.pointerEvents = 'auto'
                }, 500)
            },
            objectOptions: {
                collision: { bottomCollisionTrigger: 'bottom' }
            }
        })
    }

    update() {
        const playerPosition = this.getPosition()
        const playerElement = this.domElement
        
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

        try {
            if(moveState.left.active) {
                this.setPosition({ x: playerPosition.x - movePixelsAmount })
            }
        
            if(moveState.top.active) {
                this.setPosition({ y: playerPosition.y - movePixelsAmount })
            }
        
            if(moveState.right.active) {
                this.setPosition({ x: playerPosition.x + movePixelsAmount })
            }
                
            if(moveState.bottom.active) {
                this.setPosition({ y: playerPosition.y + movePixelsAmount })
            }
        }
        catch(error) {}

        super.update()
    }
}

export let player : Player | undefined = undefined

export function initializePlayer() {
    player = new Player()
}
