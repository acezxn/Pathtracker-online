import Point from "./point.js";
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

// output related elements
const output_option = document.getElementById("output_option");
const output_textarea = document.getElementById("output_textarea");

// stage related settings elements
const field_width_input = document.getElementById("field_width");
const img_input = document.getElementById('img_input');
const clear_img_button = document.getElementById("clear_img");
const x_origin_input = document.getElementById("x_origin_input");
const y_origin_input = document.getElementById("y_origin_input");
var background_img = null;

// color related settings elements
const start_color_input = document.getElementById("start_color_input");
const end_color_input = document.getElementById("end_color_input");
const ctlpoint_color_input = document.getElementById("ctlpoint_color_input");
const ctlpoint_open_color_input = document.getElementById("ctlpoint_open_color_input");
const y_inverse_input = document.getElementById("y_inverse_input");

var ctlpoints = [];
var fullpath  = [];
document.onkeydown = function (e) {
    if (e.key === "Escape") {
        ctlpoints.pop();
        update_path();
    }
}

function handle_files() {
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
                output += "(" + x + ", " + y + ")\n"
            }
            break;
        case "full":
            for (let p of fullpath) {
                var x = p.get_x() / canvas.width * (+field_width_input.value) - (+x_origin_input.value);
                var y = p.get_y() / canvas.width * (+field_width_input.value) - (+y_origin_input.value);
                if (y_inverse_input.checked) {
                    y *= -1;
                }
                output += "(" + x + ", " + y + ")\n"
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
    const red_value_start = parseInt(start_color.substr(1,2), 16);
    const green_value_start = parseInt(start_color.substr(3,2), 16);
    const blue_value_start = parseInt(start_color.substr(5,2), 16);
    const red_value_end = parseInt(end_color.substr(1,2), 16);
    const green_value_end = parseInt(end_color.substr(3,2), 16);
    const blue_value_end = parseInt(end_color.substr(5,2), 16);

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
            ctx.moveTo(fullpath[i - 1].get_x(), fullpath[i - 1].get_y());
            ctx.lineTo(fullpath[i].get_x(), fullpath[i].get_y());
            ctx.strokeStyle = current_color;
            ctx.stroke();
        }
    }

    // draw control points
    for (let i = 0; i < ctlpoints.length; i++) {
        if (i == 0 || i == ctlpoints.length - 1) {
            ctlpoints[i].set_color(ctlpoint_open_color_input.value);
        } else {
            ctlpoints[i].set_color(ctlpoint_color_input.value);
        }
        if (i == 0 && i + 1 < ctlpoints.length) {
            ctx.moveTo(ctlpoints[i].get_x(), ctlpoints[i].get_y());
            ctx.lineTo(ctlpoints[i + 1].get_x(), ctlpoints[i + 1].get_y());
            ctx.strokeStyle = ctlpoint_open_color_input.value
            ctx.stroke();
        }
        if (i == ctlpoints.length - 1 && i - 1 >= 0) {
            ctx.moveTo(ctlpoints[i - 1].get_x(), ctlpoints[i - 1].get_y());
            ctx.lineTo(ctlpoints[i].get_x(), ctlpoints[i].get_y());
            ctx.strokeStyle = ctlpoint_open_color_input.value
            ctx.stroke();
        }
        ctlpoints[i].render(ctx);
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);

    // draw background image
    if (background_img != null) {
        ctx.drawImage(background_img, 0, 0, canvas.width, canvas.height);
    }
    draw_full_path(ctx);
}
canvas.addEventListener("mousemove", show_mouse_coordinate, false);
canvas.addEventListener('mousedown', add_ctlpoint, false);
x_origin_input.addEventListener('input', update_output, false);
y_origin_input.addEventListener('input', update_output, false);
y_inverse_input.addEventListener('change', update_output, false);
output_option.addEventListener("change", update_output, false);
img_input.addEventListener("change", handle_files, false);
clear_img_button.addEventListener("click", clear_image, false);

animate();