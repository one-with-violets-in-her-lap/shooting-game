import { GameObject } from '@/scripts/game-objects.ts'
import { player } from '@/scripts/player'
import { Position } from '@/scripts/types/position'

export class Enemy extends GameObject {
    private lastMoveAxis = 'y'

    constructor(position: Position) {
        super(52, 82, position, {
            domElementClass: 'player-container',
        })
        
        this.domElement.insertAdjacentHTML('afterbegin', `
            <div class="player-sprite enemy-sprite"></div>
        `)
        this.domElement.setAttribute('direction', 'bottom')
        this.domElement.setAttribute('walking', '')
    }

    update() {
        const currentPosition = this.getPosition()
        
        if(player) {
            const playerPosition = player.getPosition()

            const newPosition = { x: currentPosition.x, y: currentPosition.y }
            let newDirection: string | undefined = undefined

            if(currentPosition.x < playerPosition.x) {
                newDirection = 'right'
                newPosition.x = newPosition.x + 1
            }
            else if(currentPosition.x > playerPosition.x) {
                newDirection = 'left'
                newPosition.x = newPosition.x - 1
            }

            if(currentPosition.y < playerPosition.y) {
                newDirection = 'bottom'
                newPosition.y = newPosition.y + 1
            }
            else if(currentPosition.y > playerPosition.y) {
                newDirection = 'top'
                newPosition.y = newPosition.y - 1
            }

            this.domElement.setAttribute('direction', newDirection || 'none')

            try {
                this.setPosition(newPosition)
            }
            catch(error) {}
        }

        super.update()
    }
}
