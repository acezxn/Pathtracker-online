export default function RobotSettings() {
    return <>
        <p className="option_title"><b>Robot settings</b></p>
        <label className="option_text">track width (meters): </label>
        <input type="text" id="robot_width_input" className="option_input" defaultValue={0.5}></input>
        <br />

        <label className="option_text">robot length (meters): </label>
        <input type="text" id="robot_length_input" className="option_input" defaultValue={0.5}></input>
        <br />

        <label className="option_text">Robot facing (degrees right from the direction of the path):</label>
        <input type="text" id="facing_input" className="option_input" defaultValue={0}></input>
        <br />

        <label className="option_text">Max velocity (m/s): </label>
        <input type="text" id="max_velocity_input" className="option_input" defaultValue={2}></input>
        <br />

        <label className="option_text">Max acceleration (m/s^2): </label>
        <input type="text" id="max_accel_input" className="option_input" defaultValue={10}></input>
        <br />

        <label className="option_text">Max jerk (m/s^3): </label>
        <input type="text" id="max_jerk_input" className="option_input" defaultValue={70}></input>
        <br />
        <br />

        <i style={{marginLeft: "0.6vw"}}>Note: the following constants needs to be tuned on the actual robot,
            don't directly copy the values to the robot code.</i>
        <br />
        <br />

        <label className="option_text">translational P gain: </label>
        <input type="text" id="kPT_input" className="option_input" defaultValue={1.8}></input>
        <br />

        <label className="option_text">translational I gain: </label>
        <input type="text" id="kIT_input" className="option_input" defaultValue={0}></input>
        <br />

        <label className="option_text">translational D gain: </label>
        <input type="text" id="kDT_input" className="option_input" defaultValue={0.4}></input>
        <br />

        <label className="option_text">rotational P gain: </label>
        <input type="text" id="kPR_input" className="option_input" defaultValue={1.6}></input>
        <br />

        <label className="option_text">rotational I gain: </label>
        <input type="text" id="kIR_input" className="option_input" defaultValue={0.0001}></input>
        <br />

        <label className="option_text">rotational D gain: </label>
        <input type="text" id="kDR_input" className="option_input" defaultValue={0.4}></input>
        <br />
    </>
}