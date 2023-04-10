class RobotBehavior {
    static actions = {
        pursuit: 0,
        motion_profile: 1,
    }
    constructor(action, details) {
        this.perform_action = action;
        this.perform_details = details;
    }
}

export default RobotBehavior;