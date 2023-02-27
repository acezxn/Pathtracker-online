import DrawableObject from "./drawable_object";
import Utils from "../../utils";

class Grid extends DrawableObject {
    constructor() {
        super();
        this.hidden = true;
    }

    render(ctx, settings) {
        if (this.hidden) {
            return;
        }
        const x_origin_input = document.getElementById("x_origin_input");
        const y_origin_input = document.getElementById("y_origin_input");
        const y_inverse_input = document.getElementById("y_inverse_input");
        const division = Utils.meters_to_pixel(1, settings.fieldwidth, settings.canvaswidth);
        var xoffset = Utils.meters_to_pixel(+x_origin_input.value, settings.fieldwidth, settings.canvaswidth);
        var yoffset = Utils.meters_to_pixel(+y_origin_input.value, settings.fieldwidth, settings.canvaswidth);
        var prev_lines_x = xoffset / division;
        var prev_lines_y = yoffset / division;

        // draw lines before the origin
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        for (let i = 1; i < prev_lines_x; i++) {
            ctx.beginPath();
            ctx.moveTo(xoffset - i * division , 0);
            ctx.lineTo(xoffset - i * division , settings.canvaswidth);
            ctx.stroke();
            console.log(xoffset - i * division);
        }
        for (let i = 1; i < prev_lines_y; i++) {
            ctx.beginPath();
            ctx.moveTo(0 , yoffset - i * division);
            ctx.lineTo(settings.canvaswidth, yoffset - i * division);
            ctx.stroke();
        }

        // draw lines after the origin
        for (let x = xoffset; x < settings.canvaswidth; x += division) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, settings.canvaswidth);
            ctx.stroke();
        }
        for (let y = yoffset; y < settings.canvaswidth; y += division) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(settings.canvaswidth, y);
            ctx.stroke();
        }

        // draw origin
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(xoffset, yoffset);
        ctx.lineTo(xoffset + division, yoffset);
        ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
        ctx.stroke();

        const direction = y_inverse_input.checked ? -1 : 1;
        ctx.beginPath();
        ctx.moveTo(xoffset, yoffset);
        ctx.lineTo(xoffset, yoffset + division * direction);
        ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
        ctx.stroke();

        ctx.lineWidth = 2;
    }
}

export default Grid;