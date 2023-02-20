var stop = false;
var frameCount = 0;
var target_fps = 60, fpsInterval, startTime, now, then, elapsed;
var dt = 1/60


function animate() {
    if (stop) {
        return;
    }
    requestAnimationFrame(animate);
    now = performance.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // draw background image
        if (background_img != null) {
            ctx.drawImage(background_img, 0, 0, canvas.width, canvas.height);
        }
        for (let obj of objects) {
            obj.render()
        }
    }
}

function startAnimating(target_fps) {
    fpsInterval = 1000 / target_fps;
    then = performance.now();
    startTime = then;
    animate();
}

ctx.lineWidth = 2;

startAnimating(target_fps);