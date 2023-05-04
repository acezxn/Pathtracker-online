import Waypoint from "../objects/drawable_objects/waypoint";
import Utils from "../utils";

class CubicBezier {
    constructor(ctlpoints) {
        this.ctlpoints = ctlpoints;
    }
    /**
     * Get coordinate from the spline curve with time t 
     *
     * @param {number} t
     * @return {{t1: number, t2: number}} coordinate in time t
     * @memberof CubicBezier
     */
    get_spline_point(t) {
        let tx, ty;
        if (this.ctlpoints.length > 0) {
            let p0 = Math.floor(t) * 3;
            let p1 = p0 + 1;
            let p2 = p1 + 1;
            let p3 = p2 + 1;

            t = t - Math.floor(t);

            try {
                tx = (1 - t) ** 3 * this.ctlpoints[p0].x + 3 * t * (1 - t) ** 2 * this.ctlpoints[p1].x +
                    3 * t ** 2 * (1 - t) * this.ctlpoints[p2].x + t ** 3 * this.ctlpoints[p3].x;
                ty = (1 - t) ** 3 * this.ctlpoints[p0].y + 3 * t * (1 - t) ** 2 * this.ctlpoints[p1].y +
                    3 * t ** 2 * (1 - t) * this.ctlpoints[p2].y + t ** 3 * this.ctlpoints[p3].y;
            } catch (error) {
                tx = this.ctlpoints[p0].x;
                ty = this.ctlpoints[p0].y;
            }
        }

        return { tx, ty };
    }

    /**
     * Get an array of all points in the path
     *
     * @param {number} progress step size
     * @return {Waypoint[]} all points in the path 
     * @memberof CubicBezier
     */
    get_full_path(progress) {
        const max_velocity_input = document.getElementById("max_velocity_input");
        const field_width_input = document.getElementById("field_width");
        const canvas = document.getElementById("Stage");
        const velocity = Utils.meters_to_pixel(+max_velocity_input.value, +field_width_input.value, canvas.width);
        var path = []

        for (var t = 0; t <= Math.floor(this.ctlpoints.length / 3); t += progress) {
            var coordinate = this.get_spline_point(t);
            var point = new Waypoint(coordinate.tx, coordinate.ty, 0, velocity, 0, 3, "#000000");
            path.push(point);
        }

        return path;
    }
}

export default CubicBezier;