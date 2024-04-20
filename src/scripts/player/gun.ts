import ShotAudio from '@/assets/audio/shot.mp3'

import { GameObject } from '@/scripts/game-objects'
import { Position } from '@/scripts/types/position'
import { Bullet } from '@/scripts/player/bullet'

export class Gun extends GameObject {
    private angle = 0

    private mousePosition = { x: 0, y: 0 }
    private updateMousePosition = (event: MouseEvent) =>
        this.mousePosition = { x: event.pageX, y: event.pageY }

    private shotAudio

    constructor(private readonly holderObject: GameObject) {
        super(51, 31, {
            y: holderObject.getPosition().y,
            x: holderObject.getPosition().x 
        }, {
            domElementClass: 'gun',
            collision: { disabled: true }
        })

        document.addEventListener('mousemove', this.updateMousePosition)

        this.stage.addEventListener('click', event => this.shoot(event))

        this.shotAudio = new Audio(ShotAudio)
        this.shotAudio.volume = 0.2
    }

    update() {
        const holderPosition = this.holderObject.getPosition()
        const gunPosition = this.getPosition()

        const gunOrigin = {
            x: holderPosition.x,
            y: holderPosition.y + (this.height / 2),
        }
        const gunCenter = {
            x: gunPosition.x + (this.width / 2),
            y: gunPosition.y + (this.height / 2)
        }

        let directionX = this.mousePosition.x - gunOrigin.x
        let directionY = this.mousePosition.y - gunOrigin.y

        const directionLength = Math.sqrt(directionX * directionX + directionY * directionY)
        directionX /= directionLength
        directionY /= directionLength

        const angle = Math.atan2(
            (this.mousePosition.y - gunCenter.y),
            this.mousePosition.x - gunCenter.x,
        )* (180 / Math.PI)

        this.setPosition({
            x: gunOrigin.x + directionX * 60,
            y: gunOrigin.y + directionY * 70,
        })

        this.angle = angle
        this.domElement.style.transform = `rotate(${this.angle}deg)`

        super.update()
    }

    private shoot(event: MouseEvent) {
        this.shotAudio.currentTime = 0
        this.shotAudio.play()

        const gunPosition = this.getPosition()
        
        const bulletOrigin = {
            x: gunPosition.x + (this.width / 2),
            y: gunPosition.y + (this.height / 2)
        }
    
        let directionX = this.mousePosition.x - bulletOrigin.x
        let directionY = this.mousePosition.y - bulletOrigin.y

        const directionLength = Math.sqrt(directionX * directionX + directionY * directionY)
        directionX /= directionLength
        directionY /= directionLength

        try {
            new Bullet({
                x: bulletOrigin.x + directionX * 30,
                y: bulletOrigin.y + directionY * 30
            }, this.angle)
        }
        catch(error) {}
    }
}
