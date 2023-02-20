
class CatmullRom {
    constructor(ctlpoints) {
        this.ctlpoints = ctlpoints;
    }

    get_spline_point(t) {
        var p1 = Math.floor(t) + 1;
        var p2 = p1 + 1;
        var p3 = p2 + 1;
        var p0 = p1 - 1;

        t = t - Math.floor(t);

        var tt = t * t;
        var ttt = tt * t;

        var q1 = -ttt + 2.0 * tt - t;
        var q2 = 3.0 * ttt - 5.0 * tt + 2.0;
        var q3 = -3.0 * ttt + 4.0 * tt + t;
        var q4 = ttt - tt;

        var tx, ty;
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
        var path = []
        for (var t = 0; t <= this.ctlpoints.length - 3.0; t += progress) {
            var coordinate = this.get_spline_point(t);
            var point = new Point(coordinate.tx, coordinate.ty, 3, "#000000");
            path.push(point);
        }
        var coordinate = this.get_spline_point(this.ctlpoints.length - 3.0);
        var point = new Point(coordinate.tx, coordinate.ty, 3, "#000000");
        path.push(point);
        return path;
    }
}

class Path extends DrawableObject {
    constructor() {
        super();
        this.ctlpoints = [];
        this.fullpath = [];
    }
    update() {
        var catmull = new CatmullRom(this.ctlpoints);
        this.fullpath = catmull.get_full_path(1 / (+point_density_input.value));
        update_output();
    }
    render() {
        // process color inputs
        const start_color = start_color_input.value;
        const end_color = end_color_input.value;
        const red_value_start = parseInt(start_color.substr(1, 2), 16);
        const green_value_start = parseInt(start_color.substr(3, 2), 16);
        const blue_value_start = parseInt(start_color.substr(5, 2), 16);
        const red_value_end = parseInt(end_color.substr(1, 2), 16);
        const green_value_end = parseInt(end_color.substr(3, 2), 16);
        const blue_value_end = parseInt(end_color.substr(5, 2), 16);

        // path start and end color in RGB
        var start_color_value = [red_value_start, green_value_start, blue_value_start];
        var end_color_value = [red_value_end, green_value_end, blue_value_end];

        // draw full path
        var r_increment = (end_color_value[0] - start_color_value[0]) / this.fullpath.length;
        var g_increment = (end_color_value[1] - start_color_value[1]) / this.fullpath.length;
        var b_increment = (end_color_value[2] - start_color_value[2]) / this.fullpath.length;

        for (let i = 0; i < this.fullpath.length; i++) {
            var r = start_color_value[0] + i * r_increment;
            var g = start_color_value[1] + i * g_increment;
            var b = start_color_value[2] + i * b_increment;
            var current_color = "rgb(" + r + "," + g + "," + b + ")";
            this.fullpath[i].set_color(current_color);
            this.fullpath[i].render(ctx);
            if (i > 0) {
                ctx.beginPath();
                ctx.moveTo(this.fullpath[i - 1].get_x(), this.fullpath[i - 1].get_y());
                ctx.lineTo(this.fullpath[i].get_x(), this.fullpath[i].get_y());
                ctx.strokeStyle = current_color;
                ctx.stroke();
            }
        }

        // draw control points
        for (let i = 0; i < this.ctlpoints.length; i++) {
            if (i === 0 || i === this.ctlpoints.length - 1) {
                this.ctlpoints[i].set_color(ctlpoint_open_color_input.value);
            } else {
                this.ctlpoints[i].set_color(ctlpoint_color_input.value);
            }
            if (i === 0 && i + 1 < this.ctlpoints.length) {
                ctx.beginPath();
                ctx.moveTo(this.ctlpoints[i].get_x(), this.ctlpoints[i].get_y());
                ctx.lineTo(this.ctlpoints[i + 1].get_x(), this.ctlpoints[i + 1].get_y());
                ctx.strokeStyle = ctlpoint_open_color_input.value
                ctx.stroke();
            }
            if (i + 1 === this.ctlpoints.length - 1) {
                ctx.beginPath();
                ctx.moveTo(this.ctlpoints[i].get_x(), this.ctlpoints[i].get_y());
                ctx.lineTo(this.ctlpoints[i + 1].get_x(), this.ctlpoints[i + 1].get_y());
                ctx.strokeStyle = ctlpoint_open_color_input.value
                ctx.stroke();
            }
            this.ctlpoints[i].render(ctx);
        }
    }
}