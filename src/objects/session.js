import FieldObjects from "./field_objects";
import Point from "./drawable_objects/point";

class Session {
    /**
     * Download string to file
     * 
     * @param {string} filename filename to download
     * @param {string} text file content
    */
    static download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
    
        element.style.display = 'none';
        document.body.appendChild(element);
    
        element.click();
    
        document.body.removeChild(element);
    }
    
    /**
     * Download current session
     *
     * @static
     * @memberof Session
     */
    static download_sess() {
        const curve_type_input = document.getElementById("curve_type_input");
        // stage related settings elements
        const canvas = document.getElementById("Stage");
        const field_width_input = document.getElementById("field_width");
        const coord_per_dimension_input = document.getElementById("coord_per_dimension");
        const x_origin_input = document.getElementById("x_origin_input");
        const y_origin_input = document.getElementById("y_origin_input");
        const y_inverse_input = document.getElementById("y_inverse_input");
    
        // color related settings elements
        const start_color_input = document.getElementById("start_color_input");
        const end_color_input = document.getElementById("end_color_input");
        const ctlpoint_color_input = document.getElementById("ctlpoint_color_input");
        const ctlpoint_open_color_input = document.getElementById("ctlpoint_open_color_input");
        const robot_color_input = document.getElementById("robot_color_input");
        const trackvel_color_input = document.getElementById("trackvel_color_input");
    
        // robot related settings elements
        const robot_width_input = document.getElementById("robot_width_input");
        const robot_length_input = document.getElementById("robot_length_input");
        const facing_input = document.getElementById("facing_input");
        const max_velocity_input = document.getElementById("max_velocity_input");
        const max_accel_input = document.getElementById("max_accel_input");
        const max_jerk_input = document.getElementById("max_jerk_input");

        // pure pursuit settings elements
        const lookahead_radius_input = document.getElementById("lookahead_radius_input");
        const kPT_input = document.getElementById("kPT_input");
        const kIT_input = document.getElementById("kIT_input");
        const kDT_input = document.getElementById("kDT_input");
        const kPR_input = document.getElementById("kPR_input");
        const kIR_input = document.getElementById("kIR_input");
        const kDR_input = document.getElementById("kDR_input");
    
        var processed_ctlpoints = []
        // add control points 
        for (let p of FieldObjects.path.ctlpoints) {
            const x = p.get_x() / canvas.width;
            const y = p.get_y() / canvas.height;
            processed_ctlpoints.push(new Point(x, y, p.get_radius(), p.get_color()));
        }
    
        const config = {
            settings: {
                path_generation: {
                    curve_type: curve_type_input.value,
                },
                field_related: {
                    fieldwidth: field_width_input.value,
                    coord_per_dimeinsion: coord_per_dimension_input.value,
                    field_origin_x: x_origin_input.value,
                    field_origin_y: y_origin_input.value,
                    inverse_y: y_inverse_input.checked,
                },
                color_settings: {
                    path_start_color: start_color_input.value,
                    path_end_color: end_color_input.value,
                    ctlpoint_color: ctlpoint_color_input.value,
                    open_ctlpoint_color: ctlpoint_open_color_input.value,
                    robot_color: robot_color_input.value,
                    velocity_color: trackvel_color_input.value,
                },
                robot_settings: {
                    robot_width: robot_width_input.value,
                    robot_length: robot_length_input.value,
                    facing: facing_input.value,
                    max_velocity: max_velocity_input.value,
                    max_acceleration: max_accel_input.value,
                    max_jerk: max_jerk_input.value,
                },
                pid_constants: {
                    kPT: kPT_input.value,
                    kIT: kIT_input.value,
                    kDT: kDT_input.value,
                    kPR: kPR_input.value,
                    kIR: kIR_input.value,
                    kDR: kDR_input.value,
                },
                pure_pursuit: {
                    lookahead_radius: lookahead_radius_input.value,
                },
            },
            data: {
                // note: the values are ratios of the canva's width
                ctlpoints: processed_ctlpoints,
            }
        }
    
    
        const json = JSON.stringify(config, null, 2);
        this.download("session.json", json);
    }
    
    /**
     * Load uploaded session
     *
     * @static
     * @param {Event} e event
     * @memberof Session
     */
    static load_session(e) {
        const curve_type_input = document.getElementById("curve_type_input");
        // stage related settings elements
        const canvas = document.getElementById("Stage");
        const field_width_input = document.getElementById("field_width");
        const coord_per_dimension_input = document.getElementById("coord_per_dimension");
        const x_origin_input = document.getElementById("x_origin_input");
        const y_origin_input = document.getElementById("y_origin_input");
        const y_inverse_input = document.getElementById("y_inverse_input");
    
        // color related settings elements
        const start_color_input = document.getElementById("start_color_input");
        const end_color_input = document.getElementById("end_color_input");
        const ctlpoint_color_input = document.getElementById("ctlpoint_color_input");
        const ctlpoint_open_color_input = document.getElementById("ctlpoint_open_color_input");
        const robot_color_input = document.getElementById("robot_color_input");
        const trackvel_color_input = document.getElementById("trackvel_color_input");
    
        // robot related settings elements
        const robot_width_input = document.getElementById("robot_width_input");
        const robot_length_input = document.getElementById("robot_length_input");
        const facing_input = document.getElementById("facing_input");
        const max_velocity_input = document.getElementById("max_velocity_input");
        const max_accel_input = document.getElementById("max_accel_input");
        const max_jerk_input = document.getElementById("max_jerk_input");
    
        // pure pursuit settings elements
        const lookahead_radius_input = document.getElementById("lookahead_radius_input");
        const kPT_input = document.getElementById("kPT_input");
        const kIT_input = document.getElementById("kIT_input");
        const kDT_input = document.getElementById("kDT_input");
        const kPR_input = document.getElementById("kPR_input");
        const kIR_input = document.getElementById("kIR_input");
        const kDR_input = document.getElementById("kDR_input");
    
        const sess_input = document.getElementById("sess_input");
        const file_list = e.target.files;
        var fr = new FileReader();
        fr.onload = function (e) {
            var contents = e.target.result;
            const config = JSON.parse(contents);

            curve_type_input.value = config.settings.path_generation.curve_type;
    
            // field related settings
            field_width_input.value = config.settings.field_related.fieldwidth;
            coord_per_dimension_input.value = config.settings.field_related.coord_per_dimeinsion;

            x_origin_input.value = config.settings.field_related.field_origin_x;
            y_origin_input.value = config.settings.field_related.field_origin_y;
            y_inverse_input.checked = config.settings.field_related.inverse_y;
    
    
            // color settings
            start_color_input.value = config.settings.color_settings.path_start_color;
            end_color_input.value = config.settings.color_settings.path_end_color;
            ctlpoint_color_input.value = config.settings.color_settings.ctlpoint_color;
            ctlpoint_open_color_input.value = config.settings.color_settings.open_ctlpoint_color;
            robot_color_input.value = config.settings.color_settings.robot_color;
            trackvel_color_input.value = config.settings.color_settings.velocity_color;
    
            // robot settings
            robot_width_input.value = config.settings.robot_settings.robot_width;
            robot_length_input.value = config.settings.robot_settings.robot_length;
            facing_input.value = config.settings.robot_settings.facing;
            max_velocity_input.value = config.settings.robot_settings.max_velocity;
            max_accel_input.value = config.settings.robot_settings.max_acceleration;
            max_jerk_input.value = config.settings.robot_settings.max_jerk;

            // pure pursuit
            lookahead_radius_input.value = config.settings.pure_pursuit.lookahead_radius;
            kPT_input.value = config.settings.pid_constants.kPT;
            kIT_input.value = config.settings.pid_constants.kIT;
            kDT_input.value = config.settings.pid_constants.kDT;
            kPR_input.value = config.settings.pid_constants.kPR;
            kIR_input.value = config.settings.pid_constants.kIR;
            kDR_input.value = config.settings.pid_constants.kDR;
    
            if (curve_type_input.value === "catmull_rom") {
                FieldObjects.path.set_algorithm(curve_type_input.value);
            }
            else if (curve_type_input.value === "cubic_bezier") {
                FieldObjects.path.set_algorithm(curve_type_input.value);
            }

            // load control points
            const ctlpoint_data = config.data.ctlpoints;
            FieldObjects.path.ctlpoints = []
            for (let p of ctlpoint_data) {
                const x = p.x * canvas.width;
                const y = p.y * canvas.height;
                const radius = +p.radius;
                const color = p.fill_color;
                FieldObjects.path.ctlpoints.push(new Point(x, y, radius, color));
            }
            FieldObjects.path.update();
            // update_robot_config();
        }
        fr.readAsText(file_list[0])
        sess_input.value = '';
    }
}

export default Session;