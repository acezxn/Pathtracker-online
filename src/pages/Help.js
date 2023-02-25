import NavBar from "../components/NavBar";

export default function Help() {
    return <>
        <NavBar />
        <div style={{ paddingLeft: "7vw" }}>
            <h2>How to use</h2>
            <div>
                <h3>Quick guide</h3>
                <p style={{ textAlign: "left" }}>
                    The tool provides the user the functionality to draw paths on a
                    virtual field drawn on the browser, and simulate the behavior of
                    multiple pursuit algorithms.
                    <br />
                    <br />
                    <img src={require("../images/interface.png")} alt="interface" style={{width : "40vw"}}/>
                    <br />
                    <br />
                    <b>The field</b>
                    <br/>
                    It is the square window that allows users to draw path on it and simulate
                    robot behavior.
                    <br />
                    <br />
                    Path can be drawn on the field by left-clicking on the field to add
                    control points. Users can modify the path by dragging the control points
                    on the field. To undo path generation, users can do so by right-clicking
                    the last control point of the path.
                    <br />
                    <br />
                    <b>Controls</b>
                    <br />
                    This tab contains general controls that helps the user quickly customize
                    paths and simulate robot behavior.

                    <br />
                    <br />
                    <b>Settings</b>
                    <br />
                    This tab contains advanced settings for field coordinates, display color, robot
                    performance, constants, and pursuit modes.

                    <br />
                    <br />
                    <b>Output</b>
                    <br />
                    This section exports control points and full path to the text area so they 
                    can be copy-pasted to robot programs. User could customize output format by 
                    editing the text boxes in the format settings.
                </p>
                <h3>Sessions</h3>
                <p>
                    By hitting the save hotkey, users can save the current state 
                    of the playground to a json session file. Things that would be 
                    saved include control points, field setings (background image not included), 
                    color settings, robot settings, and pursuit settings.

                    <br/>
                    <br/>
                    In controls tab, the load session input allows users to import 
                    session files to the playground. By this way, users can save 
                    their successful simulations and share them with their teammates.
                </p>
            </div>
        </div>
    </>
}