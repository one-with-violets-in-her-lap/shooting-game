import { Position } from '@/types/position';

const stage = document.querySelector('#stage') as HTMLDivElement

let lastObjectId = 0
export const objects : GameObject[] = []

interface GameObjectOptions {
    domElementClass?: string;
    disableCollision?: boolean;
    doOnCollision?: (collidedObject: GameObject) => void;
}

export class GameObject {
    readonly id: number
    readonly domElement: HTMLDivElement

    constructor(private readonly width: number, private readonly height: number,
        private readonly position:  Position, private readonly options: GameObjectOptions) {

        this.id = lastObjectId++

        this.domElement = document.createElement('div')
        this.domElement.style.width = this.width + 'px'
        this.domElement.style.height = this.height + 'px'
        
        this.domElement.classList.add('object')
        if(this.options.domElementClass) {
            this.domElement.classList.add(this.options.domElementClass)
        }
        
        this.domElement.style.top = this.position.y + 'px'
        this.domElement.style.left = this.position.x + 'px'
        stage.insertAdjacentElement('afterbegin', this.domElement)

        objects.push(this)
    }
 
    getPosition() {
        return this.position
    }

    setPosition(newPosition: Partial<Position>, collisionOffset: number = 0) {
        if(newPosition.x !== undefined && (newPosition.x + this.width > stage?.clientWidth + collisionOffset
            || newPosition.x < 0 - collisionOffset)) {
            return
        }
         
        if(newPosition.y !== undefined && (newPosition.y + this.height > stage?.clientHeight
            || newPosition.y < 0 - collisionOffset)) {
            return
        }
        
        const xCollisionObject = objects.find(object => {
            const newX = newPosition.x || this.position.x
            return object.id !== this.id
                && (newX + this.width >= object.position.x + collisionOffset && newX <= object.position.x - collisionOffset + object.width)
        })
        const yCollisionObject = objects.find(object => {
            const newY = newPosition.y || this.position.y
            return object.id !== this.id
                && (newY + this.height >= object.position.y && newY <= object.position.y - collisionOffset)
        })

        const collisionEnabled = !this.options.disableCollision && !xCollisionObject?.options.disableCollision
        if(xCollisionObject && yCollisionObject && xCollisionObject.id === yCollisionObject.id
            && collisionEnabled) {

            if(xCollisionObject.options.doOnCollision) {
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
