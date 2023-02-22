import Point from "./point";

class Waypoint extends Point {
    constructor(x, y, theta, v, w, radius=5, fill_color="#000000") {
        super(x, y, radius, fill_color);
        this.theta = theta;
        this.linvel = v;
        this.angvel = w;
    }
    get_linvel() {
        return this.linvel;
    }
    get_angvel() {
        return this.angvel;
    }
}

export default Waypoint;