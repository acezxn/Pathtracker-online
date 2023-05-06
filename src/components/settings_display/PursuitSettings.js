export default function PursuitSettings() {
    return <>
        <p className="option_title"><b>Pure pursuit</b></p>
        <label className="option_text">pursuit mode: </label>
        <select id="pursuit_mode_input" className="option_list" style={{ display: "inline-block" }}>
            <option value="pid">PID based</option>
            <option value="curvature">Curvature based</option>
        </select>
        <br />
        <label className="option_text">look ahead radius (meters): </label>
        <input type="text" id="lookahead_radius_input" className="option_input" defaultValue={0.3}></input>
        <br />
    </>
}