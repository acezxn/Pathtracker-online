import FieldObjects from "./field_objects";
import Session from "./session";
import Point from "./drawable_objects/point";
import OutputManager from "./output_manager";

var leftdown = false;
var rightdown = false;
var ctlpoint_editing = null;

/**
 * Add control point
 * 
 * @param {number} x x coordinate
 * @param {number} y y coordinate
*/
function add_ctlpoint(x, y) {
    // input control poiont
    FieldObjects.path.ctlpoints.push(new Point(x, y));
    FieldObjects.path.update();
}


/**
 * Handle left clicks
 * 
 * @param {Event} e event
*/
function left_click(e) {
    var found = false;
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.clientWidth * canvas.width;
    const y = (e.clientY - rect.top) / canvas.clientHeight * canvas.height;
    const mouse_point = new Point(x, y);

    for (let wp of FieldObjects.path.ctlpoints) {
        if (wp.distance_to(mouse_point) <= wp.get_radius()) {
            found = true;
        }
    }
    if (!found) {
        add_ctlpoint(x, y);
    }
}

function right_click(e) {
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
    if (last_wp.distance_to(mouse_point) <= last_wp.get_radius()) {
        FieldObjects.path.ctlpoints.pop();
        FieldObjects.path.update();
    }
}

/**
 * Handle mouse down
 * 
 * @param {Event} e mouse down event
*/
function handle_mousedown(e) {
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
function handle_mouseup(e) {
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
function handle_mousemove(e) {
    OutputManager.show_mouse_coordinate(e);
    if (!leftdown) {
        return;
    }

    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.clientWidth * canvas.width;
    const y = (e.clientY - rect.top) / canvas.clientHeight * canvas.height;
    const mouse_point = new Point(x, y);

    if (ctlpoint_editing === null) {
        for (let wp of FieldObjects.path.ctlpoints) {
            if (wp.distance_to(mouse_point) <= wp.get_radius()) {
                ctlpoint_editing = wp;
                break;
            }
        }
    }
    if (ctlpoint_editing !== null) {
        ctlpoint_editing.set_coordinate(x, y);
        FieldObjects.path.update();
    }
}

function handle_ctxmenu(e) {
    e.preventDefault();
}

/**
 * handle key down
 * 
 * @param {Event} e keydown event
*/
function handle_keydown(e) {
    let os = navigator.userAgent;
    // undo adding control point
    if (e.key === "Escape") {
        FieldObjects.path.ctlpoints.pop();
        FieldObjects.path.update();
    }
    // download session file
    if ((os.search("Mac") !== -1 ? e.metaKey : e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        Session.download_sess();
    }
}

function handle_showgrid() {
    FieldObjects.grid.hidden = !FieldObjects.grid.hidden;
} 

/**
 * Set background image
 * 
 * @param {Event} e onchange event
*/
function set_background_img(e) {
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
function clear_background_img(e) {
    const img_input = document.getElementById("img_input");
    img_input.value = '';
    FieldObjects.background.set_img(null);
}

export {
    handle_mousedown,
    handle_mouseup,
    handle_mousemove,
    handle_ctxmenu,
    handle_keydown,
    handle_showgrid,
    set_background_img,
    clear_background_img
}