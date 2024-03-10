import { GameObject, GameObjectOptions } from '@/scripts/game-objects'
import { Position } from '@/scripts/types/position'

interface EntityOptions {
    doOnDeath?: (entity: Entity) => void
    spriteElementClass?: string
    noHealthBar?: boolean;
    objectOptions?: GameObjectOptions
}

export class Entity extends GameObject {
    private readonly entityOptions?: EntityOptions
    private healthPoints: number = 0

    constructor(position: Position, private readonly maxHealth: number,
        entityOptions?: EntityOptions) {

        super(52, 82, position, {
            domElementClass: 'entity-container',
            ...entityOptions?.objectOptions            
        })

        this.entityOptions = entityOptions

        this.domElement.insertAdjacentHTML('afterbegin', `
            <div class="entity-sprite ${this.entityOptions?.spriteElementClass || ''}"></div>
        `)
        this.domElement.setAttribute('direction', 'bottom')

        this.setHealth(maxHealth)
    }

    setHealth(newHealth: number) {
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
            this.domElement.classList.add('dying')
            setTimeout(() => {
                if(this.entityOptions?.doOnDeath) {
                    this.entityOptions.doOnDeath(this)
                }
                
                this.destroy()
            }, 1000)
        }
    }

    getHealth() {
        return this.healthPoints
    }
}
