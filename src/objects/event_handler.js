import FieldObjects from "./field_objects";
import Session from "./session";
import Point from "./drawable_objects/point";
import OutputManager from "./output_manager";
import SimulationManager from "./simulation_manager";
import CtlpointUI from "./drawable_objects/UI/ctlpoint_ui";

var leftdown = false;
var rightdown = false;
var ctlpoint_editing_idx = -1;
var ctlpoint_editing = null;

/**
 * Add control point to the end of path
 * 
 * @param {number} x x coordinate
 * @param {number} y y coordinate
*/
export function add_ctlpoint(x, y) {
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
 */
export function insert_ctlpoint(idx, offset) {
    const curve_type_input = document.getElementById("curve_type_input");
    if (curve_type_input.value === "catmull_rom") {
        let current_point = FieldObjects.path.ctlpoints[idx];
        FieldObjects.path.ctlpoints.splice(idx + offset, 0, new Point(current_point.get_x(), current_point.get_y() + 100, 7, "#000000", true));
    }
    else if (curve_type_input.value === "cubic_bezier") {
        if (FieldObjects.path.ctlpoints.length < 4) {
            return;
        }
        // if inserting point at the end of the path
        if (idx + 3 * (offset - 1) + 1 >= FieldObjects.path.ctlpoints.length) {
            let current_point = FieldObjects.path.ctlpoints[idx];
            add_ctlpoint(current_point.get_x(), current_point.get_y() + 100);
            return;
        }

        let p1_x, p1_y, p2_x, p2_y, p3_x, p3_y, p4_x, p4_y, p5_x, p5_y;
        // if inserting in the beginning of the path
        if (idx === 0 && offset <= 0) {
            p1_x = FieldObjects.path.ctlpoints[idx].get_x();
            p1_y = FieldObjects.path.ctlpoints[idx].get_y();
            p2_x = FieldObjects.path.ctlpoints[idx + 1].get_x();
            p2_y = FieldObjects.path.ctlpoints[idx + 1].get_y();

            p5_x = p1_x;
            p5_y = p1_y + 100;

            p3_x = p1_x + (p1_x - p2_x);
            p3_y = p1_y + (p1_y - p2_y);

            p4_x = p5_x - (p1_x - p2_x);
            p4_y = p5_y - (p1_y - p2_y);

            

            // direction handle points
            let p3 = new Point(p3_x, p3_y, 7, "#000000", false, true);
            let p5 = new Point(p5_x, p5_y, 7, "#000000", false, true);

            // new control point
            let p4 = new Point(p4_x, p4_y, 7, "#000000", true, false);

            FieldObjects.path.ctlpoints.splice(idx, 0, p3);
            FieldObjects.path.ctlpoints.splice(idx, 0, p4);
            FieldObjects.path.ctlpoints.splice(idx, 0, p5);
        } else {
            p1_x = FieldObjects.path.ctlpoints[idx + 3 * (offset - 1)].get_x();
            p1_y = FieldObjects.path.ctlpoints[idx + 3 * (offset - 1)].get_y();
            p2_x = FieldObjects.path.ctlpoints[idx + 3 * (offset - 1) + 1].get_x();
            p2_y = FieldObjects.path.ctlpoints[idx + 3 * (offset - 1) + 1].get_y();
            p4_x = p1_x;
            p4_y = p1_y + 100;
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
 */
export function remove_ctlpoint(idx) {
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
        else if (idx === FieldObjects.path.ctlpoints.length-1) {
            FieldObjects.path.ctlpoints.splice(idx-2, 3);
        } else {
            FieldObjects.path.ctlpoints.splice(idx-1, 3);
        }
    }

    FieldObjects.path.update();
}

/**
 * Remove the last control point in the path
 * 
*/
function remove_last_ctlpoint() {
    FieldObjects.instage_ui.set_visibility(false);
    const curve_type_input = document.getElementById("curve_type_input");
    if (curve_type_input.value === "cubic_bezier") {
        FieldObjects.path.ctlpoints.pop();
        FieldObjects.path.ctlpoints.pop();
    }
    FieldObjects.path.ctlpoints.pop();
}

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
        add_ctlpoint(x, y);
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
        remove_last_ctlpoint();
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
        remove_last_ctlpoint();
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