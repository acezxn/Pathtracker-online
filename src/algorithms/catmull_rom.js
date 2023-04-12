import Waypoint from "../objects/drawable_objects/waypoint";
import Utils from "../utils";

class CatmullRom {
    constructor(ctlpoints) {
        this.ctlpoints = ctlpoints;
    }

    get_spline_point(t) {
        let p1 = Math.floor(t) + 1;
        let p2 = p1 + 1;
        let p3 = p2 + 1;
        let p0 = p1 - 1;

        t = t - Math.floor(t);

        let tt = t * t;
        let ttt = tt * t;

        let q1 = -ttt + 2.0 * tt - t;
        let q2 = 3.0 * ttt - 5.0 * tt + 2.0;
        let q3 = -3.0 * ttt + 4.0 * tt + t;
        let q4 = ttt - tt;

        let tx, ty;
        try {
            tx = 0.5 * (this.ctlpoints[p0].x * q1 + this.ctlpoints[p1].x * q2 + this.ctlpoints[p2].x * q3 + this.ctlpoints[p3].x * q4);
            ty = 0.5 * (this.ctlpoints[p0].y * q1 + this.ctlpoints[p1].y * q2 + this.ctlpoints[p2].y * q3 + this.ctlpoints[p3].y * q4);
        } catch (error) {
            tx = this.ctlpoints[p1].x;
            ty = this.ctlpoints[p1].y;
        }


        return { tx, ty };
    }

    get_full_path(progress) {
        const max_velocity_input = document.getElementById("max_velocity_input");
        const field_width_input = document.getElementById("field_width");
        const canvas = document.getElementById("Stage");
        const velocity = Utils.meters_to_pixel(+max_velocity_input.value, +field_width_input.value, canvas.width);
        var path = []
        for (var t = 0; t <= this.ctlpoints.length - 3.0; t += progress) {
            var coordinate = this.get_spline_point(t);
            if (t - progress >= 0) {
                var prev_coordinate = this.get_spline_point(t - progress);
                var x_dist = coordinate.tx - prev_coordinate.tx;
                var y_dist = coordinate.ty - prev_coordinate.ty;
                var dist = Math.sqrt(Math.pow(x_dist, 2) + Math.pow(y_dist, 2));
            }
            var point = new Waypoint(coordinate.tx, coordinate.ty, 0, velocity, 0, 3, "#000000");
            path.push(point);
        }
        if (this.ctlpoints.length - 3.0 >= 0) {
            var coordinate = this.get_spline_point(this.ctlpoints.length - 3.0);
            var point = new Waypoint(coordinate.tx, coordinate.ty, 0, velocity, 0, 3, "#000000");
            path.push(point);
        }
        return path;
    }
}

export default CatmullRom;