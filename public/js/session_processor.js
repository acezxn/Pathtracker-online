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
                    fieldwidth : this.sess_data.fieldwidth,
                    field_origin_x : this.sess_data.field_origin_x,
                    field_origin_y : this.sess_data.field_origin_y,
                    inverse_y : this.sess_data.inverse_y,
                },
                color_settings : {
                    path_start_color : this.sess_data.path_start_color,
                    path_end_color : this.sess_data.path_end_color,
                    ctlpoint_color : this.sess_data.ctlpoint_color,
                    open_ctlpoint_color : this.sess_data.open_ctlpoint_color,
                    robot_color : this.sess_data.robot_color,
                },
                robot_settings : {
                    robot_width : this.sess_data.robot_width,
                    robot_length : this.sess_data.robot_length,
                    max_velocity : this.sess_data.max_velocity,
                    max_acceleration : this.sess_data.max_acceleration,
                },
                pid_constants : {
                    kPT : this.sess_data.pid_constants.kPT,
                    kIT : this.sess_data.pid_constants.kIT,
                    kDT : this.sess_data.pid_constants.kDT,
                    kPR : this.sess_data.pid_constants.kPR,
                    kIR : this.sess_data.pid_constants.kIR,
                    kDR : this.sess_data.pid_constants.kDR,
                },
                pure_pursuit : {
                    lookahead_radius : this.sess_data.lookahead_radius,
                },
            },
            data : {
                // note: the values are ratios of the canva's width
                ctlpoints : this.sess_data.ctlpoints,
            }
        }

        const json = JSON.stringify(config, null, 2);
        this.download("session.json", json);
    }
}

export default SessionProcessor;