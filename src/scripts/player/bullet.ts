import { CollisionError, GameObject } from '@/scripts/game-objects'
import { Position } from '@/scripts/types/position'
import { convertDegreesToRadians } from '@/scripts/utils/convert-degrees-to-radians'

export class Bullet extends GameObject {
    constructor(initialPosition: Position, private readonly angle: number) {
        super(64, 64, initialPosition, {
            domElementClass: 'bullet'
        })

        this.domElement.style.transform = `rotate(${this.angle}deg)`
    }

    update() {
        try {
            const bulletPosition = this.getPosition()

            this.setPosition({
                x: bulletPosition.x + Math.cos(
                    convertDegreesToRadians(this.angle)
                ) * 18,
                y: bulletPosition.y + Math.sin(
                    convertDegreesToRadians(this.angle)
                ) * 18
            })

            super.update()
        }
        catch(error) {
            this.destroy()
        }
    }
}
