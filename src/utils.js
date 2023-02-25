class Utils {
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
}

export default Utils;