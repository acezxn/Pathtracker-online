import OutputManager from "../objects/output_manager"
import "../css/ExportManager.css"

export default function ExportManager() {
    return <>
        <div className="exportmanager" style={{ paddingLeft: 76 }}>
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
            <textarea rows="5" cols="88" id="output_textarea" spellCheck="false" className="textarea">
            </textarea>
        </div>
    </>
}