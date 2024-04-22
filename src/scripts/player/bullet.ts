import { CollisionError, GameObject } from '@/scripts/game-objects'
import { Position } from '@/scripts/types/position'
import { convertDegreesToRadians } from '@/scripts/utils/convert-degrees-to-radians'
import { Enemy } from '@/scripts/enemy'

export class Bullet extends GameObject {
    private readonly angle: number

    constructor(initialPosition: Position, angle: number) {
        try {
            super(64, 64, initialPosition, {
                domElementClasses: ['bullet'],
            })

            this.angle = angle
            this.domElement.style.transform = `rotate(${this.angle}deg)`
        }
        catch(error) {
            // initializes empty placeholder object and destroys it
            super(64, 64, { x: 0, y: 0 }, {
                collision: { disabled: true }
            })
            this.angle = angle

            if(error instanceof CollisionError && error.object) {
                this.damage(error.object)
            }

            this.destroy()
        }
    }

    update() {
        const BULLET_SPEED = 18
        try {
            const bulletPosition = this.getPosition()

            this.setPosition({
                x: bulletPosition.x + Math.cos(
                    convertDegreesToRadians(this.angle || 0)
                ) * BULLET_SPEED,
                y: bulletPosition.y + Math.sin(
                    convertDegreesToRadians(this.angle || 0)
                ) * BULLET_SPEED
            })

            super.update()
        }
        catch(error) {
            if(error instanceof CollisionError && error.object) {
                this.damage(error.object)
            }
            this.destroy()
        }
    }

    private damage(object: GameObject) {
        if(object instanceof Enemy) {
            object.setHealth(object.getHealth() - 1, true)
        }
    }
}
