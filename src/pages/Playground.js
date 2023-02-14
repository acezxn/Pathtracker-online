import { Helmet } from "react-helmet"
const Playground = () => {
    return (
        <>
            <Helmet>
                <script type="module" src="js/point.js"></script>
                <script type="module" src="js/catmull_rom.js"></script>
                <script type="module" src="js/playground.js"></script>
            </Helmet>

            <div style={{ overflow: "auto" }}>
                <div className="stageholder">
                    <canvas id="Stage" width="700" height="700"></canvas>
                    <p className="small" id="mouse_coordinate"></p>
                    <p className="option_text"><b>Coordinate output</b></p>
                    <label className="option_text">Things to output: </label>
                    <select id="output_option" className="option_list" style = {{display : "inline-block"}}>
                        <option value="ctlpoint" selected>Control points</option>
                        <option value="full">Full path</option>
                    </select>
                    <br />
                    <textarea rows="5" cols="83" id="output_textarea">
                    </textarea>
                </div>
                <div className="settings_tab">
                    <div className="tabpadding">
                        <div className="tabcontent">
                            <p><b>Controls</b></p>
                        </div>
                    </div>
                </div>
                <div className="settings_tab">
                    <div className="tabpadding">
                        <div className="tabcontent">
                            <p><b>Settings</b></p>
                            {
                                /* 
                                field related settings 
                                */
                            }
                            <p className="option_text"><b>Field related</b></p>
                            <label className="option_text">Field width (meters): </label>
                            <input type="text" id="field_width" name="field_width" className="option_input" defaultValue={4}></input>
                            <br />

                            <label className="option_text">Field origin (meters): </label>
                            <p style={{ display: "inline-block" }}>x=</p>
                            <input type="text" id="x_origin_input" className="option_input_short" defaultValue={0}></input>
                            <p style={{ display: "inline-block" }}>y=</p>
                            <input type="text" id="y_origin_input" className="option_input_short" defaultValue={0}></input>
                            <input type="checkbox" id="y_inverse_input" className="option_input_checkbox"></input>
                            <p style={{ display: "inline-block" }}>inverse y</p>
                            <br />

                            <label className="option_text">Background image: </label>
                            <input type="file" id="img_input" name="img_input" accept="image/*" className="file_input"></input>
                            <button className="option_input" id="clear_img" style={{ width: "auto" }}>clear image</button>
                            <br />

                            {
                                /* 
                                color related settings 
                                */
                            }
                            <p className="option_text"><b>Color settings</b></p>
                            <label className="option_text">Path start color: </label>
                            <input type="color" id="start_color_input" defaultValue={"#ff0000"} />
                            <br />

                            <label className="option_text">Path end color: </label>
                            <input type="color" id="end_color_input" defaultValue={"#0000ff"} />
                            <br />

                            <label className="option_text">Control point color: </label>
                            <input type="color" id="ctlpoint_color_input" defaultValue={"#000000"} />
                            <br />

                            <label className="option_text">Open control point color: </label>
                            <input type="color" id="ctlpoint_open_color_input" defaultValue={"#AAAAAA"} />
                            <br />

                            <label className="option_text">Robot color: </label>
                            <input type="color" id="ctlpoint_open_color_input" defaultValue={"#DDDD00"} />
                        </div>
                    </div>
                </div>
            </div>


            {/* <label class="switch">
                <input type="checkbox" />
                <span class="slider"></span>
            </label> */}
        </>
    );
};

export default Playground;
