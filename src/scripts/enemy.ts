import { GameObject } from '@/scripts/game-objects.ts'
import { player } from '@/scripts/player'
import { Position } from '@/scripts/types/position'

export class Enemy extends GameObject {
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

            if(currentPosition.x < playerPosition.x) {
                this.domElement.setAttribute('direction', 'right')
                newPosition.x = newPosition.x + 1
            }
            else {
                this.domElement.setAttribute('direction', 'left')
                newPosition.x = newPosition.x - 1
            }

            if(currentPosition.y < playerPosition.y) {
                this.domElement.setAttribute('direction', 'bottom')
                newPosition.y = newPosition.y + 1
            }
            else {
                this.domElement.setAttribute('direction', 'top')
                newPosition.y = newPosition.y - 1
            }

            try {
                this.setPosition(newPosition)
            }
            catch(error) {}
        }

        super.update()
    }
}
