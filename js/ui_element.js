const canvas = document.getElementById("Stage");
const ctx = canvas.getContext("2d");
const mouse_coordinate_field = document.getElementById("mouse_coordinate");

const sess_input = document.getElementById("sess_input");

// output related elements
const output_option = document.getElementById("output_option");
const output_textarea = document.getElementById("output_textarea");
const output_prefix = document.getElementById("output_prefix");
const output_midfix = document.getElementById("output_midfix");
const output_suffix = document.getElementById("output_suffix");

// stage related settings elements
const field_width_input = document.getElementById("field_width");
const img_input = document.getElementById('img_input');
const clear_img_button = document.getElementById("clear_img");
const x_origin_input = document.getElementById("x_origin_input");
const y_origin_input = document.getElementById("y_origin_input");
const y_inverse_input = document.getElementById("y_inverse_input");
var background_img = null;

// color related settings elements
const start_color_input = document.getElementById("start_color_input");
const end_color_input = document.getElementById("end_color_input");
const ctlpoint_color_input = document.getElementById("ctlpoint_color_input");
const ctlpoint_open_color_input = document.getElementById("ctlpoint_open_color_input");
const robot_color_input = document.getElementById("robot_color_input");

// robot related settings elements
const robot_width_input = document.getElementById("robot_width_input");
const robot_length_input = document.getElementById("robot_length_input");
const max_velocity_input = document.getElementById("max_velocity_input");
const max_accel_input = document.getElementById("max_accel_input");

// pure pursuit settings elements
const lookahead_radius_input = document.getElementById("lookahead_radius_input");
const kPT_input = document.getElementById("kPT_input");
const kIT_input = document.getElementById("kIT_input");
const kDT_input = document.getElementById("kDT_input");
const kPR_input = document.getElementById("kPR_input");
const kIR_input = document.getElementById("kIR_input");
const kDR_input = document.getElementById("kDR_input");

const point_density_input = document.getElementById("point_density_input");