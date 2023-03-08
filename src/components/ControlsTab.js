import Session from "../objects/session"
import FieldObjects from "../objects/field_objects";
import SimulationManager from "../objects/simulation_manager";
import { handle_showgrid } from "../objects/event_handler";

function update_path(e) {
    FieldObjects.path.update();
    FieldObjects.path.settings.point_density = e.target.value;
}

export default function ControlsTab() {
    return <>
        <div className="controls_tab">
            <div className="tabpadding">
                <div className="tabcontent">
                    <p className="tab_title"><b>Controls</b></p>
                    <label className="option_text">Load session: </label>
                    <input type="file" id="sess_input" accept="application/JSON" className="file_input" onChange={Session.load_session}></input>
                    <br />
                    <label className="option_text">Show grid: </label>
                    <input type="checkbox" id="show_grid_input" className="option_input_checkbox" onChange={handle_showgrid}></input>
                    <p className="option_title"><b>Path generation</b></p>
                    <label className="option_text">Point density: </label>
                    <input type="text" id="point_density_input" className="option_input" defaultValue={20} onInput={update_path} onChange={update_path}/>
                    <br />
                    <br />
                    <button className="option_input" id="simulate_btn" style={{ width: "auto" }} onClick={SimulationManager.toggle_simulation}>Simulate</button>
                </div>
            </div>
        </div>
    </>
}