import Utils from "./utils.js";
import Point from "./point.js";
import Robot from "./robot.js";
import SessionProcessor from "./session_processor.js";
import CatmullRom from "./algorithms/catmull_rom.js";

// stage elements
const canvas = document.getElementById("Stage");
const ctx = canvas.getContext("2d");
const mouse_coordinate_field = document.getElementById("mouse_coordinate");

// session objects
var session = {
    // field settings
    fieldwidth : 0,
    field_origin_x : 0,
    field_origin_y : 0,
    inverse_y : false,

    // color settings
    path_start_color : "#000000",
    path_end_color : "#000000",
    ctlpoint_color : "#000000",
    open_ctlpoint_color : "#000000",
    robot_color : "#000000",

    // robot settings
    robot_width : 0,
    robot_height : 0,
    max_velocity : 0,
    max_acceleration : 0,

    // pure pursuit
    lookahead_radius : 0,
    pid_constants : {
        kPT : 0,
        kIT : 0,
        kDT : 0,
        kPR : 0,
        kIR : 0,
        kDR : 0,
    },

    // coordinate data
    ctlpoints : [],
}
var session_processor = new SessionProcessor(session);

/* 
==========================================================
Settings
==========================================================
*/

const sess_input = document.getElementById("sess_input");

// output related elements
const output_option = document.getElementById("output_option");
const output_textarea = document.getElementById("output_textarea");
const output_prefix = document.getElementById("output_prefix");
const output_midfix = document.getElementById("output_midfix");
const output_suffix = document.getElementById("output_suffix");

// stage related settings elements
const field_width_input = document.getElementById("field_width");
const img_input = document.getElementById('img_input');
const clear_img_button = document.getElementById("clear_img");
const x_origin_input = document.getElementById("x_origin_input");
const y_origin_input = document.getElementById("y_origin_input");
const y_inverse_input = document.getElementById("y_inverse_input");
var background_img = null;

// color related settings elements
const start_color_input = document.getElementById("start_color_input");
const end_color_input = document.getElementById("end_color_input");
const ctlpoint_color_input = document.getElementById("ctlpoint_color_input");
const ctlpoint_open_color_input = document.getElementById("ctlpoint_open_color_input");
const robot_color_input = document.getElementById("robot_color_input");

// robot related settings elements
const robot_width_input = document.getElementById("robot_width_input");
const robot_length_input = document.getElementById("robot_length_input");
const max_velocity_input = document.getElementById("max_velocity_input");
const max_accel_input = document.getElementById("max_accel_input");

// pure pursuit settings elements
const lookahead_radius_input = document.getElementById("lookahead_radius_input");
const kPT_input = document.getElementById("kPT_input");
const kIT_input = document.getElementById("kIT_input");
const kDT_input = document.getElementById("kDT_input");
const kPR_input = document.getElementById("kPR_input");
const kIR_input = document.getElementById("kIR_input");
const kDR_input = document.getElementById("kDR_input");

const point_density_input = document.getElementById("point_density_input");

/* 
==========================================================
Simulation
==========================================================
*/

// rendering
var stop = false;
var frameCount = 0;
var target_fps = 60, fpsInterval, startTime, now, then, elapsed;

// object simulation
var simulate_btn        = document.getElementById("simulate_btn");
var robot;                                           // the robot object
var robot_position = {
    x : 0,
    y : 0,
    theta : 0,
}
var robot_appearance = {
    width : 0,
    length : 0,
    color : robot_color_input.value,
}
var robot_performance = {
    max_velocity : 0,
    max_acceleration : 0,
}
var pid_constants = {
    kPT : 300,
    kIT : 0,
    kDT : 0,
    kPR : 300,
    kIR : 0,
    kDR : 0,
}

var simulating          = false;                     // whether simulation is ongoing
var dt                  = 1/target_fps;              // time unit
var lookahead_radius    = +lookahead_radius_input.value;
var ctlpoints           = [];                        // control points
var fullpath            = [];                        // full path

function update_session() {
    update_robot_config();
    var processed_ctlpoints = []
    // add control points 
    for (let p of ctlpoints) {
        const x = p.get_x() / canvas.width;
        const y = p.get_y() / canvas.height;
        processed_ctlpoints.push(new Point(x, y, p.get_radius(), p.get_color()));
    }
    session = {
        // field settings
        fieldwidth : +field_width_input.value,
        field_origin_x : +x_origin_input.value,
        field_origin_y : +y_origin_input.value,
        inverse_y : y_inverse_input.checked,
    
        // color settings
        path_start_color : start_color_input.value,
        path_end_color : end_color_input.value,
        ctlpoint_color : ctlpoint_color_input.value,
        open_ctlpoint_color : ctlpoint_open_color_input.value,
        robot_color : robot_color_input.value,

        // robot settings
        robot_width : Utils.pixels_to_meter(robot_appearance.width, +field_width_input.value, canvas.width),
        robot_length : Utils.pixels_to_meter(robot_appearance.length, +field_width_input.value, canvas.width),
        max_velocity : Utils.pixels_to_meter(robot_performance.max_velocity, +field_width_input.value, canvas.width),
        max_acceleration : Utils.pixels_to_meter(robot_performance.max_acceleration, +field_width_input.value, canvas.width),

        // pure pursuit
        lookahead_radius : +lookahead_radius_input.value,
        pid_constants : {
            kPT : pid_constants.kPT,
            kIT : pid_constants.kIT,
            kDT : pid_constants.kDT,
            kPR : pid_constants.kPR,
            kIR : pid_constants.kIR,
            kDR : pid_constants.kDR,
        },
        
        // coordinate data
        ctlpoints : processed_ctlpoints,
    }    
    session_processor = new SessionProcessor(session);
}

function load_session() {
    const file_list = this.files;
    var fr = new FileReader();
    fr.onload = function (e) {
        var contents = e.target.result;
        const config = JSON.parse(contents);

        // field related settings
        field_width_input.value = config.settings.field_related.fieldwidth;
        x_origin_input.value = config.settings.field_related.field_origin_x;
        y_origin_input.value = config.settings.field_related.field_origin_y;
        y_inverse_input.checked = config.settings.field_related.inverse_y;


        // color settings
        start_color_input.value         = config.settings.color_settings.path_start_color;
        end_color_input.value           = config.settings.color_settings.path_end_color;
        ctlpoint_color_input.value      = config.settings.color_settings.ctlpoint_color;
        ctlpoint_open_color_input.value = config.settings.color_settings.open_ctlpoint_color;
        robot_color_input.value         = config.settings.color_settings.robot_color;

        // robot settings
        robot_width_input.value         = config.settings.robot_settings.robot_width;
        robot_length_input.value        = config.settings.robot_settings.robot_length;
        max_velocity_input.value        = config.settings.robot_settings.max_velocity;
        max_accel_input.value           = config.settings.robot_settings.max_acceleration;

        // pure pursuit
        lookahead_radius_input.value    = config.settings.pure_pursuit.lookahead_radius;
        kPT_input.value                 = config.settings.pid_constants.kPT;
        kIT_input.value                 = config.settings.pid_constants.kIT;
        kDT_input.value                 = config.settings.pid_constants.kDT;
        kPR_input.value                 = config.settings.pid_constants.kPR;
        kIR_input.value                 = config.settings.pid_constants.kIR;
        kDR_input.value                 = config.settings.pid_constants.kDR;


        // load control points
        const ctlpoint_data             = config.data.ctlpoints;
        ctlpoints = []
        for (let p of ctlpoint_data) {
            const x = p.x * canvas.width;
            const y = p.y * canvas.height;
            const radius = +p.radius;
            const color = p.fill_color;
            ctlpoints.push(new Point(x, y, radius, color));
        }
        update_path();
        update_output();
        update_robot_config();
        update_session();
    }
    fr.readAsText(this.files[0])
    sess_input.value = '';
}


function handle_keydown(e) {
    let os = navigator.userAgent;
    // Undo adding control point
    if (e.key === "Escape") {
        ctlpoints.pop();
        update_path();
    }
    // Download session file
    if ((os.search("Mac") !== -1 ? e.metaKey : e.ctrlKey) && e.key == 's') {
        e.preventDefault();
        update_session();
        session_processor.download_sess();
    }
}

function toggle_simulation() {
    simulating = !simulating;

    if (simulating) {
        simulate_btn.innerHTML = "Stop";
        if (fullpath.length > 1) { // path exists
            const orientation = Utils.format_angle(90 + Math.atan2(fullpath[1].get_y() - fullpath[0].get_y(), fullpath[1].get_x() - fullpath[0].get_x()) * 180 / Math.PI);
            update_robot_config();
            robot_position = {
                x : fullpath[0].get_x(), 
                y : fullpath[0].get_y(),
                theta : orientation,
            }

            robot = new Robot(robot_position, robot_appearance, robot_performance, pid_constants, lookahead_radius);
        } else {
            simulating = false;
            simulate_btn.innerHTML = "Simulate";
        }
    } else {
        simulate_btn.innerHTML = "Simulate";
    }
}

function handle_background() {
    // handle image uploads
    const file_list = this.files;
    background_img = new Image;
    background_img.src = URL.createObjectURL(file_list[0]);
}

function clear_image() {
    img_input.value = '';
    background_img = null;
}

function show_mouse_coordinate(e) {
    // print mouse coordinate to the screen
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) - (+x_origin_input.value) / (+field_width_input.value) * canvas.clientWidth;
    const y = (e.clientY - rect.top) - (+y_origin_input.value) / (+field_width_input.value) * canvas.clientWidth;

    var converted_x = Math.round(x / canvas.clientWidth * (+field_width_input.value) * 100) / 100;
    var converted_y = Math.round(y / canvas.clientWidth * (+field_width_input.value) * 100) / 100;
    if (y_inverse_input.checked) {
        converted_y *= -1;
    }
    mouse_coordinate_field.innerText = "Coordinate: (" + converted_x + ",\t" + converted_y + ")";
}

function add_ctlpoint(e) {
    // input control poiont
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.clientWidth * canvas.width;
    const y = (e.clientY - rect.top) / canvas.clientHeight * canvas.height;
    ctlpoints.push(new Point(x, y));
    update_path();
}

function update_output() {
    var output = "";
    switch (output_option.value) {
        case "ctlpoint":
            for (let p of ctlpoints) {
                var x = p.get_x() / canvas.width * (+field_width_input.value) - (+x_origin_input.value);
                var y = p.get_y() / canvas.height * (+field_width_input.value) - (+y_origin_input.value);
                if (y_inverse_input.checked) {
                    y *= -1;
                }
                output += output_prefix.value + x + output_midfix.value + y + output_suffix.value + "\n";
            }
            break;
        case "full":
            for (let p of fullpath) {
                var x = p.get_x() / canvas.width * (+field_width_input.value) - (+x_origin_input.value);
                var y = p.get_y() / canvas.height * (+field_width_input.value) - (+y_origin_input.value);
                if (y_inverse_input.checked) {
                    y *= -1;
                }
                output += output_prefix.value + x + output_midfix.value + y + output_suffix.value + "\n";
            }
            break;
    }
    output_textarea.value = output;
}

function update_robot_config() {
    robot_appearance = {
        width : Utils.meters_to_pixel(+robot_width_input.value, +field_width_input.value, canvas.width),
        length : Utils.meters_to_pixel(+robot_length_input.value, +field_width_input.value, canvas.width),
        color : robot_color_input.value,
    }

    robot_performance = {
        max_velocity : Utils.meters_to_pixel(+max_velocity_input.value, +field_width_input.value, canvas.width),
        max_acceleration : Utils.meters_to_pixel(+max_accel_input.value, +field_width_input.value, canvas.width),
    }

    pid_constants = {
        kPT : +kPT_input.value,
        kIT : +kIT_input.value,
        kDT : +kDT_input.value,
        kPR : +kPR_input.value,
        kIR : +kIR_input.value,
        kDR : +kDR_input.value,
    }

    lookahead_radius = Utils.meters_to_pixel(+lookahead_radius_input.value, +field_width_input.value, canvas.width);
}

function update_path() {
    // update full path
    var catmull = new CatmullRom(ctlpoints);
    fullpath = catmull.get_full_path(1/(+point_density_input.value));
    if (simulating) {
        toggle_simulation();
    }
    update_output();
}

function draw_full_path(ctx) {
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
    var r_increment = (end_color_value[0] - start_color_value[0]) / fullpath.length;
    var g_increment = (end_color_value[1] - start_color_value[1]) / fullpath.length;
    var b_increment = (end_color_value[2] - start_color_value[2]) / fullpath.length;

    for (let i = 0; i < fullpath.length; i++) {
        var r = start_color_value[0] + i * r_increment;
        var g = start_color_value[1] + i * g_increment;
        var b = start_color_value[2] + i * b_increment;
        var current_color = "rgb(" + r + "," + g + "," + b + ")";
        fullpath[i].set_color(current_color);
        fullpath[i].render(ctx);
        if (i > 0) {
            ctx.beginPath();
            ctx.moveTo(fullpath[i - 1].get_x(), fullpath[i - 1].get_y());
            ctx.lineTo(fullpath[i].get_x(), fullpath[i].get_y());
            ctx.strokeStyle = current_color;
            ctx.stroke();
        }
    }

    // draw control points
    for (let i = 0; i < ctlpoints.length; i++) {
        if (i === 0 || i === ctlpoints.length - 1) {
            ctlpoints[i].set_color(ctlpoint_open_color_input.value);
        } else {
            ctlpoints[i].set_color(ctlpoint_color_input.value);
        }
        if (i === 0 && i + 1 < ctlpoints.length) {
            ctx.beginPath();
            ctx.moveTo(ctlpoints[i].get_x(), ctlpoints[i].get_y());
            ctx.lineTo(ctlpoints[i + 1].get_x(), ctlpoints[i + 1].get_y());
            ctx.strokeStyle = ctlpoint_open_color_input.value
            ctx.stroke();
        }
        if (i + 1 === ctlpoints.length - 1) {
            ctx.beginPath();
            ctx.moveTo(ctlpoints[i].get_x(), ctlpoints[i].get_y());
            ctx.lineTo(ctlpoints[i + 1].get_x(), ctlpoints[i + 1].get_y());
            ctx.strokeStyle = ctlpoint_open_color_input.value
            ctx.stroke();
        }
        ctlpoints[i].render(ctx);
    }
}

function draw_robot(ctx) {
    if (simulating) {
        const finished = robot.follow_path(fullpath, dt);
        if (finished) {
            toggle_simulation();
        }
        robot.set_color(robot_color_input.value);
        robot.render(ctx);
    } else {
        robot = null;
    }
}

function animate() {
    if (stop) {
        return;
    }
    requestAnimationFrame(animate);
    now = performance.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw background image
        if (background_img != null) {
            ctx.drawImage(background_img, 0, 0, canvas.width, canvas.height);
        }

        // draw full path
        draw_full_path(ctx);

        // draw robot
        draw_robot(ctx);
    }
}

function startAnimating(target_fps) {
    fpsInterval = 1000 / target_fps;
    then = performance.now();
    startTime = then;
    animate();
}

ctx.lineWidth = 2;
document.onkeydown = handle_keydown;

// mouse coordinate update
canvas.addEventListener("mousemove", show_mouse_coordinate, false);

// add control point
canvas.addEventListener("mousedown", add_ctlpoint, false);
point_density_input.addEventListener("input", update_path, false);

// output update
x_origin_input.addEventListener("input", update_output, false);
y_origin_input.addEventListener("input", update_output, false);
y_inverse_input.addEventListener('change', update_output, false);
output_option.addEventListener("change", update_output, false);
output_prefix.addEventListener("input", update_output, false);
output_midfix.addEventListener("input", update_output, false);
output_suffix.addEventListener("input", update_output, false);

// file handling
img_input.addEventListener("change", handle_background, false);
clear_img_button.addEventListener("click", clear_image, false);
sess_input.addEventListener("change", load_session, false);

// simulation
simulate_btn.addEventListener("click", toggle_simulation, false);

startAnimating(target_fps);