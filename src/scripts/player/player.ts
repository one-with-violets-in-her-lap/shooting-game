import WalkingSound from '@/assets/audio/walking.mp3'
import DamageAudio from '@/assets/audio/damage.mp3'

import { Entity } from '@/scripts/entity'
import { resetGame } from '@/scripts/game'
import { GameObject } from '@/scripts/game-objects'
import { getTypedObjectKeys } from '@/scripts/utils/get-typed-object-keys'
import { Gun } from '@/scripts/player/gun'

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
function toggleDirectionMovement(keyCode: string, active: boolean) {
    for (const directionName in moveState) {
        const direction = moveState[directionName as keyof typeof moveState]
        if(keyCode.toUpperCase() === 'KEY' + direction.key) {
            direction.active = active
        }
    }
}

export class Player extends Entity {
    private static readonly MAX_HEALTH_POINTS = 5

    private walkingAudio

    private gun

    constructor() {
        super({ x: 10, y: 10 }, Player.MAX_HEALTH_POINTS, {
            doBeforeDeathAnimation: () => {
                this.gun.destroy()

                // death screen should be a separate element, will do that later
                const titleScreen = document.querySelector('#titleScreen') as HTMLElement
                const heading = titleScreen.querySelector('h1') as HTMLHeadingElement
                const startButton = titleScreen.querySelector('button') as HTMLButtonElement

                titleScreen?.classList.remove('closed')
                heading.textContent = 'imagine dying at this game'
                startButton.textContent = 'restart'
                startButton.style.pointerEvents = 'none'
                titleScreen.querySelector('p')?.remove()

                setTimeout(() => {
                    resetGame()
                    startButton.style.pointerEvents = 'auto'
                }, 500)
            },
            objectOptions: {
                collision: { bottomCollisionTrigger: 'bottom' }
            }
        })

        this.walkingAudio = new Audio(WalkingSound)
        this.walkingAudio.loop = true
        this.walkingAudio.volume = 0.2

        this.gun = new Gun(this)
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

            this.walkingAudio.play()
        }
        else {
            playerElement.removeAttribute('walking')
            this.walkingAudio.pause()
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

    destroy() {
        this.walkingAudio.pause()
        this.walkingAudio.remove()
        super.destroy()
    }
}

export let player : Player | undefined = undefined

export function initializePlayer() {
    player = new Player()
}
