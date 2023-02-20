import Utils from "../utils";
import FieldObjects from "./field_objects";
import Robot from "../objects/robot";

class SimulationManager {
    static simulating = false;

    static robot_position = {
        x: 0,
        y: 0,
        theta: 0,
    }
    static robot_appearance = {
        width: 0,
        length: 0,
        color: "#000000",
    }
    static robot_performance = {
        max_velocity: 0,
        max_acceleration: 0,
    }
    static pid_constants = {
        kPT: 300,
        kIT: 0,
        kDT: 0,
        kPR: 300,
        kIR: 0,
        kDR: 0,
    }

    static lookahead_radius = 0;

    static update_robot_config() {
        const canvas = document.getElementById("Stage");
        const field_width_input = document.getElementById("field_width");
        const robot_color_input = document.getElementById("robot_color_input");
        const robot_width_input = document.getElementById("robot_width_input");
        const robot_length_input = document.getElementById("robot_length_input");
        const max_velocity_input = document.getElementById("max_velocity_input");
        const max_accel_input = document.getElementById("max_accel_input");
    
        const lookahead_radius_input = document.getElementById("lookahead_radius_input");
        const kPT_input = document.getElementById("kPT_input");
        const kIT_input = document.getElementById("kIT_input");
        const kDT_input = document.getElementById("kDT_input");
        const kPR_input = document.getElementById("kPR_input");
        const kIR_input = document.getElementById("kIR_input");
        const kDR_input = document.getElementById("kDR_input");
    
        SimulationManager.robot_appearance = {
            width: Utils.meters_to_pixel(+robot_width_input.value, +field_width_input.value, canvas.width),
            length: Utils.meters_to_pixel(+robot_length_input.value, +field_width_input.value, canvas.width),
            color: robot_color_input.value,
        }
    
        SimulationManager.robot_performance = {
            max_velocity: Utils.meters_to_pixel(+max_velocity_input.value, +field_width_input.value, canvas.width),
            max_acceleration: Utils.meters_to_pixel(+max_accel_input.value, +field_width_input.value, canvas.width),
        }
    
        SimulationManager.pid_constants = {
            kPT: +kPT_input.value,
            kIT: +kIT_input.value,
            kDT: +kDT_input.value,
            kPR: +kPR_input.value,
            kIR: +kIR_input.value,
            kDR: +kDR_input.value,
        }
    
        SimulationManager.lookahead_radius = Utils.meters_to_pixel(+lookahead_radius_input.value, +field_width_input.value, canvas.width);
    }
    
    static toggle_simulation() {
        SimulationManager.simulating = !SimulationManager.simulating;
    
        const simulate_btn = document.getElementById("simulate_btn");
        if (SimulationManager.simulating) {
            simulate_btn.innerHTML = "Stop";
            if (FieldObjects.path.fullpath.length > 1) { // path exists
                const orientation = Utils.format_angle(90 + Math.atan2(FieldObjects.path.fullpath[1].get_y() - FieldObjects.path.fullpath[0].get_y(), FieldObjects.path.fullpath[1].get_x() - FieldObjects.path.fullpath[0].get_x()) * 180 / Math.PI);
                SimulationManager.update_robot_config();
                SimulationManager.robot_position = {
                    x: FieldObjects.path.fullpath[0].get_x(),
                    y: FieldObjects.path.fullpath[0].get_y(),
                    theta: orientation,
                }
    
                var robot = new Robot(SimulationManager.robot_position, SimulationManager.robot_appearance, SimulationManager.robot_performance, SimulationManager.pid_constants, SimulationManager.lookahead_radius);
                FieldObjects.objects.push(robot)
            } else {
                SimulationManager.simulating = false;
                simulate_btn.innerHTML = "Simulate";
            }
        } else {
            simulate_btn.innerHTML = "Simulate";
            FieldObjects.objects.pop();
        }
    }
}

export default SimulationManager;
