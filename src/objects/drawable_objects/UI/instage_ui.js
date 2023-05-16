import DrawableObject from "../drawable_object";

class InStageUI extends DrawableObject {
    constructor({x=20, y=20} = {}) {
        super();
        this.show = false;
        this.position = {x: x, y: y}
        this.size = {width: 100, height: 100};
        this.button_size = {width: 30, height: 30};
    }

    get_visibility() {
        return this.show;
    }

    /**
     * Set display of the UI
     *
     * @param {Boolean} show whether the UI is visible
     * @memberof InStageUI
     */
    set_visibility(show) {
        this.show = show;
    }

    /**
     * Check whether the mouse is hovering on the UI
     *
     * @param {Number} mouse_x mouse x coordinate
     * @param {Number} mouse_y mouse y coordinate
     * 
     * @returns {Boolean} whether the mouse is hovering on the UI
     * @memberof CtlpointUI
     */
    hovering(mouse_x, mouse_y) {
        return mouse_x >= this.position.x &&
        mouse_x <= this.position.x + this.size.width &&
        mouse_y >= this.position.y &&
        mouse_y <= this.position.y + this.size.height;
    }

    /**
     * Handle mouse click on the UI
     *
     * @param {Number} mouse_x mouse x coordinate
     * @param {Number} mouse_y mouse y coordinate
     * 
     * @returns {boolean} whether the mouse is clicked on the UI
     * @memberof CtlpointUI
     */
    handle_mouseclick(mouse_x, mouse_y) {
        return this.hovering(mouse_x, mouse_y);
    }
    
    render(ctx, settings) {
        if (this.show) {
            ctx.beginPath();
            ctx.rect(this.position.x, this.position.y, this.size.width, this.size.height);
            ctx.stroke();
        }
    }
}

export default InStageUI;