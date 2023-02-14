import Point from "./point.js";

class CatmullRom {
    constructor(ctlpoints) {
        this.ctlpoints = ctlpoints;
    }

    get_spline_point(t) {
        var p1 = Math.floor(t)+1;
        var p2 = p1 + 1;
        var p3 = p2 + 1;
        var p0 = p1 - 1;

        t = t - Math.floor(t);

        var tt = t*t;
        var ttt = tt*t;
        
        var q1 = -ttt + 2.0*tt - t;
        var q2 = 3.0*ttt - 5.0*tt + 2.0;
        var q3 = -3.0*ttt + 4.0*tt + t;
        var q4 = ttt - tt;

        var tx, ty;
        try {
            tx = 0.5 * (this.ctlpoints[p0].x * q1 + this.ctlpoints[p1].x * q2 + this.ctlpoints[p2].x * q3 + this.ctlpoints[p3].x * q4);
            ty = 0.5 * (this.ctlpoints[p0].y * q1 + this.ctlpoints[p1].y * q2 + this.ctlpoints[p2].y * q3 + this.ctlpoints[p3].y * q4);
        } catch (error) {
            tx = this.ctlpoints[p1].x;
            tx = this.ctlpoints[p1].y;
        }
        

        return {tx, ty};
    }

    get_full_path(progress) {
        var path = []
        for (var t = 0; t <= this.ctlpoints.length-3.0; t += progress) {
            var coordinate = this.get_spline_point(t);
            var point = new Point(coordinate.tx, coordinate.ty, 2, "#000000");
            path.push(point);
        }
        return path;
    }
}

export default CatmullRom;