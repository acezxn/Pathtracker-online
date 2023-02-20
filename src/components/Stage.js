import React, { useRef, useEffect } from 'react'
import FieldObjects from '../objects/field_objects'
import { add_ctlpoint, handle_keydown } from '../objects/event_handler'
import OutputManager from '../objects/output_manager';

var settings = {};
var target_fps = 60;
var then = performance.now();
const Stage = props => {

    const canvasRef = useRef(null)

    const draw = (ctx, frameCount, settings) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        for (let drawable_obj of FieldObjects.objects) {
            drawable_obj.render(ctx, settings);
        }
    }

    useEffect(() => {

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId

        // output related elements
        const output_option = document.getElementById("output_option");
        const output_textarea = document.getElementById("output_textarea");
        const output_prefix = document.getElementById("output_prefix");
        const output_midfix = document.getElementById("output_midfix");
        const output_suffix = document.getElementById("output_suffix");

        // stage related settings elements
        const field_width_input = document.getElementById("field_width");
        const x_origin_input = document.getElementById("x_origin_input");
        const y_origin_input = document.getElementById("y_origin_input");
        const y_inverse_input = document.getElementById("y_inverse_input");

        // color related settings elements
        const start_color_input = document.getElementById("start_color_input");
        const end_color_input = document.getElementById("end_color_input");
        const ctlpoint_color_input = document.getElementById("ctlpoint_color_input");
        const ctlpoint_open_color_input = document.getElementById("ctlpoint_open_color_input");

        const point_density_input = document.getElementById("point_density_input");

        document.onkeydown = handle_keydown;
        context.lineWidth = 2;

        //Our draw came here
        const render = () => {
            if (performance.now() - then > 1000 / target_fps) {
                then = performance.now();
                frameCount++
                settings = {
                    output_option: output_option.value,
                    output_text: output_textarea.value,
                    output_prefix: output_prefix.value,
                    output_midfix: output_midfix.value,
                    output_suffix: output_suffix.value,

                    fieldwidth: field_width_input.value,
                    field_origin_x: x_origin_input.value,
                    field_origin_y: y_origin_input.value,
                    inverse_y: y_inverse_input.value,

                    start_color: start_color_input.value,
                    end_color: end_color_input.value,
                    ctlpoint_color: ctlpoint_color_input.value,
                    ctlpoint_open_color: ctlpoint_open_color_input.value,

                    point_density: point_density_input.value,
                }
                draw(context, frameCount, settings)
            }
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw])

    return <canvas ref={canvasRef} {...props} id="Stage" width={1000} height={1000} onClick={add_ctlpoint} onMouseMove={OutputManager.show_mouse_coordinate} />
}

export default Stage