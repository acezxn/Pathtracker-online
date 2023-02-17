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
    static meters_to_pixel(meters) {
        if (+field_width_input.value != 0) {
            return meters / +field_width_input.value * canvas.width;
        } 
        return 0;
    }
    
    static pixels_to_meter(pixels) {
        if (+canvas.width != 0) {
            return pixels / canvas.width * +field_width_input.value;
        } 
        return 0;
    }
}

export default Utils;