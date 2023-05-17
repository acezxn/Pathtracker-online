class Utils {

    /**
     * Format angle to -180~180 degree range
     *
     * @static
     * @param {Number} a angle in degrees
     * @returns {Number} formatted angle
     * @memberof Utils
     */
    static format_angle(a) {
        const sign = a < 0 ? -1 : 1;
        const positive_a = Math.abs(a);
        const mod = positive_a % 360;
        if (mod <= 180) {
            return sign * mod;
        } 
        else {
            return sign * (mod - 360);
        }
    }

    /**
     * Convert meters to pixels
     *
     * @static
     * @param {Number} meters number of meters
     * @param {Number} field_width field width in meters
     * @param {Number} canvas_width canvas width
     * @returns {Number} converted length
     * @memberof Utils
     */
    static meters_to_pixel(meters, field_width, canvas_width) {
        if (field_width !== 0) {
            return meters / field_width *canvas_width;
        } 
        return 0;
    }
    
    static pixels_to_meter(pixels, field_width, canvas_width) {
        if (canvas_width !== 0) {
            return pixels / canvas_width * field_width;
        } 
        return 0;
    }


    /**
     * Adjust the incremented coordinate to be within the stage
     *
     * @param {Object} params
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {Number} [x_change=0] change in x
     * @param {Number} [y_change=0] change in y
     * @param {HTMLCanvasElement} canvas canvas element
     * @returns {{x: Number, y: Number}} computed x y coordinate pair 
     * @memberof Utils
     */
    static adjust_coordinate({x, y, x_change=0, y_change=0, canvas} = {}) {
        if (x + x_change > canvas.width || x + x_change < 0) {
            x_change = -x_change;
        }
        if (y + y_change > canvas.height || y + y_change < 0) {
            y_change = -y_change;
        }
        return {x: x + x_change, y: y + y_change};
    }
}

export default Utils;