import React, { useRef, useEffect } from 'react'
import FieldObjects from '../objects/field_objects'
import { handle_mousedown, handle_mouseup, handle_mousemove, handle_keydown, handle_ctxmenu } from '../objects/event_handler'

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
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        let frameCount = 0;
        let animationFrameId;

        const field_width_input = document.getElementById("field_width");
        
        // color related settings elements
        const start_color_input = document.getElementById("start_color_input");
        const end_color_input = document.getElementById("end_color_input");
        const ctlpoint_color_input = document.getElementById("ctlpoint_color_input");
        const ctlpoint_open_color_input = document.getElementById("ctlpoint_open_color_input");

        const point_density_input = document.getElementById("point_density_input");

        document.onkeydown = handle_keydown;
        window.addEventListener("contextmenu", handle_ctxmenu);
        context.lineWidth = 2;

        //Our draw came here
        const render = () => {
            const elapsed = performance.now() - then;
            if (elapsed > 1000 / target_fps) {
                then = performance.now();
                frameCount++
                settings = {
                    
                    fieldwidth: field_width_input.value,
                    canvaswidth: canvas.width,

                    start_color: start_color_input.value,
                    end_color: end_color_input.value,
                    ctlpoint_color: ctlpoint_color_input.value,
                    ctlpoint_open_color: ctlpoint_open_color_input.value,

                    point_density: point_density_input.value,

                    dt: elapsed / 1000,
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

    return <canvas ref={canvasRef} {...props} id="Stage" width={1000} height={1000} style={{width: "50vw"}} onMouseDown={handle_mousedown} onMouseUp={handle_mouseup} onMouseMove={handle_mousemove}/>
}

export default Stage