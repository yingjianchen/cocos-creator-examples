
const DIG_RADIUS = 50;
const DIG_FRAGMENT = 12;


const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.Graphics)
    graphics: cc.Graphics = null;

    @property(cc.Node)
    node_dirty: cc.Node = null;

    @property(cc.Node)
    node_ball: cc.Node = null;

    private _regions = [[]];

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags = 1;

        for (let index = 0; index < 20; index++) {
            const c = this.node_dirty.addComponent(cc.PhysicsChainCollider);
            c.loop = true;
            c.enabled = false;
        }

        this.graphics.node.on(cc.Node.EventType.TOUCH_START, this._touchMove, this);
        this.graphics.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this);
        this.graphics.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this);
    }

    start() {
        this.reset();
    }

    private _optimizeRegions() {
        const regions = [];
        for (let index = 0; index < this._regions.length; index++) {
            const pos = this._regions[index];
            const newPos = [];
            pos.forEach((p, i) => {
                const p1 = pos[(i + 1) % pos.length];
                const disX = p1[0] - p[0]
                const disY = p1[1] - p[1]
                if ((disX * disX + disY * disY) > 25) {
                    newPos.push(p);
                }
            })

            if (newPos.length > 2) {
                regions.push(newPos);
            }
        }
        this._regions = regions;
    }

    private _touchMove(touch: cc.Touch) {
        const regions = [[]];
        const pos = this.graphics.node.convertToNodeSpaceAR(touch.getLocation());
        // cc.log(touch.getDelta());

        const count = DIG_FRAGMENT;
        for (let index = 0; index < count; index++) {
            const r = 2 * Math.PI * index / count;
            regions[0].push([pos.x + DIG_RADIUS * Math.cos(r), pos.y + DIG_RADIUS * Math.sin(r)]);
        }

        const result = PolyBool.difference({
            regions: this._regions,
            inverted: false
        }, {
            regions,
            inverted: false
        });

        this._regions = result.regions;
        this._optimizeRegions();
        this.draw();
    }

    reset() {
        this._regions = [
            [[-375, -667], [-375, 500], [-50, 500], [-40, 450], [40, 450], [50, 500], [375, 500], [375, -667]]
        ];
        this.draw();
        this.node_ball.setPosition(0, 500);
    }

    draw() {

        const chains = this.node_dirty.getComponents(cc.PhysicsChainCollider);
        chains.forEach((c) => {
            c.enabled = false;
        })

        const enabled_chains_points: cc.Vec2[][] = [];

        for (let index = 0; index < this._regions.length; index++) {
            const pos = this._regions[index];
            let poly = chains[index];
            // if (!poly) {
            //     poly = this.node_dirty.addComponent(cc.PhysicsChainCollider);
            //     poly.loop = true;
            // }

            poly.points.length = 0;
            poly.points = pos.map((v, i) => {
                const v2 = cc.v2(v[0], v[1])
                return v2;
            });

            poly.enabled = true;
            enabled_chains_points[index] = poly.points;
        }

        this.graphics.clear(true);
        const enabled_chains_points_sort = enabled_chains_points.map((curPoly, curPoly_i) => {
            const count = enabled_chains_points.reduce((pre, nextPoly, nextPoly_i) => {
                if ((curPoly_i != nextPoly_i)) {
                    const length = curPoly.length;
                    for (let i = 0; i < length; ++i) {
                        const p0 = curPoly[i];
                        if (!cc.Intersection.pointInPolygon(p0, nextPoly))
                            return pre;
                    }
                    return pre + 1;
                }
                return pre;
            }, 0);

            return { curPoly, count };
        }).sort((a, b) => {
            return a.count - b.count;
        })

        enabled_chains_points_sort.forEach(({ curPoly, count }) => {
            this.graphics.fillColor = count % 2 === 0 ? cc.Color.ORANGE : cc.Color.BLACK;
            this._drawPoly(this.graphics, curPoly);
            this.graphics.fill();
        })


        // window['_regions'] = this._regions;
    }

    private _drawPoly(ctx, poly) {
        poly.forEach((pos, i) => {
            if (i === 0)
                ctx.moveTo(pos.x, pos.y);
            else
                ctx.lineTo(pos.x, pos.y);
            ctx.close();
        });
    }

}
