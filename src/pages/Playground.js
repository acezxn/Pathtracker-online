import { Helmet } from "react-helmet"
const Playground = () => {
    return (
        <>
            <Helmet>
                <script type="module" src="js/utils.js"></script>
                <script type="module" src="js/point.js"></script>
                <script type="module" src="js/box.js"></script>
                <script type="module" src="js/algorithms/pure_pursuit.js"></script>
                <script type="module" src="js/robot.js"></script>
                <script type="module" src="js/session_processor.js"></script>
                <script type="module" src="js/algorithms/catmull_rom.js"></script>
                <script type="module" src="js/playground.js"></script>
            </Helmet>

            <div style={{ overflow: "auto" }}>
                <div className="stageholder">
                    <canvas id="Stage" width="1000" height="1000"></canvas>
                    <p className="small" id="mouse_coordinate"></p>
                    <div className="exportmanager">
                        <p className="option_text"><b>Coordinate output</b></p>
                        <label className="option_text">Things to output: </label>
                        <select id="output_option" className="option_list" style={{ display: "inline-block" }}>
                            <option value="ctlpoint">Control points</option>
                            <option value="full">Full path</option>
                        </select>
                        <br />
                        <label className="option_text">Format: </label>
                        <input type="text" id="output_prefix" className="option_input_middle" style={{ textAlign: "right" }} defaultValue={"("}></input>
                        <p style={{ display: "inline-block" }}>x</p>
                        <input type="text" id="output_midfix" className="option_input_short" defaultValue={", "}></input>
                        <p style={{ display: "inline-block" }}>y</p>
                        <input type="text" id="output_suffix" className="option_input_middle" defaultValue={")"}></input>
                        <br />
                        <textarea rows="5" cols="88" id="output_textarea">
                        </textarea>
                    </div>

                </div>
                <div className="controls_tab">
                    <div className="tabpadding">
                        <div className="tabcontent">
                            <p><b>Controls</b></p>
                            <label className="option_text">Load session: </label>
                            <input type="file" id="sess_input" accept="application/JSON" className="file_input"></input>
                            <br />
                            <p className="option_text"><b>Path generation</b></p>
                            <label className="option_text">Point density: </label>
                            <input type="range" min="5" max="30" id="point_density_input" defaultValue={20}/>
                            <br />
                            <br />
                            <button className="option_input" id="simulate_btn" style={{ width: "auto" }}>Simulate</button>
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
                            <p style={{ display: "inline-block" }}>x = </p>
                            <input type="text" id="x_origin_input" className="option_input_short" defaultValue={0}></input>
                            <p style={{ display: "inline-block" }}>y = </p>
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
                            {
                                /* 
                                Robot related settings 
                                */
                            }
                            <p className="option_text"><b>Robot settings</b></p>
                            <label className="option_text">track width (meters): </label>
                            <input type="text" id="robot_width_input" className="option_input" defaultValue={0.5}></input>
                            <br />

                            <label className="option_text">robot length (meters): </label>
                            <input type="text" id="robot_length_input" className="option_input" defaultValue={0.5}></input>
                            <br />

                            <label className="option_text">Max velocity (m/s): </label>
                            <input type="text" id="max_velocity_input" className="option_input" defaultValue={4}></input>
                            <br />

                            <label className="option_text">Max acceleration (m/s^2): </label>
                            <input type="text" id="max_accel_input" className="option_input" defaultValue={10}></input>
                            <br />
                            <br />

                            <i>Note: the following constants needs to be tuned on the actual robot,
                            don't directly copy the values to the robot code.</i>
                            <br />
                            <br />

                            <label className="option_text">translational P gain: </label>
                            <input type="text" id="kPT_input" className="option_input" defaultValue={300}></input>
                            <br />

                            <label className="option_text">translational I gain: </label>
                            <input type="text" id="kIT_input" className="option_input" defaultValue={0}></input>
                            <br />

                            <label className="option_text">translational D gain: </label>
                            <input type="text" id="kDT_input" className="option_input" defaultValue={0}></input>
                            <br />

                            <label className="option_text">rotational P gain: </label>
                            <input type="text" id="kPR_input" className="option_input" defaultValue={300}></input>
                            <br />

                            <label className="option_text">rotational I gain: </label>
                            <input type="text" id="kIR_input" className="option_input" defaultValue={0}></input>
                            <br />

                            <label className="option_text">rotational D gain: </label>
                            <input type="text" id="kDR_input" className="option_input" defaultValue={0}></input>
                            <br />

                            {
                                /* 
                                Pure pursuit (PID based) settings
                                */
                            }
                            <p className="option_text"><b>Pure pursuit (PID based)</b></p>
                            <label className="option_text">look ahead radius (meters): </label>
                            <input type="text" id="lookahead_radius_input" className="option_input" defaultValue={0.5}></input>
                            <br />

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
