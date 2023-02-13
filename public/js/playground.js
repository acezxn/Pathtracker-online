import Point from "./point.js";
import CatmullRom from "./catmull_rom.js";

const canvas = document.getElementById("Stage");
const ctx = canvas.getContext("2d");

var ctlpoints = [];
document.onkeydown = function (e) {
    if (
        (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) ||
        e.key === 'Meta' ||
        e.key === 'Shift' ||
        e.key === 'Control' ||
        e.key === 'alt'
    ) {
        return;
    }
    else {
        // Undo control point addition
        if ((e.metaKey || e.ctrlKey) && e.key === "z") { 
            ctlpoints.pop();
        }
    }
}

canvas.addEventListener('mousedown', function (e) {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ctlpoints.push(new Point(x, y));
}, false);

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);

    // draw full path
    var catmull = new CatmullRom(ctlpoints);
    var path = catmull.get_full_path(0.1);
    for (let i = 0; i < path.length; i++) {
        path[i].render(ctx);
        if (i > 0) {
            ctx.moveTo(path[i - 1].get_x(), path[i - 1].get_y());
            ctx.lineTo(path[i].get_x(), path[i].get_y());
            ctx.strokeStyle = "#000000"
            ctx.stroke();
        }
    }

    // draw control points
    for (let i = 0; i < ctlpoints.length; i++) {
        if (i == 0 || i == ctlpoints.length-1) {
            ctlpoints[i].set_color("#AAAAAA");
        } else {
            ctlpoints[i].set_color("#000000");
        }
        if (i == 0 && i + 1 < ctlpoints.length) {
            ctx.moveTo(ctlpoints[i].get_x(), ctlpoints[i].get_y());
            ctx.lineTo(ctlpoints[i + 1].get_x(), ctlpoints[i+1].get_y());
            ctx.strokeStyle = "#AAAAAA"
            ctx.stroke();
        }
        if (i == ctlpoints.length-1 && i - 1 >= 0) {
            ctx.moveTo(ctlpoints[i - 1].get_x(), ctlpoints[i - 1].get_y());
            ctx.lineTo(ctlpoints[i].get_x(), ctlpoints[i].get_y());
            ctx.strokeStyle = "#AAAAAA"
            ctx.stroke();
        }
        ctlpoints[i].render(ctx);
    }
}

animate();