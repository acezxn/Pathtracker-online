import DrawableObject from "./drawable_object";

class Point extends DrawableObject {
    constructor(x, y, radius = 7, fill_color = "#000000", is_control_point = false, is_direction_handle = false) {
        super();
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.fill_color = fill_color;
        this.is_control_point = is_control_point;
        this.is_direction_handle = is_direction_handle;
    }
    get_is_control_point() {
        return this.is_control_point;
    }
    get_is_direction_handle() {
        return this.is_direction_handle;
    }
    set_is_control_point(is_control_point) {
        this.is_control_point = is_control_point;
    }
    set_is_direction_handle(is_direction_handle) {
        this.is_direction_handle = is_direction_handle;
    }
    get_x() {
        return this.x;
    }
    get_y() {
        return this.y;
    }
    get_radius() {
        return this.radius;
    }
    get_color() {
        return this.fill_color;
    }
    set_coordinate(x, y) {
        this.x = x;
        this.y = y;
    }
    set_color(fill_color) {
        this.fill_color = fill_color;
    }
    distance_to(another) {
        return Math.sqrt(Math.pow(this.x - another.get_x(), 2) + Math.pow(this.y - another.get_y(), 2));
    }
    render(ctx, settings) {
        ctx.beginPath();
        ctx.fillStyle = this.fill_color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

export default Point;