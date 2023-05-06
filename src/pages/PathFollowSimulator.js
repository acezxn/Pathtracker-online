import Stage from "../components/Stage";
import "../css/stage.css"
import "../css/tabs.css"

import FieldSettings from "../components/settings_display/FieldSettings";
import FieldObjects from "../objects/field_objects";
import ColorSettings from "../components/settings_display/ColorSettings";
import RobotSettings from "../components/settings_display/RobotSettings";
import ControlsTab from "../components/settings_display/ControlsTab";
import NavBar from "../components/NavBar";
import PursuitSettings from "../components/settings_display/PursuitSettings";
import ExportManager from "../components/ExportManager";

const PathFollowSimulator = () => {
    FieldObjects.reset();
    return (
        <>
            <NavBar/>
            <div style={{ overflow: "auto", paddingLeft : "max(1.5vw, 20px)"}}>
                <div className="stageholder">
                    <Stage />
                    <p style={{marginLeft: "0.6vw"}} className="small" id="mouse_coordinate"></p>
                </div>
                <ControlsTab></ControlsTab>
                <div className="settings_tab">
                    <div className="tabpadding">
                        <div className="tabcontent">
                            <p className="tab_title"><b>Settings</b></p>

                            <FieldSettings></FieldSettings>

                            <ColorSettings></ColorSettings>

                            <RobotSettings></RobotSettings>

                            <PursuitSettings></PursuitSettings>

                        </div>
                    </div>
                </div>
            </div>
            <ExportManager></ExportManager>
        </>
    );
};

export default PathFollowSimulator;
