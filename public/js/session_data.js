class SessionData {
    constructor() {
        // field settings
        this.fieldwidth;
        this.field_origin_x;
        this.field_origin_y;
        this.inverse_y;

        // color settings
        this.path_start_color;
        this.path_end_color;
        this.ctlpoint_color;
        this.open_ctlpoint_color;
        this.robot_color;

        // coordinate data
        this.ctlpoints;
    }
    get_fieldwidth() {
        return this.fieldwidth;
    }
    get_field_origin() {
        return [this.field_origin_x, this.field_origin_y];
    }

    get_y_inverse() {
        return this.inverse_y;
    }

    get_path_start_color() {
        return this.path_start_color;
    }

    get_path_end_color() {
        return this.path_end_color;
    }

    get_ctlpoint_color() {
        return this.ctlpoint_color;
    }

    get_open_ctlpoint_color() {
        return this.open_ctlpoint_color;
    }

    get_robot_color() {
        return this.robot_color;
    }

    get_ctlpoints() {
        return this.ctlpoints;
    }
    

    set_fieldwidth(width) {
        this.fieldwidth = width;
    }
    set_field_origin(x, y) {
        this.field_origin_x = x;
        this.field_origin_y = y;
    }

    set_y_inverse(inverse) {
        this.inverse_y = inverse;
    }

    set_colors(path_start_color, path_end_color, ctlpoint_color, open_ctlpoint_color, robot_color) {
        this.path_start_color = path_start_color;
        this.path_end_color = path_end_color;
        this.ctlpoint_color = ctlpoint_color;
        this.open_ctlpoint_color = open_ctlpoint_color;
        this.robot_color = robot_color;
    }

    set_ctlpoints(ctlpoints) {
        this.ctlpoints = ctlpoints;
    }
}

export default SessionData;