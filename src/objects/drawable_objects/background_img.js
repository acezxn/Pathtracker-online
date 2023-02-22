import DrawableObject from "./drawable_object"

class BackgroundImg extends DrawableObject{
    constructor() {
        super();
        this.img = null;
    }
    set_img(img) {
        this.img = img;
    }
    render(ctx, settings) {
        if (this.img != null) {
            const canvas = document.getElementById("Stage");
            ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);
        }
    }
}

export default BackgroundImg;