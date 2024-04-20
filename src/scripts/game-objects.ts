import { Position } from '@/scripts/types/position'

export class CollisionError extends Error {
    constructor(public readonly object?: GameObject) {
        super(`position cant be set because it intersects `
            + 'with another or screen bounds')
    }
}

export interface GameObjectOptions {
    domElementClass?: string
    collision?: {
        disabled?: boolean
        doWhenObjectCollided?: (collidedObject: GameObject) => void
        doWhenCollidedIntoObject?: (targetObject: GameObject) => void
        bottomCollisionTrigger?: 'top' | 'bottom'
    }
}

export const objects : GameObject[] = []
let lastObjectId = 0

export class GameObject {
    readonly id: number
    readonly domElement: HTMLDivElement
    readonly stage: HTMLDivElement

    constructor(public readonly width: number, public readonly height: number,
        private readonly position:  Position, public readonly options?: GameObjectOptions) {

        this.id = lastObjectId++

        this.domElement = document.createElement('div')
        this.domElement.style.width = this.width + 'px'
        this.domElement.style.height = this.height + 'px'
        this.domElement.setAttribute('id', `object${this.id}`)
        
        this.domElement.classList.add('object')
        if(this.options?.domElementClass) {
            this.domElement.classList.add(this.options.domElementClass)
        }
        
        try {
            this.setPosition(this.position)
        }
        catch(error) {
            throw error
        }

        const stageElement =  document.querySelector('#stage') as HTMLDivElement | null
        if(!stageElement) {
            throw new Error('game is not initialized. couldn\'t find a stage element')
        }
        this.stage = stageElement

        this.stage.insertAdjacentElement('afterbegin', this.domElement)

        objects.push(this)
    }
 
    getPosition() {
        return this.position
    }

    setPosition(newPosition: Partial<Position>) {
        if(newPosition.x !== undefined && (newPosition.x + this.width > this.stage?.clientWidth
            || newPosition.x < 0)) {
            if(!this.options?.collision?.disabled) {
                throw new CollisionError()
            }
        }
         
        if(newPosition.y !== undefined && (newPosition.y + this.height > this.stage?.clientHeight
            || newPosition.y < 0)) {
            if(!this.options?.collision?.disabled) {
                throw new CollisionError()
            }
        }

        const bottomCollisionOffset =
            this.options?.collision?.bottomCollisionTrigger === 'bottom' ? this.height : 0

        const xCollisionObjects = objects.filter(object => {
            const newX = newPosition.x || this.position.x
            return object.id !== this.id
                && (newX + this.width >= object.position.x
                && newX <= object.position.x + object.width)
        })
        const yCollisionObjects = objects.filter(object => {
            const newY = newPosition.y || this.position.y
            return object.id !== this.id
                && (newY + this.height >= object.position.y
                && newY + bottomCollisionOffset <= object.position.y + object.height)
        })

        const bothAxesCollisionObject = xCollisionObjects.find(object => {
            return yCollisionObjects.some(yCollisionObject => yCollisionObject.id === object.id)
        })

        if(bothAxesCollisionObject
            && !this.options?.collision?.disabled 
            && !bothAxesCollisionObject.options?.collision?.disabled) {

            if(bothAxesCollisionObject.options?.collision?.doWhenObjectCollided) {
                bothAxesCollisionObject.options.collision.doWhenObjectCollided(this)
            }

            if(this.options?.collision?.doWhenCollidedIntoObject) { 
                this.options.collision.doWhenCollidedIntoObject(bothAxesCollisionObject)
            }

            throw new CollisionError(bothAxesCollisionObject)
        }

        this.position.x = newPosition.x !== undefined ? newPosition.x : this.position.x
        this.position.y = newPosition.y !== undefined ? newPosition.y : this.position.y
    }

    destroy() {
        this.domElement.remove()
        objects.splice(objects.findIndex(object => object.id === this.id), 1)
    }

    update() {
        this.domElement.style.top = this.position.y + 'px'
        this.domElement.style.left = this.position.x + 'px'
    }
}
