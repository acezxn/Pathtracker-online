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

// session objects
var session = {
    // field settings
    fieldwidth : 0,
    field_origin_x : 0,
    field_origin_y : 0,
    inverse_y : false,

    // color settings
    path_start_color : "#000000",
    path_end_color : "#000000",
    ctlpoint_color : "#000000",
    open_ctlpoint_color : "#000000",
    robot_color : "#000000",

    // robot settings
    robot_width : 0,
    robot_height : 0,
    max_velocity : 0,
    max_acceleration : 0,

    // pure pursuit
    lookahead_radius : 0,
    pid_constants : {
        kPT : 0,
        kIT : 0,
        kDT : 0,
        kPR : 0,
        kIR : 0,
        kDR : 0,
    },

    // coordinate data
    ctlpoints : [],
}

var session_processor = new SessionProcessor(session);

function update_session() {
    update_robot_config();
    var processed_ctlpoints = []
    // add control points 
    for (let p of path.ctlpoints) {
        const x = p.get_x() / canvas.width;
        const y = p.get_y() / canvas.height;
        processed_ctlpoints.push(new Point(x, y, p.get_radius(), p.get_color()));
    }
    session = {
        // field settings
        fieldwidth : +field_width_input.value,
        field_origin_x : +x_origin_input.value,
        field_origin_y : +y_origin_input.value,
        inverse_y : y_inverse_input.checked,
    
        // color settings
        path_start_color : start_color_input.value,
        path_end_color : end_color_input.value,
        ctlpoint_color : ctlpoint_color_input.value,
        open_ctlpoint_color : ctlpoint_open_color_input.value,
        robot_color : robot_color_input.value,

        // robot settings
        robot_width : Utils.pixels_to_meter(robot_appearance.width, +field_width_input.value, canvas.width),
        robot_length : Utils.pixels_to_meter(robot_appearance.length, +field_width_input.value, canvas.width),
        max_velocity : Utils.pixels_to_meter(robot_performance.max_velocity, +field_width_input.value, canvas.width),
        max_acceleration : Utils.pixels_to_meter(robot_performance.max_acceleration, +field_width_input.value, canvas.width),

        // pure pursuit
        lookahead_radius : +lookahead_radius_input.value,
        pid_constants : {
            kPT : pid_constants.kPT,
            kIT : pid_constants.kIT,
            kDT : pid_constants.kDT,
            kPR : pid_constants.kPR,
            kIR : pid_constants.kIR,
            kDR : pid_constants.kDR,
        },
        
        // coordinate data
        ctlpoints : processed_ctlpoints,
    }    
    session_processor = new SessionProcessor(session);
}

function load_session() {
    const file_list = this.files;
    console.log(file_list[0]);
    var fr = new FileReader();
    fr.onload = function (e) {
        var contents = e.target.result;
        const config = JSON.parse(contents);

        // field related settings
        field_width_input.value = config.settings.field_related.fieldwidth;
        x_origin_input.value = config.settings.field_related.field_origin_x;
        y_origin_input.value = config.settings.field_related.field_origin_y;
        y_inverse_input.checked = config.settings.field_related.inverse_y;


        // color settings
        start_color_input.value         = config.settings.color_settings.path_start_color;
        end_color_input.value           = config.settings.color_settings.path_end_color;
        ctlpoint_color_input.value      = config.settings.color_settings.ctlpoint_color;
        ctlpoint_open_color_input.value = config.settings.color_settings.open_ctlpoint_color;
        robot_color_input.value         = config.settings.color_settings.robot_color;

        // robot settings
        robot_width_input.value         = config.settings.robot_settings.robot_width;
        robot_length_input.value        = config.settings.robot_settings.robot_length;
        max_velocity_input.value        = config.settings.robot_settings.max_velocity;
        max_accel_input.value           = config.settings.robot_settings.max_acceleration;

        // pure pursuit
        lookahead_radius_input.value    = config.settings.pure_pursuit.lookahead_radius;
        kPT_input.value                 = config.settings.pid_constants.kPT;
        kIT_input.value                 = config.settings.pid_constants.kIT;
        kDT_input.value                 = config.settings.pid_constants.kDT;
        kPR_input.value                 = config.settings.pid_constants.kPR;
        kIR_input.value                 = config.settings.pid_constants.kIR;
        kDR_input.value                 = config.settings.pid_constants.kDR;


        // load control points
        const ctlpoint_data             = config.data.ctlpoints;
        ctlpoints = []
        for (let p of ctlpoint_data) {
            const x = p.x * canvas.width;
            const y = p.y * canvas.height;
            const radius = +p.radius;
            const color = p.fill_color;
            console.log(p);
            ctlpoints.push(new Point(x, y, radius, color));
        }
        path.ctlpoints = ctlpoints;
        path.update();
        update_output();
        update_robot_config();
        update_session();
    }
    fr.readAsText(file_list[0])
    sess_input.value = '';
}