var background_img = null;

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
    path.ctlpoints.push(new Point(x, y));
    update_path();
}

function update_output() {
    var output = "";
    switch (output_option.value) {
        case "ctlpoint":
            for (let p of path.ctlpoints) {
                var x = p.get_x() / canvas.width * (+field_width_input.value) - (+x_origin_input.value);
                var y = p.get_y() / canvas.height * (+field_width_input.value) - (+y_origin_input.value);
                if (y_inverse_input.checked) {
                    y *= -1;
                }
                output += output_prefix.value + x + output_midfix.value + y + output_suffix.value + "\n";
            }
            break;
        case "full":
            for (let p of path.fullpath) {
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

function update_path() {
    path.update();
    update_output();
    if (simulating) {
        toggle_simulation();
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

function handle_keydown(e) {
    let os = navigator.userAgent;
    // Undo adding control point
    if (e.key === "Escape") {
        path.ctlpoints.pop();
        path.update();
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
        if (path.fullpath.length > 1) { // path exists
            const orientation = Utils.format_angle(90 + Math.atan2(path.fullpath[1].get_y() - path.fullpath[0].get_y(), path.fullpath[1].get_x() - path.fullpath[0].get_x()) * 180 / Math.PI);
            update_robot_config();
            robot_position = {
                x : path.fullpath[0].get_x(), 
                y : path.fullpath[0].get_y(),
                theta : orientation,
            }

            robot = new Robot(robot_position, robot_appearance, robot_performance, pid_constants, lookahead_radius);
            objects.push(robot);
        } else {
            simulating = false;
            simulate_btn.innerHTML = "Simulate";
        }
    } else {
        objects.pop();
        simulate_btn.innerHTML = "Simulate";
    }
}

simulating = false;

document.onkeydown = handle_keydown;

canvas.addEventListener("mousemove", show_mouse_coordinate, false);

// add control point
canvas.addEventListener("mousedown", add_ctlpoint, false);
point_density_input.addEventListener("input", update_path, false);

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