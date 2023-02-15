class Point {
    constructor(x, y, radius=3, fill_color="#000000") {
        this.x          = x;
        this.y          = y;
        this.radius     = radius;
        this.fill_color = fill_color;
    }
    get_x() {
        return this.x;
    }
    get_y() {
        return this.y;
    }
    get_color() {
        return this.fill_color;
    }
    set_coordinate(x, y) {
        this.x          = x;
        this.y          = y;
    }
    set_color(fill_color) {
        this.fill_color = fill_color;
    }
    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.fill_color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

export default Point;