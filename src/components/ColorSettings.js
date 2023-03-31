export default function ColorSettings() {
    return <>
        <p className="option_title"><b>Color settings</b></p>
        <label className="option_text">Path start color: </label>
        <input type="color" id="start_color_input" defaultValue={"#03fce8"} />
        <br />

        <label className="option_text">Path end color: </label>
        <input type="color" id="end_color_input" defaultValue={"#4103fc"} />
        <br />

        <label className="option_text">Control point color: </label>
        <input type="color" id="ctlpoint_color_input" defaultValue={"#000000"} />
        <br />

        <label className="option_text">Open control point color: </label>
        <input type="color" id="ctlpoint_open_color_input" defaultValue={"#ff6161"} />
        <br />

        <label className="option_text">Robot color: </label>
        <input type="color" id="robot_color_input" defaultValue={"#DDDD00"} />
        <br />

        <label className="option_text">Track velocity color: </label>
        <input type="color" id="trackvel_color_input" defaultValue={"#FF0000"} />
    </>
}