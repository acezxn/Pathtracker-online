import OutputManager from "../output_manager";
import DrawableObject from "./drawable_object";
import CatmullRom from "../../algorithms/catmull_rom";

class Path extends DrawableObject {
    constructor() {
        super();
        this.ctlpoints = [];
        this.fullpath = [];
        this.settings = {};
    }
    update() {
        var catmull = new CatmullRom(this.ctlpoints);
        this.fullpath = catmull.get_full_path(1 / (+this.settings.point_density));
        OutputManager.update_output();
    }
    render(ctx, settings) {
        this.settings = settings;
        // process color inputs
        const start_color = settings.start_color;
        const end_color = settings.end_color;
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
                this.ctlpoints[i].set_color(settings.ctlpoint_open_color);
            } else {
                this.ctlpoints[i].set_color(settings.ctlpoint_color);
            }
            if (i === 0 && i + 1 < this.ctlpoints.length) {
                ctx.beginPath();
                ctx.moveTo(this.ctlpoints[i].get_x(), this.ctlpoints[i].get_y());
                ctx.lineTo(this.ctlpoints[i + 1].get_x(), this.ctlpoints[i + 1].get_y());
                ctx.strokeStyle = settings.ctlpoint_open_color;
                ctx.stroke();
            }
            if (i + 1 === this.ctlpoints.length - 1) {
                ctx.beginPath();
                ctx.moveTo(this.ctlpoints[i].get_x(), this.ctlpoints[i].get_y());
                ctx.lineTo(this.ctlpoints[i + 1].get_x(), this.ctlpoints[i + 1].get_y());
                ctx.strokeStyle = settings.ctlpoint_open_color
                ctx.stroke();
            }
            this.ctlpoints[i].render(ctx, settings);
        }
    }
}

export default Path;