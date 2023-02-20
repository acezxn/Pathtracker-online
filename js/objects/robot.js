class Robot {
    constructor({x, y, theta}, {width, length, color}, {max_velocity, max_acceleration}, {kPT, kIT, kDT, kPR, kIR, kDR}, lookahead_radius) {
        this.position = [x, y];
        this.theta = theta * Math.PI / 180;
        this.width = width;
        this.box = new Box(x, y, theta, width, length, color);
        this.lookahead_radius = lookahead_radius;
        this.pursuit = new PurePursuit(lookahead_radius, {kPT, kIT, kDT, kPR, kIR, kDR});
        this.max_velocity = max_velocity;
        this.max_acceleration = max_acceleration;
        this.velocity = [0, 0];
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

        var last_velocity = this.velocity;
        for (let i = 0; i < velocity.length; i++) {
            this.velocity[i] = last_velocity[i] + Math.min(this.max_acceleration * dt, Math.max(-this.max_acceleration*dt, velocity[i]-last_velocity[i]));
        }
        // console.log(this.velocity);
        this.position = [this.position[0] + (this.velocity[0]+this.velocity[1])/2*dt * Math.sin(this.theta), 
                         this.position[1] - (this.velocity[0]+this.velocity[1])/2*dt * Math.cos(this.theta)];
        this.theta += Math.atan((this.velocity[0]-this.velocity[1])/this.width*dt);
        this.update_position();
    }

    follow_path(path, dt) {
        const pos = new Point(this.position[0], this.position[1]);
        this.pursuit.set_path(path)
        if (this.pursuit.closest(pos) == path.length-1) {
            console.log("finished");
            return 1;
        }
        const velocity_pair = this.pursuit.step(pos, this.theta);
        this.move_velocity(velocity_pair, dt);
        return 0;
    }

    render() {
        const finished = this.follow_path(path.fullpath, dt);
        if (finished) {
            toggle_simulation();
        }
        this.box.render();
        ctx.beginPath();
        ctx.arc(this.position[0], this.position[1], this.lookahead_radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

function update_robot_config() {
    robot_appearance = {
        width : Utils.meters_to_pixel(+robot_width_input.value, +field_width_input.value, canvas.width),
        length : Utils.meters_to_pixel(+robot_length_input.value, +field_width_input.value, canvas.width),
        color : robot_color_input.value,
    }

    robot_performance = {
        max_velocity : Utils.meters_to_pixel(+max_velocity_input.value, +field_width_input.value, canvas.width),
        max_acceleration : Utils.meters_to_pixel(+max_accel_input.value, +field_width_input.value, canvas.width),
    }

    pid_constants = {
        kPT : +kPT_input.value,
        kIT : +kIT_input.value,
        kDT : +kDT_input.value,
        kPR : +kPR_input.value,
        kIR : +kIR_input.value,
        kDR : +kDR_input.value,
    }

    lookahead_radius = Utils.meters_to_pixel(+lookahead_radius_input.value, +field_width_input.value, canvas.width);
}

var robot_position = {
    x : 0,
    y : 0,
    theta : 0,
}
var robot_appearance = {
    width : 100,
    length : 100,
    color : robot_color_input.value,
}
var robot_performance = {
    max_velocity : 0,
    max_acceleration : 0,
}
var pid_constants = {
    kPT : 300,
    kIT : 0,
    kDT : 0,
    kPR : 300,
    kIR : 0,
    kDR : 0,
}

