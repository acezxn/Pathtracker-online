import Session from "../../objects/session";
import FieldObjects from "../../objects/field_objects";
import SimulationManager from "../../objects/simulation_manager";
import { clear_path, handle_pathalgo_change, handle_showgrid } from "../../objects/event_handler";

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
                    <input type="file" id="sess_input" accept="application/JSON" onChange={Session.load_session}></input>
                    <br />
                    <label className="option_text">Show grid: </label>
                    <input type="checkbox" id="show_grid_input" className="option_input_checkbox" onChange={handle_showgrid}></input>
                    <p className="option_title"><b>Path generation</b></p>                   
                    <label className="option_text">Curve type: </label>
                    <select id="curve_type_input" className="option_list" onChange={handle_pathalgo_change}>
                        <option value="catmull_rom">Catmull rom spline</option>
                        <option value="cubic_bezier">Cubic Bezier curve</option>
                    </select>
                    <button id="clear_path_btn" style={{ width: "auto", padding: "0.3vw", marginLeft: "0.6vw", fontSize: "max(min(1.7vw, 18px), 10px)"}} onClick={clear_path}>Clear path</button>
                    <br />
                    <label className="option_text">Point density: </label>
                    <input type="range" min="5" max="50" id="point_density_input" defaultValue={20} onInput={update_path} onChange={update_path}/>
                    <br />
                    <br />
                    <button id="simulate_btn" style={{ width: "auto", padding: "0.4vw", marginLeft: "0.6vw"}} onClick={SimulationManager.toggle_simulation}>Simulate</button>
                </div>
            </div>
        </div>
    </>
}