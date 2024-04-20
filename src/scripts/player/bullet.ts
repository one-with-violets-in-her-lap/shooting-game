import { CollisionError, GameObject } from '@/scripts/game-objects'
import { Position } from '@/scripts/types/position'
import { convertDegreesToRadians } from '@/scripts/utils/convert-degrees-to-radians'
import { Enemy } from '@/scripts/enemy'

export class Bullet extends GameObject {
    private readonly angle

    constructor(initialPosition: Position, angle: number) {
        try {
            super(64, 64, initialPosition, {
                domElementClass: 'bullet'
            })

            this.angle = angle
            this.domElement.style.transform = `rotate(${this.angle}deg)`
        }
        catch(error) {
            if(error instanceof CollisionError && error.object) {
                Bullet.damage(error.object)
            }
        }
    }

    update() {
        try {
            const bulletPosition = this.getPosition()

            this.setPosition({
                x: bulletPosition.x + Math.cos(
                    convertDegreesToRadians(this.angle || 0)
                ) * 18,
                y: bulletPosition.y + Math.sin(
                    convertDegreesToRadians(this.angle || 0)
                ) * 18
            })

            super.update()
        }
        catch(error) {
            if(error instanceof CollisionError && error.object) {
                Bullet.damage(error.object)
            }
            this.destroy()
        }
    }

    private static damage(object: GameObject) {
        if(object instanceof Enemy) {
            object.setHealth(object.getHealth() - 1, true)
        }
    }
}
