import FieldObjects from "./field_objects";
import Session from "./session";
import Point from "./drawable_objects/point";

/**
 * Add control point
*/
function add_ctlpoint(e) {
    // input control poiont
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.clientWidth * canvas.width;
    const y = (e.clientY - rect.top) / canvas.clientHeight * canvas.height;
    FieldObjects.path.ctlpoints.push(new Point(x, y));
    FieldObjects.path.update();
}


/**
 * handle key down
*/
function handle_keydown(e) {
    let os = navigator.userAgent;
    // Undo adding control point
    if (e.key === "Escape") {
        FieldObjects.path.ctlpoints.pop();
        FieldObjects.path.update();
    }
    // Download session file
    if ((os.search("Mac") !== -1 ? e.metaKey : e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        Session.download_sess();
    }
}

/**
 * Set background image
*/
function set_background_img(e) {
    const file_list = e.target.files;
    var background_img = new Image();
    background_img.src = URL.createObjectURL(file_list[0]);
    FieldObjects.background.set_img(background_img);
}

/**
 * Clear background image
*/
function clear_background_img(e) {
    const img_input = document.getElementById("img_input");
    img_input.value = '';
    FieldObjects.background.set_img(null);
}

export {
    add_ctlpoint, 
    handle_keydown, 
    set_background_img, 
    clear_background_img
}