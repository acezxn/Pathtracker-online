import FieldObjects from "./field_objects";

class OutputManager {
    /**
     * Show mouse coordinate on the screen
     * 
     * @param {Event} e mouse move event
    */
    static show_mouse_coordinate(e) {
        const canvas = document.getElementById("Stage");
        const field_width_input = document.getElementById("field_width");
        const coord_per_dimension_input = document.getElementById("coord_per_dimension");
        const x_origin_input = document.getElementById("x_origin_input");
        const y_origin_input = document.getElementById("y_origin_input");
        const y_inverse_input = document.getElementById("y_inverse_input");
        const mouse_coordinate_field = document.getElementById("mouse_coordinate");

        // print mouse coordinate to the screen
        const rect = canvas.getBoundingClientRect();
        var x = (e.clientX - rect.left) - (+x_origin_input.value / +field_width_input.value * +coord_per_dimension_input.value) / (+coord_per_dimension_input.value) * canvas.clientWidth;
        var y = (e.clientY - rect.top) - (+y_origin_input.value / +field_width_input.value * +coord_per_dimension_input.value) / (+coord_per_dimension_input.value) * canvas.clientWidth;
    
        var converted_x = Math.round(x / canvas.clientWidth * (+coord_per_dimension_input.value) * 100) / 100;
        var converted_y = Math.round(y / canvas.clientWidth * (+coord_per_dimension_input.value) * 100) / 100;
        if (y_inverse_input.checked) {
            converted_y *= -1;
        }
        mouse_coordinate_field.innerText = "Coordinate: (" + converted_x + ",\t" + converted_y + ")";
    }

    /**
     * Update coordinate output
    */
    static update_output() {
        const canvas = document.getElementById("Stage");
        const output_option = document.getElementById("output_option");
        const output_textarea = document.getElementById("output_textarea");
        const output_prefix = document.getElementById("output_prefix");
        const output_midfix = document.getElementById("output_midfix");
        const output_suffix = document.getElementById("output_suffix");
    
        const field_width_input = document.getElementById("field_width");
        const coord_per_dimension_input = document.getElementById("coord_per_dimension");
        const x_origin_input = document.getElementById("x_origin_input");
        const y_origin_input = document.getElementById("y_origin_input");
        const y_inverse_input = document.getElementById("y_inverse_input");
    
        var output = "";
        switch (output_option.value) {
            case "ctlpoint":
                for (let p of FieldObjects.path.ctlpoints) {
                    let x = p.get_x() / canvas.width * (+coord_per_dimension_input.value) - (+x_origin_input.value / +field_width_input.value * +coord_per_dimension_input.value);
                    let y = p.get_y() / canvas.height * (+coord_per_dimension_input.value) - (+y_origin_input.value / +field_width_input.value * +coord_per_dimension_input.value);
                    if (y_inverse_input.checked) {
                        y *= -1;
                    }
                    output += output_prefix.value + x + output_midfix.value + y + output_suffix.value + "\n";
                }
                break;
            case "full":
                for (let p of FieldObjects.path.fullpath) {
                    let x = p.get_x() / canvas.width * (+coord_per_dimension_input.value) - (+x_origin_input.value / +field_width_input.value * +coord_per_dimension_input.value);
                    let y = p.get_y() / canvas.height * (+coord_per_dimension_input.value) - (+y_origin_input.value / +field_width_input.value * +coord_per_dimension_input.value);
                    if (y_inverse_input.checked) {
                        y *= -1;
                    }
                    output += output_prefix.value + x + output_midfix.value + y + output_suffix.value + "\n";
                }
                break;
        }
        output_textarea.value = output;
    }
}

export default OutputManager;