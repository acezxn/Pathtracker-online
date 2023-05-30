import Box from "./box.js"
import Point from "./point.js";
import PurePursuit from "../../algorithms/pure_pursuit.js";
import FieldObjects from "../field_objects.js";
import SimulationManager from "../simulation_manager.js";
import RobotBehavior from "../robot_behavior.js";

class Robot {
    constructor({x, y, theta}, {width, length, color, velocity_color}, {max_velocity, max_acceleration, max_jerk}, {kPT, kIT, kDT, kPR, kIR, kDR}, behavior) {
        this.position = [x, y];
        this.velocity = [0, 0];
        this.allowed_acceleration = [0, 0];
        this.max_jerk = max_jerk;
        this.theta = theta * Math.PI / 180;
        this.width = width;
        this.length = length
        this.color = color;
        this.velocity_color = velocity_color;
        this.box = new Box(x, y, theta, width, length, color);
        this.behavior = behavior;
        this.lookahead_radius = behavior.perform_details.lookahead_radius;
        this.pursuit = new PurePursuit(this.lookahead_radius, width, {kPT, kIT, kDT, kPR, kIR, kDR});
        this.pursuit.set_mode(behavior.perform_details.pursuit_mode);
        this.max_velocity = max_velocity;
        this.max_acceleration = max_acceleration;
    }

    set_color(color) {
        this.box.set_color(color);
    }

    update_position() {
        this.box.set_coordinate(this.position[0], this.position[1], this.theta * 180 / Math.PI);
    }

    /**
     * Move the robot with a specific velocity
     *
     * @param {[Number, Number]} velocity left right velocity pair
     * @param {Number} dt delta time
     * @memberof Robot
     */
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

    /**
     * Set chassis velocity to follow the path
     *
     * @param {Path} path path to follow
     * @param {Number} dt delta time
     * @returns {Number} 0
     * @memberof Robot
     */
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

    rotate_by_angle(x, y, theta) {
        return [Math.cos(theta) * (x-this.position[0]) - Math.sin(theta) * (y-this.position[1]) + this.position[0], Math.sin(theta) * (x-this.position[0]) + Math.cos(theta) * (y-this.position[1]) + this.position[1]];
    }

    render_speedbar(ctx) {
        let length_multiplier = 0.5;
        let left_length = this.velocity[0] * length_multiplier;
        let right_length = this.velocity[1] * length_multiplier;
        let left_bar_start_position = this.rotate_by_angle(this.position[0] - this.width / 2, this.position[1] - this.length / 2, this.theta);
        let right_bar_start_position = this.rotate_by_angle(this.position[0] + this.width / 2, this.position[1] - this.length / 2, this.theta);
        let left_bar_end_position = this.rotate_by_angle(this.position[0] - this.width / 2, this.position[1] - this.length / 2 - left_length, this.theta);
        let right_bar_end_position = this.rotate_by_angle(this.position[0] + this.width / 2, this.position[1] - this.length / 2 - right_length, this.theta);

        ctx.strokeStyle = this.velocity_color;
        ctx.beginPath();
        ctx.moveTo(left_bar_start_position[0], left_bar_start_position[1]);
        ctx.lineTo(left_bar_end_position[0], left_bar_end_position[1]);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(right_bar_start_position[0], right_bar_start_position[1]);
        ctx.lineTo(right_bar_end_position[0], right_bar_end_position[1]);
        ctx.stroke();
    }

    render(ctx, settings) {
        var finished;
        if (this.behavior.perform_action === RobotBehavior.actions.pursuit) {
            finished = this.follow_path(FieldObjects.path.fullpath, settings.dt);
        } else {
            finished = true;
        }
        
        if (finished) {
            SimulationManager.toggle_simulation();
            return;
        }
        this.box.render(ctx, settings);
        this.render_speedbar(ctx);

        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position[0], this.position[1], this.lookahead_radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

export default Robot;