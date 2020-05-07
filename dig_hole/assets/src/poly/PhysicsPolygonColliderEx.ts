// author: http://lamyoung.com/

declare const ClipperLib: any;

const { ccclass, property, menu, requireComponent } = cc._decorator;

@ccclass
@menu("i18n:MAIN_MENU.component.physics/Collider/PolygonEX-lamyoung.com")
@requireComponent(cc.RigidBody)
export default class PhysicsPolygonColliderEx extends cc.Component {


    public get polys() {
        return this._polys.map((v) => { return this._convertClipperPathToVecArray(v) });
    }
    private _polys: { X: number, Y: number }[][] = [];

    private _physicsPolygonColliders: cc.PhysicsPolygonCollider[] = [];

    init(polys: cc.Vec2[][]) {
        this._polys = polys.map((v) => { return this._convertVecArrayToClipperPath(v) });
        this._commands = [];
    }

    private _commands: { name: string, params: any[] }[] = [];

    pushCommand(name: string, params: any[]) {
        this._commands.push({ name, params });
    }

    polyDifference(poly: cc.Vec2[], ctx?: cc.Graphics) {
        // if (poly.length < 3) return;
        const cpr = new ClipperLib.Clipper();
        const subj_paths = this._polys;
        const clip_paths = [this._convertVecArrayToClipperPath(poly)]
        cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
        cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);
        const subject_fillType = ClipperLib.PolyFillType.pftEvenOdd;
        const clip_fillType = ClipperLib.PolyFillType.pftEvenOdd;
        const solution_polytree = new ClipperLib.PolyTree();
        cpr.Execute(ClipperLib.ClipType.ctDifference, solution_polytree, subject_fillType, clip_fillType);
        const solution_expolygons = ClipperLib.JS.PolyTreeToExPolygons(solution_polytree);
        this._polys = ClipperLib.Clipper.PolyTreeToPaths(solution_polytree);
        // cc.log(solution_expolygons);

        ctx && ctx.clear(true);
        let _physicsPolygonColliders_count = 0;
        for (const expolygon of solution_expolygons) {
            const countor = this._convertClipperPathToPoly2triPoint(expolygon.outer);
            const swctx = new poly2tri.SweepContext(countor);
            const holes = expolygon.holes.map(h => { return this._convertClipperPathToPoly2triPoint(h) });
            try {
                swctx.addHoles(holes);
                swctx.triangulate();
                const triangles = swctx.getTriangles();
                // cc.log('triangles', triangles);
                for (const tri of triangles) {
                    let c = this._physicsPolygonColliders[_physicsPolygonColliders_count];
                    if (!c) {
                        c = this.addComponent(cc.PhysicsPolygonCollider);
                        c.friction = 0;
                        c.restitution = 0;
                        this._physicsPolygonColliders[_physicsPolygonColliders_count] = c;
                    }
                    c.points = tri.getPoints().map((v, i) => {
                        if (ctx) {
                            if (i === 0) ctx.moveTo(v.x, v.y);
                            else ctx.lineTo(v.x, v.y);
                        }
                        return cc.v2(v.x, v.y)
                    });
                    c.apply();
                    _physicsPolygonColliders_count++;
                    if(ctx){
                        ctx.close();
                        ctx.fill();
                    }
                }

                this._physicsPolygonColliders.slice(_physicsPolygonColliders_count).forEach((v => {
                    if (v.points.length) {
                        v.points.length = 0;
                        v.apply();
                    }
                }));
            } catch{

            }

        }

    }


    lateUpdate(dt: number) {
        if (this._commands.length) {
            for (let index = 0; index < 2; index++) {
                const cmd = this._commands.shift();
                if (cmd)
                    this[cmd.name](...cmd.params);
                else
                    break;
            }

        }
    }


    private _convertVecArrayToClipperPath(poly: cc.Vec2[]) {
        return poly.map((p) => { return { X: p.x, Y: p.y } });
    }

    private _convertClipperPathToVecArray(poly: { X: number, Y: number }[]) {
        return poly.map((p) => { return cc.v2(p.X, p.Y) });
    }

    private _convertClipperPathToPoly2triPoint(poly: { X: number, Y: number }[]) {
        return poly.map((p) => { return new poly2tri.Point(p.X, p.Y) });
    }

}

// 欢迎关注微信公众号[白玉无冰]
// qq 交流群 859642112