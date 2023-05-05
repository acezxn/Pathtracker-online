import OutputManager from "../../objects/output_manager"
import { set_background_img, clear_background_img } from "../../objects/event_handler";

export default function FieldSettings() {
    return <>
        <p className="option_title"><b>Field related</b></p>
        <label className="option_text">Field width (meters): </label>
        <input type="text" id="field_width" name="field_width" className="option_input" defaultValue={4} onInput={OutputManager.update_output}></input>
        <br />
        <label className="option_text">Coordinates per dimension: </label>
        <input type="text" id="coord_per_dimension" name="coord_per_dimension" className="option_input" defaultValue={100} onInput={OutputManager.update_output}></input>
        <br />

        <label className="option_text">Field origin (meters): </label>
        <p style={{ display: "inline-block" }}>x = </p>
        <input type="text" id="x_origin_input" className="option_input_short" defaultValue={0} onInput={OutputManager.update_output}></input>
        <p style={{ display: "inline-block" }}>y = </p>
        <input type="text" id="y_origin_input" className="option_input_short" defaultValue={0} onInput={OutputManager.update_output}></input>
        <input type="checkbox" id="y_inverse_input" className="option_input_checkbox" onChange={OutputManager.update_output}></input>
        <p style={{ display: "inline-block" }}>inverse y</p>
        <br />
        <label className="option_text">Background image: </label>
        <input type="file" id="img_input" name="img_input" accept="image/*" className="file_input" onChange={set_background_img}></input>
        <button className="option_input" id="clear_img" style={{ width: "auto" }} onClick={clear_background_img}>clear image</button>
        <br />
        <i style={{marginLeft: "0.6vw"}}>Note: you could only upload square images.</i>
    </>
}