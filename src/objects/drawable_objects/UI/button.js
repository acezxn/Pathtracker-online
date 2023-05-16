class Button {
    constructor({ x = 20, y = 20, description = "", icon_src = "", color = "#000000", onclick = () => { } } = {}) {
        this.size = { width: 50, height: 50 };
        this.position = { x: x, y: y };
        this.description = description;
        this.icon_src = icon_src;
        this.color = color;
        this.border_radius = 5;
        this.onclick = onclick;
    }
    get_description() {
        return this.description;
    }

    hovering(mouse_x, mouse_y) {
        return mouse_x >= this.position.x &&
            mouse_x <= this.position.x + this.size.width &&
            mouse_y >= this.position.y &&
            mouse_y <= this.position.y + this.size.height;
    }

    handle_mouseclick(mouse_x, mouse_y) {
        if (
            mouse_x >= this.position.x &&
            mouse_x <= this.position.x + this.size.width &&
            mouse_y >= this.position.y &&
            mouse_y <= this.position.y + this.size.height
        ) {
            this.onclick();
            return true;
        }
        return false;
    }
    render(ctx, settings) {
        ctx.beginPath();
        ctx.roundRect(this.position.x, this.position.y, this.size.width, this.size.height, [this.border_radius]);
        ctx.fillStyle = this.color;
        ctx.fill();

        if (this.icon_src !== "") {
            let img = new Image();
            img.src = this.icon_src;
            ctx.drawImage(img, this.position.x, this.position.y);
        }
    }
}

export default Button;