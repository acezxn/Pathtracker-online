import OutputManager from "../objects/output_manager";
import Stage from "../components/Stage";

import FieldSettings from "../components/FieldSettings";
import ColorSettings from "../components/ColorSettings";
import RobotSettings from "../components/RobotSettings";
import ControlsTab from "../components/ControlsTab";

const Playground = () => {
    return (
        <>
            <div style={{ overflow: "auto" }}>
                <div className="stageholder">
                    <Stage />
                    <p className="small" id="mouse_coordinate"></p>
                </div>
                <ControlsTab></ControlsTab>
                <div className="settings_tab">
                    <div className="tabpadding">
                        <div className="tabcontent">
                            <p><b>Settings</b></p>

                            <FieldSettings></FieldSettings>

                            <ColorSettings></ColorSettings>

                            <RobotSettings></RobotSettings>

                            <p className="option_text"><b>Pure pursuit (PID based)</b></p>
                            <label className="option_text">look ahead radius (meters): </label>
                            <input type="text" id="lookahead_radius_input" className="option_input" defaultValue={0.5}></input>
                            <br />

                        </div>
                    </div>
                </div>
            </div>
            <div className="exportmanager">
                <p className="option_text"><b>Coordinate output</b></p>
                <label className="option_text">Things to output: </label>
                <select id="output_option" className="option_list" style={{ display: "inline-block" }} onChange={OutputManager.update_output}>
                    <option value="ctlpoint">Control points</option>
                    <option value="full">Full path</option>
                </select>
                <br />
                <label className="option_text">Format: </label>
                <input type="text" id="output_prefix" className="option_input_middle" style={{ textAlign: "right" }} defaultValue={"("} onChange={OutputManager.update_output}></input>
                <p style={{ display: "inline-block" }}>x</p>
                <input type="text" id="output_midfix" className="option_input_short" defaultValue={", "} onChange={OutputManager.update_output}></input>
                <p style={{ display: "inline-block" }}>y</p>
                <input type="text" id="output_suffix" className="option_input_middle" defaultValue={")"} onChange={OutputManager.update_output}></input>
                <br />
                <textarea rows="5" cols="88" id="output_textarea">
                </textarea>
            </div>
        </>
    );
};

export default Playground;
