import Point from "./point.js";
import Box from "./box.js";
import SessionData from "./session_data.js";
import SessionProcessor from "./session_processor.js";
import CatmullRom from "./catmull_rom.js";

// stage elements
const canvas = document.getElementById("Stage");
const ctx = canvas.getContext("2d");
const mouse_coordinate_field = document.getElementById("mouse_coordinate");

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


var session = new SessionData();
var session_processor = new SessionProcessor(session);
var ctlpoints = [];
var fullpath = [];

var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

function update_session() {
    // field related settings
    session.set_fieldwidth(+field_width_input.value);
    session.set_field_origin(+x_origin_input.value, +y_origin_input.value);
    session.set_y_inverse(y_inverse_input.checked);

    // color settings
    session.set_colors(
        start_color_input.value,
        end_color_input.value,
        ctlpoint_color_input.value,
        ctlpoint_open_color_input.value,
        robot_color_input.value
    );
    
    var processed_ctlpoints = []
    // add control points 
    for (let p of ctlpoints) {
        const x = p.get_x() / canvas.width;
        const y = p.get_y() / canvas.height;
        processed_ctlpoints.push(new Point(x, y, 3, p.get_color()));
    }
    session.set_ctlpoints(processed_ctlpoints);
    
    session_processor = new SessionProcessor(session);
}

function load_session() {
    const file_list = this.files;
    var fr = new FileReader();
    fr.onload = function (e) {
        var contents = e.target.result;
        const config = JSON.parse(contents);
        console.log(config);

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
    }
    fr.readAsText(this.files[0])
    sess_input.value = '';
}

/**
 * Create a file download
 * 
 * @param {string} filename file name
 * @param {string} text file content
 * 
*/
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
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
        // download("session.txt", output_textarea.value);
    }
}

document.onkeydown = handle_keydown;


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
    const x = (e.clientX - rect.left) - (+x_origin_input.value) / (+field_width_input.value) * canvas.width;
    const y = (e.clientY - rect.top) - (+y_origin_input.value) / (+field_width_input.value) * canvas.width;

    var converted_x = Math.round(x / canvas.width * (+field_width_input.value) * 100) / 100;
    var converted_y = Math.round(y / canvas.width * (+field_width_input.value) * 100) / 100;
    if (y_inverse_input.checked) {
        converted_y *= -1;
    }
    mouse_coordinate_field.innerText = "Coordinate: (" + converted_x + ",\t" + converted_y + ")";
}

function add_ctlpoint(e) {
    // input control poiont
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctlpoints.push(new Point(x, y));
    update_path();
}

function update_output() {
    var output = "";
    switch (output_option.value) {
        case "ctlpoint":
            for (let p of ctlpoints) {
                var x = p.get_x() / canvas.width * (+field_width_input.value) - (+x_origin_input.value);
                var y = p.get_y() / canvas.width * (+field_width_input.value) - (+y_origin_input.value);
                if (y_inverse_input.checked) {
                    y *= -1;
                }
                output += output_prefix.value + x + output_midfix.value + y + output_suffix.value + "\n";
            }
            break;
        case "full":
            for (let p of fullpath) {
                var x = p.get_x() / canvas.width * (+field_width_input.value) - (+x_origin_input.value);
                var y = p.get_y() / canvas.width * (+field_width_input.value) - (+y_origin_input.value);
                if (y_inverse_input.checked) {
                    y *= -1;
                }
                output += output_prefix.value + x + output_midfix.value + y + output_suffix.value + "\n";
            }
            break;
    }
    output_textarea.value = output;
}

function update_path() {
    // update full path
    var catmull = new CatmullRom(ctlpoints);
    fullpath = catmull.get_full_path(0.05);
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

function animate() {
    if (stop) {
        return;
    }
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw background image
        if (background_img != null) {
            ctx.drawImage(background_img, 0, 0, canvas.width, canvas.height);
        }
        draw_full_path(ctx);
    }
}

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

// mouse coordinate update
canvas.addEventListener("mousemove", show_mouse_coordinate, false);

// add control point
canvas.addEventListener('mousedown', add_ctlpoint, false);

// output update
x_origin_input.addEventListener('input', update_output, false);
y_origin_input.addEventListener('input', update_output, false);
y_inverse_input.addEventListener('change', update_output, false);
output_option.addEventListener("change", update_output, false);
output_prefix.addEventListener('input', update_output, false);
output_midfix.addEventListener('input', update_output, false);
output_suffix.addEventListener('input', update_output, false);


// file handling
img_input.addEventListener("change", handle_background, false);
clear_img_button.addEventListener("click", clear_image, false);
sess_input.addEventListener("change", load_session, false);

startAnimating(60);