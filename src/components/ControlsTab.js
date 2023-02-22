import Session from "../objects/session"
import FieldObjects from "../objects/field_objects";
import SimulationManager from "../objects/simulation_manager";

function update_path(e) {
    console.log(e.target.value);
    FieldObjects.path.update();
}

export default function ControlsTab() {
    return <>
        <div className="controls_tab">
            <div className="tabpadding">
                <div className="tabcontent">
                    <p><b>Controls</b></p>
                    <label className="option_text">Load session: </label>
                    <input type="file" id="sess_input" accept="application/JSON" className="file_input" onChange={Session.load_session}></input>
                    <br />
                    <p className="option_text"><b>Path generation</b></p>
                    <label className="option_text">Point density: </label>
                    <input type="range" min="5" max="30" id="point_density_input" defaultValue={20} onInput={update_path} onChange={update_path}/>
                    <br />
                    <br />
                    <button className="option_input" id="simulate_btn" style={{ width: "auto" }} onClick={SimulationManager.toggle_simulation}>Simulate</button>
                </div>
            </div>
        </div>
    </>
}