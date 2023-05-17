import DrawableObject from "./drawable_object";
import CatmullRom from "../../algorithms/catmull_rom";
import CubicBezier from "../../algorithms/cubic_bezier";
import OutputManager from "../output_manager";
import FieldObjects from "../field_objects";
import Utils from "../../utils";
import Point from "./point";
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
                if (i % 3 !== 0) { // direction handles
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
                default:
                    console.log("Unknown path generation algorithm")
                    break;
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

    /**
     * Add control point to the end of path
     * 
     * @param {number} x x coordinate
     * @param {number} y y coordinate
     * @memberof Path
    */
    add_ctlpoint(x, y) {
        const curve_type_input = document.getElementById("curve_type_input");
        FieldObjects.path.ctlpoints.push(new Point(x, y, 7, "#000000", true));
        if (curve_type_input.value === "cubic_bezier") {
            if (FieldObjects.path.ctlpoints.length > 4) {

                let p4_x = FieldObjects.path.ctlpoints[FieldObjects.path.ctlpoints.length - 2].get_x();
                let p4_y = FieldObjects.path.ctlpoints[FieldObjects.path.ctlpoints.length - 2].get_y();
                let p3_x = FieldObjects.path.ctlpoints[FieldObjects.path.ctlpoints.length - 3].get_x();
                let p3_y = FieldObjects.path.ctlpoints[FieldObjects.path.ctlpoints.length - 3].get_y();
                let p7_x = FieldObjects.path.ctlpoints[FieldObjects.path.ctlpoints.length - 1].get_x();
                let p7_y = FieldObjects.path.ctlpoints[FieldObjects.path.ctlpoints.length - 1].get_y();

                let p5_x = p4_x - (p3_x - p4_x);
                let p5_y = p4_y - (p3_y - p4_y);

                let p6_x = p7_x + (p3_x - p4_x);
                let p6_y = p7_y + (p3_y - p4_y);

                // direction handle points
                let p5 = new Point(p5_x, p5_y, 7, "#000000", false, true);
                let p6 = new Point(p6_x, p6_y, 7, "#000000", false, true);

                FieldObjects.path.ctlpoints.splice(FieldObjects.path.ctlpoints.length - 1, 0, p5);
                FieldObjects.path.ctlpoints.splice(FieldObjects.path.ctlpoints.length - 1, 0, p6);
            }
        }
        FieldObjects.path.update();
    }

    /**
     * Insert control point to the path
     *
     * @export
     * @param {Number} idx referencing index
     * @param {Number} offset index offset of the target index
     * @memberof Path
     */
    insert_ctlpoint(idx, offset) {
        const curve_type_input = document.getElementById("curve_type_input");
        const canvas = document.getElementById("Stage");
        if (curve_type_input.value === "catmull_rom") {
            let current_point, next_point;   
            let x_change, y_change, direction = 1;

            // if point selected is in the middle of the path
            if (idx + offset !== 0 && idx + offset < FieldObjects.path.ctlpoints.length) {          
                current_point = FieldObjects.path.ctlpoints[idx + offset - 1];
                next_point = FieldObjects.path.ctlpoints[idx + offset];
            }

            // if point selected is at the end of the path
            else if (idx + offset === FieldObjects.path.ctlpoints.length) {
                current_point = FieldObjects.path.ctlpoints[idx];
                next_point = FieldObjects.path.ctlpoints[idx - 1];
                direction = -1;
            }

            // if point selected is at the start of the path
            else if (idx + offset === 0) {
                current_point = FieldObjects.path.ctlpoints[idx];
                next_point = FieldObjects.path.ctlpoints[idx + 1];
                direction = -1;
            }

            x_change = direction * (next_point.get_x() - current_point.get_x()) * 0.5;
            y_change = direction * (next_point.get_y() - current_point.get_y()) * 0.5;
            
            // if the new coordinate is not within the stage
            let new_coordinate = Utils.adjust_coordinate({
                x: current_point.get_x(), 
                y: current_point.get_y(), 
                x_change: x_change,
                y_change: y_change,
                canvas: canvas
            });

            FieldObjects.path.ctlpoints.splice(idx + offset, 0, new Point(new_coordinate.x, new_coordinate.y, 7, "#000000", true));
        }
        else if (curve_type_input.value === "cubic_bezier") {
            if (FieldObjects.path.ctlpoints.length < 4) {
                return;
            }
            let x_change, y_change;
            // if inserting point at the end of the path
            if (idx + 3 * (offset - 1) + 1 >= FieldObjects.path.ctlpoints.length) {
                let current_point = FieldObjects.path.ctlpoints[idx];
                let prev_point = FieldObjects.path.ctlpoints[idx - 3];
                x_change = (current_point.get_x() - prev_point.get_x()) * 0.5;
                y_change = (current_point.get_y() - prev_point.get_y()) * 0.5;

                let new_coordinate = Utils.adjust_coordinate({
                    x: current_point.get_x(), 
                    y: current_point.get_y(), 
                    x_change: x_change,
                    y_change: y_change,
                    canvas: canvas
                });

                this.add_ctlpoint(new_coordinate.x, new_coordinate.y + y_change);
                return;
            }

            let p1_x, p1_y, p2_x, p2_y, p3_x, p3_y, p4_x, p4_y, p5_x, p5_y;
            // if inserting in the beginning of the path
            if (idx === 0 && offset <= 0) {
                p1_x = FieldObjects.path.ctlpoints[idx].get_x();
                p1_y = FieldObjects.path.ctlpoints[idx].get_y();
                p2_x = FieldObjects.path.ctlpoints[idx + 1].get_x();
                p2_y = FieldObjects.path.ctlpoints[idx + 1].get_y();

                let current_point = FieldObjects.path.ctlpoints[idx];
                let next_point = FieldObjects.path.ctlpoints[idx + 3];

                x_change = (current_point.get_x() - next_point.get_x()) * 0.5;
                y_change = (current_point.get_y() - next_point.get_y()) * 0.5;

                let new_coordinate = Utils.adjust_coordinate({
                    x: current_point.get_x(), 
                    y: current_point.get_y(), 
                    x_change: x_change,
                    y_change: y_change,
                    canvas: canvas
                });

                p5_x = new_coordinate.x;
                p5_y = new_coordinate.y;

                p3_x = p1_x + (p1_x - p2_x);
                p3_y = p1_y + (p1_y - p2_y);

                p4_x = p5_x - (p1_x - p2_x);
                p4_y = p5_y - (p1_y - p2_y);

                // direction handle points
                let p3 = new Point(p3_x, p3_y, 7, "#000000", false, true);
                let p4 = new Point(p4_x, p4_y, 7, "#000000", false, true);

                // new control point
                let p5 = new Point(p5_x, p5_y, 7, "#000000", true, false);

                FieldObjects.path.ctlpoints.splice(idx, 0, p3);
                FieldObjects.path.ctlpoints.splice(idx, 0, p4);
                FieldObjects.path.ctlpoints.splice(idx, 0, p5);
            } 
            // if inserting in the middle of the path
            else {
                p1_x = FieldObjects.path.ctlpoints[idx + 3 * (offset - 1)].get_x();
                p1_y = FieldObjects.path.ctlpoints[idx + 3 * (offset - 1)].get_y();
                p2_x = FieldObjects.path.ctlpoints[idx + 3 * (offset - 1) + 1].get_x();
                p2_y = FieldObjects.path.ctlpoints[idx + 3 * (offset - 1) + 1].get_y();

                let current_point = FieldObjects.path.ctlpoints[idx];
                let first_point = FieldObjects.path.ctlpoints[idx + 3 * (offset - 1)];
                let second_point = FieldObjects.path.ctlpoints[idx + 3 * offset];

                let direction = offset > 0 ? 1 : -1;
                x_change = direction * (second_point.get_x() - first_point.get_x()) * 0.5;
                y_change = direction * (second_point.get_y() - first_point.get_y()) * 0.5;

                let new_coordinate = Utils.adjust_coordinate({
                    x: current_point.get_x(), 
                    y: current_point.get_y(), 
                    x_change: x_change,
                    y_change: y_change,
                    canvas: canvas
                });

                p4_x = new_coordinate.x;
                p4_y = new_coordinate.y;
                p3_x = p4_x + (p1_x - p2_x);
                p3_y = p4_y + (p1_y - p2_y);

                p5_x = p4_x - (p1_x - p2_x);
                p5_y = p4_y - (p1_y - p2_y);

                // direction handle points
                let p3 = new Point(p3_x, p3_y, 7, "#000000", false, true);
                let p5 = new Point(p5_x, p5_y, 7, "#000000", false, true);

                // new control point
                let p4 = new Point(p4_x, p4_y, 7, "#000000", true, false);

                FieldObjects.path.ctlpoints.splice(idx + 3 * (offset - 1) + 2, 0, p3);
                FieldObjects.path.ctlpoints.splice(idx + 3 * (offset - 1) + 3, 0, p4);
                FieldObjects.path.ctlpoints.splice(idx + 3 * (offset - 1) + 4, 0, p5);
            }
        }
        FieldObjects.path.update();
    }

    /**
     * Remove control point in the path
     *
     * @export
     * @param {Number} idx index of the point to remove
     * @memberof Path
     */
    remove_ctlpoint(idx) {
        const curve_type_input = document.getElementById("curve_type_input");
        if (curve_type_input.value === "catmull_rom") {
            FieldObjects.path.ctlpoints.splice(idx, 1);
        }
        else if (curve_type_input.value === "cubic_bezier") {
            if (FieldObjects.path.ctlpoints.length < 4) {
                FieldObjects.path.ctlpoints = [];
            }
            else if (idx === 0) {
                FieldObjects.path.ctlpoints.splice(idx, 2);
            }
            else if (idx === FieldObjects.path.ctlpoints.length - 1) {
                FieldObjects.path.ctlpoints.splice(idx - 2, 3);
            } else {
                FieldObjects.path.ctlpoints.splice(idx - 1, 3);
            }
        }

        FieldObjects.path.update();
    }

    /**
     * Remove the last control point in the path
     * 
     * @memberof Path
    */
    remove_last_ctlpoint() {
        FieldObjects.instage_ui.set_visibility(false);
        const curve_type_input = document.getElementById("curve_type_input");
        if (curve_type_input.value === "cubic_bezier") {
            FieldObjects.path.ctlpoints.pop();
            FieldObjects.path.ctlpoints.pop();
        }
        FieldObjects.path.ctlpoints.pop();
    }
}

export default Path;