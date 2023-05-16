import FieldObjects from "./field_objects";
import Session from "./session";
import Point from "./drawable_objects/point";
import OutputManager from "./output_manager";
import SimulationManager from "./simulation_manager";

var leftdown = false;
var rightdown = false;
var ctlpoint_editing_idx = -1;
var ctlpoint_editing = null;


/**
 * Handle left clicks
 * 
 * @param {Event} e event
*/
export function left_click(e) {
    var found = false;
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.clientWidth * canvas.width;
    const y = (e.clientY - rect.top) / canvas.clientHeight * canvas.height;
    const mouse_point = new Point(x, y);

    for (let i = 0; i < FieldObjects.path.ctlpoints.length; i++) {
        let wp = FieldObjects.path.ctlpoints[i];
        if (wp.distance_to(mouse_point) <= wp.get_radius() + 5) {
            found = true;
            if (wp.is_control_point) {
                FieldObjects.instage_ui.set_position(x, y);
                FieldObjects.instage_ui.set_ctlpoint_idx(i);
                FieldObjects.instage_ui.set_visibility(true);
            } else {
                FieldObjects.instage_ui.set_visibility(false);
            }
            break;
        }
    }
    if (!found && !FieldObjects.instage_ui.handle_mouseclick(x, y)) {
        FieldObjects.instage_ui.set_visibility(false);
        FieldObjects.path.add_ctlpoint(x, y);
    }
}

/**
 * Handle right clicks
 * 
 * @param {Event} e event
*/
export function right_click(e) {
    if (!rightdown) {
        return;
    }

    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.clientWidth * canvas.width;
    const y = (e.clientY - rect.top) / canvas.clientHeight * canvas.height;
    const mouse_point = new Point(x, y);

    const last_wp = FieldObjects.path.ctlpoints[FieldObjects.path.ctlpoints.length - 1]

    // undo add control point
    if (last_wp.distance_to(mouse_point) <= last_wp.get_radius() + 5) {
        FieldObjects.path.remove_last_ctlpoint();
        FieldObjects.path.update();
    }
}

/**
 * Handle mouse down
 * 
 * @param {Event} e mouse down event
*/
export function handle_mousedown(e) {
    if (e.button === 0) {
        leftdown = true;
        left_click(e);
    }
    else if (e.button === 2) {
        rightdown = true;
        right_click(e);
    }
}


/**
 * Handle mouse up
 * 
 * @param {Event} e mouse up event
*/
export function handle_mouseup(e) {
    if (e.button === 0) {
        leftdown = false;
    }
    else if (e.button === 2) {
        rightdown = false;
    }
    ctlpoint_editing = null;
}


/**
 * Handle mouse move
 * 
 * @param {Event} e mouse move event
*/
export function handle_mousemove(e) {
    OutputManager.show_mouse_coordinate(e);
    if (!leftdown) {
        const canvas = e.target;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / canvas.clientWidth * canvas.width;
        const y = (e.clientY - rect.top) / canvas.clientHeight * canvas.height;

        if (FieldObjects.instage_ui.get_visibility()) {
            let desc_text = FieldObjects.instage_ui.handle_hover_description(x, y);
            if (desc_text !== "") {
                FieldObjects.description.set_position(x, y);
                FieldObjects.description.text = desc_text;
                FieldObjects.description.set_visibility(true);
            } else {
                FieldObjects.description.set_visibility(false);
            }
        } else {
            FieldObjects.description.set_visibility(false);
        }

        return;
    }

    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.clientWidth * canvas.width;
    const y = (e.clientY - rect.top) / canvas.clientHeight * canvas.height;
    const mouse_point = new Point(x, y);

    FieldObjects.instage_ui.set_visibility(false);
    FieldObjects.instage_ui.set_position(x, y);

    if (ctlpoint_editing === null) {
        for (let i = 0; i < FieldObjects.path.ctlpoints.length; i++) {
            let wp = FieldObjects.path.ctlpoints[i];
            if (wp.distance_to(mouse_point) <= wp.get_radius() + 5) {
                ctlpoint_editing = wp;
                ctlpoint_editing_idx = i;
                break;
            }
        }
    }

    if (ctlpoint_editing !== null) {
        let x_dist = mouse_point.get_x() - ctlpoint_editing.get_x();
        let y_dist = mouse_point.get_y() - ctlpoint_editing.get_y();

        if (FieldObjects.path.algorithm === "cubic_bezier" && ctlpoint_editing_idx % 3 === 0) {
            if (ctlpoint_editing_idx > 0) {
                let first_x = FieldObjects.path.ctlpoints[ctlpoint_editing_idx - 1].get_x();
                let first_y = FieldObjects.path.ctlpoints[ctlpoint_editing_idx - 1].get_y();
                FieldObjects.path.ctlpoints[ctlpoint_editing_idx - 1].set_coordinate(first_x + x_dist, first_y + y_dist);
            }
            if (ctlpoint_editing_idx < FieldObjects.path.ctlpoints.length - 1) {
                let second_x = FieldObjects.path.ctlpoints[ctlpoint_editing_idx + 1].get_x();
                let second_y = FieldObjects.path.ctlpoints[ctlpoint_editing_idx + 1].get_y();
                FieldObjects.path.ctlpoints[ctlpoint_editing_idx + 1].set_coordinate(second_x + x_dist, second_y + y_dist);
            }
        }
        else if (FieldObjects.path.algorithm === "cubic_bezier" && ctlpoint_editing_idx % 3 === 1) {
            if (ctlpoint_editing_idx > 1) {
                let second_x = FieldObjects.path.ctlpoints[ctlpoint_editing_idx - 2].get_x();
                let second_y = FieldObjects.path.ctlpoints[ctlpoint_editing_idx - 2].get_y();
                FieldObjects.path.ctlpoints[ctlpoint_editing_idx - 2].set_coordinate(second_x - x_dist, second_y - y_dist);
            }
        }
        else if (FieldObjects.path.algorithm === "cubic_bezier" && ctlpoint_editing_idx % 3 === 2) {
            if (ctlpoint_editing_idx < FieldObjects.path.ctlpoints.length - 2) {
                let second_x = FieldObjects.path.ctlpoints[ctlpoint_editing_idx + 2].get_x();
                let second_y = FieldObjects.path.ctlpoints[ctlpoint_editing_idx + 2].get_y();
                FieldObjects.path.ctlpoints[ctlpoint_editing_idx + 2].set_coordinate(second_x - x_dist, second_y - y_dist);
            }
        }
        ctlpoint_editing.set_coordinate(x, y);
        FieldObjects.path.update();
    }
}

/**
 * Handle context menu
 * 
 * @param {Event} e event
*/
export function handle_ctxmenu(e) {
    e.preventDefault();
}

/**
 * handle key down
 * 
 * @param {Event} e keydown event
*/
export function handle_keydown(e) {
    let os = navigator.userAgent;
    // undo adding control point
    if (e.key === "Escape") {
        FieldObjects.path.remove_last_ctlpoint();
        FieldObjects.path.update();
    }
    // download session file
    if ((os.search("Mac") !== -1 ? e.metaKey : e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        Session.download_sess();
    }
}


/**
 * handle grid showing events
 *
 */
export function handle_showgrid() {
    FieldObjects.grid.hidden = !FieldObjects.grid.hidden;
}

/**
 * Set background image
 * 
 * @param {Event} e onchange event
*/
export function set_background_img(e) {
    const file_list = e.target.files;
    var background_img = new Image();
    background_img.src = URL.createObjectURL(file_list[0]);
    FieldObjects.background.set_img(background_img);
}

/**
 * Clear background image
 * 
 * @param {Event} e onclick event
*/
export function clear_background_img(e) {
    const img_input = document.getElementById("img_input");
    img_input.value = '';
    FieldObjects.background.set_img(null);
}

/**
 * Clear everything on the path
 * 
 * @param {Event} e event
*/
export function clear_path(e) {
    FieldObjects.instage_ui.set_visibility(false);
    if (SimulationManager.simulating) {
        SimulationManager.toggle_simulation();
    }
    FieldObjects.path.reset();
}

/**
 * Handle path generation algorithm change
 * 
 * @param {Event} e event
*/
export function handle_pathalgo_change(e) {
    if (SimulationManager.simulating) {
        SimulationManager.toggle_simulation();
    }
    FieldObjects.path.reset();
    console.log(e.target.value);
    if (e.target.value === "catmull_rom") {
        FieldObjects.path.set_algorithm(e.target.value);
    }
    else if (e.target.value === "cubic_bezier") {
        FieldObjects.path.set_algorithm(e.target.value);
    }
}