import { Position } from '@/scripts/types/position';

interface GameObjectOptions {
    domElementClass?: string;
    disableCollision?: boolean;
    doOnCollision?: (collidedObject: GameObject) => void;
}

export const objects : GameObject[] = []
let lastObjectId = 0

export class GameObject {
    readonly id: number
    readonly domElement: HTMLDivElement
    readonly stage: HTMLDivElement

    constructor(private readonly width: number, private readonly height: number,
        private readonly position:  Position, private readonly options?: GameObjectOptions) {

        this.id = lastObjectId++

        this.domElement = document.createElement('div')
        this.domElement.style.width = this.width + 'px'
        this.domElement.style.height = this.height + 'px'
        
        this.domElement.classList.add('object')
        if(this.options?.domElementClass) {
            this.domElement.classList.add(this.options.domElementClass)
        }
        
        this.domElement.style.top = this.position.y + 'px'
        this.domElement.style.left = this.position.x + 'px'

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
            return
        }
         
        if(newPosition.y !== undefined && (newPosition.y + this.height > this.stage?.clientHeight
            || newPosition.y < 0)) {
            return
        }
        
        const xCollisionObject = objects.find(object => {
            const newX = newPosition.x || this.position.x
            return object.id !== this.id
                && (newX + this.width >= object.position.x
                && newX <= object.position.x + object.width)
        })
        const yCollisionObject = objects.find(object => {
            const newY = newPosition.y || this.position.y
            return object.id !== this.id
                && (newY + this.height >= object.position.y && newY <= object.position.y)
        })

        const collisionEnabled = !this.options?.disableCollision && !xCollisionObject?.options?.disableCollision
        if(xCollisionObject && yCollisionObject && xCollisionObject.id === yCollisionObject.id
            && collisionEnabled) {

            if(xCollisionObject.options?.doOnCollision) {
                xCollisionObject.options.doOnCollision(this)
            }

            return
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
