import Box from "./box.js"
import Point from "./point.js";
import PurePursuit from "../../algorithms/pure_pursuit.js";
import FieldObjects from "../field_objects.js";
import SimulationManager from "../simulation_manager.js";

class Robot {
    constructor({x, y, theta}, {width, length, color}, {max_velocity, max_acceleration, max_jerk}, {kPT, kIT, kDT, kPR, kIR, kDR}, {lookahead_radius, pursuit_mode}) {
        this.position = [x, y];
        this.velocity = [0, 0];
        this.allowed_acceleration = [0, 0];
        this.max_jerk = max_jerk;
        this.theta = theta * Math.PI / 180;
        this.width = width;
        this.box = new Box(x, y, theta, width, length, color);
        this.lookahead_radius = lookahead_radius;
        this.pursuit = new PurePursuit(lookahead_radius, width, {kPT, kIT, kDT, kPR, kIR, kDR});
        this.pursuit.set_mode(pursuit_mode);
        this.max_velocity = max_velocity;
        this.max_acceleration = max_acceleration;
    }

    set_color(color) {
        this.box.set_color(color);
    }

    update_position() {
        this.box.set_coordinate(this.position[0], this.position[1], this.theta * 180 / Math.PI);
    }

    move_velocity(velocity, dt) {
        velocity[0] = Math.max(Math.min(velocity[0], this.max_velocity), -this.max_velocity);
        velocity[1] = Math.max(Math.min(velocity[1], this.max_velocity), -this.max_velocity);

        var last_allowed_acceleration = this.allowed_acceleration;
        var last_velocity = this.velocity;

        for (let i = 0; i < velocity.length; i++) {
            const desired_accel = velocity[i]-last_velocity[i] < 0 ? -this.max_acceleration : velocity[i]-last_velocity[i] === 0 ? 0 : this.max_acceleration;
            this.allowed_acceleration[i] = last_allowed_acceleration[i] + Math.min(this.max_jerk * dt, Math.max(-this.max_jerk*dt, desired_accel-last_allowed_acceleration[i]));
            this.velocity[i] = last_velocity[i] + Math.max(Math.min(velocity[i]-last_velocity[i], Math.abs(this.allowed_acceleration[i] * dt)), -Math.abs(this.allowed_acceleration[i] * dt));
        }

        this.position = [this.position[0] + (this.velocity[0]+this.velocity[1])/2*dt * Math.sin(this.theta), 
                         this.position[1] - (this.velocity[0]+this.velocity[1])/2*dt * Math.cos(this.theta)];
        this.theta += Math.atan((this.velocity[0]-this.velocity[1])/this.width*dt);
        this.update_position();
    }

    set_pursuit_mode(mode){
        this.pursuit.set_mode(mode);
    }

    follow_path(path, dt) {
        const pos = new Point(this.position[0], this.position[1]);
        this.pursuit.set_path(path)
        if (this.pursuit.closest(pos) === path.length-1) {
            console.log("finished");
            return 1;
        }
        const velocity_pair = this.pursuit.step(pos, this.theta);
        this.move_velocity(velocity_pair, dt);
        return 0;
    }

    render(ctx, settings) {
        const finished = this.follow_path(FieldObjects.path.fullpath, settings.dt);
        if (finished) {
            SimulationManager.toggle_simulation();
            return;
        }
        this.box.render(ctx, settings);
        ctx.beginPath();
        ctx.arc(this.position[0], this.position[1], this.lookahead_radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

export default Robot;