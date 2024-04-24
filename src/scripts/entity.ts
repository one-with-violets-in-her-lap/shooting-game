import DamageAudio from '@/assets/audio/damage.mp3'

import { GameObject, GameObjectOptions } from '@/scripts/game-objects'
import { Position } from '@/scripts/types/position'

interface EntityOptions {
    doAfterDeathAnimation?: (entity: Entity) => void;
    doBeforeDeathAnimation?: (entity: Entity) => void;
    spriteElementClass?: string
    noHealthBar?: boolean
    objectOptions?: GameObjectOptions
}

export class Entity extends GameObject {
    private readonly entityOptions?: EntityOptions
    private healthPoints: number = 0

    private damageAudio

    constructor(position: Position, private readonly maxHealth: number,
        entityOptions?: EntityOptions) {
        const additionalClasses = entityOptions?.objectOptions?.domElementClasses || []

        super(52, 82, position, {
            ...entityOptions?.objectOptions,
            domElementClasses: [...additionalClasses, 'entity-container'],
        })

        this.entityOptions = entityOptions

        this.domElement.insertAdjacentHTML('afterbegin', `
            <div class="entity-sprite ${this.entityOptions?.spriteElementClass || ''}"></div>
        `)
        this.domElement.setAttribute('direction', 'bottom')

        this.setHealth(maxHealth)

        this.damageAudio = new Audio(DamageAudio)
        this.damageAudio.volume = 0.05
    }

    setHealth(newHealth: number, hurt?: boolean) {
        if(newHealth > this.maxHealth) {
            throw RangeError('player health must be a maximum of ' + this.maxHealth)
        }
        this.healthPoints = newHealth

        if(!this.entityOptions?.noHealthBar) {
            this.domElement.querySelector('#playerHealthBar')?.remove()
            this.domElement.insertAdjacentHTML('afterbegin', `
                <meter id="playerHealthBar" min="0" max="${this.maxHealth}"
                    low="1" high="3" optimum="2" value="${this.healthPoints}"
                    class="absolute left-1/2 -translate-x-1/2 -bottom-4 z-10">
                    ${this.healthPoints} hp
                </meter>
            `)
        }

        if(newHealth <= 0) {
            if(this.entityOptions?.doBeforeDeathAnimation) {
                this.entityOptions.doBeforeDeathAnimation(this)
            }

            this.domElement.classList.add('dying')
            if(this.options?.collision) {
                this.options.collision = {
                    disabled: true
                }
            }

            setTimeout(() => {
                if(this.entityOptions?.doAfterDeathAnimation) {
                    this.entityOptions.doAfterDeathAnimation(this)
                }

                this.destroy()
            }, 1000)
        }

        if(hurt && newHealth >= 0) {
            this.damageAudio.currentTime = 0
            this.damageAudio.play()
        }
    }

    getHealth() {
        return this.healthPoints
    }
}
