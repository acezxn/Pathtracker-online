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
}

export default Utils;