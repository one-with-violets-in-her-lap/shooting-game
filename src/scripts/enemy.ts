import { Entity } from '@/scripts/entity'
import { GameObject, GameObjectOptions } from '@/scripts/game-objects.ts'
import { Player, player } from '@/scripts/player'
import { Position } from '@/scripts/types/position'

export class Enemy extends Entity {
    private static readonly MAX_HEALTH_POINTS = 5
    private canDamage = true

    constructor(position: Position) {
        /* super(52, 82, position, {
            domElementClass: 'entity-container',
            collision: {
                doWhenCollidedIntoObject: (targetObject: GameObject) => {
                    if(targetObject instanceof Player && this.canDamage) {
                        try {
                            targetObject.setHealth(targetObject.getHealth() - 1)
                            this.canDamage = false
                            window.setTimeout(() => {
                                this.canDamage = true
                            }, 700)
                        }
                        catch(error) {
                            console.log(error)
                        }
                    }
                },
            }
        })
        
        this.domElement.insertAdjacentHTML('afterbegin', `
            <div class="entity-sprite enemy-sprite"></div>
        `)
        this.domElement.setAttribute('direction', 'bottom')
        this.domElement.setAttribute('walking', '') */

        const objectOptions: GameObjectOptions = {
            collision: {
                doWhenCollidedIntoObject: (targetObject: GameObject) => {
                    if(targetObject instanceof Player && this.canDamage) {
                        try {
                            targetObject.setHealth(targetObject.getHealth() - 1)
                            this.canDamage = false
                            window.setTimeout(() => {
                                this.canDamage = true
                            }, 700)
                        }
                        catch(error) {
                            console.log(error)
                        }
                    }
                },
            }
        }
        super(position, Enemy.MAX_HEALTH_POINTS, {
            spriteElementClass: 'enemy-sprite',
            noHealthBar: true,
            objectOptions
        })

        this.domElement.setAttribute('walking', '')
    }

    update() {
        const currentPosition = this.getPosition()
        const MOVE_PIXELS_AMOUNT = 2
        
        if(player) {
            const playerPosition = player.getPosition()

            const newPosition = { x: currentPosition.x, y: currentPosition.y }
            let newDirection: string | undefined = undefined

            if(currentPosition.x < playerPosition.x) {
                newDirection = 'right'
                newPosition.x = newPosition.x + MOVE_PIXELS_AMOUNT
            }
            else if(currentPosition.x > playerPosition.x) {
                newDirection = 'left'
                newPosition.x = newPosition.x - MOVE_PIXELS_AMOUNT
            }

            if(currentPosition.y < playerPosition.y) {
                newDirection = 'bottom'
                newPosition.y = newPosition.y + MOVE_PIXELS_AMOUNT
            }
            else if(currentPosition.y > playerPosition.y) {
                newDirection = 'top'
                newPosition.y = newPosition.y - MOVE_PIXELS_AMOUNT
            }

            if(newDirection) {
                this.domElement.setAttribute('direction', newDirection)
            }

            try {
                this.setPosition(newPosition)
            }
            catch(error) {}
        }

        super.update()
    }
}
