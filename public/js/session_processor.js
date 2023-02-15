import SessionData from "./session_data.js";
class SessionProcessor {
    constructor(sess_data) {
        this.sess_data = sess_data;
    }

    download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
    
        element.style.display = 'none';
        document.body.appendChild(element);
    
        element.click();
    
        document.body.removeChild(element);
    }

    download_sess() {
        const config = {
            settings : {
                field_related : {
                    fieldwidth : this.sess_data.get_fieldwidth(),
                    field_origin_x : this.sess_data.get_field_origin()[0],
                    field_origin_y : this.sess_data.get_field_origin()[1],
                    inverse_y : this.sess_data.get_y_inverse(),
                },
                color_settings : {
                    path_start_color : this.sess_data.get_path_start_color(),
                    path_end_color : this.sess_data.get_path_end_color(),
                    ctlpoint_color : this.sess_data.get_ctlpoint_color(),
                    open_ctlpoint_color : this.sess_data.get_open_ctlpoint_color(),
                    robot_color : this.sess_data.get_robot_color(),
                },
            },
            data : {
                // note: the values are ratios of the canva's width
                ctlpoints : this.sess_data.get_ctlpoints(),
            }
        }

        const json = JSON.stringify(config, null, 2);
        this.download("session.json", json);
    }
}

export default SessionProcessor;