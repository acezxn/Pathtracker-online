import DrawableObject from "./drawable_object";
import CatmullRom from "../../algorithms/catmull_rom";
import CubicBezier from "../../algorithms/cubic_bezier";
import OutputManager from "../output_manager";
class Path extends DrawableObject {
    constructor() {
        super();
        this.ctlpoints = []; // an array of Point
        this.fullpath = [];  // an array of Waypoint
        this.settings = {};
        this.algorithm = "catmull_rom";
    }
    reset() {
        this.ctlpoints = [];
        this.fullpath = [];
        this.settings = {};
        this.update();
    }
    set_algorithm(algo) {
        this.algorithm = algo;
        console.log("Switched to " + this.algorithm);
    }
    update() {
        var path_generator;
        if (this.algorithm === "catmull_rom") {
            path_generator = new CatmullRom(this.ctlpoints);
        }
        if (this.algorithm === "cubic_bezier") {
            path_generator = new CubicBezier(this.ctlpoints);
            for (let i = 0; i < this.ctlpoints.length; i++) {
                if (i % 3 != 0) { // direction handles
                    this.ctlpoints[i].set_is_direction_handle(true);
                    this.ctlpoints[i].set_is_control_point(false);
                } else {
                    this.ctlpoints[i].set_is_direction_handle(false);
                    this.ctlpoints[i].set_is_control_point(true);
                }
            }
        }
        this.fullpath = path_generator.get_full_path(1 / (+this.settings.point_density));
        OutputManager.update_output();
    }

    render_fullpath(ctx) {
        // process color inputs
        const start_color = this.settings.start_color;
        const end_color = this.settings.end_color;
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
    }

    render_ctlpoints(ctx) {
        // draw control points
        for (let i = 0; i < this.ctlpoints.length; i++) {

            switch (this.algorithm) {
                case "catmull_rom":
                    if (i === 0 || i === this.ctlpoints.length - 1) {
                        this.ctlpoints[i].set_color(this.settings.ctlpoint_open_color);
                    } else {
                        this.ctlpoints[i].set_color(this.settings.ctlpoint_color);
                    }
                    if (i === 0 && i + 1 < this.ctlpoints.length) {
                        ctx.beginPath();
                        ctx.moveTo(this.ctlpoints[i].get_x(), this.ctlpoints[i].get_y());
                        ctx.lineTo(this.ctlpoints[i + 1].get_x(), this.ctlpoints[i + 1].get_y());
                        ctx.strokeStyle = this.settings.ctlpoint_open_color;
                        ctx.stroke();
                    }
                    if (i + 1 === this.ctlpoints.length - 1) {
                        ctx.beginPath();
                        ctx.moveTo(this.ctlpoints[i].get_x(), this.ctlpoints[i].get_y());
                        ctx.lineTo(this.ctlpoints[i + 1].get_x(), this.ctlpoints[i + 1].get_y());
                        ctx.strokeStyle = this.settings.ctlpoint_open_color
                        ctx.stroke();
                    }
                    break;
                case "cubic_bezier":
                    if (i % 3 === 1) {
                        this.ctlpoints[i].set_color(this.settings.ctlpoint_open_color);
                        ctx.beginPath();
                        ctx.moveTo(this.ctlpoints[i].get_x(), this.ctlpoints[i].get_y());
                        ctx.lineTo(this.ctlpoints[i - 1].get_x(), this.ctlpoints[i - 1].get_y());
                        ctx.strokeStyle = this.settings.ctlpoint_open_color;
                        ctx.stroke();
                    }
                    else if (i % 3 === 2) {
                        this.ctlpoints[i].set_color(this.settings.ctlpoint_open_color);
                        if (i + 1 < this.ctlpoints.length) {
                            ctx.beginPath();
                            ctx.moveTo(this.ctlpoints[i].get_x(), this.ctlpoints[i].get_y());
                            ctx.lineTo(this.ctlpoints[i + 1].get_x(), this.ctlpoints[i + 1].get_y());
                            ctx.strokeStyle = this.settings.ctlpoint_open_color;
                            ctx.stroke();
                        }
                    }
                    else {
                        this.ctlpoints[i].set_color(this.settings.ctlpoint_color);
                    }
                    break;
            }
            this.ctlpoints[i].render(ctx, this.settings);
        }
    }
    render(ctx, settings) {
        this.settings = settings;

        this.render_fullpath(ctx);
        this.render_ctlpoints(ctx);

    }
}

export default Path;