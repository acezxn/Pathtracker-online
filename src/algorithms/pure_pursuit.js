import Waypoint from "../objects/drawable_objects/waypoint";
import Utils from "../utils";
class PurePursuit {
    static pursuit_mode = {
        pid: 0,
        curvature: 1,
    }
    constructor(lookahead_radius, trackwidth, pid_constants) {
        this.mode = PurePursuit.pursuit_mode.pid;
        this.lookahead_radius = lookahead_radius;
        this.trackwidth = trackwidth;
        this.max_progress_jump = 2;

        this.progress = 0;
        this.path = null;
        this.interpolate_interval = 10;

        this.prev_error_displacement = 0;
        this.prev_error_rotation = 0;

        this.total_error_displacement = 0;
        this.total_error_rotation = 0;
        const max_velocity_input = document.getElementById("max_velocity_input");
        const field_width_input = document.getElementById("field_width");
        const canvas = document.getElementById("Stage");
        this.velocity = Utils.meters_to_pixel(+max_velocity_input.value, +field_width_input.value, canvas.width);
        // translational PID constants
        this.kPT = Utils.meters_to_pixel(+pid_constants.kPT, +field_width_input.value, canvas.width);
        this.kIT = Utils.meters_to_pixel(+pid_constants.kIT, +field_width_input.value, canvas.width);
        this.kDT = Utils.meters_to_pixel(+pid_constants.kDT, +field_width_input.value, canvas.width);

        // rotational PID constants
        this.kPR = Utils.meters_to_pixel(+pid_constants.kPR, +field_width_input.value, canvas.width);
        this.kIR = Utils.meters_to_pixel(+pid_constants.kIR, +field_width_input.value, canvas.width);
        this.kDR = Utils.meters_to_pixel(+pid_constants.kDR, +field_width_input.value, canvas.width);
    }

    /**
     * Reset stored errors
    */
    reset() {
        this.progress = 0;
        this.prev_error_displacement = 0;
        this.prev_error_rotation = 0;

        this.total_error_displacement = 0;
        this.total_error_rotation = 0;
    }

    /**
     * Set path to follow
     * 
     * @param {Path} path path to follow
    */
    set_path(path) {
        this.path = path;
    }

    /**
     * Set pursuit mode
     * 
     * @param {PurePursuit.pursuit_mode} mode pursuit mode
    */
    set_mode(mode) {
        this.mode = mode;
    }

    /**
     * Find index of the closest waypoint to the robot
     * 
     * @param {Point} position robot position
     * @returns {integer} index
    */
    closest(position) {
        var min_dist = position.distance_to(this.path[0]);
        var min_idx = 0;
        for (let i = 0; i < this.path.length; i++) {
            const dist = position.distance_to(this.path[i]);
            if (dist < min_dist) {
                min_dist = dist;
                min_idx = i;
            }
        }
        return min_idx;
    }

    /**
     * Find lookahead waypoint
     * 
     * @param {Point} position robot position
     * @returns {Waypoint} lookahead point
    */
    find_lookahead(position) {
        if (position.distance_to(this.path[this.path.length - 1]) < this.lookahead_radius) {
            return this.path[this.path.length - 1];
        }

        this.progress = Math.min(Math.max(this.progress, this.closest(position)), Math.min(this.progress + this.max_progress_jump, this.path.length-1));
        
        for (let i = 0; i < this.path.length; i++) {
            var current_point = this.path[i];
            current_point.set_highlighted(false);
            if (i + 1 < this.path.length) {
                var next_point = this.path[i + 1];
                const current_dist = position.distance_to(current_point);
                const next_dist = position.distance_to(next_point);

                if (current_dist <= this.lookahead_radius &&
                    next_dist >= this.lookahead_radius &&
                    this.progress <= i) {
                    current_point.set_highlighted(true);
                    // interpolation
                    var mid_point = new Waypoint(current_point.get_x(), current_point.get_y(), 0, 
                    (current_point.get_linvel() + next_point.get_linvel())/2, 0);

                    var x_prev = current_point.get_x();
                    var x_next = next_point.get_x();

                    var y_prev = current_point.get_y();
                    var y_next = next_point.get_y();
                    var j = 0;
                    while (j < this.interpolate_interval) {
                        const x = (x_prev + x_next) * 0.5;
                        const y = (y_prev + y_next) * 0.5;
                        mid_point.set_coordinate(x, y);

                        if (position.distance_to(mid_point) < this.lookahead_radius) {
                            x_prev = x;
                            y_prev = y;
                        }
                        else if (position.distance_to(mid_point) > this.lookahead_radius) {
                            x_next = x;
                            y_next = y;
                        } else {
                            break;
                        }
                        j++;
                    }
                    return mid_point;
                }
            }
        }
        return this.path[this.progress];
    }

    /**
     * Convert global waypoint to local waypoint
     * 
     * @param {Point} point waypoint to convert
     * @param {Point} position robot position
     * @param {number} theta robot's orientation
     * 
     * @returns {Waypoint} local waypoint
    */
    to_local_coordinate(point, position, theta) {
        theta = theta * 180 / Math.PI
        const xDist = point.get_x() - position.get_x();
        const yDist = point.get_y() - position.get_y();
        // apply rotation matrix
        const newX = yDist * Math.cos((theta - 90) * Math.PI / 180.0) - xDist * Math.sin((theta - 90) * Math.PI / 180.0);
        const newY = yDist * Math.sin((theta - 90) * Math.PI / 180.0) + xDist * Math.cos((theta - 90) * Math.PI / 180.0);
        return new Waypoint(newX, newY, 0, point.get_linvel(), point.get_angvel());
    }

    /**
     * Iteration of pure pursuit algorithm
     * 
     * @param {Point} position robot position
     * @param {number} theta robot's orientation
     * @param {boolean} reverse whether reverse movement is enabled
    */
    step(position, theta, reverse = false) {
        const lookahead = this.to_local_coordinate(this.find_lookahead(position), position, theta);
        var forward = 0;
        var rotation = 0;
        switch (this.mode) {
            case PurePursuit.pursuit_mode.pid:
                const error_displacement = reverse ? -lookahead.get_y() / this.lookahead_radius
                    : lookahead.get_y() / this.lookahead_radius;
                const error_rotation = lookahead.get_x() / this.lookahead_radius;

                this.total_error_displacement += error_displacement;
                this.total_error_rotation += error_rotation;

                const deriv_displacement = error_displacement - this.prev_error_displacement;
                const deriv_rotation = error_rotation - this.prev_error_rotation;

                forward = this.kPT * error_displacement + this.kIT * this.total_error_displacement + this.kDT * deriv_displacement;
                rotation = this.kPR * error_rotation + this.kIR * this.total_error_rotation + this.kDR * deriv_rotation;

                this.prev_error_displacement = error_displacement;
                this.prev_error_rotation = error_rotation;
                break;
            case PurePursuit.pursuit_mode.curvature:
                const curvature = 2 * lookahead.get_x() / (lookahead.get_x()**2 + lookahead.get_y()**2);
                
                // forward = lookahead.get_linvel(); // get linear velocity
                forward = this.velocity;
                rotation = forward * curvature * this.trackwidth / 2;
                break;
            default:
                console.log("PurePursuit: invalid pursuit mode");
        }

        return reverse ? [-(forward + rotation), -(forward - rotation)] : [forward + rotation, forward - rotation];
    }
}

export default PurePursuit;