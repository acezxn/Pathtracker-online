import DrawableObject from "./drawable_object";

class Box extends DrawableObject {
    constructor(x, y, theta=0, width=100, height=100, color="#000000") {
        super();
        this.width  = width;
        this.height = height;
        this.x     = x;
        this.y     = y;
        this.theta = theta;
        this.color = color;
    }
    get_x() {
        return this.x;
    }
    get_y() {
        return this.y;
    }
    set_coordinate(x, y, theta) {
        this.x     = x;
        this.y     = y;
        this.theta = theta;
    }
    set_color(color) {
        this.color = color;
    }
    rotate_by_angle(x, y, theta) {
        theta = theta * Math.PI / 180;
        return [Math.cos(theta) * (x-this.x) - Math.sin(theta) * (y-this.y) + this.x, Math.sin(theta) * (x-this.x) + Math.cos(theta) * (y-this.y) + this.y];
    }
    render(ctx, settings) {
        // top line
        const left_top_corner = this.rotate_by_angle(this.x - this.width / 2, this.y - this.height / 2, this.theta);
        const right_top_corner = this.rotate_by_angle(this.x + this.width / 2, this.y - this.height / 2, this.theta);
        const left_bottom_corner = this.rotate_by_angle(this.x - this.width / 2, this.y + this.height / 2, this.theta);
        const right_bottom_corner = this.rotate_by_angle(this.x + this.width / 2, this.y + this.height / 2, this.theta);
        ctx.beginPath();
        ctx.moveTo(left_top_corner[0], left_top_corner[1]);
        ctx.lineTo(right_top_corner[0], right_top_corner[1]);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        // bottom line
        ctx.beginPath();
        ctx.moveTo(left_bottom_corner[0], left_bottom_corner[1]);
        ctx.lineTo(right_bottom_corner[0], right_bottom_corner[1]);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        // left line
        ctx.beginPath();
        ctx.moveTo(left_top_corner[0], left_top_corner[1]);
        ctx.lineTo(left_bottom_corner[0], left_bottom_corner[1]);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        // right line
        ctx.beginPath();
        ctx.moveTo(right_top_corner[0], right_top_corner[1]);
        ctx.lineTo(right_bottom_corner[0], right_bottom_corner[1]);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
}

export default Box;