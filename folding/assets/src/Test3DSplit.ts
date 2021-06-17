
import { _decorator, Component, MeshRenderer, primitives, utils, Vec3, v3, Quat, quat } from 'cc';
const { ccclass, property } = _decorator;

const _temp_v3 = v3();
const _temp_v3_1 = v3();
const _temp_v3_2 = v3();
const _temp_v3_3 = v3();
const _temp_quat = quat();

@ccclass('Test3DSplit')
export class Test3DSplit extends Component {
    @property(MeshRenderer)
    meshRenderer: MeshRenderer = null!;

    private _gemotry: primitives.IGeometry = primitives.plane({ width: 10, length: 10, widthSegments: 99, lengthSegments: 99 });
    private _mesh = utils.createMesh(this._gemotry);
    private _selectedPos: Map<number, number[]> = new Map()

    onLoad() {
        this.meshRenderer.mesh = this._mesh;
    }

    start() {

        const axiStart = v3(0, 0, -3);
        const axiEnd = v3(2, 0, -2);

        this._selectedPos.clear();
        this._gemotry.positions.forEach((v, i, arr) => {
            if (i % 3 === 0) {
                const target = _temp_v3_1.set(arr[i], arr[i + 1], arr[i + 2]);
                const axi = Vec3.subtract(_temp_v3, axiEnd, axiStart).normalize();
                const targetVector = Vec3.subtract(_temp_v3_2, target, axiStart);
                if (Vec3.cross(_temp_v3_3, axi, targetVector).y > 0) {
                    this._selectedPos.set(i, [arr[i], arr[i + 1], arr[i + 2]])
                }
            }
        })

        let count = 1;
        this.schedule(() => {
            this._selectedPos.forEach((arr, i) => {
                _temp_v3_1.set(arr[0], arr[0 + 1], arr[0 + 2]);
                this.rotatePos(_temp_v3_1, axiStart, axiEnd, Math.PI * 0.07 * count);
                this._gemotry.positions[i] = _temp_v3_1.x;
                this._gemotry.positions[i + 1] = _temp_v3_1.y;
                this._gemotry.positions[i + 2] = _temp_v3_1.z;
            })
            count++;
            this.renderMesh();
        }, 0.2)



        console.log(this._gemotry.positions, 'this._gemotry.positions');
    }

    private renderMesh() {
        this.meshRenderer.mesh = utils.createMesh(this._gemotry, this._mesh);
    }

    private rotatePos(target: Vec3, axiStart: Vec3, axiEnd: Vec3, rad: number) {
        const axi = Vec3.subtract(_temp_v3, axiEnd, axiStart).normalize();
        const targetVector = Vec3.subtract(_temp_v3_2, target, axiStart);
        Quat.fromAxisAngle(_temp_quat, axi, rad);
        Vec3.transformQuat(targetVector, targetVector, _temp_quat);
        Vec3.add(target, axiStart, targetVector);
        return target;
    }

}

