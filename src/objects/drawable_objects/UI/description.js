import DrawableObject from "../drawable_object";

class Description extends DrawableObject {
    constructor({text = "", background_color = "rgba(229, 229, 229, 0.7)", color = "#000000"} = {}) {
        super();
        this.show = false;
        this.position = {x: 0, y: 0};
        this.font = "20px Play"
        this.text = text;
        this.background_color = background_color;
        this.color = color;
        this.border_radius = 5;
    }
    get_visibility() {
        return this.show;
    }
    set_visibility(show) {
        this.show = show;
    }
    set_text(text) {
        this.text = text;
    }
    set_position(x, y) {
        this.position = {x:x, y:y};
    }
    render(ctx, settings) {
        if (this.show) {
            ctx.font = this.font;

            // render description box
            let boxwidth = ctx.measureText(this.text).width+20;
            ctx.beginPath();
            ctx.roundRect(this.position.x - boxwidth / 2, this.position.y+15, boxwidth, 40, [this.border_radius]);
            ctx.fillStyle = this.background_color;
            ctx.fill();
            
            // render description text
            ctx.fillStyle = this.color;
            ctx.textAlign = "center";
            ctx.fillText(this.text, this.position.x, this.position.y + 40);
        }
    }
}

export default Description;