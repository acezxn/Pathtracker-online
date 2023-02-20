import Point from "../objects/point";

class PurePursuit {
    constructor(lookahead_radius, pid_constants) {
        this.lookahead_radius = lookahead_radius;
        // translational PID constants
        this.kPT = pid_constants.kPT;
        this.kIT = pid_constants.kIT;
        this.kDT = pid_constants.kDT;

        // rotational PID constants
        this.kPR = pid_constants.kPR;
        this.kIR = pid_constants.kIR;
        this.kDR = pid_constants.kDR;
        this.path = null;
        this.interpolate_interval = 10;

        this.prev_error_displacement = 0;
        this.prev_error_rotation = 0;

        this.total_error_displacement = 0;
        this.total_error_rotation = 0;
    }
    reset() {
        this.interpolate_interval = 10;

        this.prev_error_displacement = 0;
        this.prev_error_rotation = 0;

        this.total_error_displacement = 0;
        this.total_error_rotation = 0;
    }
    set_path(path) {
        this.path = path;
    }
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
    find_lookahead(position) {
        if (position.distance_to(this.path[this.path.length-1]) < this.lookahead_radius) {
            return this.path[this.path.length-1];
        }
        for (let i = 0; i < this.path.length; i++) {
            var current_point = this.path[i];
            if (i + 1 < this.path.length) {
                var next_point = this.path[i+1];
                const current_dist = position.distance_to(current_point);
                const next_dist    = position.distance_to(next_point);

                if (current_dist < this.lookahead_radius && 
                    next_dist > this.lookahead_radius &&
                    this.closest(position) < i) {
                    // interpolation
                    var mid_point = new Point(current_point.get_x(), current_point.get_y());
                    var j = 0;
                    var ratio = 0.5;
                    while (j < this.interpolate_interval) {
                        const x = (1 - ratio) * current_point.get_x() + ratio * next_point.get_x();
                        const y = (1 - ratio) * current_point.get_y() + ratio * next_point.get_y();
                        mid_point.set_coordinate(x, y);
                        
                        if (position.distance_to(mid_point) < this.lookahead_radius) {
                            ratio += (1 - ratio) / 2.0;
                        } 
                        else if (position.distance_to(mid_point) > this.lookahead_radius) {
                            ratio -= ratio / 2.0;
                        } else {
                            break;
                        }
                        j++
                    }
                    return mid_point;
                }
            }
        }
        return this.path[this.closest(position)];
    }
    to_local_coordinate(point, position, theta) {
        theta = theta * 180 / Math.PI
        const xDist = point.get_x() - position.get_x();
        const yDist = point.get_y() - position.get_y(); 
        // apply rotation matrix
        const newX = yDist*Math.cos((theta-90)*Math.PI/180.0) - xDist*Math.sin((theta-90)*Math.PI/180.0);
        const newY = yDist*Math.sin((theta-90)*Math.PI/180.0) + xDist*Math.cos((theta-90)*Math.PI/180.0);
        return new Point(newX, newY);
    }
    step(position, theta, reverse=false) {
        const lookahead = this.to_local_coordinate(this.find_lookahead(position), position, theta);

        const error_displacement        = reverse? -lookahead.get_y() / this.lookahead_radius
                                                 :  lookahead.get_y() / this.lookahead_radius;
        const error_rotation            = lookahead.get_x() / this.lookahead_radius;

        this.total_error_displacement += error_displacement;
        this.total_error_rotation += error_rotation;

        const deriv_displacement = error_displacement - this.prev_error_displacement;
        const deriv_rotation = error_rotation - this.prev_error_rotation;

        const forward = this.kPT * error_displacement + this.kIT * this.total_error_displacement + this.kDT * deriv_displacement;
        const rotation = this.kPR * error_rotation + this.kIR * this.total_error_rotation + this.kDR * deriv_rotation;

        this.prev_error_displacement = error_displacement;
        this.prev_error_rotation = error_rotation;

        return [forward + rotation, forward - rotation];
    }
}

export default PurePursuit;