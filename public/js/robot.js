import Box from "./box.js"

class Robot {
    constructor(x, y, theta, width, height, color) {
        this.position = [x, y];
        this.theta = theta * Math.PI / 180;
        this.width = width;
        this.box = new Box(x, y, theta, width, height, color);
        this.max_velocity = 5;
        this.max_acceleration = 0.5;
        this.velocity = [0, 0];
    }

    set_color(color) {
        this.box.set_color(color);
    }

    update_position() {
        this.box.set_coordinate(this.position[0], this.position[1], this.theta * 180 / Math.PI);
    }

    move_velocity(velocity, dt) {
        var last_velocity = this.velocity;
        for (let i = 0; i < velocity.length; i++) {
            this.velocity[i] = last_velocity[i] + Math.min(this.max_acceleration * dt, Math.max(-this.max_acceleration*dt, velocity[i]-last_velocity[i]));
        }
        this.position = [this.position[0] + (this.velocity[0]+this.velocity[1])/2*dt * Math.sin(this.theta), 
                         this.position[1] - (this.velocity[0]+this.velocity[1])/2*dt * Math.cos(this.theta)];
        this.theta += Math.atan((this.velocity[0]-this.velocity[1])/this.width*dt);
        this.update_position();
    }

    render(ctx) {
        this.box.render(ctx);
    }
}

export default Robot;