import Waypoint from "../objects/waypoint";

class CatmullRom {
    constructor(ctlpoints) {
        this.ctlpoints = ctlpoints;
        this.length = 0;
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
            ty = this.ctlpoints[p1].y;
        }
        

        return {tx, ty};
    }

    get_full_path(progress) {
        var path = []
        this.length = 0;
        for (var t = 0; t <= this.ctlpoints.length-3.0; t += progress) {
            var coordinate = this.get_spline_point(t);
            if (t - progress >= 0) {
                var prev_coordinate = this.get_spline_point(t - progress);
                var x_dist = coordinate.tx - prev_coordinate.tx;
                var y_dist = coordinate.ty - prev_coordinate.ty;
                var dist = Math.sqrt(Math.pow(x_dist, 2) + Math.pow(y_dist, 2));
                this.length += dist;
            }
            var point = new Waypoint(coordinate.tx, coordinate.ty, 0, 300, 0, 3, "#000000");
            path.push(point);
        }
        return path;
    }
}

export default CatmullRom;