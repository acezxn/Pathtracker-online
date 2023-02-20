class Point extends DrawableObject {
    constructor(x, y, radius=5, fill_color="#000000") {
        super();
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
    get_radius() {
        return this.radius;
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
    distance_to(another) {
        return Math.sqrt(Math.pow(this.x - another.get_x(), 2) + Math.pow(this.y - another.get_y(), 2));
    }
    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.fill_color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}