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
            const canvas = document.getElementById("Stage");
            let boxwidth = ctx.measureText(this.text).width+20;
            let boxheight = 40;
            let boxoffset_y = 15

            if (canvas !== null) {
                if (this.position.x + boxwidth*0.5 > canvas.width) {
                    this.position.x -= this.position.x + boxwidth*0.5 - canvas.width;
                }
                else if (this.position.x - boxwidth*0.5 < 0) {
                    this.position.x -= this.position.x - boxwidth*0.5;
                }
                if (this.position.y + boxheight + boxoffset_y > canvas.height) {
                    this.position.y -= this.position.y + boxheight + boxoffset_y - canvas.height;
                }
            }   

            ctx.font = this.font;

            // render description box
            ctx.beginPath();
            ctx.roundRect(this.position.x - boxwidth / 2, this.position.y+boxoffset_y, boxwidth, boxheight, [this.border_radius]);
            ctx.fillStyle = this.background_color;
            ctx.fill();
            
            // render description text
            ctx.fillStyle = this.color;
            ctx.textAlign = "center";
            ctx.fillText(this.text, this.position.x, this.position.y + boxheight);
        }
    }
}

export default Description;