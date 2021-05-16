
import { _decorator, Component, Node, Vec2, v2, IRectLike } from 'cc';
const { ccclass, property } = _decorator;
const V2_UP = v2(0, 1)


@ccclass('Vehicle')
export class Vehicle extends Component {
    @property
    mass: number = 1

    @property
    maxSpeed: number = 10

    protected _position: Vec2 = v2()
    get position() {
        return this._position
    }
    set position(pos: Vec2) {
        this._position.set(pos)
        this.node.setPosition(this._position.x, this._position.y)
    }

    velocity: Vec2 = v2()


    fixedUpdate() {
        if (this.velocity.lengthSqr() > this.maxSpeed * this.maxSpeed) {
            this.velocity.multiplyScalar(this.maxSpeed / this.velocity.length())
        }
        this._position.add(this.velocity)
        this.node.setPosition(this._position.x, this._position.y)
        this.node.angle = -this.velocity.signAngle(V2_UP) / Math.PI * 180
        console.log(this.node.angle)
    }

    wrap(rect: IRectLike) {
        const position = this.position
        if (position.x > (rect.width + rect.x)) position.x = rect.x;
        if (position.x < rect.x) position.x = (rect.width + rect.x);
        if (position.y > (rect.height + rect.y)) position.y = rect.y;
        if (position.y < rect.y) position.y = (rect.height + rect.y);
    }

    bounce(rect: IRectLike): void {
        const position = this.position;
        const velocity = this.velocity;
        if (position.x > (rect.width + rect.x)) {
            position.x = (rect.width + rect.x);
            velocity.x *= -1;
        } else if (position.x < rect.x) {
            position.x = rect.x;
            velocity.x *= -1;
        }

        if (position.y > (rect.height + rect.y)) {
            position.y = (rect.height + rect.y);
            velocity.y *= -1;
        } else if (position.y < rect.y) {
            position.y = rect.y;
            velocity.y *= -1;
        }
    }


}


